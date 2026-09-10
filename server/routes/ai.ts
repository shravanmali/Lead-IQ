import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { getLeads, getCalls } from '../storage';
import { config } from '../config';

export const aiRouter = Router();

aiRouter.post('/analyze', async (req: Request, res: Response) => {
  const { transcript, lead } = req.body;
  if (!transcript) {
    return res.status(400).json({ success: false, error: 'transcript is required' });
  }

  try {
    const analysis = await aiService.analyzeTranscript(transcript, lead);
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

aiRouter.post('/chat', async (req: Request, res: Response) => {
  const { message, role = 'STAFF', user } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: 'message is required' });
  }

  const apiKey = config.gemini.apiKey;
  const leads = getLeads();
  const calls = getCalls();

  // Summarize leads context
  const leadsContext = leads.slice(0, 8).map(l => ({
    name: l.name,
    company: l.company,
    score: l.score?.score,
    status: l.status,
    dealValue: l.dealValue,
    nextAction: l.nextAction,
    telegram: l.telegramUsername
  }));

  if (apiKey) {
    try {
      const prompt = `You are Lead-IQ's Enterprise Sales AI Copilot.
The user is logged in with role: ${role} (${user?.name || 'Enterprise User'}).

CURRENT ACTIVE LEADS IN CRM:
${JSON.stringify(leadsContext, null, 2)}

RECENT CALL RECORDS COUNT: ${calls.length}

USER INQUIRY:
"${message}"

INSTRUCTIONS:
1. Provide a sharp, data-driven answer referencing the leads, scores, and pipeline metrics above.
2. Use formatted markdown with bold highlights, bullets, and Indian Rupee (₹) symbols where relevant.
3. Be professional, concise, and helpful.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 1000
            }
          })
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.json({
            success: true,
            reply: text.trim(),
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn('AI chat error:', err);
    }
  }

  // Smart fallback based on query
  const lower = message.toLowerCase();
  let fallbackReply = `Here is your CRM overview:\n\n• Active Leads: **${leads.length} accounts**\n• Top Opportunity: **${leads[0]?.name} (${leads[0]?.company})** with an AI Score of **${leads[0]?.score?.score}/100**\n• Next Step: ${leads[0]?.nextAction || 'Follow up with quotation.'}`;

  if (lower.includes('call') || lower.includes('highest')) {
    const top = [...leads].sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0))[0];
    fallbackReply = `🔥 **Priority Call Recommendation**:\n\nYou should call **${top.name}** at **${top.company}**.\n- AI Predictive Score: **${top.score.score}/100 (${top.score.category})**\n- Deal Potential: **₹${(top.dealValue || 450000).toLocaleString('en-IN')}**\n- Prescribed Action: ${top.nextAction}`;
  }

  res.json({
    success: true,
    reply: fallbackReply,
    timestamp: new Date().toISOString()
  });
});
