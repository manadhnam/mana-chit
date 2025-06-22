import { useNotificationStore } from '@/stores/notificationStore';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';

// This is a placeholder for a real email service
const sendEmailNotification = async (userId: string, subject: string, message: string) => {
  console.log(`Sending email to user ${userId}: ${subject}`);
  // In a real app, you would use a service like Resend, SendGrid, or Supabase's built-in email functions.
  await new Promise(res => setTimeout(res, 300)); // Simulate async operation
  return true;
};

class NotificationService {
  constructor() {
    // WebSocket connection is disabled for now.
  }

  // --- Public API ---

  /**
   * Creates a notification in the database and optionally sends an email.
   */
  public async createNotification(
    userId: string,
    message: string,
    type: string,
    options: { sendEmail?: boolean; subject?: string } = {}
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ user_id: userId, message, type })
      .select()
      .single();

    if (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }

    if (options.sendEmail) {
      await sendEmailNotification(userId, options.subject || 'New Notification', message);
    }

    await log_audit('notification.create', { userId, type });
    return data;
  }

  /**
   * Get all notifications for a specific user.
   */
  public async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Mark a notification as read.
   */
  public async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return data;
  }
  
  // --- WebSocket Handling (currently disabled) ---

  private handleNotification(data: any) {
    const { addNotification } = useNotificationStore.getState();

    // Map notification types to appropriate actions
    switch (data.type) {
      case 'new_user':
        addNotification({
          type: 'info',
          title: 'New User Registration',
          message: `New user ${data.userName} has registered`,
          link: `/super-admin/user-management/${data.userId}`,
          metadata: data,
        });
        break;

      case 'loan_request':
        addNotification({
          type: 'warning',
          title: 'New Loan Request',
          message: `Loan request from ${data.userName} for ${data.amount}`,
          link: `/super-admin/loans/${data.loanId}`,
          metadata: data,
        });
        break;

      case 'receipt_uploaded':
        addNotification({
          type: 'info',
          title: 'New Receipt Uploaded',
          message: `Receipt uploaded by ${data.userName}`,
          link: `/super-admin/receipts/${data.receiptId}`,
          metadata: data,
        });
        break;

      case 'meeting_scheduled':
        addNotification({
          type: 'success',
          title: 'Meeting Scheduled',
          message: `Meeting scheduled with ${data.userName} on ${new Date(data.date).toLocaleDateString()}`,
          link: `/super-admin/meetings/${data.meetingId}`,
          metadata: data,
        });
        break;

      case 'system_alert':
        addNotification({
          type: 'error',
          title: 'System Alert',
          message: data.message,
          link: data.link,
          metadata: data,
        });
        break;

      default:
        console.warn('Unknown notification type:', data.type);
    }
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;