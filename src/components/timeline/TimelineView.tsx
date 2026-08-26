import React, { useState } from 'react';
import { Incident } from '../../types';
import { TimelineEventCard } from './TimelineEventCard';
import { Filter, Search, Calendar, ChevronDown, Activity, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface TimelineViewProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'CRITICAL') return matchesSearch && inc.severity === 'CRITICAL';
    if (filterType === 'ACTIVE') return matchesSearch && inc.status === 'ACTIVE';
    return matchesSearch;
  });

  // Group by year
  const groupedByYear = filteredIncidents.reduce((acc, inc) => {
    const year = inc.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(inc);
    return acc;
  }, {} as Record<number, Incident[]>);

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* Timeline Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0d111a]/80 border border-white/[0.08] backdrop-blur-xl">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search longitudinal history (hospital, doctor, diagnosis, INC-ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131824] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal/50"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ACTIVE', 'CRITICAL'].map(filter => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={clsx(
                "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                filterType === filter
                  ? "bg-brand-teal/20 text-brand-cyan border border-brand-teal/40"
                  : "bg-white/[0.03] text-slate-400 hover:text-white border border-transparent"
              )}
            >
              {filter === 'ALL' ? 'All Episodes' : filter === 'ACTIVE' ? 'Active' : 'Critical / Surgeries'}
            </button>
          ))}
        </div>
      </div>

      {/* Longitudinal Journey Rail */}
      <div className="relative pl-6 sm:pl-8 space-y-10">
        {/* Vertical Timeline Backbone Line */}
        <div className="absolute left-3 sm:left-4 top-2 bottom-6 w-0.5 bg-gradient-to-b from-brand-teal via-slate-700 to-slate-800" />

        {sortedYears.map((year, yearIndex) => {
          const yearIncidents = groupedByYear[year];
          return (
            <div key={year} className="relative space-y-4">
              
              {/* Year Marker Badge */}
              <div className="flex items-center gap-3 -ml-6 sm:-ml-8 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#131824] border-2 border-brand-teal flex items-center justify-center text-xs font-mono font-bold text-brand-cyan shadow-glow-teal z-10">
                  {year.toString().slice(-2)}
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white tracking-wider font-mono">
                    YEAR {year}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({yearIncidents.length} recorded {yearIncidents.length === 1 ? 'episode' : 'episodes'})
                  </span>
                </div>
              </div>

              {/* Incidents in this Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {yearIncidents.map((incident, idx) => (
                  <TimelineEventCard
                    key={incident.id}
                    incident={incident}
                    isSelected={selectedIncidentId === incident.id}
                    onSelect={onSelectIncident}
                    isLatest={yearIndex === 0 && idx === 0}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredIncidents.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-[#0d111a] border border-white/10 text-slate-400 text-xs">
            No medical incidents matched your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
