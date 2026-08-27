import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { Badge } from '../common/Badge';
import { GlassPanel } from '../common/GlassPanel';
import { Modal } from '../common/Modal';
import { MilestoneType } from '../../types';
import { 
  X, 
  Building2, 
  Stethoscope, 
  Calendar, 
  FileText, 
  Pill, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Upload, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  GitBranch, 
  GitFork, 
  Check, 
  CircleDot, 
  Activity,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface IncidentInspectorProps {
  incidentId: string | null;
  onClose: () => void;
}

export const IncidentInspector: React.FC<IncidentInspectorProps> = ({ incidentId, onClose }) => {
  const { 
    incidents, 
    documents, 
    medicines, 
    doctorSuggestions, 
    accessLogs,
    activeRole,
    addDoctorSuggestion,
    addIncidentMilestone,
    branchIncident,
    closeIncident,
    reopenIncident,
    setSelectedIncidentId
  } = usePatient();

  const [activeTab, setActiveTab] = useState<'overview' | 'progression' | 'documents' | 'medicines' | 'suggestions' | 'audit'>('overview');
  const [newSuggestionText, setNewSuggestionText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Milestone Creation State
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneType, setMilestoneType] = useState<MilestoneType>('CHEMO_CYCLE');
  const [milestoneNotes, setMilestoneNotes] = useState('');
  const [milestoneStatus, setMilestoneStatus] = useState<'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'>('SCHEDULED');

  // Branch Creation State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchTitle, setBranchTitle] = useState('');
  const [branchStage, setBranchStage] = useState('');
  const [branchReason, setBranchReason] = useState('');
  const [branchDoctor, setBranchDoctor] = useState('');
  const [branchHospital, setBranchHospital] = useState('');

  if (!incidentId) return null;

  const incident = incidents.find(inc => inc.id === incidentId);
  if (!incident) return null;

  const isActive = incident.status === 'ACTIVE';

  // Find parent and child branches
  const parentIncident = incident.parentIncidentId ? incidents.find(i => i.id === incident.parentIncidentId) : null;
  const childBranches = incidents.filter(i => i.parentIncidentId === incident.id);

  const incidentDocs = documents.filter(d => d.incidentId === incident.id);
  const incidentMeds = medicines.filter(m => m.incidentId === incident.id);
  const incidentSuggestions = doctorSuggestions.filter(s => s.incidentId === incident.id);
  const incidentLogs = accessLogs.filter(l => l.recordsAccessed.some(r => r.includes(incident.id)));

  const handleToggleClose = () => {
    if (isActive) {
      closeIncident(incident.id);
    } else {
      reopenIncident(incident.id);
    }
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestionText.trim()) return;

    addDoctorSuggestion({
      incidentId: incident.id,
      doctorName: activeRole === 'DOCTOR' ? 'Dr. Ram, MS Ortho' : 'Consulting Specialist',
      specialty: incident.department || 'Clinical Care Unit',
      hospital: incident.hospital,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      suggestion: newSuggestionText,
      followUpDate: followUpDate || 'In 7 days',
      priority: 'HIGH'
    });

    setNewSuggestionText('');
    setFollowUpDate('');
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    addIncidentMilestone(incident.id, {
      title: milestoneTitle,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: milestoneType,
      notes: milestoneNotes,
      status: milestoneStatus,
      doctorName: incident.doctor,
      hospitalName: incident.hospital
    });

    setIsAddingMilestone(false);
    setMilestoneTitle('');
    setMilestoneNotes('');
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchTitle.trim()) return;

    await branchIncident(incident.id, {
      title: branchTitle,
      stageOrCycle: branchStage || 'Sub-Episode Phase',
      reason: branchReason || `Extended progression from ${incident.title}`,
      doctor: branchDoctor || incident.doctor,
      hospital: branchHospital || incident.hospital,
      department: incident.department,
      diagnosis: incident.diagnosis,
      severity: incident.severity
    });

    setIsBranchModalOpen(false);
    setBranchTitle('');
    setBranchStage('');
    setBranchReason('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Spatial Slide Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl h-full bg-[#0d111a] border-l border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Drawer Top Header */}
          <div className="p-6 border-b border-white/[0.08] bg-[#131824]/90 backdrop-blur-xl shrink-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-md bg-brand-teal/20 text-brand-cyan border border-brand-teal/40">
                  {incident.id}
                </span>
                <span className={clsx(
                  "text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border",
                  isActive ? 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                )}>
                  {isActive ? '● ACTIVE' : '✓ CURED & CLOSED'}
                </span>
                <Badge severity={incident.severity} />
                {incident.parentIncidentId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    <span>Branch of {incident.parentIncidentId}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleClose}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${isActive ? 'bg-brand-emerald text-slate-950 hover:brightness-110 shadow-glow-emerald' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>{isActive ? 'Mark as Cured & Closed' : 'Reopen Episode'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {incident.title}
            </h2>

            {incident.stageOrCycle && (
              <div className="text-xs font-mono text-brand-cyan font-semibold mt-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Current Stage: {incident.stageOrCycle}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{incident.hospital}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Stethoscope className="w-3.5 h-3.5 text-brand-emerald" />
                <span>{incident.doctor} ({incident.department})</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{incident.date}</span>
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-5 border-b border-white/[0.06] overflow-x-auto pb-1 text-xs">
              {[
                { id: 'overview', label: 'Clinical Overview', icon: Sparkles },
                { id: 'progression', label: `Progression & Branches (${(incident.milestones?.length || 0) + childBranches.length})`, icon: GitBranch, highlight: true },
                { id: 'documents', label: `Documents (${incidentDocs.length})`, icon: FileText },
                { id: 'medicines', label: `Medicines (${incidentMeds.length})`, icon: Pill },
                { id: 'suggestions', label: `Doctor Advice (${incidentSuggestions.length})`, icon: MessageSquare },
                { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
              ].map(tab => {
                const Icon = tab.icon;
                const isTabActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-all whitespace-nowrap border-b-2",
                      isTabActive
                        ? 'text-brand-cyan border-brand-cyan bg-white/[0.04]'
                        : 'text-slate-400 border-transparent hover:text-slate-200'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer Body Outlet */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: CLINICAL OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Parent Link if Branched */}
                {parentIncident && (
                  <div 
                    onClick={() => setSelectedIncidentId(parentIncident.id)}
                    className="p-3.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs flex items-center justify-between cursor-pointer hover:bg-brand-cyan/15 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-brand-cyan" />
                      <span className="text-slate-300">Branched from Primary Incident:</span>
                      <strong className="text-white">{parentIncident.title}</strong>
                    </div>
                    <span className="text-brand-cyan font-bold font-mono">View Parent →</span>
                  </div>
                )}

                {/* Patient-Provided Narrative */}
                <GlassPanel variant="base" className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Patient's Own Narrative
                    </span>
                    <Badge source="PATIENT_PROVIDED" />
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/5">
                    "{incident.patientDescription || incident.reason}"
                  </p>
                </GlassPanel>

                {/* Doctor-Recorded Diagnosis & Treatment */}
                <GlassPanel variant="glow-emerald" className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider">
                      Doctor Confirmed Diagnosis
                    </span>
                    <Badge source="DOCTOR_RECORDED" />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {incident.diagnosis}
                  </div>
                  
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">Prescribed Treatment Protocol</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {incident.treatment}
                    </p>
                  </div>
                </GlassPanel>
              </div>
            )}

            {/* TAB 2: PROGRESSION & BRANCHES (Longitudinal Episodes like Cancer / Rehab) */}
            {activeTab === 'progression' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#131824] border border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-cyan" />
                      <span>Longitudinal Milestones & Branching Trajectory</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      For chronic conditions like Cancer or Rehab that extend across multiple cycles, phases, and follow-ups.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddingMilestone(true)}
                      className="px-3 py-1.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Milestone</span>
                    </button>
                    <button
                      onClick={() => setIsBranchModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-brand-emerald/20 hover:bg-brand-emerald/30 border border-brand-emerald/40 text-brand-emerald font-bold text-xs flex items-center gap-1"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      <span>Branch Sub-Episode</span>
                    </button>
                  </div>
                </div>

                {/* Form to Add Milestone Inline */}
                {isAddingMilestone && (
                  <form onSubmit={handleCreateMilestone} className="p-4 rounded-2xl bg-black/60 border border-brand-cyan/40 space-y-3 animate-fadeIn text-xs">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>Add Clinical Milestone / Cycle</span>
                      <button type="button" onClick={() => setIsAddingMilestone(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-mono mb-1">Milestone Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cycle 2 AC Chemotherapy, Follow-up PET-CT"
                          value={milestoneTitle}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                          className="w-full bg-[#131824] border border-white/10 rounded-xl p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-mono mb-1">Type</label>
                        <select
                          value={milestoneType}
                          onChange={(e) => setMilestoneType(e.target.value as any)}
                          className="w-full bg-[#131824] border border-white/10 rounded-xl p-2 text-white"
                        >
                          <option value="CHEMO_CYCLE">Chemotherapy Cycle</option>
                          <option value="RADIATION">Radiation Therapy</option>
                          <option value="SURGERY">Surgical Milestone</option>
                          <option value="REMISSION_CHECK">Remission / Diagnostic Scan</option>
                          <option value="REHABILITATION">Rehabilitation / Physiotherapy</option>
                          <option value="FOLLOW_UP">Outpatient Follow-up</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Clinical Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Full dose administered; blood counts stable; repeat review in 14 days"
                        value={milestoneNotes}
                        onChange={(e) => setMilestoneNotes(e.target.value)}
                        className="w-full bg-[#131824] border border-white/10 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingMilestone(false)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs"
                      >
                        Record Milestone
                      </button>
                    </div>
                  </form>
                )}

                {/* Milestone Progression Timeline */}
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400">
                    Clinical Milestones & Protocol History ({incident.milestones?.length || 0})
                  </span>

                  {(incident.milestones || []).map((ms, idx) => (
                    <div key={ms.id || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3.5 text-xs relative">
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5",
                        ms.status === 'COMPLETED' ? "bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40" :
                        ms.status === 'IN_PROGRESS' ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 animate-pulse" :
                        "bg-slate-800 text-slate-400 border border-slate-700"
                      )}>
                        {ms.status === 'COMPLETED' ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-white text-sm">{ms.title}</h5>
                          <span className="text-[10px] font-mono text-slate-500">{ms.date}</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1">{ms.notes}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                          <span>Type: {ms.type}</span>
                          <span>•</span>
                          <span className={clsx(
                            "font-bold",
                            ms.status === 'COMPLETED' ? "text-brand-emerald" : ms.status === 'IN_PROGRESS' ? "text-brand-cyan" : "text-brand-amber"
                          )}>
                            Status: {ms.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!incident.milestones || incident.milestones.length === 0) && (
                    <div className="p-6 text-center rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
                      No milestones logged yet. Click "Add Milestone" above to track cycles or rehabilitation stages.
                    </div>
                  )}
                </div>

                {/* Child Branched Episodes */}
                {childBranches.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-xs font-mono font-bold uppercase text-brand-emerald">
                      Connected Sub-Episodes & Branches ({childBranches.length})
                    </span>

                    {childBranches.map(branch => (
                      <div
                        key={branch.id}
                        onClick={() => setSelectedIncidentId(branch.id)}
                        className="p-4 rounded-xl bg-black/40 border border-brand-emerald/30 hover:border-brand-emerald transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-brand-emerald flex items-center gap-1.5">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>{branch.id} • {branch.stageOrCycle || 'Sub-Episode'}</span>
                          </span>
                          <span className="text-brand-cyan text-xs font-bold font-mono">Inspect Branch →</span>
                        </div>
                        <h5 className="font-bold text-white text-xs">{branch.title}</h5>
                        <p className="text-slate-300 text-xs">{branch.diagnosis}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DOCUMENTS */}
            {activeTab === 'documents' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Uploaded Medical Artifacts
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">{incidentDocs.length} files</span>
                </div>

                {incidentDocs.map(doc => (
                  <GlassPanel key={doc.id} variant="base" className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-brand-cyan" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white line-clamp-1">{doc.title}</span>
                          <Badge source="AI_EXTRACTED" />
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {doc.filename} • {doc.fileSize} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            )}

            {/* TAB 4: MEDICINES */}
            {activeTab === 'medicines' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Prescribed Pharmacotherapy
                </h4>

                {incidentMeds.map(med => (
                  <GlassPanel key={med.id} variant="base" className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white">{med.name}</h5>
                        <p className="text-xs text-brand-cyan font-mono">{med.dosage} • {med.frequency}</p>
                      </div>
                      <Badge source={med.source} />
                    </div>
                    <div className="text-xs text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      {med.instructions}
                    </div>
                  </GlassPanel>
                ))}
              </div>
            )}

            {/* TAB 5: DOCTOR SUGGESTIONS */}
            {activeTab === 'suggestions' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Recorded Doctor Directives
                </h4>

                {incidentSuggestions.map(sug => (
                  <GlassPanel key={sug.id} variant="glow-emerald" className="p-4 space-y-2">
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "{sug.suggestion}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-white/10">
                      <span>{sug.doctorName} ({sug.specialty})</span>
                      {sug.followUpDate && <span className="font-mono text-brand-amber">Next Review: {sug.followUpDate}</span>}
                    </div>
                  </GlassPanel>
                ))}

                <form onSubmit={handleAddSuggestion} className="p-4 rounded-2xl bg-[#131824] border border-white/10 space-y-3 text-xs">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>Append Attending Doctor Recommendation</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter clinical follow-up advice, dietary guidelines, or warning signs..."
                    value={newSuggestionText}
                    onChange={(e) => setNewSuggestionText(e.target.value)}
                    className="w-full bg-[#0d111a] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald/50"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:brightness-110"
                  >
                    Record Directive
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: AUDIT TRAIL */}
            {activeTab === 'audit' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Access History for Incident {incident.id}
                </div>

                <div className="space-y-2.5">
                  {incidentLogs.map(log => (
                    <div key={log.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-bold text-white">{log.recipientName}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{log.timestamp}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">Purpose: {log.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* BRANCH CREATION MODAL */}
        <Modal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          title={`Branch / Extend Incident ${incident.id}`}
          subtitle={`Create a longitudinal sub-episode (e.g. Chemotherapy Cycle, Radiation, Post-Op Rehab)`}
          maxWidth="lg"
        >
          <form onSubmit={handleCreateBranch} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Branch Sub-Episode Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cycle 2 Chemotherapy Protocol, Post-Cast Physical Therapy"
                value={branchTitle}
                onChange={(e) => setBranchTitle(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Stage / Phase Label</label>
                <input
                  type="text"
                  placeholder="e.g. Stage II - Cycle 2"
                  value={branchStage}
                  onChange={(e) => setBranchStage(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono mb-1">Attending Clinician</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ram, MS Ortho"
                  value={branchDoctor}
                  onChange={(e) => setBranchDoctor(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Branch Clinical Objective</label>
              <textarea
                rows={2}
                placeholder="Describe why this episode is being branched and its treatment goals..."
                value={branchReason}
                onChange={(e) => setBranchReason(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110"
              >
                Create Connected Sub-Episode
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </AnimatePresence>
  );
};
