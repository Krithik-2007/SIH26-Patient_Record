import React from 'react';
import { Incident } from '../../types';
import { Badge } from '../common/Badge';
import { usePatient } from '../../context/PatientContext';
import { 
  Building2, 
  Stethoscope, 
  FileText, 
  Pill, 
  MessageSquare, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';

interface TimelineEventCardProps {
  incident: Incident;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isLatest?: boolean;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  incident,
  isSelected,
  onSelect,
  isLatest = false
}) => {
  const { closeIncident, reopenIncident } = usePatient();
  const isActive = incident.status === 'ACTIVE';

  const handleToggleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      closeIncident(incident.id);
    } else {
      reopenIncident(incident.id);
    }
  };

  return (
    <div
      onClick={() => onSelect(incident.id)}
      className={clsx(
        "group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer border text-left",
        isSelected
          ? "bg-[#161f30] border-brand-teal shadow-[0_0_30px_rgba(14,165,233,0.25)] ring-1 ring-brand-teal"
          : isLatest && isActive
          ? "bg-[#0f1420] border-brand-teal/40 hover:border-brand-teal/70 shadow-spatial-md"
          : !isActive
          ? "bg-[#0a0d14]/70 border-white/[0.05] opacity-80 hover:opacity-100"
          : "bg-[#0d111a]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#131824] shadow-spatial-sm"
      )}
    >
      {/* Latest Active Incident Indicator Ribbon */}
      {isLatest && isActive && (
        <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-glow-teal flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
          <span>Active in Real Time</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-brand-cyan">
            {incident.id}
          </span>
          <span className={clsx(
            "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
            isActive 
              ? "bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30" 
              : "bg-slate-800 text-slate-400 border-slate-700"
          )}>
            {isActive ? '● ACTIVE' : '✓ CURED & CLOSED'}
          </span>
          <Badge severity={incident.severity} />
          {incident.parentIncidentId && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1">
              <span>Branch</span>
            </span>
          )}
          {incident.milestones && incident.milestones.length > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 flex items-center gap-1">
              <span>{incident.milestones.length} milestones</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{incident.date}</span>
          </div>

          {/* Quick Close / Reopen Toggle Button */}
          <button
            type="button"
            onClick={handleToggleClose}
            title={isActive ? "Mark this incident as cured and closed" : "Reopen this incident"}
            className={clsx(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border",
              isActive 
                ? "bg-brand-emerald/20 hover:bg-brand-emerald/30 text-brand-emerald border-brand-emerald/40"
                : "bg-white/5 hover:bg-white/10 text-slate-400 border-white/10"
            )}
          >
            {isActive ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
            <span>{isActive ? 'Mark Cured & Close' : 'Reopen'}</span>
          </button>
        </div>
      </div>

      {/* Incident Title */}
      <h4 className={clsx(
        "text-base font-bold transition-colors line-clamp-1 mb-1.5",
        isActive ? "text-white group-hover:text-brand-cyan" : "text-slate-300"
      )}>
        {incident.title}
      </h4>

      {/* Hospital & Doctor */}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 mb-3">
        <span className="flex items-center gap-1 text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">{incident.hospital}</span>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="flex items-center gap-1 text-slate-400">
          <Stethoscope className="w-3.5 h-3.5 text-brand-emerald" />
          <span>{incident.doctor}</span>
        </span>
      </div>

      {/* Clinical Reason / Summary */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {incident.patientDescription || incident.reason}
      </p>

      {/* Linked Assets Badges */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1" title={`${incident.documentsCount} documents verified`}>
            <FileText className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{incident.documentsCount} docs</span>
          </span>

          <span className="flex items-center gap-1" title={`${incident.medicinesCount} linked medications`}>
            <Pill className="w-3.5 h-3.5 text-brand-emerald" />
            <span>{incident.medicinesCount} meds</span>
          </span>

          <span className="flex items-center gap-1" title={`${incident.doctorSuggestionsCount} doctor suggestions`}>
            <MessageSquare className="w-3.5 h-3.5 text-brand-amber" />
            <span>{incident.doctorSuggestionsCount} recs</span>
          </span>
        </div>

        <span className="flex items-center gap-1 text-brand-teal text-[11px] font-semibold group-hover:translate-x-1 transition-transform">
          <span>Inspect Episode</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
