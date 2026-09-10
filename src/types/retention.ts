export interface RetentionTrendPoint {
  period: string;
  month: string;
  year: number;
  rate: number;
  retained: number;
  total: number;
  changePP: number;
}

export interface AtRiskCustomer {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  avatar?: string;
  lastActivityDate: string;
  daysInactive: number;
  previousValue: number;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedStaff: string;
  lastInteraction: string;
  industry: string;
}

export interface RetentionMetrics {
  retentionRate: number;
  trendPP: number;
  retainedCustomers: number;
  totalCustomers: number;
  atRiskCount: number;
  revenueAtRisk: number;
  periodLabel: string;
  status: 'improving' | 'stable' | 'declining';
}

export interface ReengagementCampaignState {
  isSent: boolean;
  sentAt?: string;
  recipientCount: number;
  totalRevenue: number;
  tone: 'Professional' | 'Friendly' | 'Win-back' | 'Concise';
  status: 'Awaiting response' | 'Draft';
  contactedCustomerIds: string[];
}
