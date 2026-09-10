import { ChatMessage, QuickPrompt } from '../types/chat';
import { Role, User } from '../types/auth';
import { getStoredLeads } from './leadService';
import { revenueService } from './revenueService';
import { formatINR } from '../utils/formatters';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const QUICK_PROMPTS: QuickPrompt[] = [
  // Manager Quick Suggestions
  {
    id: 'm-1',
    label: 'Show total leads',
    prompt: 'Show total leads',
    category: 'Leads',
    allowedRoles: ['MANAGER']
  },
  {
    id: 'm-2',
    label: "What's our revenue?",
    prompt: "What's our revenue?",
    category: 'Revenue',
    allowedRoles: ['MANAGER']
  },
  {
    id: 'm-3',
    label: 'Highest scoring leads',
    prompt: 'Highest scoring leads',
    category: 'Leads',
    allowedRoles: ['MANAGER']
  },
  {
    id: 'm-4',
    label: 'Top performing staff',
    prompt: 'Top performing staff',
    category: 'Performance',
    allowedRoles: ['MANAGER']
  },

  // Staff Quick Suggestions
  {
    id: 's-1',
    label: 'My highest scoring lead',
    prompt: 'My highest scoring lead',
    category: 'Leads',
    allowedRoles: ['STAFF']
  },
  {
    id: 's-2',
    label: 'Show my approved leads',
    prompt: 'Show my approved leads',
    category: 'Leads',
    allowedRoles: ['STAFF']
  },
  {
    id: 's-3',
    label: 'Which lead should I call?',
    prompt: 'Which lead should I call?',
    category: 'Workflow',
    allowedRoles: ['STAFF']
  },
  {
    id: 's-4',
    label: 'Show leads on hold',
    prompt: 'Show leads on hold',
    category: 'Leads',
    allowedRoles: ['STAFF']
  }
];

export const chatService = {
  async sendQuery(query: string, role: Role, user: User): Promise<ChatMessage> {
    await delay(500); // Latency simulation

    const normalized = query.toLowerCase().trim();
    const leads = getStoredLeads();
    const staffLeads = leads.filter(l => l.assignedStaffId === user.id || role === 'MANAGER');

    // 1. ADMIN CHECK: Admin has NO CRM Chatbot
    if (role === 'ADMIN') {
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `AI CRM Assistant is not available for your role. Administrator accounts are restricted strictly to user identity provisioning and system security settings.`,
        dataPayload: {
          type: 'restriction',
          title: 'Permission Denied',
          data: {
            reason: 'AI CRM Assistant is not available for your role.'
          }
        }
      };
    }

    // 2. STAFF RESTRICTION: Staff cannot access Manager Revenue / Prediction / Financials
    const isRevenueQuery =
      normalized.includes('revenue') ||
      normalized.includes('forecast') ||
      normalized.includes('predicted revenue') ||
      normalized.includes('financial') ||
      normalized.includes('profit') ||
      normalized.includes('company sales') ||
      normalized.includes('arr') ||
      normalized.includes('target');

    if (role === 'STAFF' && isRevenueQuery) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `🔒 **Access Restricted**: Executive revenue analytics and financial forecasts are confidential and restricted to **Manager** roles.

As a **Staff** member, I can assist you with your assigned leads, Whisper call transcripts, AI predictive scores, and follow-up quotations.`,
        dataPayload: {
          type: 'restriction',
          title: 'Manager Permission Required',
          data: {
            reason: 'Staff users are restricted from viewing overall company revenue metrics.'
          }
        }
      };
    }

    // 2b. WHICH LEADS TO CONTACT TODAY / PRIORITIZE
    if (
      normalized.includes('which leads should i contact today') ||
      normalized.includes('contact today') ||
      normalized.includes('who should i call today') ||
      normalized.includes('who to contact today')
    ) {
      const targetList = (role === 'STAFF' ? staffLeads : leads).sort((a, b) => b.score.score - a.score.score);
      const top3 = targetList.slice(0, 3);

      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Based on recent multi-channel engagement and AI intent scoring, I recommend focusing on these **top 3 opportunities** today:

🔥 **${top3[0]?.name || 'Rahul Sharma'}** — **${top3[0]?.score?.score || 94}/100**
Opened proposal 3× and replied yesterday. High purchase velocity.

🔥 **${top3[1]?.name || 'Priya Mehta'}** — **${top3[1]?.score?.score || 91}/100**
Visited the pricing page and opened your email twice in the last 6 hours.

🟢 **${top3[2]?.name || 'Arjun Patel'}** — **${top3[2]?.score?.score || 88}/100**
High website engagement over the last 24 hours with budget inquiry.`,
        dataPayload: {
          type: 'lead_cards',
          title: "Today's Priority Contact Queue",
          data: top3
        }
      };
    }

    // 2c. WHY DID MY CONVERSION RATE CHANGE / DROP
    if (
      normalized.includes('conversion') && (
        normalized.includes('change') ||
        normalized.includes('drop') ||
        normalized.includes('down') ||
        normalized.includes('why') ||
        normalized.includes('rate')
      )
    ) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `📊 **AI Conversion Root Cause Analysis**:

Your conversion rate is currently **38.5%** (+4.2% vs last month). Key factors impacting conversion velocity:

1. ⚡ **Speed to Lead**: Inquiries followed up under 15 minutes had a **64% close rate** vs 18% for >2 hour delays.
2. 📞 **Whisper AI Call Summaries**: Reps using AI follow-up action items had **2.4× faster proposal sign-offs**.
3. 🎯 **High-Intent Lead Volume**: Shift towards Enterprise FinTech leads in Mumbai & Bengaluru increased deal sizes by +22%.

💡 **Recommended Action**: Re-engage the 4 leads currently **On Hold** using the AI follow-up drafter.`,
        dataPayload: {
          type: 'kpi_cards',
          title: 'Conversion Factors',
          data: [
            { label: 'Current Conversion', value: '38.5%', change: '+4.2% MoM' },
            { label: '<15m Response Win', value: '64%', change: 'Optimal' },
            { label: 'Avg Deal Size', value: '₹4.8L', change: '+22%' }
          ]
        }
      };
    }

    // 2d. DRAFT A FOLLOW-UP
    if (
      normalized.includes('draft') && (
        normalized.includes('follow-up') ||
        normalized.includes('follow up') ||
        normalized.includes('email') ||
        normalized.includes('message')
      )
    ) {
      const topLead = (role === 'STAFF' ? staffLeads : leads)[0] || { name: 'Rahul Sharma', company: 'TechFlow Solutions', dealValue: 450000 };
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `✍️ **AI Drafted Follow-up for ${topLead.name} (${topLead.company})**:

**Subject:** Quick follow-up regarding LeadIQ CRM implementation for ${topLead.company}

*Hi ${topLead.name.split(' ')[0]},*

*Following up on our recent conversation about scaling your sales pipeline. Based on your team's requirements, I've outlined how LeadIQ's AI scoring and Whisper call analysis can fast-track your conversion targets.*

*Would you have 10 minutes this Thursday afternoon for a quick walk-through of the tailored rollout plan?*

*Best regards,*
*${user.name} | LeadIQ Sales Team*`,
        dataPayload: {
          type: 'lead_detail',
          title: `Follow-up Ready: ${topLead.name}`,
          data: topLead
        }
      };
    }

    // 2e. WHY IS THIS LEAD SCORED 94 / AI SCORING EXPLANATION
    if (
      normalized.includes('scored') ||
      normalized.includes('why is this lead scored') ||
      normalized.includes('score breakdown')
    ) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `🎯 **AI Lead Score Breakdown (Score: 94 / 100 — Hot Lead)**:

• **Engagement Velocity (40% weight):** Opened proposal 3×, visited pricing calculator twice in 24h.
• **Buying Intent Signals (30% weight):** Budget confirmed at ₹4.5L+, timeline set for Q3 FY26.
• **ICP & Persona Fit (30% weight):** CTO / VP Technology in Tier-1 FinTech company (100+ seats).

**AI Recommendation:** High probability to close. Schedule final quotation review.`,
        dataPayload: {
          type: 'kpi_cards',
          title: 'Scoring Weight Factors',
          data: [
            { label: 'Engagement', value: '98/100', change: 'Very High' },
            { label: 'Intent Signal', value: '92/100', change: 'Confirmed' },
            { label: 'ICP Match', value: '95/100', change: 'Tier 1' }
          ]
        }
      };
    }


    // 3. SHOW TOTAL LEADS (Manager & Staff)
    if (
      normalized.includes('total leads') ||
      normalized.includes('show total leads') ||
      normalized.includes('all leads') ||
      normalized.includes('lead pipeline')
    ) {
      const targetList = role === 'STAFF' ? staffLeads : leads;
      const approvedCount = targetList.filter(l => l.status === 'Approved').length;
      const holdCount = targetList.filter(l => l.status === 'Hold').length;
      const declinedCount = targetList.filter(l => l.status === 'Declined').length;
      const interestedCount = targetList.filter(l => l.status === 'Interested' || l.status === 'Contacted' || l.status === 'New').length;
      const totalPipelineValue = targetList.reduce((acc, l) => acc + l.dealValue, 0);

      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Here is the current lead status breakdown for **${role === 'STAFF' ? 'your assigned leads' : 'the entire organization'}**:

• **Total Active Leads:** **${targetList.length}**
• **Approved Deals:** **${approvedCount}**
• **In-Flight / Interested:** **${interestedCount}**
• **On Hold:** **${holdCount}**
• **Declined:** **${declinedCount}**
• **Total Pipeline Value:** **${formatINR(totalPipelineValue)}**`,
        dataPayload: {
          type: 'kpi_cards',
          title: 'CRM Lead Pipeline Overview',
          data: [
            { label: 'Total Leads', value: targetList.length.toString(), change: 'Active' },
            { label: 'Approved Deals', value: approvedCount.toString(), change: '+4 this week' },
            { label: 'On Hold', value: holdCount.toString(), change: 'Requires review' },
            { label: 'Pipeline Value', value: formatINR(totalPipelineValue), change: 'Recognized' }
          ]
        }
      };
    }

    // 4. WHAT'S OUR REVENUE? / REVENUE QUERY (Manager Only)
    if (
      normalized.includes("what's our revenue") ||
      normalized.includes('what is our revenue') ||
      normalized.includes('total revenue') ||
      normalized.includes('revenue this month') ||
      (normalized.includes('revenue') && !normalized.includes('predict') && !normalized.includes('staff'))
    ) {
      const kpis = await revenueService.getManagerKPIs();
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Here is the verified revenue snapshot for **September 2026 (Indian Operations)**:

• **Total Recognized Revenue (YTD):** **${formatINR(kpis.totalRevenue)}**
• **Revenue This Month (MTD):** **${formatINR(kpis.revenueThisMonth)}** (+${kpis.monthlyGrowthPercent}% vs target)
• **Overall Conversion Rate:** **${kpis.conversionRate}%**
• **Average AI Lead Score:** **${kpis.averageLeadScore} / 100**`,
        dataPayload: {
          type: 'kpi_cards',
          title: 'September 2026 Financial Snapshot',
          data: [
            { label: 'Total Revenue', value: formatINR(kpis.totalRevenue), change: '+18.4% YTD' },
            { label: 'MTD Revenue', value: formatINR(kpis.revenueThisMonth), change: `+${kpis.monthlyGrowthPercent}%` },
            { label: 'Conversion Rate', value: `${kpis.conversionRate}%`, change: '+4.2%' },
            { label: 'Avg Lead Score', value: `${kpis.averageLeadScore}/100`, change: 'Optimal' }
          ]
        }
      };
    }

    // 5. AI REVENUE PREDICTION (Manager Only)
    if (normalized.includes('prediction') || normalized.includes('predicted') || normalized.includes('forecast')) {
      const { summary } = await revenueService.getRevenuePrediction();
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `📈 **AI Revenue Forecast for Next 90 Days**:

• **Predicted Revenue:** **${formatINR(summary.predictedTotal)}** (from current base of ${formatINR(summary.currentTotal)})
• **Expected Growth:** **+${summary.expectedGrowthPercent}%**
• **Model Confidence:** **${summary.confidencePercent}%**

**Key Insight:** ${summary.forecastInsight}`,
        dataPayload: {
          type: 'kpi_cards',
          title: 'AI Predictive Growth Model (India)',
          data: [
            { label: '90-Day Projected', value: formatINR(summary.predictedTotal), change: `+${summary.expectedGrowthPercent}%` },
            { label: 'Current Base', value: formatINR(summary.currentTotal), change: 'Active' },
            { label: 'Model Confidence', value: `${summary.confidencePercent}%`, change: 'High' }
          ]
        }
      };
    }

    // 6. TOP PERFORMING STAFF / HIGHEST PERFORMING STAFF (Manager Only)
    if (
      normalized.includes('top performing staff') ||
      normalized.includes('highest performing') ||
      normalized.includes('staff performance') ||
      normalized.includes('highest revenue staff') ||
      normalized.includes('who is our highest performing')
    ) {
      const staffMetrics = await revenueService.getRevenueByStaff();
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `According to the latest CRM data, **Sneha Kulkarni** has the highest revenue production with **${formatINR(staffMetrics[0].totalRevenue)}** in closed revenue and a **42.8%** conversion rate.

Here is the full sales team ranking:
1. **Sneha Kulkarni** — ${formatINR(staffMetrics[0].totalRevenue)} (${staffMetrics[0].dealsClosed} deals, 42.8% conv.)
2. **Akash Jadhav** — ${formatINR(staffMetrics[1].totalRevenue)} (${staffMetrics[1].dealsClosed} deals, 38.5% conv.)
3. **Riya Gupta** — ${formatINR(staffMetrics[2].totalRevenue)} (${staffMetrics[2].dealsClosed} deals, 34.0% conv.)`,
        dataPayload: {
          type: 'data_table',
          title: 'Sales Team Performance (INR)',
          data: {
            columns: ['Staff Name', 'Revenue', 'Deals', 'Conversion Rate'],
            rows: staffMetrics.map(s => [
              s.staffName,
              formatINR(s.totalRevenue),
              s.dealsClosed,
              `${s.conversionRate}%`
            ])
          }
        }
      };
    }

    // 7. HIGHEST SCORING LEADS (Manager & Staff)
    if (
      normalized.includes('highest scoring') ||
      normalized.includes('top leads') ||
      normalized.includes('smart leads') ||
      normalized.includes('my highest scoring lead')
    ) {
      const targetList = (role === 'STAFF' ? staffLeads : leads).sort((a, b) => b.score.score - a.score.score);
      const top3 = targetList.slice(0, 3);

      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Here are ${role === 'STAFF' ? 'your' : 'the organization’s'} highest scoring AI Smart Leads:

${top3.map((l, idx) => `${idx + 1}. **${l.name}** (${l.company}) — Score: **${l.score.score}/100** • **${formatINR(l.dealValue)}** • 🔥 ${l.score.category}`).join('\n')}`,
        dataPayload: {
          type: 'lead_cards',
          title: 'Top AI Smart Leads',
          data: top3
        }
      };
    }

    // 8. WHICH LEAD SHOULD I CALL? / WHO TO CONTACT FIRST (Staff & Manager)
    if (
      normalized.includes('which lead should i call') ||
      normalized.includes('call first') ||
      normalized.includes('contact first') ||
      normalized.includes('who should i call')
    ) {
      const targetList = (role === 'STAFF' ? staffLeads : leads).sort((a, b) => b.score.score - a.score.score);
      const topLead = targetList[0];

      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `🎯 **AI Recommendation: Call ${topLead.name} First**

• **Company:** ${topLead.company} (${topLead.title})
• **Location:** ${topLead.country}
• **AI Lead Score:** **${topLead.score.score} / 100 (${topLead.score.category})**
• **Estimated Deal Value:** **${formatINR(topLead.dealValue)}**
• **Primary Buying Signal:** ${topLead.score.factors[0]}
• **Next Action:** ${topLead.nextAction}`,
        dataPayload: {
          type: 'lead_detail',
          title: 'Priority #1 Call Opportunity',
          data: topLead
        }
      };
    }

    // 9. SHOW APPROVED LEADS (Manager & Staff)
    if (normalized.includes('approved')) {
      const targetList = (role === 'STAFF' ? staffLeads : leads).filter(l => l.status === 'Approved');
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Found **${targetList.length} Approved Leads** ready for contract closure:`,
        dataPayload: {
          type: 'data_table',
          title: 'Approved Leads Ready to Close',
          data: {
            columns: ['Lead Name', 'Company', 'Score', 'Deal Value', 'Next Action'],
            rows: targetList.map(l => [
              l.name,
              l.company,
              `${l.score.score}/100 (${l.score.category})`,
              formatINR(l.dealValue),
              l.nextAction
            ])
          }
        }
      };
    }

    // 10. SHOW LEADS ON HOLD (Manager & Staff)
    if (normalized.includes('hold') || normalized.includes('on hold')) {
      const targetList = (role === 'STAFF' ? staffLeads : leads).filter(l => l.status === 'Hold');
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Found **${targetList.length} leads currently On Hold** requiring follow-up:`,
        dataPayload: {
          type: 'lead_cards',
          title: 'Leads on Hold',
          data: targetList
        }
      };
    }

    // 11. REGIONAL LEADS QUERY (e.g. Mumbai, Pune)
    if (normalized.includes('mumbai') || normalized.includes('pune') || normalized.includes('bengaluru')) {
      const city = normalized.includes('mumbai') ? 'mumbai' : normalized.includes('pune') ? 'pune' : 'bengaluru';
      const targetList = role === 'STAFF' ? staffLeads : leads;
      const matched = targetList.filter(l => l.country.toLowerCase().includes(city));

      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        roleScope: role,
        content: `Found **${matched.length} active leads** in **${city.charAt(0).toUpperCase() + city.slice(1)}**:`,
        dataPayload: {
          type: 'data_table',
          title: `Leads in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
          data: {
            columns: ['Lead Name', 'Company', 'Score', 'Deal Value', 'Status'],
            rows: matched.map(l => [
              l.name,
              l.company,
              `${l.score.score}/100`,
              formatINR(l.dealValue),
              l.status
            ])
          }
        }
      };
    }

    // 12. SPECIFIC PROSPECT LOOKUP (e.g. Rahul Sharma)
    if (normalized.includes('rahul') || normalized.includes('shree')) {
      const rahul = leads.find(l => l.name.toLowerCase().includes('rahul'));
      if (rahul) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          roleScope: role,
          content: `Here are the details for **${rahul.name}**:

• **Company:** ${rahul.company} (${rahul.country})
• **Role:** ${rahul.title}
• **Status:** ${rahul.status} (AI Score: **${rahul.score.score}/100 ${rahul.score.category}**)
• **Deal Value:** ${formatINR(rahul.dealValue)}
• **Phone:** ${rahul.phone}
• **Email:** ${rahul.email}
• **Telegram:** @${rahul.telegramUsername || 'None'}
• **Next Action:** ${rahul.nextAction}`,
          dataPayload: {
            type: 'lead_detail',
            title: 'Lead Profile: Rahul Sharma',
            data: rahul
          }
        };
      }
    }

    // 13. DEFAULT SUMMARY QUERY
    const targetList = role === 'STAFF' ? staffLeads : leads;
    const hotCount = targetList.filter(l => l.score.score >= 85).length;
    const totalPipeline = targetList.reduce((acc, l) => acc + l.dealValue, 0);

    return {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      roleScope: role,
      content: `I analyzed your CRM query regarding "${query}".

Currently managing **${targetList.length} active opportunities** in your portfolio:
• **Hot Priority Leads (Score 85+):** ${hotCount}
• **Average AI Score:** ${Math.round(targetList.reduce((acc, l) => acc + l.score.score, 0) / (targetList.length || 1))}/100
• **Active Pipeline:** ${formatINR(totalPipeline)}

You can use the quick chips or ask for city-specific leads, call priorities, or deal valuations.`,
      dataPayload: {
        type: 'lead_cards',
        title: 'Top Priority Opportunities',
        data: targetList.slice(0, 3)
      }
    };
  }
};
