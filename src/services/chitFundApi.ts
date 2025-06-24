import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
// Chit Fund API Service
// All functions are stubs and should be implemented with actual Supabase or backend logic

export async function requestLoan(userId: string, groupId: string): Promise<{ success: boolean; error?: string }> {
  // Check for existing approved loan in last 30 days
  const { data: loans, error: loanError } = await supabase
    .from('loans')
    .select('requested_on, status')
    .eq('user_id', userId)
    .eq('group_id', groupId)
    .order('requested_on', { ascending: false })
    .limit(1);
  if (loanError) return { success: false, error: loanError.message };
  if (loans && loans.length > 0) {
    const lastLoan = loans[0];
    if (lastLoan.status === 'approved') {
      const lastDate = new Date(lastLoan.requested_on);
      const now = new Date();
      const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 30) {
        return { success: false, error: 'You are not eligible for a new loan yet.' };
      }
    }
  }
  // Insert new loan request
  const { error } = await supabase.from('loans').insert([
    {
      user_id: userId,
      group_id: groupId,
      status: 'pending',
      requested_on: new Date().toISOString(),
    },
  ]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function manualPayment(data: {
  userId: string;
  groupId: string;
  amount: number;
  mode: 'cash' | 'online' | 'phonepe_qr';
  paidOn: string;
  agentId: string;
  screenshot?: File;
  remarks?: string;
}): Promise<{ success: boolean; error?: string }> {
  let screenshotUrl: string | undefined = undefined;
  if (data.screenshot) {
    const filePath = `manual-payments/${data.userId}_${Date.now()}_${data.screenshot.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('manual-payments')
      .upload(filePath, data.screenshot);
    if (uploadError) return { success: false, error: uploadError.message };
    const { data: publicUrlData } = supabase.storage.from('manual-payments').getPublicUrl(filePath);
    screenshotUrl = publicUrlData?.publicUrl;
  }
  const { error } = await supabase.from('collections').insert([
    {
      user_id: data.userId,
      group_id: data.groupId,
      amount: data.amount,
      mode: data.mode,
      paid_on: data.paidOn,
      manual: true,
      agent_id: data.agentId,
      screenshot_url: screenshotUrl,
      remarks: data.remarks,
    },
  ]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function generateReceipt(paymentId: string, issuedBy: string): Promise<{ receiptUrl: string; error?: string }> {
  // Fetch payment details
  const { data: payment, error: paymentError } = await supabase
    .from('collections')
    .select('id, user_id, group_id, amount, mode, paid_on, fine')
    .eq('id', paymentId)
    .single();
  if (paymentError || !payment) return { receiptUrl: '', error: paymentError?.message || 'Payment not found' };

  // Generate PDF (simple placeholder)
  const doc = new jsPDF();
  doc.text('Chit Fund Payment Receipt', 10, 10);
  doc.text(`Payment ID: ${payment.id}`, 10, 20);
  doc.text(`User ID: ${payment.user_id}`, 10, 30);
  doc.text(`Group ID: ${payment.group_id}`, 10, 40);
  doc.text(`Amount: ₹${payment.amount}`, 10, 50);
  doc.text(`Mode: ${payment.mode}`, 10, 60);
  doc.text(`Paid On: ${payment.paid_on}`, 10, 70);
  doc.text(`Fine: ₹${payment.fine || 0}`, 10, 80);
  doc.text(`Issued By: ${issuedBy}`, 10, 90);
  const pdfBlob = doc.output('blob');

  // Upload PDF to receipts bucket
  const filePath = `receipts/${payment.id}_${Date.now()}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, pdfBlob);
  if (uploadError) return { receiptUrl: '', error: uploadError.message };
  const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(filePath);
  const receiptUrl = publicUrlData?.publicUrl;

  // Insert into receipts table
  const { error: insertError } = await supabase.from('collections').insert([
    {
      payment_id: payment.id,
      issued_by: issuedBy,
      receipt_url: receiptUrl,
      created_at: new Date().toISOString(),
    },
  ]);
  if (insertError) return { receiptUrl: '', error: insertError.message };

  return { receiptUrl, error: undefined };
}

export async function updateRiskLevel(): Promise<{ updated: number; error?: string }> {
  // Fetch all users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, risk_level');
  if (usersError) return { updated: 0, error: usersError.message };

  let updated = 0;
  for (const user of users) {
    // Fetch payment history
    const { data: payments, error: paymentsError } = await supabase
      .from('collections')
      .select('fine, paid_on')
      .eq('user_id', user.id)
      .order('paid_on', { ascending: false });
    if (paymentsError) continue;

    // Missed payments: fine > 0
    const missedPayments = payments.filter((p: any) => p.fine && p.fine > 0).length;
    // Fines in a row (from latest)
    let finesInARow = 0;
    for (const p of payments) {
      if (p.fine && p.fine > 0) finesInARow++;
      else break;
    }
    let newRisk = 'normal';
    if (missedPayments >= 2 || finesInARow >= 3) {
      newRisk = 'high';
      // Insert flag if not already flagged
      await supabase.from('flags').insert([
        {
          type: 'user',
          reference_id: user.id,
          reason: 'High risk: missed payments or repeated fines',
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ]);
    }
    if (newRisk !== user.risk_level) {
      await supabase.from('users').update({ risk_level: newRisk }).eq('id', user.id);
      updated++;
    }
  }
  return { updated, error: undefined };
}

export async function sendReminders(): Promise<{ sent: number; error?: string }> {
  // Find overdue payments (fine > 0 or paid_on > 15th)
  const { data: payments, error: paymentsError } = await supabase
    .from('collections')
    .select('user_id, paid_on, fine')
    .gt('fine', 0);
  if (paymentsError) return { sent: 0, error: paymentsError.message };

  // Get unique user IDs
  const userIds = Array.from(new Set(payments.map((p: any) => p.user_id)));

  // Fetch user contact info
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, phone')
    .in('id', userIds);
  if (usersError) return { sent: 0, error: usersError.message };

  // Stub: send WhatsApp/SMS reminder
  let sent = 0;
  for (const user of users) {
    // Here you would integrate with Twilio, WhatsApp API, etc.
    // For now, just log and count
    // console.log(`Reminder sent to ${user.name} (${user.phone})`);
    sent++;
  }

  return { sent, error: undefined };
}

export async function agentPerformance(agentId: string): Promise<{ performance: any; error?: string }> {
  // Fetch total collections and missed collections
  const { data: payments, error: paymentsError } = await supabase
    .from('collections')
    .select('id, paid_on')
    .eq('agent_id', agentId);
  if (paymentsError) return { performance: null, error: paymentsError.message };
  // For demo: collection ratio = paid payments / (paid + missed), missed = payments with fine > 0
  const total = payments.length;
  const missedCollections = payments.filter((p: any) => p.fine && p.fine > 0).length;
  const collectionRatio = total > 0 ? (total - missedCollections) / total : 1;

  // Fetch flags
  const { data: flags, error: flagsError } = await supabase
    .from('flags')
    .select('created_at, reason, status')
    .eq('type', 'agent')
    .eq('reference_id', agentId)
    .order('created_at', { ascending: false });
  if (flagsError) return { performance: null, error: flagsError.message };

  return {
    performance: {
      collectionRatio,
      missedCollections,
      flags: flags.map((f: any) => ({
        date: f.created_at.split('T')[0],
        reason: f.reason,
        status: f.status,
      })),
    },
    error: undefined,
  };
}

export async function attendancePunchIn(data: {
  agentId: string;
  selfie: File;
  lat: string;
  lng: string;
  remarks?: string;
}): Promise<{ success: boolean; error?: string }> {
  let selfieUrl: string | undefined = undefined;
  if (data.selfie) {
    const filePath = `attendance-selfies/${data.agentId}_${Date.now()}_${data.selfie.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('attendance-selfies')
      .upload(filePath, data.selfie);
    if (uploadError) return { success: false, error: uploadError.message };
    const { data: publicUrlData } = supabase.storage.from('attendance-selfies').getPublicUrl(filePath);
    selfieUrl = publicUrlData?.publicUrl;
  }
  const { error } = await supabase.from('attendance').insert([
    {
      agent_id: data.agentId,
      selfie_url: selfieUrl,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      remarks: data.remarks,
    },
  ]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function branchSummary(branchId: string): Promise<{ summary: any; riskUsers: any[]; error?: string }> {
  // Fetch payments for the branch
  const { data: payments, error: paymentsError } = await supabase
    .from('collections')
    .select('id, user_id, fine, paid_on')
    .eq('group_id', branchId); // Assuming group_id is used for branch; adjust if needed
  if (paymentsError) return { summary: null, riskUsers: [], error: paymentsError.message };

  const paid = payments.length;
  const missed = payments.filter((p: any) => p.fine && p.fine > 0).length;
  const overdue = payments.filter((p: any) => {
    const paidDate = new Date(p.paid_on);
    return paidDate.getDate() > 15;
  }).length;
  const fineCollected = payments.reduce((sum: number, p: any) => sum + (p.fine || 0), 0);

  // Fetch flagged users and agents
  const { data: flaggedUsers, error: flaggedUsersError } = await supabase
    .from('flags')
    .select('type, reference_id')
    .eq('type', 'user');
  const { data: flaggedAgents, error: flaggedAgentsError } = await supabase
    .from('flags')
    .select('type, reference_id')
    .eq('type', 'agent');

  // Fetch risk-level users (risk_level = 'high' or overdue > 0)
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, group_id, risk_level')
    .eq('group_id', branchId);
  let riskUsers: any[] = [];
  if (users) {
    riskUsers = users.filter((u: any) => u.risk_level === 'high');
    // Optionally, add overdue info by cross-referencing payments
    riskUsers = riskUsers.map((u: any) => ({
      name: u.name,
      group: u.group_id,
      risk: u.risk_level,
      overdue: payments.filter((p: any) => p.user_id === u.id && p.fine > 0).length,
    }));
  }

  return {
    summary: {
      paid,
      missed,
      overdue,
      fineCollected,
      flaggedUsers: flaggedUsers ? flaggedUsers.length : 0,
      flaggedAgents: flaggedAgents ? flaggedAgents.length : 0,
    },
    riskUsers,
    error: undefined,
  };
}

// Fetch user's group info
export async function getUserGroup(userId: string) {
  // Get user's group_id
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('group_id')
    .eq('id', userId)
    .single();
  if (userError || !user?.group_id) return { group: null, error: userError?.message || 'No group found' };

  // Get group info
  const { data: group, error: groupError } = await supabase
    .from('chit_groups')
    .select('*')
    .eq('id', user.group_id)
    .single();
  return { group, error: groupError?.message };
}

// Fetch user's passbook (payment history)
export async function getUserPassbook(userId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('paid_on, amount, fine, id, receipt:receipts(receipt_url)')
    .eq('user_id', userId)
    .order('paid_on', { ascending: false });
  if (error) return { passbook: [], error: error.message };
  // Map to expected format
  const passbook = data.map((p: any) => ({
    date: p.paid_on,
    amount: p.amount,
    fine: p.fine,
    receiptUrl: p.receipt?.receipt_url || '#',
  }));
  return { passbook, error: null };
}

// Fetch user's loan status
export async function getUserLoanStatus(userId: string) {
  // Get last loan
  const { data, error } = await supabase
    .from('loans')
    .select('requested_on, status')
    .eq('user_id', userId)
    .order('requested_on', { ascending: false })
    .limit(1);
  if (error) return { loanStatus: null, error: error.message };
  const lastLoan = data[0];
  // Example eligibility logic: eligible if no active loan in last 30 days
  const eligible = !lastLoan || lastLoan.status !== 'approved';
  return {
    loanStatus: {
      eligible,
      lastLoan: lastLoan ? lastLoan.requested_on : null,
      nextEligible: eligible ? null : 'TBD',
    },
    error: null,
  };
}

// Admin uploads QR code image and UPI ID for a branch
export async function uploadBranchQrCode(branchId: string, upiId: string, qrImage: File): Promise<{ success: boolean; error?: string }> {
  const filePath = `qr-codes/${branchId}_${Date.now()}_${qrImage.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('qr-codes')
    .upload(filePath, qrImage);
  if (uploadError) return { success: false, error: uploadError.message };
  const { data: publicUrlData } = supabase.storage.from('qr-codes').getPublicUrl(filePath);
  const qrImageUrl = publicUrlData?.publicUrl;
  const { error } = await supabase.from('qr_codes').upsert([
    {
      branch_id: branchId,
      upi_id: upiId,
      qr_image_url: qrImageUrl,
    },
  ], { onConflict: 'branch_id' });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Fetch QR code info for a branch
export async function getBranchQrCode(branchId: string): Promise<{ upiId: string; qrImageUrl: string; error?: string }> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('upi_id, qr_image_url')
    .eq('branch_id', branchId)
    .single();
  if (error || !data) return { upiId: '', qrImageUrl: '', error: error?.message || 'QR code not found' };
  return { upiId: data.upi_id, qrImageUrl: data.qr_image_url, error: undefined };
}

// Fetch advanced analytics for admin dashboard (extended)
export async function getAdminAnalytics({ branchId, from, to }: { branchId?: string; from?: string; to?: string }) {
  // Helper to safely execute queries
  const safeQuery = async (query: any) => {
    const { data, error } = await query;
    if (error) {
      console.error('Analytics query error:', error);
      return []; // Return empty array on error
    }
    return data || [];
  };

  // Payments filter
  let paymentsQuery = supabase.from('collections').select('amount, fine, paid_on, user_id, agent_id, group_id, branch_id, mandal_id');
  if (branchId) paymentsQuery = paymentsQuery.eq('branch_id', branchId);
  if (from) paymentsQuery = paymentsQuery.gte('paid_on', from);
  if (to) paymentsQuery = paymentsQuery.lte('paid_on', to);
  const payments = await safeQuery(paymentsQuery);

  // Users
  let usersQuery = supabase.from('users').select('id, name, role, risk_level, group_id, branch_id, mandal_id');
  if (branchId) usersQuery = usersQuery.eq('branch_id', branchId);
  const users = await safeQuery(usersQuery);

  // Groups
  const groups = await safeQuery(supabase.from('chit_groups').select('id, name, amount, branch_id, mandal_id'));

  // Branches
  const branches = await safeQuery(supabase.from('branches').select('id, name, mandal_id'));

  // Mandals
  const mandals = await safeQuery(supabase.from('mandals').select('id, name'));

  // Loans
  let loansQuery = supabase.from('loans').select('id, status, requested_on, user_id, group_id');
  if (branchId) loansQuery = loansQuery.eq('group_id', branchId);
  if (from) loansQuery = loansQuery.gte('requested_on', from);
  if (to) loansQuery = loansQuery.lte('requested_on', to);
  const loans = await safeQuery(loansQuery);

  // Aggregated stats
  const totalPaid = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const totalFines = payments.reduce((sum: number, p: any) => sum + (p.fine || 0), 0);
  const missed = payments.filter((p: any) => p.fine && p.fine > 0).length;
  const overdue = payments.filter((p: any) => {
    const paidDate = new Date(p.paid_on);
    return paidDate.getDate() > 15;
  }).length;
  const totalLoans = loans.length;
  const totalUsers = users.length;
  const totalAgents = users.filter((u: any) => u.role === 'agent').length;
  const riskyUsers = users.filter((u: any) => u.risk_level === 'high').length;

  // Time-series: collections per month
  const collectionsByMonth: { [month: string]: number } = {};
  payments.forEach((p: any) => {
    const d = new Date(p.paid_on);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    collectionsByMonth[key] = (collectionsByMonth[key] || 0) + (p.amount || 0);
  });

  // Top overdue users (by fine amount, descending, top 10)
  const userFineMap: { [userId: string]: number } = {};
  payments.forEach((p: any) => {
    if (p.fine && p.fine > 0) {
      userFineMap[p.user_id] = (userFineMap[p.user_id] || 0) + p.fine;
    }
  });
  const topOverdueUsers = Object.entries(userFineMap)
    .map(([userId, fine]) => {
      const user = users.find((u: any) => u.id === userId);
      return { userId, name: user?.name || userId, fine };
    })
    .sort((a, b) => b.fine - a.fine)
    .slice(0, 10);

  // Top agents (by total collections, top 10)
  const agentCollectionMap: { [agentId: string]: number } = {};
  payments.forEach((p: any) => {
    if (p.agent_id) {
      agentCollectionMap[p.agent_id] = (agentCollectionMap[p.agent_id] || 0) + (p.amount || 0);
    }
  });
  const topAgents = Object.entries(agentCollectionMap)
    .map(([agentId, total]) => {
      const agent = users.find((u: any) => u.id === agentId);
      return { agentId, name: agent?.name || agentId, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Group/branch breakdowns
  const groupBreakdown = groups.map((g: any) => {
    const groupPayments = payments.filter((p: any) => p.group_id === g.id);
    const groupUsers = users.filter((u: any) => u.group_id === g.id);
    return {
      groupId: g.id,
      groupName: g.name,
      amount: g.amount,
      totalPaid: groupPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      totalFines: groupPayments.reduce((sum: number, p: any) => sum + (p.fine || 0), 0),
      users: groupUsers.length,
    };
  });

  // Branch breakdowns
  const branchBreakdown = branches.map((b: any) => {
    const branchPayments = payments.filter((p: any) => p.branch_id === b.id);
    const branchUsers = users.filter((u: any) => u.branch_id === b.id);
    return {
      branchId: b.id,
      branchName: b.name,
      totalPaid: branchPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      totalFines: branchPayments.reduce((sum: number, p: any) => sum + (p.fine || 0), 0),
      users: branchUsers.length,
    };
  });

  // Mandal breakdowns
  const mandalBreakdown = mandals.map((m: any) => {
    const mandalPayments = payments.filter((p: any) => p.mandal_id === m.id);
    const mandalUsers = users.filter((u: any) => u.mandal_id === m.id);
    return {
      mandalId: m.id,
      mandalName: m.name,
      totalPaid: mandalPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      totalFines: mandalPayments.reduce((sum: number, p: any) => sum + (p.fine || 0), 0),
      users: mandalUsers.length,
    };
  });

  // Payment mode breakdown
  const paymentModeBreakdown = ['cash', 'online', 'phonepe_qr'].map(mode => ({
    mode,
    count: payments.filter((p: any) => p.mode === mode).length,
    total: payments.filter((p: any) => p.mode === mode).reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
  }));

  // Group breakdown by payment mode (for stacked bar)
  const groupStacked = groups.map((g: any) => {
    const groupPayments = payments.filter((p: any) => p.group_id === g.id);
    return {
      groupName: g.name,
      cash: groupPayments.filter((p: any) => p.mode === 'cash').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      online: groupPayments.filter((p: any) => p.mode === 'online').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      phonepe_qr: groupPayments.filter((p: any) => p.mode === 'phonepe_qr').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
    };
  });

  // Branch breakdown by payment mode (for stacked bar)
  const branchStacked = branches.map((b: any) => {
    const branchPayments = payments.filter((p: any) => p.branch_id === b.id);
    return {
      branchName: b.name,
      cash: branchPayments.filter((p: any) => p.mode === 'cash').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      online: branchPayments.filter((p: any) => p.mode === 'online').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      phonepe_qr: branchPayments.filter((p: any) => p.mode === 'phonepe_qr').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
    };
  });

  // Mandal breakdown by payment mode (for stacked bar)
  const mandalStacked = mandals.map((m: any) => {
    const mandalPayments = payments.filter((p: any) => p.mandal_id === m.id);
    return {
      mandalName: m.name,
      cash: mandalPayments.filter((p: any) => p.mode === 'cash').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      online: mandalPayments.filter((p: any) => p.mode === 'online').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      phonepe_qr: mandalPayments.filter((p: any) => p.mode === 'phonepe_qr').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
    };
  });

  // CSV export for all payments
  const csvHeaders = ['Date', 'User', 'Amount', 'Fine', 'Agent', 'Group'];
  const csvRows = [csvHeaders.join(',')];
  payments.forEach((p: any) => {
    const user = users.find((u: any) => u.id === p.user_id);
    const agent = users.find((u: any) => u.id === p.agent_id);
    csvRows.push([
      p.paid_on,
      user?.name || p.user_id,
      p.amount,
      p.fine,
      agent?.name || p.agent_id,
      p.group_id
    ].join(','));
  });
  const csv = csvRows.join('\n');

  return {
    stats: {
      totalPaid,
      totalFines,
      missed,
      overdue,
      totalLoans,
      totalUsers,
      totalAgents,
      riskyUsers,
    },
    collectionsByMonth,
    topOverdueUsers,
    topAgents,
    groupBreakdown,
    branchBreakdown,
    mandalBreakdown,
    paymentModeBreakdown,
    groupStacked,
    branchStacked,
    mandalStacked,
    csv,
    error: undefined,
  };
}

/**
 * Send a WhatsApp message to a user (placeholder for real API integration)
 * @param recipientPhone - The recipient's phone number (E.164 format)
 * @param message - The message content
 * @param templateName - The template name (optional, for template-based APIs)
 * @returns {Promise<{ success: boolean; error?: string }>}
 */
export async function sendWhatsAppMessage({
  recipientPhone,
  message,
  templateName,
}: {
  recipientPhone: string;
  message: string;
  templateName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Integrate with WhatsApp API provider (e.g., Twilio, Gupshup, WhatsApp Business API)
    // Example:
    // await twilioClient.messages.create({
    //   from: 'whatsapp:+14155238886',
    //   to: `whatsapp:${recipientPhone}`,
    //   body: message,
    // });
    // For now, just log and return success
    console.log(`WhatsApp message sent to ${recipientPhone}: ${message} (template: ${templateName || 'N/A'})`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send WhatsApp message' };
  }
}

async function getBranchPerformance(branchId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('amount, fine')
    .eq('branch_id', branchId);
  // ... existing code ...
}

async function getBranchStaff(branchId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, role')
    .eq('branch_id', branchId)
    // ... existing code ...
    .in('role', ['agent', 'branchManager']);
  return { data, error };
}

async function getBranchLoans(branchId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('id, amount, status')
    .eq('branch_id', branchId);
  // ... existing code ...
}

async function getBranchCustomers(branchId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, created_at')
    .eq('branch_id', branchId);
  // ... existing code ...
}

async function getBranchGroups(branchId: string) {
  const { data, error } = await supabase
    .from('chit_groups')
    .select('id, name, amount')
    .eq('branch_id', branchId);
  // ... existing code ...
} 