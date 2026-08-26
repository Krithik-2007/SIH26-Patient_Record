import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { 
  Activity, 
  Upload, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Building2,
  Stethoscope,
  Calendar,
  X,
  Image as ImageIcon
} from 'lucide-react';

export const CreateIncidentModal: React.FC = () => {
  const { isCreateIncidentOpen, setIsCreateIncidentOpen, createIncident } = usePatient();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<string>('Orthopedic / Fracture');
  const [patientNarrative, setPatientNarrative] = useState('');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [severity, setSeverity] = useState<'ROUTINE' | 'MILD' | 'MODERATE' | 'CRITICAL'>('MODERATE');
  
  // Multi-file upload state
  const [attachedFiles, setAttachedFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const categories = [
    'Orthopedic / Fracture',
    'Fever & Infection',
    'Surgical Episode',
    'Respiratory & Allergy',
    'Gastrointestinal',
    'Routine Outpatient Follow-up'
  ];

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);

      // Auto-extract keywords from filenames
      newFiles.forEach(({ file }) => {
        const lower = file.name.toLowerCase();
        if (lower.includes('fortis')) setHospital('Fortis Orthopedic & Trauma Center');
        if (lower.includes('ananya') || lower.includes('iyer')) setDoctor('Dr. Ananya Iyer, MS Ortho');
        if (lower.includes('fracture') || lower.includes('xray') || lower.includes('arm')) {
          setDiagnosis('Right Distal Radius Hairline Fracture');
        }
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientNarrative.trim()) return;

    const rawFiles = attachedFiles.map(a => a.file);

    await createIncident(
      {
        title: `${category} Episode`,
        hospital: hospital || 'Consulting Clinic',
        doctor: doctor || 'Attending Physician',
        department: 'Clinical Care',
        reason: patientNarrative,
        patientDescription: patientNarrative,
        diagnosis: diagnosis || `Clinical assessment for ${category.toLowerCase()}`,
        treatment: 'Prescribed medication, immobilization and outpatient rest protocol',
        severity
      },
      rawFiles
    );

    // Reset form
    setStep(1);
    setCategory('Orthopedic / Fracture');
    setPatientNarrative('');
    setHospital('');
    setDoctor('');
    setDiagnosis('');
    setAttachedFiles([]);
    setIsCreateIncidentOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateIncidentOpen}
      onClose={() => setIsCreateIncidentOpen(false)}
      title="Register New Medical Incident"
      subtitle="Log your healthcare episode and upload multiple medical documents/photos."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step Progression Indicators */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
            step === 1 ? 'bg-brand-teal text-slate-950 shadow-glow-teal' : 'bg-white/5 text-slate-400'
          }`}>
            <span>1</span>
            <span>What Happened?</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
            step === 2 ? 'bg-brand-teal text-slate-950 shadow-glow-teal' : 'bg-white/5 text-slate-400'
          }`}>
            <span>2</span>
            <span>Upload Multiple Documents & Confirm</span>
          </div>
        </div>

        {/* STEP 1: WHAT HAPPENED? */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Episode Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      category === cat
                        ? 'bg-brand-teal/20 text-brand-cyan border-brand-teal/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                        : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Narrative */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Describe What Happened In Your Own Words *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Example: Fell from bike onto right outstretched arm. Sharp wrist pain, severe swelling, cannot move fingers without pain..."
                value={patientNarrative}
                onChange={(e) => setPatientNarrative(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal/50"
              />
            </div>

            {/* Severity Tag */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Severity
              </label>
              <div className="flex items-center gap-2">
                {(['ROUTINE', 'MILD', 'MODERATE', 'CRITICAL'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      severity === sev
                        ? 'bg-brand-teal/20 text-brand-cyan border-brand-teal/50'
                        : 'bg-white/[0.02] text-slate-400 border-white/[0.06]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                disabled={!patientNarrative.trim()}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-teal"
              >
                <span>Continue to Upload Photos & Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MULTI-FILE UPLOAD & CONFIRM */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Multi-File Upload Dropzone */}
            <div className="border-2 border-dashed border-white/15 hover:border-brand-teal/50 rounded-2xl p-6 text-center bg-black/20 transition-all relative">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-cyan shadow-glow-teal">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  Select or drag & drop multiple photos/X-rays/prescriptions
                </div>
                <p className="text-[11px] text-slate-400">
                  Select multiple files simultaneously • Instant client-side preview
                </p>
              </div>
            </div>

            {/* Attached Files List / Thumbnails */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">
                  Attached Documents ({attachedFiles.length}):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {attachedFiles.map((item, idx) => (
                    <div key={idx} className="relative rounded-xl bg-[#131824] border border-white/10 p-2 text-xs flex items-center gap-2 overflow-hidden">
                      {item.preview ? (
                        <img src={item.preview} alt="Preview" className="w-10 h-10 rounded object-cover shrink-0 bg-black" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-black/40 flex items-center justify-center shrink-0 text-brand-cyan">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 pr-4">
                        <div className="text-white font-semibold truncate text-[11px]">{item.file.name}</div>
                        <div className="text-slate-500 text-[10px] font-mono">{(item.file.size / (1024 * 1024)).toFixed(1)} MB</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/10 hover:bg-brand-rose text-white flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hospital, Doctor & Diagnosis Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Fortis Orthopedic & Trauma Center"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Attending Doctor</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ananya Iyer"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Doctor's Diagnosis</label>
              <input
                type="text"
                placeholder="e.g. Non-displaced right distal radius fracture"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white font-medium"
              >
                ← Back to description
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-teal hover:brightness-110"
              >
                Confirm & Add Incident to Timeline
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
