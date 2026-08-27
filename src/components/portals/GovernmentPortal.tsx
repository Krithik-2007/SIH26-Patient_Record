import React, { useState, useRef, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { Modal } from '../common/Modal';
import { HealthcareScheme } from '../../types';
import jsQR from 'jsqr';
import { 
  Landmark, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  Building2, 
  Clock, 
  Plus, 
  ShieldAlert, 
  Camera, 
  Siren, 
  KeyRound, 
  Check, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  Lock,
  Phone,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { clsx } from 'clsx';

export const GovernmentPortal: React.FC = () => {
  const { 
    currentUser, 
    schemes, 
    accessLogs, 
    createScheme, 
    verifyPoliceAccess, 
    showToast 
  } = usePatient();

  const [activeSubTab, setActiveSubTab] = useState<'schemes' | 'police' | 'cases' | 'audit'>('schemes');

  // Scheme Creation State
  const [isCreateSchemeModalOpen, setIsCreateSchemeModalOpen] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [schemeCode, setSchemeCode] = useState('');
  const [ministry, setMinistry] = useState('Ministry of Health and Family Welfare (MoHFW)');
  const [coverageAmount, setCoverageAmount] = useState('₹5,00,000 / Year');
  const [schemeDesc, setSchemeDesc] = useState('');
  const [targetConditions, setTargetConditions] = useState('Cancer, Fracture, Trauma, Orthopedic, BPL');
  const [requiredDocs, setRequiredDocs] = useState('Aadhaar Card, ABHA Health ID, Hospital Diagnosis');
  const [benefits, setBenefits] = useState('100% Cashless Inpatient Hospitalization, Subsidized Diagnostic Scans');

  // Police / Medico-Legal State
  const [officerName, setOfficerName] = useState('Inspector Vikram Singh');
  const [badgeNumber, setBadgeNumber] = useState('POL-RJ-4902');
  const [policeStation, setPoliceStation] = useState('Jaipur Central Thana');
  const [firNumber, setFirNumber] = useState('FIR-2026-8812 / GD-44');
  const [policePurpose, setPolicePurpose] = useState('Emergency Road Accident Triage & Next-of-Kin Identification');
  const [policeTokenInput, setPoliceTokenInput] = useState('AURA-SEC-1474-TOK');
  const [policeUnlockedData, setPoliceUnlockedData] = useState<any | null>(null);

  // Police Camera Scanner State
  const [isPoliceScannerOpen, setIsPoliceScannerOpen] = useState(false);
  const [policeCameraStream, setPoliceCameraStream] = useState<MediaStream | null>(null);
  const [policeCameraError, setPoliceCameraError] = useState<string | null>(null);
  const [policeScanSuccess, setPoliceScanSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Case Clearance Search State
  const [caseRefInput, setCaseRefInput] = useState('PMJAY-DEL-2026-9021');
  const [isCaseVerified, setIsCaseVerified] = useState(true);

  // Handle New Scheme Creation
  const handlePublishScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName.trim() || !schemeCode.trim()) return;

    createScheme({
      name: schemeName,
      shortCode: schemeCode.toUpperCase(),
      ministry,
      coverageAmount,
      description: schemeDesc,
      applicableConditions: targetConditions.split(',').map(s => s.trim()),
      requiredDocuments: requiredDocs.split(',').map(s => s.trim()),
      benefits: benefits.split(',').map(s => s.trim()),
      applicationDeadline: 'Open Year-Round'
    });

    setIsCreateSchemeModalOpen(false);
    setSchemeName('');
    setSchemeCode('');
    setSchemeDesc('');
  };

  // Handle Police Verification Token Unlock
  const handlePoliceVerify = (e?: React.FormEvent, rawToken?: string) => {
    if (e) e.preventDefault();
    const token = (rawToken || policeTokenInput).trim();
    if (!token) return;

    const result = verifyPoliceAccess(token, {
      officerName,
      badgeNumber,
      stationName: policeStation,
      firNumber,
      purpose: policePurpose
    });

    setPoliceUnlockedData(result);
  };

  // Continuous Camera QR frame scanner for Police Tab
  useEffect(() => {
    if (!isPoliceScannerOpen || !policeCameraStream) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let isSubscribed = true;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = () => {
      if (!isSubscribed || !videoRef.current) {
        if (isSubscribed) animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const video = videoRef.current;
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });

            if (code && code.data && code.data.trim().length > 0) {
              setPoliceScanSuccess(true);
              if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);

              setTimeout(() => {
                stopPoliceCamera();
                setPoliceScanSuccess(false);
                handlePoliceVerify(undefined, code.data);
              }, 400);
              return;
            }
          }
        } catch (err) {
          console.debug('Police scan error:', err);
        }
      }

      if (isSubscribed) animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPoliceScannerOpen, policeCameraStream]);

  const startPoliceCamera = async () => {
    setPoliceCameraError(null);
    setPoliceScanSuccess(false);
    setIsPoliceScannerOpen(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        setPoliceCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } else {
        setPoliceCameraError('Camera not supported. Please enter the token or ABHA ID manually.');
      }
    } catch (err) {
      setPoliceCameraError('Camera permission denied. Enter token or ABHA manually.');
    }
  };

  const stopPoliceCamera = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (policeCameraStream) {
      policeCameraStream.getTracks().forEach(t => t.stop());
      setPoliceCameraStream(null);
    }
    setIsPoliceScannerOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Official Authority Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0d111a] border border-brand-amber/30 shadow-glow-amber">
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
              {currentUser?.department || 'National Health Authority (NHA) & Statutory Verification Portal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateSchemeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:brightness-110 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Scheme</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto text-xs">
        {[
          { id: 'schemes', label: `Schemes Management (${schemes.length})`, icon: Landmark },
          { id: 'police', label: 'Law Enforcement / Police & MLC Verification', icon: Siren, highlight: true },
          { id: 'cases', label: 'Case Authorization Search', icon: ShieldCheck },
          { id: 'audit', label: `Statutory Audit Register (${accessLogs.length})`, icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap border",
                isActive
                  ? tab.highlight 
                    ? "bg-brand-rose/20 text-brand-rose border-brand-rose/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]" 
                    : "bg-brand-amber/20 text-brand-amber border-brand-amber/50 shadow-glow-amber"
                  : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCHEMES MANAGEMENT (Only Government Officials Can Create) */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Central & State Healthcare Schemes Registry</h3>
              <p className="text-xs text-slate-400">Only authorized government administrators can author and publish national health schemes.</p>
            </div>
            <button
              onClick={() => setIsCreateSchemeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-amber/20 hover:bg-brand-amber/30 border border-brand-amber/40 text-brand-amber font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Author Scheme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map(scheme => (
              <GlassPanel key={scheme.id} variant="base" className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber border border-brand-amber/40">
                      {scheme.shortCode}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 font-bold">
                      Published & Live
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">{scheme.coverageAmount}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{scheme.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{scheme.description}</p>

                {/* Target Conditions Chips */}
                {scheme.applicableConditions && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    <span className="text-[10px] font-mono text-slate-500 mr-1">Eligibility:</span>
                    {scheme.applicableConditions.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/5 text-brand-amber font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>{scheme.ministry}</span>
                  <span className="text-brand-emerald font-mono font-bold">Cashless ABHA Sync ✓</span>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: POLICE & MEDICO-LEGAL EMERGENCY VERIFICATION */}
      {activeSubTab === 'police' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0d111a] to-black border border-brand-rose/40 shadow-[0_0_25px_rgba(244,63,94,0.15)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-rose/20 border border-brand-rose/40 flex items-center justify-center text-brand-rose">
                  <Siren className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Law Enforcement & Medico-Legal Case (MLC) Registry</h3>
                  <p className="text-xs text-slate-400">Scan patient Emergency QR token or enter ABHA ID for road accident victim identification and triage.</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-brand-rose/20 text-brand-rose border border-brand-rose/40 self-start sm:self-auto">
                STATUTORY EMERGENCY ACCESS
              </span>
            </div>

            {/* Officer Duty Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Investigating Officer</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Badge / Duty No.</label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-brand-rose font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Police Station & FIR / GD Ref</label>
                <input
                  type="text"
                  value={firNumber}
                  onChange={(e) => setFirNumber(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Scan / Token Trigger */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={startPoliceCamera}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-rose text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:brightness-110 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Patient Emergency QR</span>
              </button>

              <form onSubmit={(e) => handlePoliceVerify(e)} className="flex items-center gap-2 w-full sm:flex-1">
                <input
                  type="text"
                  placeholder="Enter QR Token e.g. AURA-SEC-1474-TOK"
                  value={policeTokenInput}
                  onChange={(e) => setPoliceTokenInput(e.target.value)}
                  className="flex-1 bg-[#131824] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-brand-rose font-mono focus:outline-none focus:border-brand-rose/50 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs whitespace-nowrap"
                >
                  Verify MLC Data
                </button>
              </form>
            </div>
          </div>

          {/* UNLOCKED POLICE / MLC TRIAGE PROFILE */}
          {policeUnlockedData && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-brand-rose/30 flex items-center justify-between text-xs shadow-spatial-sm">
                <div className="flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                  <span className="text-white font-bold">AUTHENTICATED MEDICO-LEGAL PROFILE</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-brand-rose">Statutory Log Recorded</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{new Date().toLocaleTimeString()}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Triage & Next-of-Kin Data */}
                <div className="lg:col-span-6 space-y-4">
                  <GlassPanel variant="base" className="p-5 space-y-3 border-l-4 border-l-brand-rose">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Victim / Patient Identity & Critical Triage
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Full Legal Name:</span>
                        <strong className="text-white text-sm">{policeUnlockedData.patient.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Blood Group:</span>
                        <strong className="text-brand-rose text-base">{policeUnlockedData.triage.bloodGroup}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Age & Gender:</span>
                        <span className="text-slate-200">{policeUnlockedData.patient.age} Yrs / {policeUnlockedData.patient.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ABHA ID:</span>
                        <span className="font-mono text-brand-cyan">{policeUnlockedData.patient.abhaId}</span>
                      </div>
                    </div>

                    {/* Next of Kin Contact */}
                    <div className="p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/30 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-brand-rose font-bold text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Emergency Next-of-Kin Contact</span>
                      </div>
                      <div className="text-xs text-white">
                        {policeUnlockedData.triage.emergencyContact.name} ({policeUnlockedData.triage.emergencyContact.relationship}):{' '}
                        <strong className="text-brand-rose font-mono text-sm underline">
                          {policeUnlockedData.triage.emergencyContact.phone}
                        </strong>
                      </div>
                    </div>

                    {/* Organ Donor Status */}
                    <div className="p-3 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-brand-emerald" />
                        <span className="text-white font-semibold">Organ Donor Registry:</span>
                      </div>
                      <span className="font-bold text-brand-emerald">{policeUnlockedData.triage.organDonor}</span>
                    </div>
                  </GlassPanel>
                </div>

                {/* Right: Trauma & Injury Episodes */}
                <div className="lg:col-span-6 space-y-4">
                  <GlassPanel variant="base" className="p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Documented Trauma, Fractures & Injuries ({policeUnlockedData.triage.activeTraumaEpisodes.length})
                    </h4>

                    {policeUnlockedData.triage.activeTraumaEpisodes.map((ep: any) => (
                      <div key={ep.id} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-brand-cyan">{ep.id} • {ep.date}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-rose/20 text-brand-rose font-bold">
                            {ep.severity} TRAUMA
                          </span>
                        </div>
                        <div className="font-bold text-white">{ep.title}</div>
                        <p className="text-slate-300 text-[11px]">{ep.diagnosis}</p>
                        <div className="text-slate-500 text-[10px] pt-1 border-t border-white/5">
                          Attending Facility: {ep.hospital} • {ep.doctor}
                        </div>
                      </div>
                    ))}
                  </GlassPanel>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CASE AUTHORIZATION SEARCH */}
      {activeSubTab === 'cases' && (
        <div className="space-y-6 animate-fadeIn">
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

              <form onSubmit={(e) => { e.preventDefault(); setIsCaseVerified(true); showToast(`Case verified.`); }} className="flex items-center gap-2 w-full sm:w-auto">
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
        </div>
      )}

      {/* TAB 4: STATUTORY AUDIT REGISTER */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4 animate-fadeIn">
          <GlassPanel variant="base" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Statutory Access Audit Register (Tamper-Evident)</h3>
              <span className="text-xs font-mono text-brand-amber">Real-Time NHA Access Log</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {accessLogs.map(log => (
                <div key={log.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.recipientName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">{log.recipientRole}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] block mt-0.5">Purpose: {log.purpose}</span>
                    <span className="text-slate-500 font-mono text-[10px]">Records: {log.recordsAccessed.join(', ')}</span>
                  </div>
                  <div className="text-right text-slate-500 font-mono text-[11px] shrink-0">
                    <div>{log.timestamp}</div>
                    <div>{log.ipAddress} • {log.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* CREATE SCHEME MODAL (Government Exclusive) */}
      <Modal
        isOpen={isCreateSchemeModalOpen}
        onClose={() => setIsCreateSchemeModalOpen(false)}
        title="Author & Publish New Healthcare Scheme"
        subtitle="Configure eligibility parameters, maximum financial coverage, and required proof."
        maxWidth="xl"
      >
        <form onSubmit={handlePublishScheme} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-mono mb-1">Scheme Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. National Pediatric Oncology & Bone Marrow Mission"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Scheme Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. NPOM-2026"
                value={schemeCode}
                onChange={(e) => setSchemeCode(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-brand-amber font-mono font-bold uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Ministry / Statutory Body</label>
              <input
                type="text"
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Annual Coverage Limit</label>
              <input
                type="text"
                value={coverageAmount}
                onChange={(e) => setCoverageAmount(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-brand-amber font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Scheme Description *</label>
            <textarea
              rows={2}
              required
              placeholder="Detailed description of financial aid, empaneled hospital network, and benefits..."
              value={schemeDesc}
              onChange={(e) => setSchemeDesc(e.target.value)}
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Eligible Clinical Conditions (comma separated)</label>
            <input
              type="text"
              value={targetConditions}
              onChange={(e) => setTargetConditions(e.target.value)}
              placeholder="e.g. Cancer, Orthopedic, Fracture, Trauma, Cardiac, BPL"
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Required Documents</label>
              <input
                type="text"
                value={requiredDocs}
                onChange={(e) => setRequiredDocs(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Primary Scheme Benefits</label>
              <input
                type="text"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateSchemeModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:brightness-110"
            >
              Publish Scheme to National Registry
            </button>
          </div>
        </form>
      </Modal>

      {/* POLICE CAMERA SCANNER MODAL */}
      <Modal
        isOpen={isPoliceScannerOpen}
        onClose={stopPoliceCamera}
        title="Police Medico-Legal QR Scanner"
        subtitle="Point camera at victim's emergency health token."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="relative w-full h-72 rounded-2xl bg-black border-2 border-brand-rose/50 overflow-hidden flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-52 h-52 border-2 ${policeScanSuccess ? 'border-brand-emerald bg-brand-emerald/20' : 'border-dashed border-brand-rose'} rounded-2xl flex items-center justify-center`}>
                {!policeScanSuccess ? (
                  <span className="text-[10px] font-mono text-brand-rose font-bold bg-black/70 px-2 py-1 rounded border border-brand-rose/40">
                    ALIGN EMERGENCY QR
                  </span>
                ) : (
                  <span className="text-xs font-mono text-brand-emerald font-bold bg-black/80 px-3 py-1.5 rounded border border-brand-emerald">
                    MLC PROFILE UNLOCKED!
                  </span>
                )}
              </div>
            </div>
            {policeCameraError && (
              <div className="absolute inset-0 bg-black/80 p-6 flex flex-col items-center justify-center text-center text-slate-300">
                <AlertTriangle className="w-8 h-8 text-brand-rose mb-2" />
                <p>{policeCameraError}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Can't scan? Use instant token:</span>
            <button
              type="button"
              onClick={() => {
                stopPoliceCamera();
                handlePoliceVerify(undefined, 'AURA-SEC-1474-TOK');
              }}
              className="px-3 py-1.5 rounded-lg bg-brand-rose/20 text-brand-rose border border-brand-rose/40 font-mono font-bold"
            >
              Load Victim Token AURA-SEC-1474
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
