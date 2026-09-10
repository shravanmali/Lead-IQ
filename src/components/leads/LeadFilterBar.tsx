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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '420px' }}>
        <Search
          size={16}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by prospect name, company, email, or @telegram..."
          style={{ width: '100%', paddingLeft: '2.25rem' }}
        />
      </div>

      {/* Status Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
          <Filter size={14} />
          <span>Status:</span>
        </div>

        {STATUS_OPTIONS.map(st => {
          const isActive = selectedStatus === st;
          return (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={isActive ? 'btn btn-primary btn-sm' : 'btn-secondary btn-sm'}
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)'
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
