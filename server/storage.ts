import fs from 'fs';
import path from 'path';
import { config } from './config';

export interface LeadScore {
  score: number;
  category: 'Hot' | 'Warm' | 'Moderate' | 'Cold';
  probability: number;
  confidence: number;
  factors: string[];
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email_sent' | 'email_prepared' | 'email_edited' | 'telegram_sent' | 'telegram_prepared' | 'telegram_edited' | 'whatsapp_prepared' | 'status_change' | 'score_update';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  metadata?: Record<string, any>;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'In Discussion' | 'Won' | 'Lost';
  score: LeadScore;
  dealValue: number;
  assignedStaffId: string;
  assignedStaffName: string;
  lastContact: string;
  telegramUsername?: string;
  telegramChatId?: string;
  interestedIn?: string;
  requirements?: string;
  notes?: string;
  nextAction?: string;
  activityTimeline?: LeadActivity[];
}

export interface TranscriptTurn {
  speaker: 'Staff' | 'Lead' | 'Customer' | string;
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Transcript {
  durationSeconds: number;
  language: string;
  detectedTelegramHandle?: string;
  detectedWhatsAppNumber?: string;
  extractedKeyPoints: string[];
  turns: TranscriptTurn[];
}

export interface AISummary {
  overview: string;
  keyDiscussionPoints: string[];
  customerObjections: string[];
  customerInterests: string[];
  sentimentScore: number;
  buyingIntentScore: number;
  recommendedTimeline: string;
}

export interface AIRecommendation {
  type: 'EMAIL' | 'TELEGRAM' | 'WHATSAPP';
  title: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  generatedContent: {
    to?: string;
    username?: string;
    phone?: string;
    channel?: string;
    subject?: string;
    body: string;
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
  status: 'Completed' | 'Failed';
  waveformData: number[];
  audioUrl?: string;
  transcript: Transcript;
  summary: AISummary;
  recommendation: AIRecommendation;
  resultingScore: LeadScore;
}

const LEADS_FILE = path.join(config.paths.dataDir, 'leads.json');
const CALLS_FILE = path.join(config.paths.dataDir, 'calls.json');

// Ensure directory exists
function ensureDir() {
  if (!fs.existsSync(config.paths.dataDir)) {
    fs.mkdirSync(config.paths.dataDir, { recursive: true });
  }
  if (!fs.existsSync(config.paths.uploadDir)) {
    fs.mkdirSync(config.paths.uploadDir, { recursive: true });
  }
}

export const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Rahul Sharma',
    company: 'Shree Enterprises',
    title: 'Director of Operations & IT',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@shreeenterprises.in',
    telegramUsername: 'rahul_shree',
    status: 'Interested',
    score: {
      score: 92,
      category: 'Hot',
      probability: 94,
      confidence: 96,
      factors: [
        'Approved ₹4,50,000 annual IT automation budget for Pune & Mumbai teams',
        'Requested GST quotation and auto-dialer speech intelligence demo',
        'Direct signing authority for commercial procurement'
      ],
      updatedAt: '2026-09-09T14:32:00Z'
    },
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Sneha Kulkarni',
    lastContact: 'Yesterday at 2:30 PM IST',
    nextAction: 'Send Formal GST Quotation & Telegram Onboarding Link',
    industry: 'Manufacturing & Industrial Solutions',
    dealValue: 450000,
    country: 'Pune, Maharashtra',
    activityTimeline: []
  },
  {
    id: 'lead-102',
    name: 'Pooja Shah',
    company: 'Mumbai Digital Works',
    title: 'Chief Operating Officer',
    phone: '+91 98234 56120',
    email: 'pooja.shah@mumbaidigital.co.in',
    telegramUsername: 'poojashah_mdw',
    status: 'Approved',
    score: {
      score: 87,
      category: 'Hot',
      probability: 89,
      confidence: 93,
      factors: [
        'Executive board approved 35-seat pilot program',
        'GST and data privacy compliance verified by legal team',
        'High engagement during live platform demo'
      ],
      updatedAt: '2026-09-08T16:15:00Z'
    },
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Sneha Kulkarni',
    lastContact: '08 Sep 2026',
    nextAction: 'Finalize Master Services Agreement (MSA)',
    industry: 'Digital Marketing & Media Tech',
    dealValue: 650000,
    country: 'Mumbai, Maharashtra',
    activityTimeline: []
  },
  {
    id: 'lead-103',
    name: 'Amit Patil',
    company: 'Patil Industries & Logistics',
    title: 'VP of Growth & Strategy',
    phone: '+91 97654 32109',
    email: 'amit.patil@patilindustries.com',
    telegramUsername: 'amitpatil_ind',
    status: 'Contacted',
    score: {
      score: 79,
      category: 'Warm',
      probability: 76,
      confidence: 88,
      factors: [
        'Evaluating integration with Tally ERP and custom logistics software',
        'Requested API webhook performance documentation',
        'Budget confirmed for Q3 rollout'
      ],
      updatedAt: '2026-09-07T11:45:00Z'
    },
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Sneha Kulkarni',
    lastContact: '07 Sep 2026',
    nextAction: 'Send Technical ERP & Tally Integration Dossier',
    industry: 'Logistics & Supply Chain',
    dealValue: 375000,
    country: 'Nashik, Maharashtra',
    activityTimeline: []
  },
  {
    id: 'lead-104',
    name: 'Rohit Verma',
    company: 'NexGen Solutions India',
    title: 'Head of Business Operations',
    phone: '+91 98980 11223',
    email: 'rohit.verma@nexgenindia.com',
    telegramUsername: 'rohit_nexgen',
    status: 'Hold',
    score: {
      score: 65,
      category: 'Warm',
      probability: 61,
      confidence: 82,
      factors: [
        'Internal restructuring of Bengaluru sales division in progress',
        'Project temporarily on hold until 15 October',
        'Expressed continued interest in AI voice transcription'
      ],
      updatedAt: '2026-09-06T10:00:00Z'
    },
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Sneha Kulkarni',
    lastContact: '06 Sep 2026',
    nextAction: 'Schedule check-in call for 12 Oct',
    industry: 'Enterprise Software & IT',
    dealValue: 275000,
    country: 'Bengaluru, Karnataka',
    activityTimeline: []
  },
  {
    id: 'lead-105',
    name: 'Saurabh Pawar',
    company: 'Sharma Retail Group',
    title: 'Procurement Lead',
    phone: '+91 98450 77889',
    email: 'saurabh.p@sharmaretail.in',
    status: 'Declined',
    score: {
      score: 42,
      category: 'Cold',
      probability: 35,
      confidence: 85,
      factors: [
        'Locked into 2-year contract with legacy ERP provider',
        'No budget reallocation permitted until FY2027',
        'Low response rate on follow-up emails'
      ],
      updatedAt: '2026-09-05T09:10:00Z'
    },
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Sneha Kulkarni',
    lastContact: '05 Sep 2026',
    nextAction: 'Add to quarterly newsletter nurture sequence',
    industry: 'Retail & Multi-Store Chains',
    dealValue: 180000,
    country: 'Nagpur, Maharashtra',
    activityTimeline: []
  },
  {
    id: 'lead-106',
    name: 'Ananya Iyer',
    company: 'Bharat Business Solutions',
    title: 'Chief Technology Officer',
    phone: '+91 98401 23456',
    email: 'ananya.iyer@bharatbiz.in',
    telegramUsername: 'ananya_bharat',
    status: 'Converted',
    score: {
      score: 96,
      category: 'Hot',
      probability: 99,
      confidence: 98,
      factors: [
        '2-year enterprise agreement signed (₹12,50,000 ARR)',
        'Onboarding kickoff scheduled for 75 sales reps across India',
        'High appraisal of Whisper AI Hindi & Indian English accuracy'
      ],
      updatedAt: '2026-09-08T18:00:00Z'
    },
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Akash Jadhav',
    lastContact: '08 Sep 2026',
    nextAction: 'Customer Success Onboarding Kickoff',
    industry: 'Fintech & Digital Payments',
    dealValue: 1250000,
    country: 'Chennai, Tamil Nadu',
    activityTimeline: []
  },
  {
    id: 'lead-107',
    name: 'Vikram Singh',
    company: 'Aarav Technologies',
    title: 'CISO & Infrastructure Head',
    phone: '+91 98660 34567',
    email: 'vikram.singh@aaravtech.co.in',
    status: 'New',
    score: {
      score: 54,
      category: 'Moderate',
      probability: 52,
      confidence: 72,
      factors: [
        'Downloaded Lead-IQ AI Whitepaper on Cloud Voice Intelligence',
        'Inquired about data localization in Indian cloud data centers (Mumbai/Hyderabad)',
        'Awaiting technical discovery call'
      ],
      updatedAt: '2026-09-09T08:00:00Z'
    },
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Riya Gupta',
    lastContact: 'Never contacted',
    nextAction: 'Initiate Discovery Call & Confirm India Cloud Residency',
    industry: 'Cybersecurity & Cloud',
    dealValue: 420000,
    country: 'Hyderabad, Telangana',
    activityTimeline: []
  },
  {
    id: 'lead-108',
    name: 'Neha Joshi',
    company: 'Maharashtra Enterprises',
    title: 'VP of Business Development',
    phone: '+91 98200 45678',
    email: 'neha.joshi@mahabiz.in',
    telegramUsername: 'neha_mahabiz',
    status: 'Interested',
    score: {
      score: 81,
      category: 'Warm',
      probability: 83,
      confidence: 91,
      factors: [
        'Expanding regional sales presence across Pune, Nashik, and Kolhapur',
        'Highly valued the automated Telegram instant alert workflow',
        'Target decision timeline: End of current month'
      ],
      updatedAt: '2026-09-08T12:00:00Z'
    },
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Sneha Kulkarni',
    lastContact: 'Yesterday at 5:00 PM IST',
    nextAction: 'Send Demo Recording & Telegram Commercial Summary',
    industry: 'Renewable Energy & Infrastructure',
    dealValue: 550000,
    country: 'Pune, Maharashtra',
    activityTimeline: []
  },
  {
    id: 'lead-109',
    name: 'Karan Malhotra',
    company: 'Kaveri Healthcare Systems',
    title: 'Managing Director',
    phone: '+91 98110 56789',
    email: 'karan.m@kaverihealth.in',
    telegramUsername: 'karan_kaveri',
    status: 'New',
    score: {
      score: 72,
      category: 'Warm',
      probability: 70,
      confidence: 84,
      factors: [
        'Attended product webinar on AI Lead Intelligence',
        'Managing 30 clinical sales advisors across North India',
        'Targeting Q3 rollout'
      ],
      updatedAt: '2026-09-09T18:00:00Z'
    },
    assignedStaffId: 'staff-4',
    assignedStaffName: 'Amit Patil',
    lastContact: 'Never contacted',
    nextAction: 'Schedule Discovery Call',
    industry: 'Healthcare & Diagnostics',
    dealValue: 310000,
    country: 'Delhi NCR',
    activityTimeline: []
  }
];

export function getLeads(): Lead[] {
  ensureDir();
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      const leads: Lead[] = JSON.parse(data);
      let changed = false;
      for (const def of DEFAULT_LEADS) {
        if (!leads.some(l => l.id === def.id)) {
          leads.push(def);
          changed = true;
        }
      }
      if (changed) {
        saveLeads(leads);
      }
      return leads;
    }
  } catch (err) {
    console.error('Failed to read leads file:', err);
  }
  saveLeads(DEFAULT_LEADS);
  return [...DEFAULT_LEADS];
}

export function saveLeads(leads: Lead[]): boolean {
  ensureDir();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save leads file:', err);
    return false;
  }
}

export function getLeadById(id: string): Lead | null {
  const leads = getLeads();
  let found = leads.find(l => l.id === id);
  if (!found) {
    found = DEFAULT_LEADS.find(l => l.id === id) || null;
    if (found) {
      leads.push(found);
      saveLeads(leads);
    }
  }
  return found || null;
}

export function createLead(data: Partial<Lead>): Lead {
  const leads = getLeads();
  const id = data.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  const newLead: Lead = {
    id,
    name: data.name || 'New Inbound Contact',
    company: data.company || 'Enterprise Prospect',
    title: data.title || 'Director / Decision Maker',
    email: data.email || '',
    phone: data.phone || '',
    country: data.country || 'India',
    industry: data.industry || 'Enterprise Technology',
    status: data.status || 'New',
    score: data.score || {
      score: 85,
      category: 'Hot',
      probability: 88,
      confidence: 90,
      factors: ['Extracted from speech intelligence call'],
      updatedAt: new Date().toISOString()
    },
    dealValue: data.dealValue || 450000,
    assignedStaffId: data.assignedStaffId || 'staff-1',
    assignedStaffName: data.assignedStaffName || 'Sneha Kulkarni',
    lastContact: 'Just now',
    telegramUsername: data.telegramUsername || '',
    telegramChatId: data.telegramChatId || '',
    interestedIn: data.interestedIn || 'Lead-IQ Enterprise Suite',
    requirements: data.requirements || '',
    notes: data.notes || '',
    nextAction: data.nextAction || 'Review AI Call Takeaways & Send Follow-up',
    activityTimeline: data.activityTimeline || []
  };

  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return null;

  leads[idx] = {
    ...leads[idx],
    ...updates
  };

  saveLeads(leads);
  return leads[idx];
}

export function addLeadActivity(leadId: string, activity: LeadActivity): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === leadId);
  if (idx === -1) return null;

  const current = leads[idx].activityTimeline || [];
  leads[idx].activityTimeline = [activity, ...current];
  saveLeads(leads);
  return leads[idx];
}

export function getCalls(staffId?: string, leadId?: string): CallRecord[] {
  ensureDir();
  try {
    if (fs.existsSync(CALLS_FILE)) {
      const data = fs.readFileSync(CALLS_FILE, 'utf-8');
      let calls: CallRecord[] = JSON.parse(data);
      if (staffId) calls = calls.filter(c => c.staffId === staffId);
      if (leadId) calls = calls.filter(c => c.leadId === leadId);
      return calls;
    }
  } catch (err) {
    console.error('Failed to read calls file:', err);
  }
  return [];
}

export function saveCalls(calls: CallRecord[]): boolean {
  ensureDir();
  try {
    fs.writeFileSync(CALLS_FILE, JSON.stringify(calls, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save calls file:', err);
    return false;
  }
}

export function getCallById(id: string): CallRecord | null {
  const calls = getCalls();
  return calls.find(c => c.id === id) || null;
}

export function saveCallRecord(call: CallRecord): CallRecord {
  const calls = getCalls();
  const existingIndex = calls.findIndex(c => c.id === call.id);
  if (existingIndex !== -1) {
    calls[existingIndex] = call;
  } else {
    calls.unshift(call);
  }
  saveCalls(calls);
  return call;
}
