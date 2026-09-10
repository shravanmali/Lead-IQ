import { Lead, LeadStatus, LeadActivity, StatusUpdatePayload } from '../types/lead';
import { INITIAL_LEADS, INITIAL_ACTIVITIES } from './mockData';
import { formatIndianDate } from '../utils/formatters';

const LEADS_STORAGE_KEY = 'leadiq_leads_in';
const ACTIVITIES_STORAGE_KEY = 'leadiq_activities_in';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getStoredLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveStoredLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

export function getStoredActivities(): LeadActivity[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function saveStoredActivities(acts: LeadActivity[]): void {
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(acts));
}

export interface LeadFilterOptions {
  status?: LeadStatus | 'All';
  assignedStaffId?: string;
  searchQuery?: string;
  minScore?: number;
  category?: string;
}

export const leadService = {
  async getLeads(filters?: LeadFilterOptions): Promise<Lead[]> {
    await delay(180);
    let list = getStoredLeads();

    if (filters) {
      if (filters.status && filters.status !== 'All') {
        list = list.filter(l => l.status === filters.status);
      }
      if (filters.assignedStaffId) {
        list = list.filter(l => l.assignedStaffId === filters.assignedStaffId);
      }
      if (filters.minScore !== undefined) {
        list = list.filter(l => l.score.score >= filters.minScore!);
      }
      if (filters.category && filters.category !== 'All') {
        list = list.filter(l => l.score.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          l =>
            l.name.toLowerCase().includes(q) ||
            l.company.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            l.country.toLowerCase().includes(q) ||
            (l.telegramUsername && l.telegramUsername.toLowerCase().includes(q))
        );
      }
    }

    return list;
  },

  async getLeadById(id: string): Promise<Lead | null> {
    await delay(150);
    const leads = getStoredLeads();
    return leads.find(l => l.id === id) || null;
  },

  /**
   * Smart Leads Algorithm:
   * Returns leads strictly sorted in DESCENDING ORDER by AI Lead Score.
   * Highest scoring lead (e.g. Rahul Sharma 92 Hot) appears FIRST with AI Priority #1.
   */
  async getSmartLeads(staffId?: string): Promise<Lead[]> {
    await delay(200);
    let list = getStoredLeads();
    if (staffId) {
      list = list.filter(l => l.assignedStaffId === staffId);
    }
    // Strict DESC sorting by score.score
    return [...list].sort((a, b) => b.score.score - a.score.score);
  },

  async updateLeadStatus(payload: StatusUpdatePayload): Promise<Lead> {
    await delay(300);
    const leads = getStoredLeads();
    const index = leads.findIndex(l => l.id === payload.leadId);
    if (index === -1) {
      throw new Error(`Lead ${payload.leadId} not found`);
    }

    const current = leads[index];
    const updatedLead: Lead = {
      ...current,
      status: payload.newStatus,
      lastContact: 'Just now'
    };

    leads[index] = updatedLead;
    saveStoredLeads(leads);

    // Record activity audit entry
    const newActivity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: payload.leadId,
      type: 'status_change',
      title: `Status updated to ${payload.newStatus}`,
      description: `Status changed from ${payload.previousStatus} to ${payload.newStatus}. ${payload.reason ? `Reason: "${payload.reason}"` : ''}`,
      timestamp: new Date().toISOString(),
      performedBy: payload.updatedBy,
      metadata: {
        previousStatus: payload.previousStatus,
        newStatus: payload.newStatus,
        reason: payload.reason
      }
    };

    const activities = getStoredActivities();
    saveStoredActivities([newActivity, ...activities]);

    return updatedLead;
  },

  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    await delay(150);
    const activities = getStoredActivities();
    return activities.filter(a => a.leadId === leadId);
  },

  async addLead(lead: Partial<Lead>): Promise<Lead> {
    await delay(300);
    const leads = getStoredLeads();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: lead.name || 'New Client Prospect',
      company: lead.company || 'Enterprise Solutions India',
      title: lead.title || 'Director',
      phone: lead.phone || '+91 98000 00000',
      email: lead.email || 'contact@prospect.in',
      telegramUsername: lead.telegramUsername,
      status: lead.status || 'New',
      score: lead.score || {
        score: 65,
        category: 'Warm',
        probability: 60,
        confidence: 75,
        factors: ['Inbound demo inquiry', 'Awaiting discovery call'],
        updatedAt: new Date().toISOString()
      },
      assignedStaffId: lead.assignedStaffId || 'staff-1',
      assignedStaffName: lead.assignedStaffName || 'Sneha Kulkarni',
      lastContact: 'Never contacted',
      nextAction: 'Initiate Discovery Call & Confirm Requirements',
      industry: lead.industry || 'Technology & IT Services',
      dealValue: lead.dealValue || 350000,
      source: lead.source || 'Inbound Website',
      createdAt: new Date().toISOString(),
      notes: lead.notes || '',
      country: lead.country || 'Pune, Maharashtra'
    };

    const updated = [newLead, ...leads];
    saveStoredLeads(updated);
    return newLead;
  }
};
