import { Role } from './auth';

export interface ChatAttachment {
  type: 'lead' | 'kpi' | 'chart' | 'table';
  title: string;
  data: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  content: string;
  roleScope: Role;
  dataPayload?: {
    type: 'kpi_cards' | 'lead_cards' | 'data_table' | 'chart' | 'lead_detail' | 'restriction';
    title?: string;
    data: any;
  };
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'Leads' | 'Revenue' | 'Performance' | 'Workflow';
  allowedRoles: Role[];
}
