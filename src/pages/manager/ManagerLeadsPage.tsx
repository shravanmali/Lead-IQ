import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Lead, LeadStatus } from '../../types/lead';
import { LeadTable } from '../../components/leads/LeadTable';
import { LeadFilterBar } from '../../components/leads/LeadFilterBar';
import { LoadingState } from '../../components/common/LoadingState';
import { Modal } from '../../components/common/Modal';
import { LeadScoreBadge } from '../../components/common/LeadScoreBadge';
import { LeadStatusBadge } from '../../components/common/LeadStatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { Users, Phone, Mail, Building, MapPin, IndianRupee, Calendar, Send } from 'lucide-react';

export const ManagerLeadsPage: React.FC = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads({
        status: selectedStatus,
        category: selectedCategory,
        searchQuery
      });
      setLeads(data);
    } catch (err: any) {
      showToast('Error Loading Leads', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [selectedStatus, selectedCategory, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              All Company CRM Leads
            </h2>
            <span className="badge" style={{ backgroundColor: 'rgba(79, 242, 176, 0.1)', color: 'var(--brand-primary)', fontSize: '0.72rem' }}>
              {leads.length} TOTAL IN PIPELINE
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
            Comprehensive view of enterprise pipeline and staff assignments
          </p>
        </div>
      </div>

      <LeadFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        {isLoading ? (
          <LoadingState message="Loading CRM leads..." count={6} />
        ) : (
          <LeadTable
            leads={leads}
            onSelectLead={l => setActiveLeadModal(l)}
          />
        )}
      </div>

      {/* Lead Detail Inspection Modal for Manager */}
      <Modal
        isOpen={Boolean(activeLeadModal)}
        onClose={() => setActiveLeadModal(null)}
        title={activeLeadModal ? `${activeLeadModal.name} (${activeLeadModal.company})` : ''}
        subtitle="Executive Lead Dossier"
        maxWidth="620px"
      >
        {activeLeadModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PIPELINE STATUS</div>
                <LeadStatusBadge status={activeLeadModal.status} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI PREDICTIVE SCORE</div>
                <LeadScoreBadge score={activeLeadModal.score} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ESTIMATED VALUE</div>
                <div style={{ fontWeight: 800, color: 'var(--brand-primary)', fontSize: '1.05rem' }}>
                  {formatINR(activeLeadModal.dealValue)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contact Email</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeLeadModal.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Phone Number</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{activeLeadModal.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Staff</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--brand-primary)' }}>{activeLeadModal.assignedStaffName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lead Source</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeLeadModal.source}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>AI Scoring Justification Vectors</div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {activeLeadModal.score.factors.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Latest Internal Notes</div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, padding: '0.625rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                {activeLeadModal.notes || 'No specific notes recorded.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
