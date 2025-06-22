import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';

// --- Mock CIBIL API ---
const mockCibilCheck = async (userId: string): Promise<{ score: number; history: string }> => {
  // In a real app, this would be an external API call.
  // For now, generate a random score for demonstration.
  await new Promise(res => setTimeout(res, 500)); // Simulate network delay
  const score = Math.floor(Math.random() * (850 - 550 + 1)) + 550;
  return {
    score,
    history: score > 700 ? 'Good' : 'Average',
  };
};


// --- Loan Eligibility Engine ---

/**
 * Checks a user's eligibility for a loan based on multiple factors.
 * @param userId - The ID of the user applying for the loan.
 * @param groupId - The ID of the group associated with the loan.
 * @returns An object detailing the user's eligibility.
 */
export const checkLoanEligibility = async (userId: string, groupId: string) => {
  const eligibilityDetails: Record<string, any> = { checks: {} };

  // 1. Check CIBIL Score
  const cibil = await mockCibilCheck(userId);
  eligibilityDetails.cibil_score = cibil.score;
  eligibilityDetails.checks.cibil = cibil.score > 650;

  // 2. Check Savings History (e.g., has made at least 3 payments)
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('id')
    .eq('user_id', userId)
    .limit(3);
  if (paymentsError) throw paymentsError;
  eligibilityDetails.checks.savings_history = payments.length >= 3;

  // 3. Check Group Performance (e.g., has the group had successful auctions?)
  const { data: auctions, error: auctionsError } = await supabase
    .from('auctions')
    .select('id')
    .eq('group_id', groupId)
    .eq('status', 'closed')
    .limit(1);
  if (auctionsError) throw auctionsError;
  eligibilityDetails.checks.group_performance = auctions.length > 0;

  // Determine overall eligibility
  const isEligible =
    eligibilityDetails.checks.cibil &&
    eligibilityDetails.checks.savings_history &&
    eligibilityDetails.checks.group_performance;

  await log_audit('loan.eligibility_check', { userId, groupId, isEligible, details: eligibilityDetails });

  return {
    isEligible,
    details: eligibilityDetails,
  };
};

/**
 * Request a loan after checking eligibility.
 * @param userId
 * @param groupId
 * @param amount
 */
export const requestLoanWithEligibilityCheck = async (userId: string, groupId: string, amount: number) => {
  const eligibility = await checkLoanEligibility(userId, groupId);

  if (!eligibility.isEligible) {
    throw new Error('User is not eligible for a loan at this time.');
  }

  const { data, error } = await supabase
    .from('loan_requests')
    .insert({
      user_id: userId,
      group_id: groupId,
      // amount: amount, // Assuming you add an 'amount' column
      status: 'pending',
      cibil_score: eligibility.details.cibil_score,
      eligibility_details: eligibility.details,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  await log_audit('loan.request', { userId, groupId, loanRequestId: data.id });
  return data;
}; 