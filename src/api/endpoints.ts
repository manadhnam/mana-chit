// API Endpoints for the application

// Loan Management Endpoints
export const LOAN_ENDPOINTS = {
  // Loan Application
  APPLY_LOAN: '/api/loans/apply',
  GET_LOAN_DETAILS: (id: string) => `/api/loans/${id}`,
  GET_USER_LOANS: (userId: string) => `/api/loans/user/${userId}`,
  
  // Loan Approval
  SUBMIT_FOR_APPROVAL: (id: string) => `/api/loans/${id}/submit`,
  APPROVE_LOAN: (id: string) => `/api/loans/${id}/approve`,
  REJECT_LOAN: (id: string) => `/api/loans/${id}/reject`,
  GET_APPROVAL_HISTORY: (id: string) => `/api/loans/${id}/approval-history`,
  
  // Loan Repayment
  MAKE_REPAYMENT: (id: string) => `/api/loans/${id}/repay`,
  GET_REPAYMENT_HISTORY: (id: string) => `/api/loans/${id}/repayments`,
};

// Document Management Endpoints
export const DOCUMENT_ENDPOINTS = {
  UPLOAD_DOCUMENT: '/api/documents/upload',
  VERIFY_DOCUMENT: (id: string) => `/api/documents/${id}/verify`,
  GET_DOCUMENT_STATUS: (id: string) => `/api/documents/${id}/status`,
  GET_USER_DOCUMENTS: (userId: string) => `/api/documents/user/${userId}`,
  GET_EXPIRING_DOCUMENTS: '/api/documents/expiring',
};

// Risk Assessment Endpoints
export const RISK_ENDPOINTS = {
  ASSESS_RISK: '/api/risk/assess',
  GET_RISK_SCORE: (userId: string) => `/api/risk/score/${userId}`,
  GET_RISK_HISTORY: (userId: string) => `/api/risk/history/${userId}`,
  UPDATE_RISK_FACTORS: (userId: string) => `/api/risk/factors/${userId}`,
};

// Branch Management Endpoints
export const BRANCH_ENDPOINTS = {
  GET_BRANCHES: '/api/branches',
  GET_BRANCH_DETAILS: (id: string) => `/api/branches/${id}`,
  GET_BRANCH_PERFORMANCE: (id: string) => `/api/branches/${id}/performance`,
  GET_BRANCH_HIERARCHY: '/api/branches/hierarchy',
  UPDATE_BRANCH_DETAILS: (id: string) => `/api/branches/${id}`,
};

// User Role Management Endpoints
export const ROLE_ENDPOINTS = {
  GET_ROLES: '/api/roles',
  GET_ROLE_PERMISSIONS: (id: string) => `/api/roles/${id}/permissions`,
  ASSIGN_ROLE: '/api/roles/assign',
  UPDATE_ROLE_PERMISSIONS: (id: string) => `/api/roles/${id}/permissions`,
  GET_USER_ROLES: (userId: string) => `/api/roles/user/${userId}`,
};

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  SEND_NOTIFICATION: '/api/notifications/send',
  GET_USER_NOTIFICATIONS: (userId: string) => `/api/notifications/user/${userId}`,
  MARK_AS_READ: (id: string) => `/api/notifications/${id}/read`,
  GET_UNREAD_COUNT: (userId: string) => `/api/notifications/unread/${userId}`,
};

// Audit Log Endpoints
export const AUDIT_ENDPOINTS = {
  LOG_ACTION: '/api/audit/log',
  GET_AUDIT_LOGS: '/api/audit/logs',
  GET_USER_AUDIT_LOGS: (userId: string) => `/api/audit/logs/user/${userId}`,
  GET_BRANCH_AUDIT_LOGS: (branchId: string) => `/api/audit/logs/branch/${branchId}`,
}; 