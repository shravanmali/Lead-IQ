import { Router, Request, Response } from 'express';
import { config } from '../config';
import {
  getTelegramConfig,
  sendTelegramBotMessage,
  buildDirectTelegramUrl,
  resolveChatIdFromUpdates,
  sanitizeTelegramUsername
} from '../services/telegramService';
import { aiService } from '../services/aiService';
import { getLeadById, addLeadActivity, updateLead, createLead, LeadActivity } from '../storage';

export const telegramRouter = Router();

telegramRouter.get('/status', (req: Request, res: Response) => {
  const cfg = getTelegramConfig();
  res.json({ success: true, ...cfg, config: cfg });
});

telegramRouter.post('/generate', async (req: Request, res: Response) => {
  const { leadId, lead: directLead, tone = 'friendly', customPrompt } = req.body;
  const lead = directLead || (leadId ? getLeadById(leadId) : null);
  if (!lead) {
    return res.status(400).json({ success: false, error: 'lead or leadId is required' });
  }

  try {
    const summaryText = customPrompt || lead.notes || `${lead.interestedIn || 'Enterprise AI'} requirement for ${lead.company || lead.name}`;
    const message = await aiService.generateTelegramMessage(lead, summaryText, tone);
    res.json({
      success: true,
      message,
      tone,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

telegramRouter.get('/sync', async (_req: Request, res: Response) => {
  try {
    const token = config.telegram.botToken;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Telegram Bot Token not configured' });
    }
    const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=20`);
    const data = await response.json();
    res.json({
      success: true,
      updates: data.result || [],
      message: `Polled ${data.result?.length || 0} updates from @${config.telegram.botUsername || 'Lead_IQ_bot'}`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

telegramRouter.post('/sync', async (req: Request, res: Response) => {
  const { leadId, username } = req.body;
  if (!leadId) {
    return res.status(400).json({ success: false, error: 'leadId is required' });
  }

  const lead = getLeadById(leadId);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }

  const targetUsername = username?.trim() || lead.telegramUsername;
  if (!targetUsername) {
    return res.status(400).json({ success: false, error: 'Telegram username is required to sync updates.' });
  }

  const resolved = await resolveChatIdFromUpdates(targetUsername);
  if (resolved) {
    const updated = updateLead(leadId, {
      telegramChatId: resolved.chatId,
      telegramUsername: sanitizeTelegramUsername(targetUsername)
    });
    return res.json({
      success: true,
      chatId: resolved.chatId,
      username: sanitizeTelegramUsername(targetUsername),
      message: `Verified and connected to Chat ID ${resolved.chatId}!`,
      lead: updated
    });
  }

  res.json({
    success: false,
    message: `No updates found from @${targetUsername}. Ask the prospect to message @Lead_IQ_bot first.`,
    deepLinkUrl: buildDirectTelegramUrl(targetUsername)
  });
});

telegramRouter.post('/send', async (req: Request, res: Response) => {
  const {
    leadId,
    recipient,
    username,
    message,
    body: altBody,
    sentBy,
    staffUser = sentBy || 'Sneha Kulkarni (Staff AE)',
    mode = 'auto', // 'auto' | 'manual'
    isEdited = false,
    originalMessage = ''
  } = req.body;

  const targetMsg = (message || altBody || '').trim();

  if (!leadId) {
    return res.status(400).json({ success: false, error: 'leadId is required' });
  }

  if (!targetMsg) {
    return res.status(400).json({ success: false, error: 'Message content cannot be empty.' });
  }

  let lead = getLeadById(leadId);
  if (!lead) {
    lead = createLead({
      id: leadId,
      name: req.body.leadName || req.body.name || 'Valued Lead',
      telegramUsername: (username || recipient || '').trim(),
      company: req.body.company || 'Enterprise Account',
      assignedStaffName: staffUser
    });
  }

  const targetRecipient = (username || recipient || lead.telegramUsername || '').trim();
  const knownChatId = req.body.chatId || lead.telegramChatId || undefined;

  if (!targetRecipient && !knownChatId) {
    return res.status(400).json({ success: false, error: 'Telegram username or identifier is required.' });
  }

  const cleanMessage = targetMsg;

  // If edited, log the edit
  if (isEdited && originalMessage && originalMessage !== cleanMessage) {
    addLeadActivity(leadId, {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      leadId,
      type: 'telegram_edited',
      title: 'Telegram Message Edited',
      description: 'Staff adjusted the AI draft before dispatch.',
      timestamp: new Date().toISOString(),
      performedBy: staffUser,
      metadata: { targetRecipient }
    });
  }

  const cfg = getTelegramConfig();

  // 1. MANUAL SEND MODE: t.me deep link
  if (mode === 'manual' || !cfg.configured) {
    const directUrl = buildDirectTelegramUrl(targetRecipient, cleanMessage);

    const activity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId,
      type: 'telegram_prepared',
      title: 'Telegram Prepared for Manual Sending',
      description: `Direct Telegram link opened for @${sanitizeTelegramUsername(targetRecipient)}.`,
      timestamp: new Date().toISOString(),
      performedBy: staffUser,
      metadata: {
        channel: 'telegram',
        deliveryMethod: 'direct_link',
        recipient: targetRecipient
      }
    };

    const updatedLead = addLeadActivity(leadId, activity);

    return res.json({
      success: true,
      status: 'prepared',
      deliveryMethod: 'direct_link',
      directUrl,
      details: `Telegram link opened for @${sanitizeTelegramUsername(targetRecipient)} with prefilled message.`,
      lead: updatedLead,
      timestamp: activity.timestamp
    });
  }

  // 2. AUTOMATIC SEND MODE: Official Telegram Bot API
  const result = await sendTelegramBotMessage(targetRecipient, cleanMessage, knownChatId);

  if (result.success) {
    if (result.resolvedChatId && lead.telegramChatId !== result.resolvedChatId) {
      updateLead(leadId, { telegramChatId: result.resolvedChatId });
    }

    const activity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId,
      type: 'telegram_sent',
      title: 'Telegram Message Automatically Sent',
      description: `Confirmed delivered via @${cfg.botUsername} to @${sanitizeTelegramUsername(targetRecipient)}.`,
      timestamp: new Date().toISOString(),
      performedBy: staffUser,
      metadata: {
        channel: 'telegram',
        deliveryMethod: 'bot_api',
        recipient: targetRecipient,
        chatId: result.resolvedChatId || knownChatId,
        messageId: result.messageId
      }
    };

    const updatedLead = addLeadActivity(leadId, activity);

    return res.json({
      success: true,
      status: 'sent',
      deliveryMethod: 'bot_api',
      messageId: result.messageId,
      details: result.details,
      resolvedChatId: result.resolvedChatId,
      lead: updatedLead,
      timestamp: activity.timestamp
    });
  } else {
    const directUrl = result.directUrl || buildDirectTelegramUrl(targetRecipient, cleanMessage);
    return res.status(422).json({
      success: false,
      status: 'failed',
      deliveryMethod: 'bot_api',
      error: result.error,
      details: result.details,
      directUrl
    });
  }
});
