export type RevenueTimeframe = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface RevenueDataPoint {
  period: string;
  actualRevenue: number;
  targetRevenue: number;
  dealsClosed: number;
}

export interface RevenuePredictionPoint {
  date: string;
  actual?: number;
  predicted: number;
  lowerConfidence: number;
  upperConfidence: number;
  milestone?: string;
}

export interface StaffRevenueMetric {
  staffId: string;
  staffName: string;
  avatar: string;
  totalRevenue: number;
  dealsClosed: number;
  conversionRate: number;
  avgDealSize: number;
  trend: number;
}

export interface SourceRevenueMetric {
  source: string;
  revenue: number;
  leadsCount: number;
  conversionRate: number;
  color: string;
}

export interface RevenuePredictionSummary {
  predictedTotal: number;
  currentTotal: number;
  expectedGrowthPercent: number;
  confidencePercent: number;
  forecastInsight: string;
  growthDrivers: string[];
  risks: string[];
}
