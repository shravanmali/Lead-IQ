import { getStoredActivities, saveStoredActivities, getStoredLeads, saveStoredLeads } from './leadService';
import { LeadActivity } from '../types/lead';

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
  chatId?: string;
  body: string;
  sentBy: string;
}

export const automationService = {
  /**
   * Channel 1: [ Automatic Email ]
   * Dispatches automated email via Nodemailer Gmail SMTP relay on server
   */
  async sendEmail(payload: EmailDispatchPayload): Promise<{ success: boolean; messageId: string; response?: string }> {
    let resultMessageId = `msg-${Date.now()}`;
    let backendSuccess = false;

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        resultMessageId = data.messageId || resultMessageId;
        backendSuccess = true;
      } else {
        const err = await res.json().catch(() => ({ error: 'SMTP dispatch failed' }));
        throw new Error(err.error || `SMTP error ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Backend email dispatch warning, recording activity:', err.message);
      // If server failed, throw error to user so they know
      throw err;
    }

    const leads = getStoredLeads();
    const lead = leads.find(l => l.id === payload.leadId);

    // Record activity locally and remotely
    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: payload.leadId,
      type: 'email_sent',
      title: `Automated Email Dispatched (SMTP): "${payload.subject}"`,
      description: `Sent personalized proposal email to ${payload.to} via Gmail SMTP. Message ID: ${resultMessageId}`,
      timestamp: new Date().toISOString(),
      performedBy: payload.sentBy,
      metadata: {
        to: payload.to,
        subject: payload.subject,
        body: payload.body,
        messageId: resultMessageId
      }
    };

    const activities = getStoredActivities();
    saveStoredActivities([activity, ...activities]);

    if (lead) {
      lead.lastContact = 'Just now (SMTP Email)';
      lead.nextAction = 'Awaiting Prospect Reply / Follow-up in 2 days';
      saveStoredLeads(leads);
    }

    try {
      await fetch(`/api/leads/${payload.leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
    } catch {
      // Background sync optional
    }

    return {
      success: true,
      messageId: resultMessageId
    };
  },

  /**
   * Channel 2: [ Manual Email ]
   * Builds pre-filled mailto: link and triggers default mail client
   */
  triggerManualEmail(to: string, subject: string, body: string, leadId?: string, sentBy: string = 'Staff'): string {
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    if (leadId) {
      const activity: LeadActivity = {
        id: `act-${Date.now()}`,
        leadId,
        type: 'email_sent',
        title: `Manual Email Client Opened (mailto:)`,
        description: `Pre-filled email client launched with recipient ${to} and subject "${subject.substring(0, 45)}..."`,
        timestamp: new Date().toISOString(),
        performedBy: sentBy,
        metadata: { to, subject, body, channel: 'manual_mailto' }
      };
      const activities = getStoredActivities();
      saveStoredActivities([activity, ...activities]);

      fetch(`/api/leads/${leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      }).catch(() => {});
    }

    return mailtoUrl;
  },

  /**
   * Channel 3: [ Automatic Telegram ]
   * Dispatches direct message via configured Telegram Bot (@Lead_IQ_bot)
   */
  async sendTelegramMessage(payload: TelegramDispatchPayload): Promise<{ success: boolean; messageId: string }> {
    let resultMessageId = `tg-${Date.now()}`;

    const res = await fetch('/api/telegram/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Telegram dispatch failed' }));
      throw new Error(err.error || `Telegram error ${res.status}`);
    }

    const data = await res.json();
    resultMessageId = String(data.messageId || resultMessageId);

    const leads = getStoredLeads();
    const lead = leads.find(l => l.id === payload.leadId);

    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: payload.leadId,
      type: 'telegram_sent',
      title: `Automated Telegram Message Sent (@${payload.username.replace('@', '')})`,
      description: `Dispatched direct Telegram message via Lead-IQ Telegram Bot: "${payload.body.substring(0, 70)}..."`,
      timestamp: new Date().toISOString(),
      performedBy: payload.sentBy,
      metadata: {
        username: payload.username,
        body: payload.body,
        messageId: resultMessageId
      }
    };

    const activities = getStoredActivities();
    saveStoredActivities([activity, ...activities]);

    if (lead) {
      lead.lastContact = 'Just now (Bot Telegram)';
      lead.nextAction = 'Awaiting Telegram Response';
      saveStoredLeads(leads);
    }

    try {
      await fetch(`/api/leads/${payload.leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
    } catch {
      // Optional
    }

    return {
      success: true,
      messageId: resultMessageId
    };
  },

  /**
   * Channel 4: [ Manual Telegram ]
   * Builds direct Telegram user link (https://t.me/username?text=...) and opens in new tab
   */
  triggerManualTelegram(username: string, message: string, leadId?: string, sentBy: string = 'Staff'): string {
    const cleanUser = username.replace(/^@/, '').trim();
    const url = `https://t.me/${cleanUser}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    if (leadId) {
      const activity: LeadActivity = {
        id: `act-${Date.now()}`,
        leadId,
        type: 'telegram_sent',
        title: `Manual Telegram Chat Opened (@${cleanUser})`,
        description: `Opened direct Telegram chat deep-link with pre-populated message.`,
        timestamp: new Date().toISOString(),
        performedBy: sentBy,
        metadata: { username: cleanUser, message, channel: 'manual_telegram' }
      };
      const activities = getStoredActivities();
      saveStoredActivities([activity, ...activities]);

      fetch(`/api/leads/${leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      }).catch(() => {});
    }

    return url;
  },

  /**
   * Channel 5: [ Manual WhatsApp ]
   * Builds WhatsApp click-to-chat deep-link (https://wa.me/phone?text=...) and opens in new tab
   */
  triggerManualWhatsApp(phone: string, message: string, leadId?: string, sentBy: string = 'Staff'): string {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 10) {
      clean = '91' + clean; // Default to India (+91) if 10-digit number
    }
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    if (leadId) {
      const activity: LeadActivity = {
        id: `act-${Date.now()}`,
        leadId,
        type: 'call',
        title: `Manual WhatsApp Chat Opened (+${clean})`,
        description: `Opened WhatsApp click-to-chat deep-link with pre-populated proposal text.`,
        timestamp: new Date().toISOString(),
        performedBy: sentBy,
        metadata: { phone: clean, message, channel: 'manual_whatsapp' }
      };
      const activities = getStoredActivities();
      saveStoredActivities([activity, ...activities]);

      fetch(`/api/leads/${leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      }).catch(() => {});
    }

    return url;
  },

  /**
   * AI Content Generators (Calling Server Gemini Backend)
   */
  async generateEmail(lead: any, customPrompt?: string): Promise<{ subject: string; body: string }> {
    try {
      const res = await fetch('/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, customPrompt })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }

    return {
      subject: `Lead-IQ Commercial Proposal & Enterprise Onboarding for ${lead.company || lead.name}`,
      body: `Dear ${lead.name},\n\nThank you for taking the time to speak with our sales intelligence team. Based on our call notes regarding ${lead.company}, we have tailored our AI voice analytics and predictive lead scoring suite for your team.\n\nKey Highlights:\n• Automated Whisper Speech-to-Text & Diarization\n• Indian GST Compliant Invoicing with AWS Mumbai Cloud Residency\n• 5-Channel Automated Follow-ups (Email, Telegram, WhatsApp)\n\nPlease let us know if you'd like to schedule a 15-minute executive briefing.\n\nWarm regards,\nLead-IQ Sales Operations`
    };
  },

  async generateTelegram(lead: any, customPrompt?: string): Promise<{ message: string; preview: string }> {
    try {
      const res = await fetch('/api/telegram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, customPrompt })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }

    const firstName = (lead.name || 'Friend').split(' ')[0];
    return {
      message: `Namaste ${firstName} ji! 👋 Lead-IQ team here. Just sent over the full proposal and GST quotation to ${lead.email || 'your email'}. Feel free to drop any questions here!`,
      preview: `Namaste ${firstName} ji! 👋 Lead-IQ team here.`
    };
  },

  async generateWhatsApp(lead: any, customPrompt?: string): Promise<{ message: string; url: string }> {
    try {
      const res = await fetch('/api/whatsapp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, customPrompt })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const firstName = (lead.name || 'Friend').split(' ')[0];
    const msg = `Hello ${firstName}! 👋 Thank you for connecting with Lead-IQ today. We have prepared the enterprise proposal for ${lead.company || 'your team'}. You can reply directly here to finalize dates for onboarding.`;
    return {
      message: msg,
      url: `https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
    };
  },

  async syncTelegramUpdates(): Promise<{ success: boolean; updates: any[]; message: string }> {
    const res = await fetch('/api/telegram/sync');
    if (!res.ok) {
      throw new Error(`Sync failed with status ${res.status}`);
    }
    return await res.json();
  },

  async checkEmailStatus(): Promise<{ configured: boolean; user?: string; host?: string }> {
    try {
      const res = await fetch('/api/email/status');
      if (res.ok) {
        const data = await res.json();
        return {
          configured: data.configured ?? data.config?.configured ?? false,
          user: data.user ?? data.config?.user,
          host: data.host ?? data.config?.host
        };
      }
    } catch {}
    return { configured: false };
  },

  async checkTelegramStatus(): Promise<{ configured: boolean; botUsername?: string }> {
    try {
      const res = await fetch('/api/telegram/status');
      if (res.ok) {
        const data = await res.json();
        return {
          configured: data.configured ?? data.config?.configured ?? false,
          botUsername: data.botUsername ?? data.config?.botUsername ?? 'Lead_IQ_bot'
        };
      }
    } catch {}
    return { configured: false };
  }
};
