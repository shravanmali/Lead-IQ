export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Approved'
  | 'Declined'
  | 'Hold'
  | 'Converted';

export type LeadScoreCategory = 'Hot' | 'Warm' | 'Moderate' | 'Cold';

export interface LeadScore {
  score: number; // 0 - 100
  category: LeadScoreCategory;
  probability: number; // percentage e.g. 92%
  confidence: number; // percentage e.g. 96%
  factors: string[];
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  telegramUsername?: string;
  status: LeadStatus;
  score: LeadScore;
  assignedStaffId: string;
  assignedStaffName: string;
  lastContact: string;
  nextAction: string;
  industry: string;
  dealValue: number;
  source: string;
  createdAt: string;
  notes: string;
  country: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'status_change' | 'email_sent' | 'telegram_sent' | 'note' | 'score_update';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  metadata?: Record<string, any>;
}

export interface StatusUpdatePayload {
  leadId: string;
  previousStatus: LeadStatus;
  newStatus: LeadStatus;
  reason?: string;
  updatedBy: string;
}
