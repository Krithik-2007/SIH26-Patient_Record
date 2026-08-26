import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { HealthcareScheme } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { 
  Landmark, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  FileText, 
  ArrowUpRight, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

export const HealthcareSchemes: React.FC = () => {
  const { schemes, toggleSchemeEnrollment } = usePatient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<HealthcareScheme | null>(null);

  const filteredSchemes = schemes.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-amber uppercase flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>Government Health Entitlements</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Contextual Eligibility Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Healthcare Schemes & Benefits
          </h1>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-xs font-bold text-brand-emerald flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4" />
          <span>2 Matched Schemes for Your Health Profile</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search central & state government schemes (e.g. PM-JAY, Asthma Mission, CGHS)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0d111a] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-amber/50"
        />
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map(scheme => {
          const isEnrolled = scheme.activeEnrollment;
          const isLikely = scheme.eligibilityStatus === 'LIKELY_ELIGIBLE';
          const isPotential = scheme.eligibilityStatus === 'POTENTIALLY_ELIGIBLE';

          return (
            <GlassPanel
              key={scheme.id}
              variant="base"
              className="p-5 flex flex-col justify-between space-y-4 hover:border-brand-amber/40 transition-all"
            >
              <div>
                {/* Status Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-amber/10 text-brand-amber border border-brand-amber/30">
                      {scheme.shortCode}
                    </span>
                    <span className={clsx(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      isLikely ? "bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30" :
                      isPotential ? "bg-brand-amber/15 text-brand-amber border-brand-amber/30" :
                      "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                      {isLikely ? 'Likely Eligible (94%)' : isPotential ? 'Potentially Eligible' : 'Info Required'}
                    </span>
                  </div>

                  {isEnrolled && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
                      Active Enrolled
                    </span>
                  )}
                </div>

                {/* Scheme Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-1">
                  {scheme.name}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono mb-3">
                  {scheme.ministry} • Coverage: <span className="text-brand-amber font-bold">{scheme.coverageAmount}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {scheme.description}
                </p>

                {/* Required Docs Chips */}
                <div className="space-y-1.5 pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Required Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.requiredDocuments.map((doc, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/5 text-slate-300 font-mono">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                {isEnrolled ? (
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: <strong className="text-brand-cyan">{scheme.enrollmentId}</strong>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Deadline: {scheme.applicationDeadline || 'Open'}
                  </span>
                )}

                <button
                  onClick={() => toggleSchemeEnrollment(scheme.id)}
                  className={clsx(
                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                    isEnrolled
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-brand-amber text-slate-950 hover:brightness-110 shadow-glow-amber"
                  )}
                >
                  {isEnrolled ? 'Manage Enrollment' : 'Apply via ABHA'}
                </button>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
