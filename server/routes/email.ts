import { Router, Request, Response } from 'express';
import { getEmailConfig, sendAutomatedEmail, buildMailtoUrl } from '../services/emailService';
import { aiService } from '../services/aiService';
import { getLeadById, addLeadActivity, createLead, LeadActivity } from '../storage';

export const emailRouter = Router();

emailRouter.get('/status', (req: Request, res: Response) => {
  const cfg = getEmailConfig();
  res.json({ success: true, ...cfg, config: cfg });
});

emailRouter.post('/generate', async (req: Request, res: Response) => {
  const { leadId, lead: directLead, tone = 'friendly', customPrompt } = req.body;
  const lead = directLead || (leadId ? getLeadById(leadId) : null);
  if (!lead) {
    return res.status(400).json({ success: false, error: 'lead or leadId is required' });
  }

  try {
    const summaryText = customPrompt || lead.notes || `${lead.interestedIn || 'Enterprise AI'} requirement for ${lead.company || lead.name}`;
    const result = await aiService.generateEmail(lead, summaryText, tone);
    res.json({
      success: true,
      subject: result.subject,
      body: result.body,
      tone,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

emailRouter.post('/send', async (req: Request, res: Response) => {
  const {
    leadId,
    recipient,
    to,
    subject,
    body,
    emailBody: rawEmailBody,
    sentBy,
    staffUser = sentBy || 'Sneha Kulkarni (Staff AE)',
    mode = 'auto',
    isEdited = false,
    originalSubject = '',
    originalBody = ''
  } = req.body;

  const targetRecipient = (to || recipient || '').trim();
  const emailBody = (body || rawEmailBody || '').trim();

  if (!leadId) {
    return res.status(400).json({ success: false, error: 'leadId is required' });
  }

  if (!targetRecipient || !targetRecipient.includes('@')) {
    return res.status(400).json({ success: false, error: 'A valid customer email address is required.' });
  }

  if (!subject?.trim()) {
    return res.status(400).json({ success: false, error: 'Email subject cannot be empty.' });
  }

  if (!emailBody) {
    return res.status(400).json({ success: false, error: 'Email body cannot be empty.' });
  }

  let lead = getLeadById(leadId);
  if (!lead) {
    lead = createLead({
      id: leadId,
      name: req.body.leadName || req.body.name || 'Valued Lead',
      email: targetRecipient,
      company: req.body.company || 'Enterprise Account',
      assignedStaffName: staffUser
    });
  }

  const cleanRecipient = targetRecipient;
  const cleanSubject = subject.trim();
  const cleanBody = emailBody.trim();

  // If edited, log the edit event
  if (isEdited && (originalSubject !== cleanSubject || originalBody !== cleanBody)) {
    addLeadActivity(leadId, {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      leadId,
      type: 'email_edited',
      title: 'Email Draft Edited',
      description: `Staff refined the proposal email for ${cleanRecipient}.`,
      timestamp: new Date().toISOString(),
      performedBy: staffUser,
      metadata: { cleanRecipient, cleanSubject }
    });
  }

  // 1. MANUAL SEND MODE: mailto URL launch
  if (mode === 'manual') {
    const mailtoUrl = buildMailtoUrl(cleanRecipient, cleanSubject, cleanBody);

    const activity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId,
      type: 'email_prepared',
      title: 'Email Prepared for Manual Sending',
      description: `Default email client triggered with prefilled proposal for ${cleanRecipient}.`,
      timestamp: new Date().toISOString(),
      performedBy: staffUser,
      metadata: {
        channel: 'email',
        deliveryMethod: 'mailto',
        recipient: cleanRecipient,
        subject: cleanSubject
      }
    };

    const updatedLead = addLeadActivity(leadId, activity);

    return res.json({
      success: true,
      status: 'prepared',
      deliveryMethod: 'mailto',
      mailtoUrl,
      details: `Default email client opened with prefilled proposal for ${cleanRecipient}.`,
      lead: updatedLead,
      timestamp: activity.timestamp
    });
  }

  // 2. AUTOMATIC SEND MODE: Nodemailer SMTP
  const result = await sendAutomatedEmail({
    to: cleanRecipient,
    subject: cleanSubject,
    body: cleanBody,
    leadName: lead.name
  });

  if (result.success) {
    const activity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId,
      type: 'email_sent',
      title: 'Email Automatically Sent',
      description: `${result.details} Subject: "${cleanSubject}"`,
      timestamp: new Date().toISOString(),
      performedBy: staffUser,
      metadata: {
        channel: 'email',
        deliveryMethod: result.deliveryMethod,
        recipient: cleanRecipient,
        subject: cleanSubject,
        messageId: result.messageId
      }
    };

    const updatedLead = addLeadActivity(leadId, activity);

    return res.json({
      success: true,
      status: 'sent',
      deliveryMethod: result.deliveryMethod,
      messageId: result.messageId,
      details: result.details,
      lead: updatedLead,
      timestamp: activity.timestamp
    });
  } else {
    return res.status(422).json({
      success: false,
      status: 'failed',
      error: result.error,
      details: result.details
    });
  }
});
