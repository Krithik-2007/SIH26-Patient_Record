import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { AccessHistoryLog } from '../share/AccessHistoryLog';
import { GlassPanel } from '../common/GlassPanel';
import { 
  ShieldCheck, 
  Lock, 
  UserX, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Heart, 
  Eye,
  KeyRound,
  XOctagon
} from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const { accessGrants, revokeAccessGrant, showToast } = usePatient();
  
  const [aiConsent, setAiConsent] = useState(true);
  const [caseStudyConsent, setCaseStudyConsent] = useState(true);
  const [emergencyBypassConsent, setEmergencyBypassConsent] = useState(true);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean, label: string) => {
    setter(!value);
    showToast(`${label} preference updated`, 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Sovereignty Center</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Patient-Owned Keys</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Privacy & Access Governance
          </h1>
        </div>
      </div>

      {/* Active Grants Killswitch Table */}
      <GlassPanel variant="base" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Active Scoped Authorizations</h3>
            <p className="text-xs text-slate-400">Tokens granted via QR scan or authorized clinical links.</p>
          </div>
        </div>

        <div className="space-y-3">
          {accessGrants.map(grant => {
            const isActive = grant.status === 'ACTIVE' && grant.expiresInSeconds > 0;

            return (
              <div
                key={grant.id}
                className="p-4 rounded-xl bg-[#131824] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{grant.recipientName}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isActive ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {grant.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Scope: <strong className="text-brand-cyan">{grant.scope.replace(/_/g, ' ')}</strong> • Purpose: {grant.purpose}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    Token: {grant.token} • Created: {grant.createdAt}
                  </div>
                </div>

                {isActive && (
                  <button
                    onClick={() => revokeAccessGrant(grant.id)}
                    className="px-3 py-1.5 rounded-lg bg-brand-rose/20 hover:bg-brand-rose/30 border border-brand-rose/40 text-brand-rose font-bold text-xs flex items-center gap-1.5 self-end sm:self-auto"
                  >
                    <XOctagon className="w-3.5 h-3.5" />
                    <span>Revoke Now</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </GlassPanel>

      {/* Patient Consent Toggles */}
      <GlassPanel variant="base" className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Patient Consent Policies</h3>

        <div className="space-y-3">
          {/* AI Assistance Consent */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Grounded AI Analysis on Local Records</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows AURA Health Assistant to read uploaded prescriptions and lab reports to answer questions and compute medication interactions.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={() => handleToggle(setAiConsent, aiConsent, 'AI Analysis')}
              className="w-5 h-5 accent-brand-cyan cursor-pointer"
            />
          </div>

          {/* Anonymized Research & Case Study Consent */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">De-identified Medical Case Study Contribution</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows de-identified clinical episodes to contribute to institutional academic case study repositories (under CASE-EDU-XXXX format with zero personal identifiers).
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={caseStudyConsent}
              onChange={() => handleToggle(setCaseStudyConsent, caseStudyConsent, 'Research Case Study')}
              className="w-5 h-5 accent-brand-cyan cursor-pointer"
            />
          </div>

          {/* Emergency Triage Kiosk Access */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-brand-rose shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Emergency Critical Allergy & Blood Group Broadcast</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Permits registered emergency ambulances and ICUs to instantly retrieve your O+ blood type and Penicillin/Sulfa allergies upon biometric/ABHA handshake.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emergencyBypassConsent}
              onChange={() => handleToggle(setEmergencyBypassConsent, emergencyBypassConsent, 'Emergency Triage Access')}
              className="w-5 h-5 accent-brand-cyan cursor-pointer"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Access Audit Trail Log */}
      <AccessHistoryLog />
    </div>
  );
};
