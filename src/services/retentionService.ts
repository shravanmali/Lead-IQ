import {
  RetentionTrendPoint,
  AtRiskCustomer,
  RetentionMetrics,
  ReengagementCampaignState
} from '../types/retention';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const RETENTION_TREND_6M: RetentionTrendPoint[] = [
  { period: '2026-01', month: 'Jan', year: 2026, rate: 68.2, retained: 341, total: 500, changePP: 0.0 },
  { period: '2026-02', month: 'Feb', year: 2026, rate: 70.1, retained: 350, total: 500, changePP: 1.9 },
  { period: '2026-03', month: 'Mar', year: 2026, rate: 69.4, retained: 347, total: 500, changePP: -0.7 },
  { period: '2026-04', month: 'Apr', year: 2026, rate: 73.2, retained: 366, total: 500, changePP: 3.8 },
  { period: '2026-05', month: 'May', year: 2026, rate: 76.1, retained: 380, total: 500, changePP: 2.9 },
  { period: '2026-06', month: 'Jun', year: 2026, rate: 78.4, retained: 392, total: 500, changePP: 2.3 }
];

export const RETENTION_TREND_30D: RetentionTrendPoint[] = [
  { period: 'Week 1', month: 'W1', year: 2026, rate: 76.8, retained: 384, total: 500, changePP: 0.5 },
  { period: 'Week 2', month: 'W2', year: 2026, rate: 77.2, retained: 386, total: 500, changePP: 0.4 },
  { period: 'Week 3', month: 'W3', year: 2026, rate: 77.9, retained: 389, total: 500, changePP: 0.7 },
  { period: 'Week 4', month: 'W4', year: 2026, rate: 78.4, retained: 392, total: 500, changePP: 0.5 }
];

export const RETENTION_TREND_90D: RetentionTrendPoint[] = [
  { period: '2026-04', month: 'Apr', year: 2026, rate: 73.2, retained: 366, total: 500, changePP: 3.8 },
  { period: '2026-05', month: 'May', year: 2026, rate: 76.1, retained: 380, total: 500, changePP: 2.9 },
  { period: '2026-06', month: 'Jun', year: 2026, rate: 78.4, retained: 392, total: 500, changePP: 2.3 }
];

export const RETENTION_TREND_1Y: RetentionTrendPoint[] = [
  { period: '2025-Q3', month: 'Q3 \'25', year: 2025, rate: 64.5, retained: 322, total: 500, changePP: 1.2 },
  { period: '2025-Q4', month: 'Q4 \'25', year: 2025, rate: 66.8, retained: 334, total: 500, changePP: 2.3 },
  { period: '2026-Q1', month: 'Q1 \'26', year: 2026, rate: 69.4, retained: 347, total: 500, changePP: 2.6 },
  { period: '2026-Q2', month: 'Q2 \'26', year: 2026, rate: 78.4, retained: 392, total: 500, changePP: 9.0 }
];

export const AT_RISK_CUSTOMERS_LIST: AtRiskCustomer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@acmetech.in',
    company: 'Acme Technologies',
    title: 'VP Engineering',
    lastActivityDate: '2026-08-07',
    daysInactive: 34,
    previousValue: 240000,
    riskScore: 92,
    riskLevel: 'HIGH',
    assignedStaff: 'Sneha Kulkarni',
    lastInteraction: 'Contract renewal discussion',
    industry: 'Enterprise FinTech'
  },
  {
    id: 'cust-2',
    name: 'Priya Mehta',
    email: 'priya.mehta@technova.co',
    company: 'TechNova Solutions',
    title: 'Chief Operating Officer',
    lastActivityDate: '2026-07-31',
    daysInactive: 41,
    previousValue: 180000,
    riskScore: 88,
    riskLevel: 'HIGH',
    assignedStaff: 'Akash Jadhav',
    lastInteraction: 'Feature feedback meeting',
    industry: 'SaaS / Cloud'
  },
  {
    id: 'cust-3',
    name: 'Arjun Patel',
    email: 'arjun@fincorporation.in',
    company: 'FinCorp India',
    title: 'Director of Sales',
    lastActivityDate: '2026-08-09',
    daysInactive: 32,
    previousValue: 95000,
    riskScore: 64,
    riskLevel: 'MEDIUM',
    assignedStaff: 'Riya Gupta',
    lastInteraction: 'Quarterly account check-in',
    industry: 'Banking & NBFC'
  },
  {
    id: 'cust-4',
    name: 'Sneha Deshmukh',
    email: 'sneha@bharatlogistics.com',
    company: 'Bharat Logistics',
    title: 'Head of Operations',
    lastActivityDate: '2026-08-02',
    daysInactive: 39,
    previousValue: 160000,
    riskScore: 85,
    riskLevel: 'HIGH',
    assignedStaff: 'Sneha Kulkarni',
    lastInteraction: 'API webhook integration',
    industry: 'Supply Chain'
  },
  {
    id: 'cust-5',
    name: 'Vikram Malhotra',
    email: 'vikram.m@zenithretail.in',
    company: 'Zenith Retail Brands',
    title: 'Managing Director',
    lastActivityDate: '2026-08-04',
    daysInactive: 37,
    previousValue: 110000,
    riskScore: 71,
    riskLevel: 'MEDIUM',
    assignedStaff: 'Akash Jadhav',
    lastInteraction: 'Invoicing & GST update',
    industry: 'Omnichannel Retail'
  },
  {
    id: 'cust-6',
    name: 'Ananya Iyer',
    email: 'ananya@hyperstack.io',
    company: 'HyperStack Systems',
    title: 'VP Product',
    lastActivityDate: '2026-08-08',
    daysInactive: 33,
    previousValue: 55000,
    riskScore: 58,
    riskLevel: 'MEDIUM',
    assignedStaff: 'Riya Gupta',
    lastInteraction: 'Support ticket resolution',
    industry: 'Developer Tools'
  }
];

const LOCAL_STORAGE_KEY_CAMPAIGN = 'leadiq_retention_campaign_state';

export const retentionService = {
  async getMetrics(): Promise<RetentionMetrics> {
    await delay(120);
    return {
      retentionRate: 78.4,
      trendPP: 4.2,
      retainedCustomers: 392,
      totalCustomers: 500,
      atRiskCount: 43,
      revenueAtRisk: 840000, // ₹8.4L
      periodLabel: '30-day retention',
      status: 'improving'
    };
  },

  async getTrend(range: '30D' | '90D' | '6M' | '1Y' = '6M'): Promise<RetentionTrendPoint[]> {
    await delay(150);
    switch (range) {
      case '30D':
        return RETENTION_TREND_30D;
      case '90D':
        return RETENTION_TREND_90D;
      case '1Y':
        return RETENTION_TREND_1Y;
      case '6M':
      default:
        return RETENTION_TREND_6M;
    }
  },

  async getAtRiskCustomers(): Promise<AtRiskCustomer[]> {
    await delay(160);
    return AT_RISK_CUSTOMERS_LIST;
  },

  getStoredCampaignState(): ReengagementCampaignState | null {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY_CAMPAIGN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async sendReengagementCampaign(params: {
    recipientIds: string[];
    tone: 'Professional' | 'Friendly' | 'Win-back' | 'Concise';
    subject: string;
    bodyTemplate: string;
  }): Promise<{ success: boolean; sentCount: number; failedCount: number; message: string }> {
    await delay(1200); // Simulate realistic dispatch pipeline

    const state: ReengagementCampaignState = {
      isSent: true,
      sentAt: new Date().toISOString(),
      recipientCount: params.recipientIds.length,
      totalRevenue: 840000,
      tone: params.tone,
      status: 'Awaiting response',
      contactedCustomerIds: params.recipientIds
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CAMPAIGN, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }

    return {
      success: true,
      sentCount: params.recipientIds.length,
      failedCount: 0,
      message: `Successfully dispatched re-engagement campaign to ${params.recipientIds.length} customers.`
    };
  },

  resetCampaignState(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY_CAMPAIGN);
  }
};
