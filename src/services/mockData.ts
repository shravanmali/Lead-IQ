import { User } from '../types/auth';
import { Lead, LeadActivity } from '../types/lead';
import { CallRecord } from '../types/call';
import { RevenueDataPoint, RevenuePredictionPoint, StaffRevenueMetric, SourceRevenueMetric, RevenuePredictionSummary } from '../types/revenue';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Aditya Mehta',
    email: 'admin@leadiq.in',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-01-10T08:00:00Z',
    title: 'Lead-IQ System Administrator',
    phone: '+91 98190 28310',
  },
  {
    id: 'manager-1',
    name: 'Priya Deshmukh',
    email: 'manager@leadiq.in',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-01-15T09:30:00Z',
    title: 'Head of Revenue & Sales Operations',
    phone: '+91 98220 14992',
    assignedLeadsCount: 0,
    conversionRate: 68.4,
  },
  {
    id: 'staff-1',
    name: 'Sneha Kulkarni',
    email: 'staff@leadiq.in',
    role: 'STAFF',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-02-01T10:00:00Z',
    title: 'Senior Enterprise AE',
    phone: '+91 98234 56120',
    assignedLeadsCount: 14,
    conversionRate: 42.8,
  },
  {
    id: 'staff-2',
    name: 'Akash Jadhav',
    email: 'akash.j@leadiq.in',
    role: 'STAFF',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-02-10T11:15:00Z',
    title: 'Enterprise SDR Lead',
    phone: '+91 98765 43210',
    assignedLeadsCount: 18,
    conversionRate: 38.5,
  },
  {
    id: 'staff-3',
    name: 'Riya Gupta',
    email: 'riya.g@leadiq.in',
    role: 'STAFF',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-02-18T14:20:00Z',
    title: 'Strategic Account Executive',
    phone: '+91 97654 32109',
    assignedLeadsCount: 12,
    conversionRate: 45.2,
  },
  {
    id: 'staff-4',
    name: 'Amit Patil',
    email: 'amit.p@leadiq.in',
    role: 'STAFF',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-03-01T09:00:00Z',
    title: 'Inbound Growth Specialist',
    phone: '+91 98501 99887',
    assignedLeadsCount: 9,
    conversionRate: 34.0,
  }
];

export const INITIAL_LEADS: Lead[] = [
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
    source: 'Inbound Demo Request',
    createdAt: '2026-09-01T10:00:00Z',
    notes: 'Migrating 35 sales agents from manual spreadsheet tracking in Pune. Call was very positive.',
    country: 'Pune, Maharashtra'
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
    source: 'AI Outbound Campaign',
    createdAt: '2026-08-28T09:20:00Z',
    notes: 'Finance team cleared commercial terms. Target closing is 20 Sep.',
    country: 'Mumbai, Maharashtra'
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
    source: 'Webinar Attendee',
    createdAt: '2026-09-02T15:00:00Z',
    notes: 'Technical decision maker. Needs Tally webhook benchmark details.',
    country: 'Nashik, Maharashtra'
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
    source: 'LinkedIn Outreach',
    createdAt: '2026-08-25T13:40:00Z',
    notes: 'Paused for 3 weeks due to regional branch realignment.',
    country: 'Bengaluru, Karnataka'
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
    source: 'Cold Outreach',
    createdAt: '2026-08-20T11:00:00Z',
    notes: 'Declined due to existing multi-year vendor lock-in.',
    country: 'Nagpur, Maharashtra'
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
    source: 'Partner Ecosystem',
    createdAt: '2026-08-15T14:10:00Z',
    notes: 'Flagship enterprise client win! Signed 2-year contract.',
    country: 'Chennai, Tamil Nadu'
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
    source: 'Organic Search',
    createdAt: '2026-09-09T07:45:00Z',
    notes: 'Hot inbound from Hyderabad technology corridor.',
    country: 'Hyderabad, Telangana'
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
    source: 'Inbound Demo Request',
    createdAt: '2026-09-03T16:20:00Z',
    notes: 'Strong rapport. Wants mobile CRM enabled for field staff.',
    country: 'Pune, Maharashtra'
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
    source: 'Webinar Attendee',
    createdAt: '2026-09-09T17:30:00Z',
    notes: 'Signed up after pan-India healthcare tech session.',
    country: 'Delhi NCR'
  }
];

export const INITIAL_CALL_RECORDS: CallRecord[] = [
  {
    id: 'call-801',
    leadId: 'lead-101',
    leadName: 'Rahul Sharma',
    staffId: 'staff-1',
    staffName: 'Sneha Kulkarni',
    startTime: '2026-09-09T14:15:00Z',
    endTime: '2026-09-09T14:31:45Z',
    durationSeconds: 1005,
    status: 'Completed',
    waveformData: [12, 28, 45, 60, 35, 78, 92, 65, 40, 55, 82, 95, 70, 48, 62, 88, 75, 50, 68, 85, 90, 60, 45, 70, 82, 58, 40, 75, 88, 65, 30, 15],
    transcript: {
      durationSeconds: 1005,
      language: 'English (India) & Hindi Nuances',
      detectedTelegramHandle: 'rahul_shree',
      extractedKeyPoints: [
        '35 sales representatives migration required across Pune & Mumbai offices',
        'Confirmed GST invoice requirement and ISO compliance documentation',
        'Validated budget of ₹4,50,000 to ₹5,50,000 approved by management',
        'Requested Telegram channel follow-up with @rahul_shree for quick approvals'
      ],
      turns: [
        {
          speaker: 'Staff',
          text: 'Namaste Rahul ji, Sneha here from Lead-IQ. Thanks for taking out time today to evaluate our AI Lead Management platform for Shree Enterprises.',
          timestamp: '00:05',
          sentiment: 'positive'
        },
        {
          speaker: 'Lead',
          text: 'Hello Sneha. Glad to connect. Our sales team in Pune and Mumbai currently manages leads across multiple WhatsApp chats and spreadsheets. We need automated call recording and scoring for our 35 reps.',
          timestamp: '00:20',
          sentiment: 'neutral'
        },
        {
          speaker: 'Staff',
          text: 'Lead-IQ takes care of that seamlessly. It runs automated Whisper transcription with Indian English accent optimization, calculates dynamic 0-100 conversion probability scores, and automates email and Telegram proposals.',
          timestamp: '00:40',
          sentiment: 'positive'
        },
        {
          speaker: 'Lead',
          text: 'That is very helpful. What about GST billing and data security in India? If compliant, we have an approved budget of ₹4,50,000 ready for deployment this quarter.',
          timestamp: '01:12',
          sentiment: 'positive'
        },
        {
          speaker: 'Staff',
          text: 'We provide 100% GST-compliant invoicing with Indian cloud residency on AWS Mumbai. I can share our formal commercial quotation and technical security dossier right away.',
          timestamp: '01:38',
          sentiment: 'positive'
        },
        {
          speaker: 'Lead',
          text: 'Excellent. Please send the formal proposal to my email. You can also ping me on Telegram at @rahul_shree for faster coordination with our finance team.',
          timestamp: '02:08',
          sentiment: 'positive'
        }
      ]
    },
    summary: {
      overview: 'High-value discovery call with Rahul Sharma (Director of Operations & IT at Shree Enterprises, Pune). Client has an active requirement for 35 sales agents, verified budget of ₹4,50,000, and requested GST quotation.',
      keyDiscussionPoints: [
        'Migration of 35 sales agents across Pune and Mumbai offices',
        'Confirmation of GST compliance and AWS Mumbai data residency',
        'Whisper speech-to-text accuracy demo and automated scoring',
        'Telegram communication preference established (@rahul_shree)'
      ],
      customerObjections: [
        'Required formal GST-compliant commercial proposal for internal procurement committee'
      ],
      customerInterests: [
        'Automated call transcripts in Indian English',
        'AI Smart Leads prioritization',
        'Telegram automated follow-up proposals'
      ],
      sentimentScore: 94,
      buyingIntentScore: 96,
      recommendedTimeline: 'Follow up within 24 to 48 hours for Q3 commit'
    },
    recommendation: {
      type: 'EMAIL',
      title: 'Formal GST Commercial Quotation & Onboarding Roadmap',
      reason: 'Rahul requested an official GST commercial proposal and technical compliance documentation to submit to the finance committee.',
      priority: 'HIGH',
      generatedContent: {
        to: 'rahul.sharma@shreeenterprises.in',
        subject: 'Lead-IQ Commercial Proposal & GST Quotation for Shree Enterprises',
        body: `Dear Rahul,

Thank you for your time on our call today! As discussed, Lead-IQ is designed to streamline lead operations across your Pune and Mumbai sales teams through automated Whisper transcription and predictive lead scoring.

Attached please find:
1. Lead-IQ Enterprise 35-Seat GST Commercial Quotation (₹4,50,000/year)
2. ISO 27001 Security Packet & AWS Mumbai Cloud Architecture Overview
3. 3-Week Implementation & Staff Training Roadmap

I have also made a note of your Telegram handle (@rahul_shree). Please let me know if tomorrow at 3:00 PM IST works for a quick 15-minute alignment call with your finance team.

Warm regards,
Sneha Kulkarni
Senior Enterprise AE | Lead-IQ India`
      },
      isExecuted: false
    },
    resultingScore: {
      score: 92,
      category: 'Hot',
      probability: 94,
      confidence: 96,
      factors: [
        'Urgent Q3 budget allocated (₹4,50,000)',
        'High positive sentiment regarding Indian English Whisper speech accuracy',
        'Direct decision maker with 35-seat deployment authority'
      ],
      updatedAt: '2026-09-09T14:32:00Z'
    }
  }
];

export const INITIAL_ACTIVITIES: LeadActivity[] = [
  {
    id: 'act-1',
    leadId: 'lead-101',
    type: 'call',
    title: 'Completed Discovery Call (16m 45s)',
    description: 'Call completed with Rahul Sharma (Pune). Whisper audio transcribed. AI Score updated to 92 (Hot).',
    timestamp: '2026-09-09T14:32:00Z',
    performedBy: 'Sneha Kulkarni'
  },
  {
    id: 'act-2',
    leadId: 'lead-101',
    type: 'score_update',
    title: 'AI Lead Score Recalculated: 92 / 100',
    description: 'AI model increased probability from 78% to 94% following high buying intent indicators.',
    timestamp: '2026-09-09T14:33:00Z',
    performedBy: 'Lead-IQ AI Engine'
  },
  {
    id: 'act-3',
    leadId: 'lead-102',
    type: 'status_change',
    title: 'Status changed from Interested to Approved',
    description: 'Executive board in Mumbai approved pilot program. Legal reviewing terms.',
    timestamp: '2026-09-08T16:15:00Z',
    performedBy: 'Sneha Kulkarni'
  },
  {
    id: 'act-4',
    leadId: 'lead-106',
    type: 'status_change',
    title: 'Status changed to Converted (₹12,50,000)',
    description: '2-year Enterprise Agreement signed by CTO Ananya Iyer (Chennai).',
    timestamp: '2026-09-08T18:00:00Z',
    performedBy: 'Akash Jadhav'
  }
];

export const REVENUE_TIMELINE: RevenueDataPoint[] = [
  { period: 'Jan 2026', actualRevenue: 1420000, targetRevenue: 1300000, dealsClosed: 12 },
  { period: 'Feb 2026', actualRevenue: 1680000, targetRevenue: 1500000, dealsClosed: 16 },
  { period: 'Mar 2026', actualRevenue: 1950000, targetRevenue: 1800000, dealsClosed: 19 },
  { period: 'Apr 2026', actualRevenue: 2200000, targetRevenue: 2100000, dealsClosed: 21 },
  { period: 'May 2026', actualRevenue: 2540000, targetRevenue: 2400000, dealsClosed: 24 },
  { period: 'Jun 2026', actualRevenue: 2890000, targetRevenue: 2700000, dealsClosed: 27 },
  { period: 'Jul 2026', actualRevenue: 3180000, targetRevenue: 3000000, dealsClosed: 30 },
  { period: 'Aug 2026', actualRevenue: 3620000, targetRevenue: 3300000, dealsClosed: 34 },
  { period: 'Sep 2026 (MTD)', actualRevenue: 580000, targetRevenue: 520000, dealsClosed: 38 }
];

export const REVENUE_PREDICTION_POINTS: RevenuePredictionPoint[] = [
  { date: '15 Aug', actual: 3300000, predicted: 3300000, lowerConfidence: 3200000, upperConfidence: 3400000 },
  { date: '30 Aug', actual: 3620000, predicted: 3620000, lowerConfidence: 3500000, upperConfidence: 3740000 },
  { date: 'Current (10 Sep)', actual: 2450000, predicted: 2450000, lowerConfidence: 2400000, upperConfidence: 2500000, milestone: 'Current Baseline' },
  { date: '+7 Days (17 Sep)', predicted: 2880000, lowerConfidence: 2750000, upperConfidence: 3010000, milestone: 'Closing 4 Hot Leads' },
  { date: '+30 Days (10 Oct)', predicted: 3450000, lowerConfidence: 3250000, upperConfidence: 3650000, milestone: 'Q3 Enterprise Expansion' },
  { date: '+60 Days (10 Nov)', predicted: 3980000, lowerConfidence: 3720000, upperConfidence: 4240000, milestone: 'Diwali Quarter Growth' },
  { date: '+90 Days (10 Dec)', predicted: 4580000, lowerConfidence: 4250000, upperConfidence: 4910000, milestone: 'Annual Target Exceeded' }
];

export const STAFF_REVENUE_METRICS: StaffRevenueMetric[] = [
  {
    staffId: 'staff-1',
    staffName: 'Sneha Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    totalRevenue: 875000,
    dealsClosed: 14,
    conversionRate: 42.8,
    avgDealSize: 62500,
    trend: 18.5
  },
  {
    staffId: 'staff-2',
    staffName: 'Akash Jadhav',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalRevenue: 790000,
    dealsClosed: 12,
    conversionRate: 38.5,
    avgDealSize: 65800,
    trend: 14.2
  },
  {
    staffId: 'staff-3',
    staffName: 'Riya Gupta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalRevenue: 645000,
    dealsClosed: 8,
    conversionRate: 45.2,
    avgDealSize: 80600,
    trend: 9.8
  },
  {
    staffId: 'staff-4',
    staffName: 'Amit Patil',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalRevenue: 420000,
    dealsClosed: 6,
    conversionRate: 34.0,
    avgDealSize: 70000,
    trend: 12.0
  }
];

export const SOURCE_REVENUE_METRICS: SourceRevenueMetric[] = [
  { source: 'Inbound Demo Requests', revenue: 980000, leadsCount: 42, conversionRate: 52.4, color: '#3B82F6' },
  { source: 'AI Outbound Campaigns', revenue: 640000, leadsCount: 68, conversionRate: 36.8, color: '#8B5CF6' },
  { source: 'Partner Ecosystem India', revenue: 450000, leadsCount: 15, conversionRate: 64.0, color: '#10B981' },
  { source: 'Webinars & Industry Summits', revenue: 260000, leadsCount: 38, conversionRate: 28.5, color: '#F59E0B' },
  { source: 'Organic Search & Regional SEO', revenue: 120000, leadsCount: 29, conversionRate: 24.2, color: '#EC4899' }
];

export const REVENUE_PREDICTION_SUMMARY: RevenuePredictionSummary = {
  predictedTotal: 4580000,
  currentTotal: 2450000,
  expectedGrowthPercent: 86.9,
  confidencePercent: 94.6,
  forecastInsight: 'Based on current lead velocity in Pune, Mumbai, and Bengaluru, 92+ score conversion probability, and average contract expansion in Q3, revenue is projected to reach ₹45,80,000 (+86.9%) over the next 90 days.',
  growthDrivers: [
    'Hot Lead pipeline grew by 42% following Indian English Whisper STT integration',
    'Sneha Kulkarni & Akash Jadhav maintain >40% conversion rate in Western & Southern regions',
    'Average deal value increased to ₹4,50,000+ for mid-market enterprise tiers'
  ],
  risks: [
    '2 deals (₹8,50,000 total) awaiting internal procurement clearance',
    'Diwali seasonal festival holiday closures in late October'
  ]
};
