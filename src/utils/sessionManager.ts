import { toast } from 'react-hot-toast';

// Session Configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REFRESH_TOKEN_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

// Session State
interface SessionState {
  isActive: boolean;
  lastActivity: number;
  sessionStart: number;
  refreshToken: string | null;
  user: any | null;
}

class SessionManager {
  private sessionState: SessionState = {
    isActive: false,
    lastActivity: 0,
    sessionStart: 0,
    refreshToken: null,
    user: null
  };

  private warningShown = false;
  private timeoutId: NodeJS.Timeout | null = null;
  private warningId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSession();
    this.setupActivityListeners();
  }

  // Initialize session from localStorage
  private initializeSession() {
    try {
      const storedSession = localStorage.getItem('session-data');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        const now = Date.now();
        
        // Check if session is still valid
        if (session.lastActivity && (now - session.lastActivity) < SESSION_TIMEOUT) {
          this.sessionState = { ...session, isActive: true };
          this.startSessionTimer();
          this.logAuditEvent('SESSION_RESUMED', 'Session resumed from storage');
        } else {
          this.clearSession();
          this.logAuditEvent('SESSION_EXPIRED', 'Stored session expired');
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      this.clearSession();
    }
  }

  // Start session
  startSession(user: any, refreshToken: string) {
    const now = Date.now();
    this.sessionState = {
      isActive: true,
      lastActivity: now,
      sessionStart: now,
      refreshToken,
      user
    };

    this.saveSession();
    this.startSessionTimer();
    this.logAuditEvent('SESSION_STARTED', `Session started for user: ${user.email}`);
  }

  // Update last activity
  updateActivity() {
    if (this.sessionState.isActive) {
      this.sessionState.lastActivity = Date.now();
      this.saveSession();
      this.resetSessionTimer();
      this.warningShown = false;
    }
  }

  // Start session timer
  private startSessionTimer() {
    // Clear any existing timers first
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
    }
    
    // Set warning timer
    this.warningId = setTimeout(() => {
      if (!this.warningShown) {
        this.showSessionWarning();
        this.warningShown = true;
      }
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      this.handleSessionTimeout();
    }, SESSION_TIMEOUT);
  }

  // Reset session timer
  private resetSessionTimer() {
    // Clear existing timers
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
    }
    
    // Reset warning flag
    this.warningShown = false;
    
    // Start new timers
    this.startSessionTimer();
  }

  // Show session warning
  private showSessionWarning() {
    toast.error(
      'Your session will expire in 5 minutes. Please save your work.',
      { duration: 10000 }
    );
  }

  // Handle session timeout
  private handleSessionTimeout() {
    this.logAuditEvent('SESSION_TIMEOUT', 'Session timed out due to inactivity');
    this.clearSession();
    toast.error('Session expired due to inactivity. Please login again.');
    
    // Redirect to login
    window.location.href = '/auth/login';
  }

  // Refresh session
  async refreshSession(): Promise<boolean> {
    try {
      if (!this.sessionState.refreshToken) {
        return false;
      }

      // Mock API call to refresh token
      const response = await this.callRefreshAPI(this.sessionState.refreshToken);
      
      if (response.success) {
        this.sessionState.refreshToken = response.newRefreshToken;
        this.sessionState.lastActivity = Date.now();
        this.saveSession();
        this.resetSessionTimer();
        this.logAuditEvent('SESSION_REFRESHED', 'Session refreshed successfully');
        return true;
      } else {
        this.clearSession();
        this.logAuditEvent('REFRESH_FAILED', 'Failed to refresh session');
        return false;
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      this.clearSession();
      this.logAuditEvent('REFRESH_ERROR', 'Error during session refresh');
      return false;
    }
  }

  // Mock refresh API call
  private async callRefreshAPI(refreshToken: string): Promise<any> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful refresh
    return {
      success: true,
      newRefreshToken: `new_refresh_${Date.now()}`,
      accessToken: `new_access_${Date.now()}`
    };
  }

  // Clear session
  clearSession() {
    this.sessionState = {
      isActive: false,
      lastActivity: 0,
      sessionStart: 0,
      refreshToken: null,
      user: null
    };

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
    }

    localStorage.removeItem('session-data');
    this.logAuditEvent('SESSION_CLEARED', 'Session cleared');
  }

  // Save session to localStorage
  private saveSession() {
    try {
      localStorage.setItem('session-data', JSON.stringify(this.sessionState));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Setup activity listeners
  private setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), true);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
      }
    });
  }

  // Get session info
  getSessionInfo() {
    return {
      ...this.sessionState,
      timeRemaining: this.getTimeRemaining(),
      isWarningActive: this.warningShown
    };
  }

  // Get time remaining
  getTimeRemaining(): number {
    if (!this.sessionState.isActive) return 0;
    const elapsed = Date.now() - this.sessionState.lastActivity;
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  }

  // Check if session is active
  isSessionActive(): boolean {
    return this.sessionState.isActive && this.getTimeRemaining() > 0;
  }

  // Extend session
  extendSession() {
    if (this.sessionState.isActive) {
      this.updateActivity();
      this.warningShown = false;
      toast.success('Session extended');
      this.logAuditEvent('SESSION_EXTENDED', 'Session extended by user');
    }
  }

  // Logout
  logout() {
    this.logAuditEvent('LOGOUT', 'User logged out');
    this.clearSession();
  }

  // Audit logging
  private logAuditEvent(action: string, details: string) {
    const auditLog = {
      timestamp: new Date().toISOString(),
      action,
      details,
      userId: this.sessionState.user?.id || 'unknown',
      userEmail: this.sessionState.user?.email || 'unknown',
      sessionId: this.sessionState.sessionStart,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // In real app, this would come from server
    };

    // Store audit log
    this.storeAuditLog(auditLog);
    
    // In production, send to server
    this.sendAuditLogToServer(auditLog);
  }

  // Store audit log locally
  private storeAuditLog(auditLog: any) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('audit-logs') || '[]');
      existingLogs.push(auditLog);
      
      // Keep only last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem('audit-logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Error storing audit log:', error);
    }
  }

  // Send audit log to server (mock)
  private async sendAuditLogToServer(auditLog: any) {
    try {
      // In production, this would be a real API call
      console.log('Audit log sent to server:', auditLog);
    } catch (error) {
      console.error('Error sending audit log:', error);
    }
  }

  // Get audit logs
  getAuditLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('audit-logs') || '[]');
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  }

  // Clear audit logs
  clearAuditLogs() {
    localStorage.removeItem('audit-logs');
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Export utility functions
export const getSessionInfo = () => sessionManager.getSessionInfo();
export const isSessionActive = () => sessionManager.isSessionActive();
export const extendSession = () => sessionManager.extendSession();
export const logout = () => sessionManager.logout();
export const getAuditLogs = () => sessionManager.getAuditLogs();
export const clearAuditLogs = () => sessionManager.clearAuditLogs(); 