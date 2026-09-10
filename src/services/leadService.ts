import { Lead, LeadStatus, LeadActivity, StatusUpdatePayload } from '../types/lead';
import { INITIAL_LEADS, INITIAL_ACTIVITIES } from './mockData';

const LEADS_STORAGE_KEY = 'leadiq_leads_in';
const ACTIVITIES_STORAGE_KEY = 'leadiq_activities_in';

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
    let list: Lead[] = [];

    // Attempt to fetch from backend API
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.leads)) {
          list = data.leads;
          saveStoredLeads(list);
        }
      }
    } catch {
      // Offline fallback
      list = getStoredLeads();
    }

    if (list.length === 0) {
      list = getStoredLeads();
    }

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
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.lead) {
          return data.lead;
        }
      }
    } catch {
      // Fallback
    }

    const leads = getStoredLeads();
    return leads.find(l => l.id === id) || null;
  },

  /**
   * Smart Leads: Returns leads sorted in DESCENDING order by AI Lead Score
   */
  async getSmartLeads(staffId?: string): Promise<Lead[]> {
    const list = await this.getLeads(staffId ? { assignedStaffId: staffId } : undefined);
    return [...list].sort((a, b) => b.score.score - a.score.score);
  },

  async updateLeadStatus(payload: StatusUpdatePayload): Promise<Lead> {
    try {
      const res = await fetch(`/api/leads/${payload.leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: payload.newStatus,
          lastContact: 'Just now'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.lead) {
          // Log activity
          await this.addLeadActivity(payload.leadId, {
            leadId: payload.leadId,
            type: 'status_change',
            title: `Status updated to ${payload.newStatus}`,
            description: `Status changed from ${payload.previousStatus} to ${payload.newStatus}. ${payload.reason ? `Reason: "${payload.reason}"` : ''}`,
            performedBy: payload.updatedBy,
            metadata: {
              previousStatus: payload.previousStatus,
              newStatus: payload.newStatus,
              reason: payload.reason
            }
          });

          return data.lead;
        }
      }
    } catch {
      // Fallback
    }

    const leads = getStoredLeads();
    const index = leads.findIndex(l => l.id === payload.leadId);
    if (index === -1) {
      throw new Error(`Lead ${payload.leadId} not found`);
    }

    const updatedLead: Lead = {
      ...leads[index],
      status: payload.newStatus,
      lastContact: 'Just now'
    };

    leads[index] = updatedLead;
    saveStoredLeads(leads);
    return updatedLead;
  },

  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    try {
      const res = await fetch(`/api/leads/${leadId}/activities`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.activities)) {
          return data.activities;
        }
      }
    } catch {
      // Fallback
    }

    const acts = getStoredActivities();
    return acts.filter(a => a.leadId === leadId);
  },

  async addLeadActivity(leadId: string, activity: Omit<LeadActivity, 'id' | 'timestamp'>): Promise<LeadActivity> {
    try {
      const res = await fetch(`/api/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.activity) {
          return data.activity;
        }
      }
    } catch {
      // Fallback
    }

    const newAct: LeadActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      leadId,
      timestamp: new Date().toISOString()
    };

    const acts = getStoredActivities();
    saveStoredActivities([newAct, ...acts]);
    return newAct;
  }
};
