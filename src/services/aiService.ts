import { Lead, LeadScore } from '../types/lead';
import { Transcript, AISummary, AIRecommendation, TranscriptTurn } from '../types/call';
import { formatINR } from '../utils/formatters';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Whisper Speech-to-Text Transcription Simulation (Indian Business Context)
   */
  async transcribeAudio(lead: Lead, durationSeconds: number): Promise<Transcript> {
    await delay(1200); // Realistic AI transcription delay

    const hasTelegram = Boolean(lead.telegramUsername);
    const handle = lead.telegramUsername || undefined;

    const turns: TranscriptTurn[] = [
      {
        speaker: 'Staff',
        text: `Namaste ${lead.name} ji, this is your dedicated Lead-IQ account executive. Thank you for connecting with us today regarding ${lead.company}'s sales operations in ${lead.country}.`,
        timestamp: '00:04',
        sentiment: 'positive'
      },
      {
        speaker: 'Lead',
        text: `Hello! Yes, we have been looking for an automated CRM solution. Our team across India handles hundreds of incoming inquiries and we need automated Whisper call recording and lead scoring.`,
        timestamp: '00:22',
        sentiment: 'neutral'
      },
      {
        speaker: 'Staff',
        text: `Lead-IQ is built precisely for Indian enterprise teams. It transcribes calls in Indian English with high accuracy, auto-calculates 0-100 conversion probability, and generates personalized follow-up proposals.`,
        timestamp: '00:46',
        sentiment: 'positive'
      },
      {
        speaker: 'Lead',
        text: `That is ideal for our workflow. We have allocated approximately ${formatINR(lead.dealValue)} annual budget for this rollout if implementation can happen within the next 3 weeks.`,
        timestamp: '01:14',
        sentiment: 'positive'
      },
      {
        speaker: 'Staff',
        text: `We provide complete onboarding and 100% GST-compliant invoicing with AWS Mumbai cloud hosting. Would you like me to share the formal commercial proposal?`,
        timestamp: '01:42',
        sentiment: 'positive'
      },
      {
        speaker: 'Lead',
        text: hasTelegram
          ? `Yes please. Send the official proposal via email. You can also message me on Telegram at @${handle} for faster coordination.`
          : `Yes please, send across the complete commercial quotation and GST documentation to my email. I will review it with our finance team.`,
        timestamp: '02:05',
        sentiment: 'positive'
      }
    ];

    const extractedKeyPoints = [
      `Approved commercial budget for solution: ~${formatINR(lead.dealValue)}`,
      `Target deployment timeline: 3-4 weeks across ${lead.country} offices`,
      hasTelegram ? `Telegram contact detected: @${handle}` : `Prefers formal email correspondence for proposal delivery`,
      `Verified requirement for GST compliance, AWS Mumbai cloud data residency, and Whisper STT`
    ];

    return {
      turns,
      durationSeconds: Math.max(durationSeconds, 125),
      language: 'English (India) & Hindi Nuances',
      detectedTelegramHandle: handle,
      extractedKeyPoints
    };
  },

  /**
   * AI Summary & Sentiment Analytics
   */
  async analyzeCall(transcript: Transcript, lead: Lead): Promise<AISummary> {
    await delay(1000); // AI summarization delay

    const isHighIntent = transcript.extractedKeyPoints.some(k => k.includes('Approved commercial budget') || k.includes('GST compliance'));

    return {
      overview: `Highly productive discovery session with ${lead.name} (${lead.title} at ${lead.company}, ${lead.country}). Discussed sales automation, Indian English Whisper transcription accuracy, and GST billing. Client confirmed an approved budget of ${formatINR(lead.dealValue)}.`,
      keyDiscussionPoints: [
        `Deployment timeline target of 3-4 weeks for ${lead.company}`,
        `Validated commercial budget of approximately ${formatINR(lead.dealValue)}`,
        `GST compliance and AWS Mumbai cloud residency confirmed`,
        transcript.detectedTelegramHandle ? `Identified Telegram handle: @${transcript.detectedTelegramHandle}` : `Standard email communication confirmed`
      ],
      customerObjections: [
        'Requested formal GST quotation and compliance audit for finance committee'
      ],
      customerInterests: [
        'Automated call transcripts with speaker sentiment',
        'Dynamic AI predictive lead scoring',
        'Automated Email & Telegram follow-up proposals'
      ],
      sentimentScore: isHighIntent ? 94 : 76,
      buyingIntentScore: isHighIntent ? 96 : 72,
      recommendedTimeline: 'Follow up within 24 to 48 hours to secure Q3 commit'
    };
  },

  /**
   * AI Lead Predictive Scoring Engine
   */
  async calculateLeadScore(transcript: Transcript, lead: Lead): Promise<LeadScore> {
    await delay(800);

    const baseScore = Math.min(96, Math.max(88, lead.score.score + 10));
    
    return {
      score: baseScore,
      category: baseScore >= 90 ? 'Hot' : baseScore >= 70 ? 'Warm' : 'Moderate',
      probability: Math.min(98, baseScore + 2),
      confidence: 95,
      factors: [
        `Verified buying intent and executive budget (${formatINR(lead.dealValue)}) during call`,
        `High positive sentiment score (94%) in conversation transcript`,
        `Direct decision maker (${lead.title}) engaged and requested GST quotation`
      ],
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * AI Email Follow-up Automation Generator
   */
  async generateEmailFollowup(lead: Lead, summary: AISummary, transcript: Transcript): Promise<AIRecommendation> {
    await delay(600);

    const subject = `Lead-IQ Commercial Proposal & GST Quotation for ${lead.company}`;
    const body = `Dear ${lead.name},

Thank you for your time on our call today! It was great discussing how Lead-IQ's AI voice intelligence and predictive scoring can streamline sales operations at ${lead.company} (${lead.country}).

As discussed, I have prepared:
• Custom Enterprise GST Commercial Quotation (${formatINR(lead.dealValue)}/year)
• ISO 27001 Security & AWS Mumbai Cloud Architecture Dossier
• 3-Week Rapid Onboarding & Staff Training Roadmap

${transcript.detectedTelegramHandle ? `I have also noted your Telegram handle (@${transcript.detectedTelegramHandle}) for quick contract questions.` : ''}

Please review the attached terms and let me know if tomorrow at 3:00 PM IST works for a 15-minute executive review with your finance lead.

Warm regards,
${lead.assignedStaffName}
Lead-IQ Sales & Enterprise Operations India`;

    return {
      type: 'EMAIL',
      title: 'Automated GST Proposal Email',
      reason: 'AI detected high buying intent and explicit request for commercial terms and GST compliance paperwork.',
      priority: 'HIGH',
      generatedContent: {
        to: lead.email,
        subject,
        body
      },
      isExecuted: false
    };
  },

  /**
   * AI Telegram Automation Generator
   */
  async generateTelegramMessage(lead: Lead, summary: AISummary, transcript: Transcript): Promise<AIRecommendation | null> {
    await delay(500);

    const handle = transcript.detectedTelegramHandle || lead.telegramUsername;
    if (!handle) {
      return null;
    }

    const body = `Namaste ${lead.name.split(' ')[0]} ji! 👋 ${lead.assignedStaffName.split(' ')[0]} from Lead-IQ here. Just sent over the full enterprise proposal and GST quotation to your email (${lead.email}). Feel free to message me here if you need quick answers on contract terms or onboarding!`;

    return {
      type: 'TELEGRAM',
      title: 'Automated Telegram Quick-Connect',
      reason: `Telegram contact @${handle} was identified during the call transcript. Enables instant response rate.`,
      priority: 'HIGH',
      generatedContent: {
        username: handle,
        channel: 'Direct Message',
        body
      },
      isExecuted: false
    };
  }
};
