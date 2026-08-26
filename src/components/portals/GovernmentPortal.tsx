import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Landmark, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserCheck,
  Building2,
  Clock
} from 'lucide-react';

export const GovernmentPortal: React.FC = () => {
  const { currentUser, schemes, accessLogs, showToast } = usePatient();
  const [caseRefInput, setCaseRefInput] = useState('PMJAY-DEL-2026-9021');
  const [isCaseVerified, setIsCaseVerified] = useState(true);

  const handleVerifyCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseRefInput.trim()) return;
    setIsCaseVerified(true);
    showToast(`Case reference ${caseRefInput} verified against National Health Authority Registry.`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Official Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d111a] border border-brand-amber/30 shadow-glow-amber">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-amber/10 border border-brand-amber/30 flex items-center justify-center text-brand-amber">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentUser?.name || 'Rajesh Varma'}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber font-bold">
                {currentUser?.officialId || 'NHA-VERIF-DEL-889'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser?.department || 'National Health Authority (NHA) & PM-JAY Registry'}
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <div>Authority: <strong>Statutory Verification Officer</strong></div>
          <div className="text-brand-amber">Audited Access Mode ✓</div>
        </div>
      </div>

      {/* Case Reference Search */}
      <GlassPanel variant="base" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-amber" />
              <span>Official Healthcare Case Authorization Search</span>
            </h3>
            <p className="text-xs text-slate-400">
              Enter official case reference or ABHA beneficiary token for scheme entitlement clearance.
            </p>
          </div>

          <form onSubmit={handleVerifyCase} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. PMJAY-DEL-2026-9021"
              value={caseRefInput}
              onChange={(e) => setCaseRefInput(e.target.value)}
              className="bg-[#131824] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-brand-amber font-mono focus:outline-none focus:border-brand-amber/50"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-amber whitespace-nowrap"
            >
              Verify Case
            </button>
          </form>
        </div>
      </GlassPanel>

      {/* Verification Results */}
      {isCaseVerified && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map(scheme => (
              <GlassPanel key={scheme.id} variant="base" className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-amber">{scheme.shortCode}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 font-bold">
                    Official Clearance Active
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{scheme.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{scheme.description}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Coverage: {scheme.coverageAmount}</span>
                  <span className="text-brand-cyan font-bold font-mono">100% Cashless</span>
                </div>
              </GlassPanel>
            ))}
          </div>

          {/* Audit Logs Table */}
          <GlassPanel variant="base" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Statutory Access Audit Register</h3>
            <div className="space-y-2 text-xs">
              {accessLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{log.recipientName}</span>
                    <span className="text-slate-400 text-[11px] block">{log.purpose}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{log.timestamp} • {log.ipAddress}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
