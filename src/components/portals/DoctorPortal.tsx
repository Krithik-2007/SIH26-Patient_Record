import React, { useState, useRef, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import jsQR from 'jsqr';
import { 
  Stethoscope, 
  QrCode, 
  Camera, 
  KeyRound, 
  ShieldCheck, 
  Search, 
  FileText, 
  Pill, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  HeartHandshake, 
  Upload, 
  X, 
  Sparkles, 
  Zap, 
  Check, 
  UserCheck,
  Lock,
  ArrowRight
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { 
    currentUser, 
    patient: fallbackPatient, 
    incidents: fallbackIncidents, 
    medicines: fallbackMedicines, 
    donations,
    addDoctorSuggestion,
    verifyPatientCampaign,
    setSelectedIncidentId,
    showToast
  } = usePatient();

  const [tokenInput, setTokenInput] = useState('');
  const [isHandshakeVerified, setIsHandshakeVerified] = useState(false);
  const [selectedIncidentForAdvice, setSelectedIncidentForAdvice] = useState<string>('');
  const [suggestionText, setSuggestionText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Scanned / Loaded Patient Data State
  const [scannedPatient, setScannedPatient] = useState<{
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    abhaId: string;
    phone?: string;
  } | null>(null);

  const [scannedIncidents, setScannedIncidents] = useState<any[]>([]);
  const [scannedMedicines, setScannedMedicines] = useState<any[]>([]);

  // Live Camera Scanner State
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const pendingCampaigns = donations.filter(d => !d.verifiedByDoctor);

  // Unpack and Verify Token / Scanned Payload
  const handleVerifyToken = (e?: React.FormEvent, rawScannedText?: string) => {
    if (e) e.preventDefault();
    const input = rawScannedText || tokenInput;
    if (!input.trim()) return;

    let token = input.trim();

    // Check if raw payload has encoded data bundle (data=...)
    if (input.includes('data=')) {
      try {
        const match = input.match(/data=([^&]+)/);
        if (match) {
          const base64Str = decodeURIComponent(match[1]);
          const decodedJson = decodeURIComponent(escape(atob(base64Str)));
          const payload = JSON.parse(decodedJson);

          if (payload.token) token = payload.token;
          if (payload.patient) setScannedPatient(payload.patient);
          if (payload.incidents && payload.incidents.length > 0) {
            setScannedIncidents(payload.incidents);
            setSelectedIncidentForAdvice(payload.incidents[0].id);
          } else {
            setScannedIncidents([]);
          }
          if (payload.medicines) setScannedMedicines(payload.medicines);

          setTokenInput(token);
          setIsHandshakeVerified(true);
          showToast(`✅ Scanned Patient EMR Package: ${payload.patient?.name || 'Patient'} (${payload.incidents?.length || 0} episodes unlocked)`, 'success');
          return;
        }
      } catch (err) {
        console.error('Failed to unpack QR data payload:', err);
      }
    }

    // Token direct match fallback
    setTokenInput(token);
    setScannedPatient({
      name: fallbackPatient.name || 'Krithik',
      age: fallbackPatient.age || 26,
      gender: fallbackPatient.gender || 'Male',
      bloodGroup: fallbackPatient.bloodGroup || 'O+',
      abhaId: fallbackPatient.abhaId || '91-4920-8193-4412'
    });
    setScannedIncidents(fallbackIncidents.length > 0 ? fallbackIncidents : [
      {
        id: 'INC-001',
        year: 2026,
        date: '26 Aug 2026',
        title: 'Right Distal Radius Bone Fracture',
        hospital: 'SMS Hospital & Medical College, Jaipur',
        doctor: 'Dr. Ram, MS Ortho',
        diagnosis: 'Right Forearm Distal Radius Fracture from fall',
        treatment: 'Closed reduction, fiberglass casting for 4 weeks, analgesics, and rest protocol',
        patientDescription: 'Broke right arm after slip and fall.',
        status: 'ACTIVE',
        severity: 'MODERATE'
      }
    ]);
    if (fallbackIncidents.length > 0) {
      setSelectedIncidentForAdvice(fallbackIncidents[0].id);
    } else {
      setSelectedIncidentForAdvice('INC-001');
    }
    setScannedMedicines(fallbackMedicines);
    setIsHandshakeVerified(true);
    showToast(`✅ Patient Handshake Authenticated: ${token}. Records unlocked!`, 'success');
  };

  // High-performance continuous QR frame decoding with jsQR
  useEffect(() => {
    if (!isCameraScannerOpen || !cameraStream) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let isSubscribed = true;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = async () => {
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
              console.log('✅ QR Code decoded by jsQR:', code.data);

              setScannedSuccess(true);
              if ('vibrate' in navigator) navigator.vibrate([80, 50, 80]);

              setTimeout(() => {
                stopCamera();
                setScannedSuccess(false);
                handleVerifyToken(undefined, code.data);
              }, 400);
              return;
            }
          }
        } catch (err) {
          console.debug('Scan frame error:', err);
        }
      }

      if (isSubscribed) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isCameraScannerOpen, cameraStream]);

  // Start Camera Feed
  const startCamera = async () => {
    setCameraError(null);
    setScannedSuccess(false);
    setIsCameraScannerOpen(true);
    setIsScanningActive(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Camera access is not supported by your browser. Please enter the token manually.');
      }
    } catch (err) {
      console.warn('Camera permission or device error:', err);
      setCameraError('Camera access was not granted. You can type the token code or tap an instant test token below.');
    }
  };

  // Stop Camera Feed
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsScanningActive(false);
    setIsCameraScannerOpen(false);
  };

  const handleAddAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    addDoctorSuggestion({
      incidentId: selectedIncidentForAdvice,
      doctorName: currentUser?.name || 'Attending Physician',
      specialty: currentUser?.specialty || 'General Practitioner',
      hospital: currentUser?.hospitalAffiliation || 'Hospital Practice',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      suggestion: suggestionText,
      followUpDate: followUpDate || 'In 2 weeks with repeat review',
      priority: 'HIGH'
    });

    setSuggestionText('');
    setFollowUpDate('');
    showToast('Signed clinical directives attached to patient incident ✓', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Doctor Header - Strictly renders Logged in Doctor's credentials */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-brand-emerald/40 shadow-glow-emerald">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentUser?.name || 'Dr. Ram, MS Ortho'}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-bold">
                {currentUser?.doctorRegNo || 'MCI-2014-9812'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser?.specialty || 'Orthopedic & Trauma Surgery'} • {currentUser?.hospitalAffiliation || 'SMS Hospital & Medical College, Jaipur'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>Open Camera QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Pending Medical Aid Box Verifications */}
      {pendingCampaigns.length > 0 && (
        <GlassPanel variant="glow-emerald" className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-brand-rose" />
              <span>Pending Patient Crowdfunding Verifications ({pendingCampaigns.length})</span>
            </h3>
            <span className="text-xs text-brand-amber font-mono font-bold">Requires Doctor Verification</span>
          </div>

          <div className="space-y-3">
            {pendingCampaigns.map(camp => (
              <div key={camp.id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{camp.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">{camp.campaignCode}</span>
                  </div>
                  <p className="text-slate-300">Patient: <strong>{camp.patientName}</strong> • Condition: {camp.condition}</p>
                  <p className="text-slate-400 text-[11px]">Requested Target: ₹{camp.goalAmount.toLocaleString('en-IN')}</p>
                </div>

                <button
                  onClick={() => verifyPatientCampaign(camp.id)}
                  className="px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-emerald self-end sm:self-auto flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticate & Publish Campaign</span>
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Patient Token Verification Panel */}
      <GlassPanel variant="base" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-cyan" />
              <span>Scan Patient QR Code or Enter Token</span>
            </h3>
            <p className="text-xs text-slate-400">
              Point camera at the patient's screen to load permitted longitudinal episodes.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={startCamera}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-brand-emerald/20 hover:bg-brand-emerald/30 border border-brand-emerald/40 text-brand-emerald font-bold text-xs transition-colors flex items-center gap-1.5 shadow-glow-emerald"
            >
              <Camera className="w-4 h-4 text-brand-emerald" />
              <span>Launch Camera Scanner</span>
            </button>

            <form onSubmit={handleVerifyToken} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. AURA-SEC-1474-TOK"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="bg-[#0f1524] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-brand-cyan font-mono focus:outline-none focus:border-brand-emerald/50 uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-emerald whitespace-nowrap"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </GlassPanel>

      {/* STANDBY STATE: When no patient QR has been scanned yet */}
      {!isHandshakeVerified && (
        <div className="p-12 text-center rounded-3xl bg-[#090d16]/80 border border-white/[0.08] shadow-spatial-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto shadow-glow-cyan">
            <Lock className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">
              Patient Medical Records Protected
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No patient data is unlocked yet. Point your camera at a patient's temporary QR code or enter their access token above to inspect their permitted medical history.
            </p>
          </div>
          <button
            onClick={startCamera}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-teal hover:brightness-110"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Patient QR Code Now</span>
          </button>
        </div>
      )}

      {/* Patient Record Inspection Workspace (Unlocked after QR Scan) */}
      {isHandshakeVerified && scannedPatient && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Patient Identity Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-brand-emerald/30 text-xs shadow-spatial-sm">
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-brand-emerald" />
              <span className="font-bold text-white text-sm">{scannedPatient.name}</span>
              <span className="text-slate-400">({scannedPatient.age}y / {scannedPatient.gender} / Blood: <strong className="text-brand-rose">{scannedPatient.bloodGroup}</strong>)</span>
              <span className="font-mono text-brand-cyan">ABHA: {scannedPatient.abhaId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 text-[10px] font-bold">
                Access Granted: FULL_EMR
              </span>
            </div>
          </div>

          {/* Incidents & Suggestions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Patient Episodes & Clinical Trajectory */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Permitted Medical Incidents ({scannedIncidents.length})
                </h3>
              </div>

              {scannedIncidents.map(inc => (
                <GlassPanel
                  key={inc.id}
                  variant="base"
                  className="p-5 space-y-3 cursor-pointer hover:border-brand-emerald/40 transition-all shadow-spatial-sm"
                  onClick={() => setSelectedIncidentId(inc.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-cyan">{inc.id} • {inc.date || `${inc.year}`}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${inc.status === 'ACTIVE' ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-slate-800 text-slate-400'}`}>
                      {inc.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{inc.patientDescription || inc.reason}"
                  </p>
                  
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-xs text-brand-emerald font-semibold">
                      Diagnosis: {inc.diagnosis}
                    </div>
                    {inc.treatment && (
                      <div className="text-[11px] text-slate-300">
                        Protocol: {inc.treatment}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{inc.hospital} • {inc.doctor}</span>
                    <span className="text-brand-cyan underline font-medium">Inspect Incident Drawer →</span>
                  </div>
                </GlassPanel>
              ))}

              {scannedIncidents.length === 0 && (
                <div className="p-8 text-center rounded-2xl bg-[#090d16] border border-white/10 text-slate-400 text-xs">
                  No recorded incidents found for this patient token.
                </div>
              )}
            </div>

            {/* Right: Record Clinical Suggestion / Directives */}
            <div className="lg:col-span-5 space-y-4">
              <GlassPanel variant="glow-emerald" className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-emerald" />
                  <span>Add Doctor Directives / Advice</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Record official clinical directives signed by {currentUser?.name || 'Attending Physician'}.
                </p>

                <form onSubmit={handleAddAdvice} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Attach to Incident</label>
                    <select
                      value={selectedIncidentForAdvice}
                      onChange={(e) => setSelectedIncidentForAdvice(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {scannedIncidents.map(inc => (
                        <option key={inc.id} value={inc.id}>{inc.id} - {inc.title.substring(0, 25)}</option>
                      ))}
                      {scannedIncidents.length === 0 && <option value="INC-001">INC-001 - Current Episode</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Clinical Directive / Instructions *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g. Strict immobilization in forearm cast for 4 weeks. Elevate arm. Avoid running and heavy lifting until bone union on follow-up X-ray."
                      value={suggestionText}
                      onChange={(e) => setSuggestionText(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-emerald/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Follow-up Review Date</label>
                    <input
                      type="text"
                      placeholder="e.g. In 2 weeks with repeat AP/Lateral X-ray"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-emerald"
                  >
                    Sign & Attach Clinical Directive
                  </button>
                </form>
              </GlassPanel>
            </div>
          </div>
        </div>
      )}

      {/* LIVE CAMERA QR CODE SCANNER MODAL */}
      <Modal
        isOpen={isCameraScannerOpen}
        onClose={stopCamera}
        title="Live Camera QR Code Scanner"
        subtitle="Point your camera at the patient's AURA Health QR code to auto-decode."
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          
          {/* Camera Viewfinder Box with Scanning Reticle */}
          <div className="relative w-full h-72 rounded-2xl bg-black border-2 border-brand-emerald/40 overflow-hidden flex items-center justify-center">
            
            {/* Live Video Feed Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Holographic Scanning Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-52 h-52 border-2 ${scannedSuccess ? 'border-brand-emerald bg-brand-emerald/20' : 'border-dashed border-brand-cyan/80'} rounded-2xl relative flex items-center justify-center transition-all duration-300`}>
                {!scannedSuccess ? (
                  <>
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-emerald to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce" />
                    <span className="text-[10px] font-mono text-brand-cyan font-bold bg-black/70 px-2.5 py-1 rounded-full border border-brand-cyan/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-brand-emerald animate-pulse" />
                      <span>ALIGN QR CODE</span>
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-mono text-brand-emerald font-bold bg-black/80 px-3 py-1.5 rounded-full border border-brand-emerald flex items-center gap-1.5 shadow-glow-emerald">
                    <Check className="w-4 h-4 text-brand-emerald stroke-[3]" />
                    <span>PATIENT RECORD LOADED!</span>
                  </span>
                )}
              </div>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-black/80 p-6 flex flex-col items-center justify-center text-center space-y-2 text-slate-300">
                <Camera className="w-8 h-8 text-brand-amber" />
                <p className="text-xs">{cameraError}</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
