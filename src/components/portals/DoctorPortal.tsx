import React, { useState, useRef, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
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
  Zap
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { 
    currentUser, 
    patient, 
    incidents, 
    documents, 
    medicines, 
    doctorSuggestions,
    donations,
    addDoctorSuggestion,
    verifyPatientCampaign,
    setSelectedIncidentId,
    showToast
  } = usePatient();

  const [tokenInput, setTokenInput] = useState('');
  const [isHandshakeVerified, setIsHandshakeVerified] = useState(true);
  const [selectedIncidentForAdvice, setSelectedIncidentForAdvice] = useState<string>(incidents[0]?.id || 'INC-001');
  const [suggestionText, setSuggestionText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Live Camera Scanner State
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const pendingCampaigns = donations.filter(d => !d.verifiedByDoctor);

  const handleVerifyToken = (e?: React.FormEvent, directToken?: string) => {
    if (e) e.preventDefault();
    const token = directToken || tokenInput;
    if (!token.trim()) return;

    setTokenInput(token);
    setIsHandshakeVerified(true);
    showToast(`✅ Patient QR Handshake Verified: ${token}. Record unlocked!`, 'success');
  };

  // Real-time Barcode / QR Code Scanner Loop
  useEffect(() => {
    if (!isCameraScannerOpen || !cameraStream) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let isSubscribed = true;

    // Check for native BarcodeDetector API (Android Chrome, iOS 17+, modern browsers)
    const scanFrame = async () => {
      if (!isSubscribed || !videoRef.current || videoRef.current.readyState < 2) {
        if (isSubscribed) animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      if ('BarcodeDetector' in window) {
        try {
          // @ts-ignore
          const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await barcodeDetector.detect(videoRef.current);

          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            console.log('QR Code detected:', rawValue);

            // Extract token from URL or direct string
            let extractedToken = rawValue;
            if (rawValue.includes('token=')) {
              const match = rawValue.match(/token=([^&]+)/);
              if (match) extractedToken = match[1];
            }

            // Haptic vibration feedback if supported
            if ('vibrate' in navigator) navigator.vibrate(100);

            stopCamera();
            handleVerifyToken(undefined, extractedToken);
            return;
          }
        } catch (err) {
          console.debug('Barcode detection frame error:', err);
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
    setIsCameraScannerOpen(true);
    setIsScanningActive(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
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
      setCameraError('Camera access was not granted. You can type the token code or click a test scan below.');
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

  const handleSimulateScan = (scannedToken: string) => {
    stopCamera();
    handleVerifyToken(undefined, scannedToken);
  };

  const handleAddAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    addDoctorSuggestion({
      incidentId: selectedIncidentForAdvice,
      doctorName: currentUser?.name || 'Dr. Ram, MS Ortho',
      specialty: currentUser?.specialty || 'Orthopedic & Trauma Surgery',
      hospital: currentUser?.hospitalAffiliation || 'SMS Hospital & Medical College, Jaipur',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      suggestion: suggestionText,
      followUpDate: followUpDate || 'In 2 weeks with repeat AP/Lateral X-ray',
      priority: 'HIGH'
    });

    setSuggestionText('');
    setFollowUpDate('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Doctor Header */}
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
              {currentUser?.specialty || 'Orthopedic Surgery'} • {currentUser?.hospitalAffiliation || 'SMS Hospital & Medical College, Jaipur'}
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
              <span>Scan Patient QR or Enter Temporary Token</span>
            </h3>
            <p className="text-xs text-slate-400">
              Point your camera at the patient's screen or enter their 10-minute temporary token code.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={startCamera}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-brand-emerald/20 hover:bg-brand-emerald/30 border border-brand-emerald/40 text-brand-emerald font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-brand-emerald" />
              <span>Camera Scan</span>
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
                Verify Token
              </button>
            </form>
          </div>
        </div>
      </GlassPanel>

      {/* Patient Record Inspection Workspace */}
      {isHandshakeVerified && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Patient Identity Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs shadow-spatial-sm">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">{patient.name}</span>
              <span className="text-slate-400">({patient.age}y / {patient.gender} / Blood: <strong className="text-brand-rose">{patient.bloodGroup}</strong>)</span>
              <span className="font-mono text-brand-cyan">ABHA: {patient.abhaId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 text-[10px] font-bold">
                Access Granted: FULL_HISTORY
              </span>
            </div>
          </div>

          {/* Incidents & Suggestions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Patient Episodes & Files */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Permitted Medical Incidents ({incidents.length})
                </h3>
              </div>

              {incidents.map(inc => (
                <GlassPanel
                  key={inc.id}
                  variant="base"
                  className="p-5 space-y-3 cursor-pointer hover:border-brand-emerald/40 transition-all shadow-spatial-sm"
                  onClick={() => setSelectedIncidentId(inc.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-cyan">{inc.id} • {inc.date}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${inc.status === 'ACTIVE' ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-slate-800 text-slate-400'}`}>
                      {inc.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{inc.patientDescription || inc.reason}"
                  </p>
                  <div className="text-xs text-brand-emerald font-semibold">
                    Diagnosis: {inc.diagnosis}
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{inc.hospital} • {inc.doctor}</span>
                    <span className="text-brand-cyan underline font-medium">Click to inspect full drawer →</span>
                  </div>
                </GlassPanel>
              ))}

              {incidents.length === 0 && (
                <div className="p-8 text-center rounded-2xl bg-[#090d16] border border-white/10 text-slate-400 text-xs">
                  No recorded incidents in patient profile yet.
                </div>
              )}
            </div>

            {/* Right: Record Clinical Suggestion / Prescription */}
            <div className="lg:col-span-5 space-y-4">
              <GlassPanel variant="glow-emerald" className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-emerald" />
                  <span>Add Doctor Suggestion / Directives</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Record official clinical directives attached directly to the patient's episode.
                </p>

                <form onSubmit={handleAddAdvice} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Attach to Incident</label>
                    <select
                      value={selectedIncidentForAdvice}
                      onChange={(e) => setSelectedIncidentForAdvice(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {incidents.map(inc => (
                        <option key={inc.id} value={inc.id}>{inc.id} - {inc.title.substring(0, 25)}</option>
                      ))}
                      {incidents.length === 0 && <option value="INC-001">INC-001 - Current Episode</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Clinical Suggestion / Instructions *</label>
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
                    Record & Sign Clinical Suggestion
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
              <div className="w-48 h-48 border-2 border-dashed border-brand-cyan/80 rounded-2xl relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-emerald to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce" />
                <span className="text-[10px] font-mono text-brand-cyan font-bold bg-black/70 px-2.5 py-1 rounded-full border border-brand-cyan/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-brand-emerald animate-pulse" />
                  <span>ALIGN QR CODE</span>
                </span>
              </div>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-black/80 p-6 flex flex-col items-center justify-center text-center space-y-2 text-slate-300">
                <Camera className="w-8 h-8 text-brand-amber" />
                <p className="text-xs">{cameraError}</p>
              </div>
            )}
          </div>

          {/* Quick Simulation Trigger */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-mono text-slate-400">Or tap to instantly test with a patient token:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateScan('AURA-SEC-1474-TOK')}
                className="p-2.5 rounded-xl bg-brand-emerald/15 hover:bg-brand-emerald/25 border border-brand-emerald/40 text-brand-emerald font-mono font-bold text-center"
              >
                Token AURA-SEC-1474
              </button>
              <button
                type="button"
                onClick={() => handleSimulateScan('AURA-SEC-9102-TOK')}
                className="p-2.5 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/40 text-brand-cyan font-mono font-bold text-center"
              >
                Token AURA-SEC-9102
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
