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
  GitBranch,
  Layers,
  Sparkle
} from 'lucide-react';
import { clsx } from 'clsx';

export const CreateIncidentModal: React.FC = () => {
  const { 
    isCreateIncidentOpen, 
    setIsCreateIncidentOpen, 
    createIncident, 
    branchIncident, 
    incidents 
  } = usePatient();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isBranchOfExisting, setIsBranchOfExisting] = useState(false);
  const [parentIncidentId, setParentIncidentId] = useState(incidents[0]?.id || '');
  const [stageOrCycle, setStageOrCycle] = useState('');
  const [category, setCategory] = useState<string>('Orthopedic / Fracture');
  const [patientNarrative, setPatientNarrative] = useState('');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [severity, setSeverity] = useState<'ROUTINE' | 'MILD' | 'MODERATE' | 'CRITICAL'>('MODERATE');
  
  // Multi-file upload state
  const [attachedFiles, setAttachedFiles] = useState<{ file: File; preview: string }[]>([]);

  const categories = [
    'Orthopedic / Fracture',
    'Oncology / Cancer Care',
    'Fever & Infection',
    'Surgical Episode',
    'Respiratory & Allergy',
    'Chronic Illness Management'
  ];

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientNarrative.trim()) return;

    const rawFiles = attachedFiles.map(a => a.file);

    if (isBranchOfExisting && parentIncidentId) {
      await branchIncident(
        parentIncidentId,
        {
          title: `${category} — ${stageOrCycle || 'Follow-up Sub-Episode'}`,
          stageOrCycle: stageOrCycle || 'Follow-up Phase',
          hospital: hospital || 'Specialty Care Center',
          doctor: doctor || 'Attending Physician',
          department: category,
          reason: patientNarrative,
          patientDescription: patientNarrative,
          diagnosis: diagnosis || `Longitudinal follow-up for ${category}`,
          treatment: 'Prescribed protocol and monitoring',
          severity
        },
        rawFiles
      );
    } else {
      await createIncident(
        {
          title: `${category} Episode`,
          stageOrCycle: stageOrCycle || (category.includes('Oncology') ? 'Initial Staging' : undefined),
          hospital: hospital || 'Consulting Clinic',
          doctor: doctor || 'Attending Physician',
          department: category,
          reason: patientNarrative,
          patientDescription: patientNarrative,
          diagnosis: diagnosis || `Clinical assessment for ${category.toLowerCase()}`,
          treatment: 'Prescribed medication and care protocol',
          severity
        },
        rawFiles
      );
    }

    // Reset form
    setStep(1);
    setIsBranchOfExisting(false);
    setCategory('Orthopedic / Fracture');
    setPatientNarrative('');
    setHospital('');
    setDoctor('');
    setDiagnosis('');
    setStageOrCycle('');
    setAttachedFiles([]);
    setIsCreateIncidentOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateIncidentOpen}
      onClose={() => setIsCreateIncidentOpen(false)}
      title="Register New Medical Incident / Branch"
      subtitle="Log a new standalone episode or branch an ongoing chronic condition (e.g. Cancer, Fracture rehab)."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        
        {/* Step Progression Indicators */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <div className={clsx(
            "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold",
            step === 1 ? 'bg-brand-teal text-slate-950 shadow-glow-teal' : 'bg-white/5 text-slate-400'
          )}>
            <span>1</span>
            <span>Episode Details & Branching</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={clsx(
            "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold",
            step === 2 ? 'bg-brand-teal text-slate-950 shadow-glow-teal' : 'bg-white/5 text-slate-400'
          )}>
            <span>2</span>
            <span>Upload Artifacts & Confirm</span>
          </div>
        </div>

        {/* STEP 1: WHAT HAPPENED? */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Branch vs Standalone Toggle */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-brand-cyan" />
                  <span>Is this a branch / follow-up cycle of an existing condition?</span>
                </label>
                <input
                  type="checkbox"
                  checked={isBranchOfExisting}
                  onChange={(e) => setIsBranchOfExisting(e.target.checked)}
                  className="w-4 h-4 accent-brand-cyan cursor-pointer"
                />
              </div>

              {isBranchOfExisting && (
                <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Select Parent Episode *</label>
                    <select
                      value={parentIncidentId}
                      onChange={(e) => setParentIncidentId(e.target.value)}
                      className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-white"
                    >
                      {incidents.map(inc => (
                        <option key={inc.id} value={inc.id}>{inc.id} - {inc.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Stage / Cycle Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Cycle 2 AC Chemo, Post-Op Rehab Phase 1"
                      value={stageOrCycle}
                      onChange={(e) => setStageOrCycle(e.target.value)}
                      className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

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
                    className={clsx(
                      "p-2.5 rounded-xl text-xs font-semibold text-left transition-all border",
                      category === cat
                        ? 'bg-brand-teal/20 text-brand-cyan border-brand-teal/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                        : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-white'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Narrative */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Describe What Happened In Your Own Words *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Example: Attending cycle 2 chemotherapy infusion, or fell from bike onto right wrist..."
                value={patientNarrative}
                onChange={(e) => setPatientNarrative(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal/50"
              />
            </div>

            {/* Severity Tag */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Severity
              </label>
              <div className="flex items-center gap-2">
                {(['ROUTINE', 'MILD', 'MODERATE', 'CRITICAL'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                      severity === sev
                        ? 'bg-brand-teal/20 text-brand-cyan border-brand-teal/50'
                        : 'bg-white/[0.02] text-slate-400 border-white/[0.06]'
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
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
          <div className="space-y-4 animate-fadeIn">
            <div className="border-2 border-dashed border-white/15 hover:border-brand-teal/50 rounded-2xl p-6 text-center bg-black/20 transition-all relative">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-10 h-10 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-cyan">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">
                  Drop diagnostic photos, biopsy reports, or X-rays
                </div>
                <p className="text-[11px] text-slate-400">
                  Select multiple files simultaneously
                </p>
              </div>
            </div>

            {attachedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attachedFiles.map((item, idx) => (
                  <div key={idx} className="relative rounded-xl bg-[#131824] border border-white/10 p-2 flex items-center gap-2 overflow-hidden">
                    {item.preview ? (
                      <img src={item.preview} alt="Preview" className="w-8 h-8 rounded object-cover shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-brand-cyan shrink-0" />
                    )}
                    <span className="text-white truncate text-[11px]">{item.file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute top-1 right-1 text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. SMS Hospital / Tata Memorial"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Attending Doctor</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ram, MS Ortho"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-teal hover:brightness-110"
              >
                {isBranchOfExisting ? 'Confirm & Attach Sub-Episode Branch' : 'Confirm & Add Incident to Timeline'}
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
