import React, { useState, useEffect } from 'react';
import { AtRiskCustomer } from '../../types/retention';
import { retentionService } from '../../services/retentionService';
import { formatINR } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Sparkles,
  Send,
  Users,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface ReengagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCustomer?: AtRiskCustomer | null;
  allCustomers: AtRiskCustomer[];
  onSuccess: () => void;
}

type CampaignTone = 'Professional' | 'Friendly' | 'Win-back' | 'Concise';
type ModalStep = 'REVIEW' | 'SENDING' | 'SUCCESS' | 'ERROR';

export const ReengagementModal: React.FC<ReengagementModalProps> = ({
  isOpen,
  onClose,
  targetCustomer,
  allCustomers,
  onSuccess
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const isLight = theme === 'light';

  const [tone, setTone] = useState<CampaignTone>('Friendly');
  const [activeTab, setActiveTab] = useState<'TEMPLATE' | 'RECIPIENTS'>('TEMPLATE');
  const [recipientFilter, setRecipientFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'VALUE'>('ALL');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [step, setStep] = useState<ModalStep>('REVIEW');
  const [sendProgress, setSendProgress] = useState(0);

  // Initialize selected customer IDs when opened
  useEffect(() => {
    if (isOpen) {
      setStep('REVIEW');
      setSendProgress(0);
      if (targetCustomer) {
        setSelectedCustomerIds([targetCustomer.id]);
      } else {
        setSelectedCustomerIds(allCustomers.map(c => c.id));
      }
    }
  }, [isOpen, targetCustomer, allCustomers]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && step !== 'SENDING') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, onClose]);

  if (!isOpen) return null;

  const staffName = user?.name || 'Alex Morgan';
  const recipientCount = targetCustomer ? 1 : 43;
  const potentialRevenue = targetCustomer ? targetCustomer.previousValue : 840000;

  // Filtered customer list
  const filteredCustomers = allCustomers.filter(c => {
    if (recipientFilter === 'HIGH') return c.riskLevel === 'HIGH';
    if (recipientFilter === 'MEDIUM') return c.riskLevel === 'MEDIUM';
    if (recipientFilter === 'VALUE') return c.previousValue >= 150000;
    return true;
  });

  const toggleCustomer = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedCustomerIds(allCustomers.map(c => c.id));
  };

  const getEmailContent = (selectedTone: CampaignTone) => {
    switch (selectedTone) {
      case 'Professional':
        return {
          subject: 'LeadIQ CRM — Strategic Account Review & Update',
          body: `Hi {{customer_name}},\n\nI am reaching out regarding your account at {{company_name}}. We noticed it has been a short while since your last interaction with our platform.\n\nWe have recently rolled out several high-impact updates, including automated Whisper transcription and predictive deal scoring. I would appreciate the opportunity to review your current objectives and ensure your team is extracting maximum value.\n\nCould we schedule a brief 10-minute touchpoint this week?\n\nBest regards,\n{{staff_name}}\nLeadIQ Enterprise Solutions`
        };
      case 'Win-back':
        return {
          subject: 'Special 20% Retention Credit on Your LeadIQ Subscription',
          body: `Hi {{customer_name}},\n\nWe miss having {{company_name}} active on LeadIQ! As one of our valued early partners, we want to help you scale your sales pipeline with zero friction.\n\nWe've credited a 20% platform discount to your account and upgraded your team to unlimited AI lead priority queues for the next 60 days.\n\nSimply reply to this email or log in today to reactivate your workspace.\n\nWarm regards,\n{{staff_name}}\nLeadIQ Team`
        };
      case 'Concise':
        return {
          subject: 'Quick check-in from LeadIQ',
          body: `Hi {{customer_name}},\n\nQuick check-in regarding {{company_name}}'s sales workspace. Let us know if you need any assistance with pipeline setup or custom CRM integrations.\n\nHappy to help anytime.\n\nBest,\n{{staff_name}}\nLeadIQ`
        };
      case 'Friendly':
      default:
        return {
          subject: "We'd love to have you back",
          body: `Hi {{customer_name}},\n\nIt's been a little while since your last visit with us at {{company_name}}.\n\nWe'd love to help you get back on track. If there's anything you need, simply reply to this email and our team will be happy to help.\n\nBest,\n{{staff_name}}\nLeadIQ`
        };
    }
  };

  const emailContent = getEmailContent(tone);

  const handleSendCampaign = async () => {
    if (selectedCustomerIds.length === 0) {
      showToast('No Recipients Selected', 'Please select at least one customer.', 'warning');
      return;
    }

    setStep('SENDING');
    setSendProgress(15);

    try {
      // Step 1: Preparing
      await new Promise(r => setTimeout(r, 450));
      setSendProgress(45);

      // Step 2: Dispatching
      await new Promise(r => setTimeout(r, 650));
      setSendProgress(85);

      await retentionService.sendReengagementCampaign({
        recipientIds: selectedCustomerIds,
        tone,
        subject: emailContent.subject,
        bodyTemplate: emailContent.body
      });

      setSendProgress(100);
      await new Promise(r => setTimeout(r, 350));
      setStep('SUCCESS');
      showToast('Campaign Dispatched', `Re-engagement sent to ${selectedCustomerIds.length} customers.`, 'success');
      onSuccess();
    } catch (err: any) {
      setStep('ERROR');
      showToast('Campaign Failed', err.message || 'Unable to send campaign.', 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 17, 15, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="glass-dialog"
        role="dialog"
        aria-label="Re-engage Customers Modal"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          backgroundColor: isLight ? '#FFFFFF' : 'rgba(8, 24, 20, 0.96)',
          borderRadius: '24px',
          border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(79, 242, 176, 0.25)',
          boxShadow: isLight
            ? '0 24px 80px rgba(0, 0, 0, 0.16), 0 0 32px rgba(16, 185, 129, 0.12)'
            : '0 24px 90px rgba(0, 0, 0, 0.7), 0 0 40px rgba(79, 242, 176, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* ===================================================================== */}
        {/* MODAL HEADER                                                          */}
        {/* ===================================================================== */}
        <div
          style={{
            padding: '1.25rem 1.6rem',
            borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
            background: isLight
              ? 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)'
              : 'linear-gradient(135deg, rgba(79, 242, 176, 0.1) 0%, rgba(16, 38, 32, 0.6) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: isLight
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #4FF2B0 0%, #20C997 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLight ? '#FFFFFF' : '#06110F',
                boxShadow: isLight ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 0 16px rgba(79, 242, 176, 0.35)'
              }}
            >
              <Sparkles size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                  Re-engage Customers
                </h2>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isLight ? '#D1FAE5' : 'rgba(79, 242, 176, 0.15)',
                    color: isLight ? '#065F46' : 'var(--brand-primary)',
                    border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.3)'
                  }}
                >
                  30-Day Retention
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {targetCustomer
                  ? `Re-engage ${targetCustomer.name} (${targetCustomer.company})`
                  : `${recipientCount} customers haven't returned in the last 30 days.`}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={step === 'SENDING'}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '8px',
              cursor: step === 'SENDING' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===================================================================== */}
        {/* MODAL BODY                                                            */}
        {/* ===================================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* STEP 1: REVIEW & CONFIGURE FLOW */}
          {step === 'REVIEW' && (
            <>
              {/* Campaign Key Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.04)',
                    border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Recipients
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedCustomerIds.length} customers
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.1)',
                    border: isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.25)'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: isLight ? '#92400E' : '#FBBF24', textTransform: 'uppercase', fontWeight: 600 }}>
                    Potential Revenue
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#78350F' : '#FDE68A', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    {formatINR(potentialRevenue)}
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.1)',
                    border: isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.25)'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: isLight ? '#065F46' : 'var(--brand-primary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Campaign Type
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#065F46' : 'var(--text-primary)', marginTop: '4px' }}>
                    30-Day Win-back
                  </div>
                </div>
              </div>

              {/* Navigation Tabs (Template vs Recipients) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
                  paddingBottom: '0.5rem'
                }}
              >
                <button
                  onClick={() => setActiveTab('TEMPLATE')}
                  style={{
                    background: activeTab === 'TEMPLATE' ? (isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.12)') : 'transparent',
                    color: activeTab === 'TEMPLATE' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.80rem',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  ✦ AI Message & Tone
                </button>

                <button
                  onClick={() => setActiveTab('RECIPIENTS')}
                  style={{
                    background: activeTab === 'RECIPIENTS' ? (isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.12)') : 'transparent',
                    color: activeTab === 'RECIPIENTS' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.80rem',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Review Recipients</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      backgroundColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
                      padding: '0.05rem 0.35rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {selectedCustomerIds.length}
                  </span>
                </button>
              </div>

              {activeTab === 'TEMPLATE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* AI Personalization Callout */}
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isLight ? '#F0FDF4' : 'rgba(79, 242, 176, 0.08)',
                      border: isLight ? '1px solid #BBF7D0' : '1px solid rgba(79, 242, 176, 0.25)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem'
                    }}
                  >
                    <Sparkles size={16} style={{ color: 'var(--brand-primary)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.76rem', color: isLight ? '#166534' : 'var(--text-secondary)', lineHeight: 1.45 }}>
                      <strong style={{ color: isLight ? '#14532D' : 'var(--text-primary)' }}>✦ AI Personalized: </strong>
                      Each email will automatically use the customer's name, company, previous interaction, and relevant account context when available.
                    </div>
                  </div>

                  {/* Tone Selector */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem', display: 'block' }}>
                      Tone of Voice
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(['Friendly', 'Professional', 'Win-back', 'Concise'] as CampaignTone[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTone(t)}
                          style={{
                            background: tone === t
                              ? 'var(--brand-gradient)'
                              : (isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.04)'),
                            color: tone === t ? (isLight ? '#FFFFFF' : '#06110F') : 'var(--text-primary)',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Email Live Preview Box */}
                  <div
                    style={{
                      borderRadius: '14px',
                      backgroundColor: isLight ? '#F8FAF9' : 'rgba(12, 32, 27, 0.65)',
                      border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    <div style={{ borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUBJECT: </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {emailContent.subject}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit'
                      }}
                    >
                      {emailContent.body}
                    </div>

                    <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['{{customer_name}}', '{{company_name}}', '{{staff_name}}'].map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: isLight ? '#E2E8F0' : 'rgba(79, 242, 176, 0.1)',
                            color: isLight ? '#334155' : 'var(--brand-primary)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* RECIPIENTS TAB */}
              {activeTab === 'RECIPIENTS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Category Filter Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'ALL', label: `All (${allCustomers.length})` },
                        { id: 'HIGH', label: 'High Risk (3)' },
                        { id: 'MEDIUM', label: 'Medium Risk (3)' },
                        { id: 'VALUE', label: 'High Value > ₹1.5L (3)' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setRecipientFilter(f.id as any)}
                          style={{
                            fontSize: '0.70rem',
                            fontWeight: recipientFilter === f.id ? 700 : 500,
                            padding: '0.3rem 0.65rem',
                            borderRadius: '8px',
                            background: recipientFilter === f.id
                              ? (isLight ? '#ECFDF5' : 'var(--brand-primary)')
                              : (isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)'),
                            color: recipientFilter === f.id
                              ? (isLight ? '#065F46' : '#06110F')
                              : 'var(--text-secondary)',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={selectAllFiltered}
                      style={{
                        fontSize: '0.70rem',
                        color: 'var(--brand-primary)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Select All
                    </button>
                  </div>

                  {/* Customer Checkbox Selection List */}
                  <div
                    style={{
                      maxHeight: '220px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    {filteredCustomers.map(cust => {
                      const isSelected = selectedCustomerIds.includes(cust.id);
                      return (
                        <div
                          key={cust.id}
                          onClick={() => toggleCustomer(cust.id)}
                          style={{
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            backgroundColor: isSelected
                              ? (isLight ? '#F0FDF4' : 'rgba(79, 242, 176, 0.08)')
                              : (isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.02)'),
                            border: isSelected
                              ? (isLight ? '1px solid #BBF7D0' : '1px solid rgba(79, 242, 176, 0.3)')
                              : (isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: isSelected ? 'none' : (isLight ? '1.5px solid #CBD5E1' : '1.5px solid var(--border-medium)'),
                                backgroundColor: isSelected ? 'var(--brand-primary)' : 'transparent',
                                color: isLight ? '#FFFFFF' : '#06110F',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {isSelected && <Check size={13} strokeWidth={3} />}
                            </div>

                            <div>
                              <div style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {cust.name} • {cust.company}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                Inactive {cust.daysInactive} days • {formatINR(cust.previousValue)}
                              </div>
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: cust.riskLevel === 'HIGH' ? '#EF4444' : '#F59E0B'
                            }}
                          >
                            Risk {cust.riskScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: SENDING PROGRESS STATE */}
          {step === 'SENDING' && (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.15)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={26} className="animate-spin" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  ✦ Preparing campaign...
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Sending personalized emails... {Math.round((sendProgress / 100) * selectedCustomerIds.length)} / {selectedCustomerIds.length}
                </p>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${sendProgress}%`,
                    backgroundColor: 'var(--brand-primary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'SUCCESS' && (
            <div style={{ padding: '1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.18)',
                  color: isLight ? '#059669' : 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isLight ? '0 0 20px rgba(16, 185, 129, 0.25)' : '0 0 24px rgba(79, 242, 176, 0.35)'
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Re-engagement campaign sent ✦
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <strong>{selectedCustomerIds.length} customers</strong> contacted with personalized follow-up.
                </p>
              </div>

              {/* Metric Box */}
              <div
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: isLight ? '#F0FDF4' : 'rgba(79, 242, 176, 0.08)',
                  border: isLight ? '1px solid #BBF7D0' : '1px solid rgba(79, 242, 176, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Potential Revenue Re-engaged
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatINR(potentialRevenue)}
                  </div>
                </div>

                <div style={{ borderLeft: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Status
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isLight ? '#065F46' : 'var(--brand-primary)' }}>
                    Awaiting response
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ERROR STATE */}
          {step === 'ERROR' && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertCircle size={28} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Unable to send campaign
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  No customers were successfully contacted. Please check your network connection.
                </p>
              </div>

              <button
                onClick={handleSendCampaign}
                className="btn btn-primary btn-sm"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MODAL FOOTER                                                          */}
        {/* ===================================================================== */}
        <div
          style={{
            padding: '1rem 1.6rem',
            borderTop: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)',
            backgroundColor: isLight ? '#F8FAF9' : 'rgba(6, 17, 15, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          {step === 'REVIEW' && (
            <>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Estimated delivery: <strong style={{ color: 'var(--text-primary)' }}>Immediately</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={onClose}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendCampaign}
                  disabled={selectedCustomerIds.length === 0}
                  className="btn btn-primary btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Send size={13} />
                  <span>Send to {selectedCustomerIds.length} Customers</span>
                </button>
              </div>
            </>
          )}

          {step === 'SUCCESS' && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                onClick={onClose}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.5rem 1.25rem' }}
              >
                Back to Analytics
              </button>
            </div>
          )}

          {step === 'ERROR' && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
