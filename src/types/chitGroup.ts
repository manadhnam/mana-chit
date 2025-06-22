// Chit Group Types
export interface ChitGroupRange {
  id: string;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  commission: number;
  interestRate: number;
  duration: number; // in months
  maxMembers: number;
  isActive: boolean;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  eligibilityCriteria: EligibilityCriteria;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCriteria {
  minAge: number;
  maxAge: number;
  minIncome: number;
  minCreditScore: number;
  requiredDocuments: string[];
  employmentTypes: string[];
  residenceTypes: string[];
  maxExistingLoans: number;
  minBankBalance: number;
}

export interface ChitGroup {
  id: string;
  name: string;
  rangeId: string;
  amount: number;
  commission: number;
  interestRate: number;
  duration: number;
  maxMembers: number;
  currentMembers: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FULL' | 'COMPLETED';
  startDate: Date;
  endDate: Date;
  auctionDate: Date;
  nextAuctionDate: Date;
  totalAmount: number;
  collectedAmount: number;
  remainingAmount: number;
  managerId: string;
  branchId: string;
  members: ChitGroupMember[];
  auctions: ChitGroupAuction[];
  payments: ChitGroupPayment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChitGroupMember {
  id: string;
  groupId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  joinDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'DEFAULTED' | 'COMPLETED';
  totalPaid: number;
  totalReceived: number;
  nextPaymentDate: Date;
  nextPaymentAmount: number;
  auctionWon: boolean;
  auctionDate?: Date;
  auctionAmount?: number;
  documents: MemberDocument[];
}

export interface MemberDocument {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface ChitGroupAuction {
  id: string;
  groupId: string;
  auctionDate: Date;
  baseAmount: number;
  winningAmount: number;
  winnerId: string;
  winnerName: string;
  participants: AuctionParticipant[];
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  commission: number;
  totalBids: number;
}

export interface AuctionParticipant {
  id: string;
  customerId: string;
  customerName: string;
  bidAmount: number;
  bidTime: Date;
  status: 'ACTIVE' | 'WON' | 'LOST';
}

export interface ChitGroupPayment {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DEFAULTED';
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'UPI';
  referenceNumber?: string;
  collectedBy: string;
  notes?: string;
  lateFee?: number;
  documents: PaymentDocument[];
}

export interface PaymentDocument {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

// Configuration Types
export interface ChitGroupConfig {
  ranges: ChitGroupRange[];
  globalSettings: GlobalChitSettings;
  riskAssessment: RiskAssessmentConfig;
  notificationSettings: NotificationConfig;
}

export interface GlobalChitSettings {
  maxGroupsPerCustomer: number;
  maxActiveGroupsPerCustomer: number;
  minDaysBetweenAuctions: number;
  maxDaysBetweenPayments: number;
  lateFeePercentage: number;
  defaultCommission: number;
  defaultInterestRate: number;
  autoApprovalEnabled: boolean;
  requireManagerApproval: boolean;
  requireDocumentVerification: boolean;
}

export interface RiskAssessmentConfig {
  lowRiskThreshold: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  factors: RiskFactor[];
  scoringWeights: ScoringWeights;
}

export interface RiskFactor {
  id: string;
  name: string;
  weight: number;
  description: string;
  calculationMethod: 'PERCENTAGE' | 'FIXED' | 'RANGE';
  minValue: number;
  maxValue: number;
}

export interface ScoringWeights {
  age: number;
  income: number;
  creditScore: number;
  employmentHistory: number;
  residenceStability: number;
  existingLoans: number;
  bankBalance: number;
  documentCompleteness: number;
}

export interface NotificationConfig {
  auctionReminders: boolean;
  paymentReminders: boolean;
  overdueNotifications: boolean;
  groupUpdates: boolean;
  documentExpiry: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

// API Response Types
export interface ChitGroupResponse {
  success: boolean;
  data?: ChitGroup | ChitGroup[];
  message?: string;
  error?: string;
}

export interface ChitGroupRangeResponse {
  success: boolean;
  data?: ChitGroupRange | ChitGroupRange[];
  message?: string;
  error?: string;
}

// Form Types
export interface CreateChitGroupForm {
  name: string;
  rangeId: string;
  amount: number;
  duration: number;
  maxMembers: number;
  startDate: Date;
  managerId: string;
  branchId: string;
}

export interface UpdateChitGroupForm {
  name?: string;
  status?: string;
  endDate?: Date;
  managerId?: string;
}

export interface CreateRangeForm {
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  commission: number;
  interestRate: number;
  duration: number;
  maxMembers: number;
  description: string;
  riskLevel: string;
  eligibilityCriteria: EligibilityCriteria;
  documents: string[];
}

// Filter Types
export interface ChitGroupFilter {
  status?: string;
  rangeId?: string;
  branchId?: string;
  managerId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ChitGroupMemberFilter {
  status?: string;
  auctionWon?: boolean;
  paymentStatus?: string;
  joinDate?: Date;
  search?: string;
}

// Statistics Types
export interface ChitGroupStats {
  totalGroups: number;
  activeGroups: number;
  completedGroups: number;
  totalMembers: number;
  activeMembers: number;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  defaultedAmount: number;
  averageCommission: number;
  averageInterestRate: number;
}

export interface RangeStats {
  rangeId: string;
  rangeName: string;
  totalGroups: number;
  activeGroups: number;
  totalMembers: number;
  totalAmount: number;
  collectedAmount: number;
  averageCommission: number;
  averageInterestRate: number;
  riskLevel: string;
} 