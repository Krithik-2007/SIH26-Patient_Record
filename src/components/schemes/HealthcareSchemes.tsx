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
  Calendar, 
  Sparkles, 
  Filter, 
  Check 
} from 'lucide-react';
import { clsx } from 'clsx';

export const HealthcareSchemes: React.FC = () => {
  const { 
    currentUser, 
    activeRole, 
    schemes, 
    incidents, 
    patient, 
    toggleSchemeEnrollment, 
    setActiveTab 
  } = usePatient();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ELIGIBLE_ONLY' | 'ALL'>('ELIGIBLE_ONLY');

  // Check patient eligibility dynamically based on active incidents
  const activeConditions = incidents.map(i => i.title.toLowerCase() + ' ' + i.diagnosis.toLowerCase());
  const hasFracture = activeConditions.some(c => c.includes('fracture') || c.includes('arm') || c.includes('trauma') || c.includes('ortho'));
  const hasCancer = activeConditions.some(c => c.includes('cancer') || c.includes('oncology') || c.includes('carcinoma') || c.includes('chemo'));

  const processedSchemes = schemes.map(s => {
    let isEligible = false;
    let matchScore = 75;
    let reason = 'General Public Scheme';

    const conditions = (s.applicableConditions || []).map(c => c.toLowerCase());
    const isUniversal = conditions.includes('all') || conditions.length === 0;

    if (isUniversal) {
      isEligible = true;
      matchScore = 96;
      reason = 'Valid ABHA Health ID & National Health Coverage';
    } else if (hasFracture && conditions.some(c => c.includes('fracture') || c.includes('orthopedic') || c.includes('trauma'))) {
      isEligible = true;
      matchScore = 95;
      reason = `Matched Active Incident: Right Arm Bone Fracture (${incidents[0]?.id || 'INC-001'})`;
    } else if (hasCancer && conditions.some(c => c.includes('cancer') || c.includes('oncology'))) {
      isEligible = true;
      matchScore = 98;
      reason = 'Matched Oncology Protocol';
    }

    return {
      ...s,
      isEligible,
      dynamicMatchScore: matchScore,
      matchReason: reason
    };
  });

  const filteredSchemes = processedSchemes.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'ELIGIBLE_ONLY') return s.isEligible;
    return true;
  });

  const eligibleCount = processedSchemes.filter(s => s.isEligible).length;

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Healthcare Schemes & Benefits
          </h1>
        </div>

        {activeRole === 'GOVERNMENT_OFFICIAL' && (
          <button
            onClick={() => setActiveTab('government')}
            className="px-4 py-2 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:brightness-110 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Landmark className="w-4 h-4" />
            <span>Manage Schemes (Government Official Portal)</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterMode('ELIGIBLE_ONLY')}
            className={clsx(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5",
              filterMode === 'ELIGIBLE_ONLY'
                ? "bg-brand-emerald/20 text-brand-emerald border-brand-emerald/50 shadow-glow-emerald"
                : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-white"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible For You ({eligibleCount})</span>
          </button>

          <button
            onClick={() => setFilterMode('ALL')}
            className={clsx(
              "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5",
              filterMode === 'ALL'
                ? "bg-brand-amber/20 text-brand-amber border-brand-amber/50 shadow-glow-amber"
                : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-white"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Central & State Schemes ({schemes.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes (PM-JAY, Trauma, Oncology)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d111a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-amber/50"
          />
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map(scheme => {
          const isEnrolled = scheme.activeEnrollment;

          return (
            <GlassPanel
              key={scheme.id}
              variant="base"
              className={clsx(
                "p-5 flex flex-col justify-between space-y-4 transition-all shadow-spatial-sm",
                scheme.isEligible ? "border-brand-emerald/30 hover:border-brand-emerald/60" : "hover:border-white/20"
              )}
            >
              <div>
                {/* Status Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-amber/10 text-brand-amber border border-brand-amber/30">
                      {scheme.shortCode}
                    </span>
                    <span className={clsx(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                      scheme.isEligible
                        ? "bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", scheme.isEligible ? "bg-brand-emerald" : "bg-slate-500")} />
                      <span>{scheme.isEligible ? `Eligible (${scheme.dynamicMatchScore}%)` : 'Additional Info Required'}</span>
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
                <div className="text-[11px] text-slate-400 font-mono mb-2">
                  {scheme.ministry} • Coverage: <span className="text-brand-amber font-bold">{scheme.coverageAmount}</span>
                </div>

                {/* Match Rationale Alert */}
                {scheme.isEligible && (
                  <div className="p-2 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 text-[11px] text-brand-emerald font-medium mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{scheme.matchReason}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-3">
                  {scheme.description}
                </p>

                {/* Benefits */}
                {scheme.benefits && (
                  <div className="space-y-1 pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Key Benefits:</span>
                    {scheme.benefits.slice(0, 2).map((b, i) => (
                      <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-brand-emerald shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                {isEnrolled ? (
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: <strong className="text-brand-cyan">{scheme.enrollmentId}</strong>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Deadline: {scheme.applicationDeadline || 'Rolling'}
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
