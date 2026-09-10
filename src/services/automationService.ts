import { getStoredActivities, saveStoredActivities, getStoredLeads, saveStoredLeads } from './leadService';
import { LeadActivity } from '../types/lead';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface EmailDispatchPayload {
  leadId: string;
  to: string;
  subject: string;
  body: string;
  sentBy: string;
}

export interface TelegramDispatchPayload {
  leadId: string;
  username: string;
  body: string;
  sentBy: string;
}

export const automationService = {
  async sendEmail(payload: EmailDispatchPayload): Promise<{ success: boolean; messageId: string }> {
    await delay(700); // Simulate SMTP dispatch

    const leads = getStoredLeads();
    const lead = leads.find(l => l.id === payload.leadId);

    // Record activity
    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: payload.leadId,
      type: 'email_sent',
      title: `Automated Email Dispatched: "${payload.subject}"`,
      description: `Sent personalized proposal email to ${payload.to}. Content was synthesized from AI call intelligence.`,
      timestamp: new Date().toISOString(),
      performedBy: payload.sentBy,
      metadata: {
        to: payload.to,
        subject: payload.subject,
        body: payload.body
      }
    };

    const activities = getStoredActivities();
    saveStoredActivities([activity, ...activities]);

    if (lead) {
      lead.lastContact = 'Just now (Email sent)';
      lead.nextAction = 'Awaiting Prospect Reply / Follow-up in 2 days';
      saveStoredLeads(leads);
    }

    return {
      success: true,
      messageId: `msg-${Date.now()}`
    };
  },

  async sendTelegramMessage(payload: TelegramDispatchPayload): Promise<{ success: boolean; messageId: string }> {
    await delay(600); // Simulate Telegram Bot API dispatch

    const leads = getStoredLeads();
    const lead = leads.find(l => l.id === payload.leadId);

    // Record activity
    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: payload.leadId,
      type: 'telegram_sent',
      title: `Automated Telegram Message Sent to @${payload.username}`,
      description: `Dispatched direct Telegram message via Lead-IQ Telegram Bot: "${payload.body.substring(0, 70)}..."`,
      timestamp: new Date().toISOString(),
      performedBy: payload.sentBy,
      metadata: {
        username: payload.username,
        body: payload.body
      }
    };

    const activities = getStoredActivities();
    saveStoredActivities([activity, ...activities]);

    if (lead) {
      lead.lastContact = 'Just now (Telegram sent)';
      lead.nextAction = 'Awaiting Telegram Response';
      saveStoredLeads(leads);
    }

    return {
      success: true,
      messageId: `tg-${Date.now()}`
    };
  }
};
