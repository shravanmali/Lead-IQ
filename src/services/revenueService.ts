import {
  RevenueDataPoint,
  RevenuePredictionPoint,
  StaffRevenueMetric,
  SourceRevenueMetric,
  RevenuePredictionSummary
} from '../types/revenue';
import {
  REVENUE_TIMELINE,
  REVENUE_PREDICTION_POINTS,
  STAFF_REVENUE_METRICS,
  SOURCE_REVENUE_METRICS,
  REVENUE_PREDICTION_SUMMARY
} from './mockData';
import { getStoredLeads } from './leadService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ManagerKPIs {
  totalRevenue: number;
  revenueThisMonth: number;
  monthlyGrowthPercent: number;
  totalLeads: number;
  approvedLeads: number;
  declinedLeads: number;
  holdLeads: number;
  interestedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageLeadScore: number;
}

export const revenueService = {
  async getRevenueTimeline(): Promise<RevenueDataPoint[]> {
    await delay(180);
    return REVENUE_TIMELINE;
  },

  async getRevenuePrediction(): Promise<{
    points: RevenuePredictionPoint[];
    summary: RevenuePredictionSummary;
  }> {
    await delay(250);
    return {
      points: REVENUE_PREDICTION_POINTS,
      summary: REVENUE_PREDICTION_SUMMARY
    };
  },

  async getRevenueByStaff(): Promise<StaffRevenueMetric[]> {
    await delay(200);
    return STAFF_REVENUE_METRICS;
  },

  async getRevenueBySource(): Promise<SourceRevenueMetric[]> {
    await delay(180);
    return SOURCE_REVENUE_METRICS;
  },

  async getManagerKPIs(): Promise<ManagerKPIs> {
    await delay(150);
    const leads = getStoredLeads();

    const totalLeads = leads.length;
    const approvedLeads = leads.filter(l => l.status === 'Approved').length;
    const declinedLeads = leads.filter(l => l.status === 'Declined').length;
    const holdLeads = leads.filter(l => l.status === 'Hold').length;
    const interestedLeads = leads.filter(l => l.status === 'Interested').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;

    const totalScore = leads.reduce((acc, l) => acc + l.score.score, 0);
    const averageLeadScore = totalLeads > 0 ? Math.round(totalScore / totalLeads) : 0;

    const closed = approvedLeads + convertedLeads;
    const conversionRate = totalLeads > 0 ? Number(((closed / totalLeads) * 100).toFixed(1)) : 0;

    return {
      totalRevenue: 2450000,
      revenueThisMonth: 580000,
      monthlyGrowthPercent: 17.2,
      totalLeads,
      approvedLeads,
      declinedLeads,
      holdLeads,
      interestedLeads,
      convertedLeads,
      conversionRate,
      averageLeadScore
    };
  }
};
