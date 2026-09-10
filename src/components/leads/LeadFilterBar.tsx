import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { LeadStatus } from '../../types/lead';

interface LeadFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: LeadStatus | 'All';
  onStatusChange: (status: LeadStatus | 'All') => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const STATUS_OPTIONS: (LeadStatus | 'All')[] = [
  'All',
  'New',
  'Contacted',
  'Interested',
  'Approved',
  'Hold',
  'Declined',
  'Converted'
];

export const LeadFilterBar: React.FC<LeadFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '420px' }}>
        <Search
          size={15}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-primary)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by prospect, organization, email, or @telegram..."
          style={{
            width: '100%',
            paddingLeft: '2.25rem',
            backgroundColor: 'rgba(6, 17, 15, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.84rem'
          }}
        />
      </div>

      {/* Status Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem', fontWeight: 600 }}>
          <Filter size={13} />
          <span>STAGE:</span>
        </div>

        {STATUS_OPTIONS.map(st => {
          const isActive = selectedStatus === st;
          return (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={isActive ? 'btn btn-primary btn-sm' : 'btn-ghost btn-sm'}
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? 'none' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#06110F' : 'var(--text-secondary)'
              }}
            >
              {st}
            </button>
          );
        })}
      </div>
    </div>
  );
};
