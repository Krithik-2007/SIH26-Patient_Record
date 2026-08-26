import React, { useState, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { AccessScope } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import QRCode from 'qrcode';
import { 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  XOctagon, 
  Key,
  Eye,
  Building2,
  Stethoscope
} from 'lucide-react';
import { clsx } from 'clsx';

export const SecureQRShare: React.FC = () => {
  const { 
    patient, 
    accessGrants, 
    generateAccessGrant, 
    revokeAccessGrant,
    setActiveTab 
  } = usePatient();

  const [selectedScope, setSelectedScope] = useState<AccessScope>('FULL_MEDICAL_HISTORY');
  const [purpose, setPurpose] = useState('Doctor Outpatient Consultation');
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [activeGrant, setActiveGrant] = useState(accessGrants.find(g => g.status === 'ACTIVE') || accessGrants[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Update active grant state when grants change
  useEffect(() => {
    const live = accessGrants.find(g => g.status === 'ACTIVE');
    if (live) setActiveGrant(live);
  }, [accessGrants]);

  // Generate QR code data URL whenever active grant changes
  useEffect(() => {
    if (activeGrant) {
      // The QR strictly contains a secure scoped temporary handshake URI, NEVER raw medical data!
      const securePayload = `https://aura-health.gov.in/verify?token=${activeGrant.token}&grantId=${activeGrant.id}&scope=${activeGrant.scope}`;
      QRCode.toDataURL(securePayload, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0284c7',
          light: '#07090e'
        }
      }).then(setQrDataUrl);
    }
  }, [activeGrant]);

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrant = generateAccessGrant(selectedScope, purpose, durationMinutes);
    setActiveGrant(newGrant);
  };

  const scopes: { id: AccessScope; label: string; desc: string }[] = [
    { 
      id: 'FULL_MEDICAL_HISTORY', 
      label: 'Full Medical History', 
      desc: 'All 4 episodes (2024–2026), 5 verified documents, active medications, and doctor directives.' 
    },
    { 
      id: 'CURRENT_INCIDENT_ONLY', 
      label: 'Current Episode Only (INC-004)', 
      desc: 'Only recent Bronchial Asthma episode at AIIMS with linked pulmonology documents.' 
    },
    { 
      id: 'MEDICINES_AND_ALLERGIES', 
      label: 'Current Medicines & Allergies', 
      desc: 'Active inhaler dosages, SOS medications, and drug sensitivity registry (Penicillin/Sulfa).' 
    },
    { 
      id: 'EMERGENCY_TRIAGE_DATA', 
      label: 'Emergency Triage Data', 
      desc: 'Blood Group (O+), emergency contact, registered organ donor status, and critical alerts.' 
    },
  ];

  const isTokenActive = activeGrant && activeGrant.status === 'ACTIVE' && activeGrant.expiresInSeconds > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-teal uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographic Permission Boundary</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Zero Raw Data Stored in QR</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Share Medical History Securely
          </h1>
        </div>

        <button
          onClick={() => setActiveTab('privacy')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#131824] hover:bg-[#1a2233] border border-white/10 text-xs text-slate-200 font-semibold transition-all self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-brand-cyan" />
          <span>View Access Audit Trail</span>
        </button>
      </div>

      {/* Main Layout: Left QR Hero Display + Right Permission Scope Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dark Spatial QR Display Hero */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#0a0e17] via-[#0d111a] to-[#131824] border border-brand-teal/30 shadow-spatial-lg relative overflow-hidden text-center">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status */}
          <div className="flex items-center justify-between z-10 mb-4">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
              Temporary Access Token
            </span>
            <span className={clsx(
              "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border flex items-center gap-1",
              isTokenActive
                ? "bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40"
                : "bg-brand-rose/20 text-brand-rose border-brand-rose/40"
            )}>
              <span className={clsx("w-1.5 h-1.5 rounded-full", isTokenActive ? "bg-brand-emerald animate-ping" : "bg-brand-rose")} />
              <span>{isTokenActive ? 'LIVE ACTIVE' : 'REVOKED / EXPIRED'}</span>
            </span>
          </div>

          {/* Center QR Hero Container */}
          <div className="my-auto py-4 flex flex-col items-center justify-center z-10">
            <div className="p-4 rounded-2xl bg-[#07090e] border-2 border-brand-teal/40 shadow-glow-teal relative group">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Secure Medical Access QR" 
                  className={clsx(
                    "w-56 h-56 rounded-xl transition-all duration-300",
                    !isTokenActive && "opacity-20 grayscale"
                  )}
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-500 font-mono text-xs">
                  Generating QR...
                </div>
              )}

              {!isTokenActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-rose font-bold text-xs gap-1">
                  <XOctagon className="w-8 h-8 text-brand-rose animate-pulse" />
                  <span>TOKEN INVALIDATED</span>
                </div>
              )}
            </div>

            {/* Live Countdown Clock */}
            {isTokenActive && (
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 text-brand-amber animate-spin" />
                <span className="text-slate-400">Expires in:</span>
                <span className="text-brand-amber font-bold text-sm">
                  {Math.floor(activeGrant.expiresInSeconds / 60)}:
                  {(activeGrant.expiresInSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            <div className="font-mono text-[11px] text-slate-400 mt-2">
              Token: <span className="text-brand-cyan font-bold">{activeGrant?.token || 'N/A'}</span>
            </div>
          </div>

          {/* Bottom Killswitch Revoke Button */}
          <div className="pt-4 border-t border-white/[0.08] z-10 space-y-2">
            {isTokenActive ? (
              <button
                onClick={() => revokeAccessGrant(activeGrant.id)}
                className="w-full py-2.5 rounded-xl bg-brand-rose/20 hover:bg-brand-rose/30 border border-brand-rose/40 text-brand-rose font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.15)]"
              >
                <XOctagon className="w-4 h-4" />
                <span>Instant Killswitch: Revoke Access Now</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 text-center">
                Access revoked or expired. Generate a new token below.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scoped Access Generator Form */}
        <div className="lg:col-span-7 space-y-6">
          <GlassPanel variant="base" className="p-6">
            <h3 className="text-base font-bold text-white mb-1">
              Configure Permission Scope
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Select precisely what an attending doctor or hospital is authorized to view.
            </p>

            <form onSubmit={handleCreateGrant} className="space-y-5">
              
              {/* Scope Radio Cards */}
              <div className="space-y-2.5">
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Access Scope
                </label>

                {scopes.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScope(s.id)}
                    className={clsx(
                      "p-3.5 rounded-xl border transition-all cursor-pointer text-xs",
                      selectedScope === s.id
                        ? "bg-brand-teal/15 border-brand-teal text-white shadow-sm"
                        : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{s.label}</span>
                      <input
                        type="radio"
                        checked={selectedScope === s.id}
                        onChange={() => setSelectedScope(s.id)}
                        className="accent-brand-cyan"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Purpose of Access */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Clinical Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Pulmonology Outpatient Follow-up, Second Opinion..."
                  className="w-full bg-[#131824] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal/50"
                />
              </div>

              {/* Expiry Duration Chips */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Temporary Validity Window
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 30, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={clsx(
                        "flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all border",
                        durationMinutes === mins
                          ? "bg-brand-teal/20 text-brand-cyan border-brand-teal/50 shadow-glow-teal"
                          : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05]"
                      )}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-teal hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 text-slate-950" />
                <span>Generate New Temporary QR Access Token</span>
              </button>
            </form>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
