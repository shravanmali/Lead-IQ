import { Router, Request, Response } from 'express';
import { buildWhatsAppUrl, sanitizePhoneNumberForWhatsApp } from '../services/whatsappService';
import { aiService } from '../services/aiService';
import { getLeadById, addLeadActivity, createLead, LeadActivity } from '../storage';

export const whatsappRouter = Router();

whatsappRouter.post('/generate', async (req: Request, res: Response) => {
  const { leadId, lead: directLead, tone = 'friendly', customPrompt } = req.body;
  const lead = directLead || (leadId ? getLeadById(leadId) : null);
  if (!lead) {
    return res.status(400).json({ success: false, error: 'lead or leadId is required' });
  }

  try {
    const summaryText = customPrompt || lead.notes || `${lead.interestedIn || 'Enterprise AI'} requirement for ${lead.company || lead.name}`;
    const message = await aiService.generateWhatsAppMessage(lead, summaryText, tone);
    const targetPhone = lead.phone || '';
    const url = targetPhone ? buildWhatsAppUrl(targetPhone, message) : '';
    res.json({
      success: true,
      message,
      url,
      tone,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/manual
 * Triggers manual WhatsApp flow:
 * Generates official click-to-chat URL with prefilled recipient and AI message.
 * Logs "whatsapp_prepared" activity in lead's timeline.
 */
whatsappRouter.post('/manual', (req: Request, res: Response) => {
  const { leadId, phone, message, staffUser = 'Sneha Kulkarni (Staff AE)' } = req.body;

  if (!leadId) {
    return res.status(400).json({ success: false, error: 'leadId is required' });
  }

  let lead = getLeadById(leadId);
  if (!lead) {
    lead = createLead({
      id: leadId,
      name: req.body.leadName || 'Valued Lead',
      phone: phone?.trim() || '+919876543210',
      company: req.body.company || 'Enterprise Account'
    });
  }

  const targetPhone = phone?.trim() || lead.phone || '';
  if (!targetPhone) {
    return res.status(400).json({ success: false, error: 'Customer phone number is required for WhatsApp.' });
  }

  const defaultMsg = message?.trim() ||
    `Namaste ${lead.name.split(' ')[0]} ji! 👋 ${staffUser.split(' ')[0]} from Lead-IQ here. Just sent over the proposal to your email (${lead.email}). Let me know if you need quick answers on contract terms or onboarding!`;

  const waUrl = buildWhatsAppUrl(targetPhone, defaultMsg);

  const activity: LeadActivity = {
    id: `act_${Date.now()}`,
    leadId,
    type: 'whatsapp_prepared',
    title: 'WhatsApp Message Prepared for Manual Sending',
    description: `WhatsApp Web/App triggered for ${targetPhone} with prefilled message.`,
    timestamp: new Date().toISOString(),
    performedBy: staffUser,
    metadata: {
      channel: 'phone',
      deliveryMethod: 'direct_link',
      phone: targetPhone
    }
  };

  const updatedLead = addLeadActivity(leadId, activity);

  res.json({
    success: true,
    status: 'prepared',
    deliveryMethod: 'direct_link',
    url: waUrl,
    details: `WhatsApp Web/App opened for ${targetPhone}. Message prefilled.`,
    lead: updatedLead,
    timestamp: activity.timestamp
  });
});
