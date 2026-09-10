import { LeadScore } from './lead';

export interface TranscriptTurn {
  speaker: 'Staff' | 'Lead';
  text: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'hesitant';
}

export interface Transcript {
  turns: TranscriptTurn[];
  durationSeconds: number;
  language: string;
  detectedTelegramHandle?: string;
  extractedKeyPoints: string[];
}

export interface AISummary {
  overview: string;
  keyDiscussionPoints: string[];
  customerObjections: string[];
  customerInterests: string[];
  sentimentScore: number; // 0 - 100
  buyingIntentScore: number; // 0 - 100
  recommendedTimeline: string;
}

export interface AIRecommendation {
  type: 'EMAIL' | 'TELEGRAM';
  title: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  generatedContent: {
    to?: string;
    subject?: string;
    body: string;
    username?: string;
    channel?: string;
  };
  isExecuted: boolean;
}

export interface CallRecord {
  id: string;
  leadId: string;
  leadName: string;
  staffId: string;
  staffName: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  status: 'Completed' | 'Missed' | 'Scheduled';
  recordingUrl?: string;
  waveformData: number[];
  transcript: Transcript;
  summary: AISummary;
  recommendation: AIRecommendation;
  resultingScore: LeadScore;
}
