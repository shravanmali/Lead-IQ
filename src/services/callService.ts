import { CallRecord } from '../types/call';
import { Lead } from '../types/lead';
import { User } from '../types/auth';
import { INITIAL_CALL_RECORDS } from './mockData';
import { aiService } from './aiService';
import { getStoredLeads, saveStoredLeads, getStoredActivities, saveStoredActivities } from './leadService';

const CALLS_STORAGE_KEY = 'leadiq_calls';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getStoredCalls(): CallRecord[] {
  try {
    const raw = localStorage.getItem(CALLS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(INITIAL_CALL_RECORDS));
      return INITIAL_CALL_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CALL_RECORDS;
  }
}

export function saveStoredCalls(calls: CallRecord[]): void {
  localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
}

export interface PipelineProgressCallback {
  (step: 'transcribing' | 'summarizing' | 'scoring' | 'recommending' | 'saving' | 'complete'): void;
}

export const callService = {
  async getCallHistory(staffId?: string, leadId?: string): Promise<CallRecord[]> {
    await delay(150);
    let calls = getStoredCalls();
    if (staffId) {
      calls = calls.filter(c => c.staffId === staffId);
    }
    if (leadId) {
      calls = calls.filter(c => c.leadId === leadId);
    }
    return calls;
  },

  async getCallById(callId: string): Promise<CallRecord | null> {
    await delay(120);
    const calls = getStoredCalls();
    return calls.find(c => c.id === callId) || null;
  },

  /**
   * Complete Call & Run Full AI Intelligence Pipeline:
   * 1. Speech-to-Text Whisper transcription
   * 2. AI Executive Summarization & Sentiment Analytics
   * 3. AI Predictive Lead Scoring
   * 4. AI Recommended Next Actions (Email / Telegram)
   * 5. Save Record & Update CRM Store
   */
  async processCallPipeline(
    lead: Lead,
    durationSeconds: number,
    staff: User,
    onProgress?: PipelineProgressCallback
  ): Promise<CallRecord> {
    // 1. Whisper Transcription
    onProgress?.('transcribing');
    const transcript = await aiService.transcribeAudio(lead, durationSeconds);

    // 2. AI Summary
    onProgress?.('summarizing');
    const summary = await aiService.analyzeCall(transcript, lead);

    // 3. Predictive Lead Score
    onProgress?.('scoring');
    const newScore = await aiService.calculateLeadScore(transcript, lead);

    // 4. Recommendation Generation
    onProgress?.('recommending');
    const emailRec = await aiService.generateEmailFollowup(lead, summary, transcript);
    const telegramRec = await aiService.generateTelegramMessage(lead, summary, transcript);
    const primaryRecommendation = emailRec;

    onProgress?.('saving');

    // Generate random synthetic waveform data
    const waveformData = Array.from({ length: 32 }, () => Math.floor(Math.random() * 85) + 15);

    const callRecord: CallRecord = {
      id: `call-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      staffId: staff.id,
      staffName: staff.name,
      startTime: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds,
      status: 'Completed',
      waveformData,
      transcript,
      summary,
      recommendation: primaryRecommendation,
      resultingScore: newScore
    };

    // Save Call Record
    const calls = getStoredCalls();
    saveStoredCalls([callRecord, ...calls]);

    // Update Lead in Store
    const leads = getStoredLeads();
    const leadIndex = leads.findIndex(l => l.id === lead.id);
    if (leadIndex !== -1) {
      leads[leadIndex] = {
        ...leads[leadIndex],
        score: newScore,
        lastContact: 'Just now',
        status: lead.status === 'New' ? 'Contacted' : lead.status,
        telegramUsername: transcript.detectedTelegramHandle || lead.telegramUsername,
        nextAction: `Review AI Recommendation (${primaryRecommendation.type})`
      };
      saveStoredLeads(leads);
    }

    // Append Activity Log
    const activities = getStoredActivities();
    const durationMin = Math.floor(durationSeconds / 60);
    const durationSec = durationSeconds % 60;
    const timeFormatted = `${durationMin}m ${durationSec}s`;

    const newActivity = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      type: 'call' as const,
      title: `Call Completed with ${lead.name} (${timeFormatted})`,
      description: `Whisper audio analyzed. Sentiment Score: ${summary.sentimentScore}%. Predictive Lead Score calculated: ${newScore.score}/100 (${newScore.category}).`,
      timestamp: new Date().toISOString(),
      performedBy: staff.name,
      metadata: { callId: callRecord.id, score: newScore.score }
    };
    saveStoredActivities([newActivity, ...activities]);

    onProgress?.('complete');
    return callRecord;
  }
};
