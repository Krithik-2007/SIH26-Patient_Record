import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { Badge } from '../common/Badge';
import { GlassPanel } from '../common/GlassPanel';
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
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    closeIncident,
    reopenIncident
  } = usePatient();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'medicines' | 'suggestions' | 'audit'>('overview');
  const [newSuggestionText, setNewSuggestionText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  if (!incidentId) return null;

  const incident = incidents.find(inc => inc.id === incidentId);
  if (!incident) return null;

  const isActive = incident.status === 'ACTIVE';

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
      doctorName: activeRole === 'DOCTOR' ? 'Dr. Priya Sen, MD' : 'Consulting Physician',
      specialty: 'Clinical Care Unit',
      hospital: incident.hospital,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      suggestion: newSuggestionText,
      followUpDate: followUpDate || 'In 7 days',
      priority: 'HIGH'
    });

    setNewSuggestionText('');
    setFollowUpDate('');
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
                <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${isActive ? 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {isActive ? '● ACTIVE' : '✓ CURED & CLOSED'}
                </span>
                <Badge severity={incident.severity} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleClose}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${isActive ? 'bg-brand-emerald text-slate-950 hover:brightness-110 shadow-glow-emerald' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>{isActive ? 'Mark Incident as Cured & Closed ✓' : 'Reopen Episode'}</span>
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
                { id: 'documents', label: `Documents (${incidentDocs.length})`, icon: FileText },
                { id: 'medicines', label: `Medicines (${incidentMeds.length})`, icon: Pill },
                { id: 'suggestions', label: `Doctor Advice (${incidentSuggestions.length})`, icon: MessageSquare },
                { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-all whitespace-nowrap border-b-2 ${
                      isActive
                        ? 'text-brand-cyan border-brand-cyan bg-white/[0.04]'
                        : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
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
                {/* Patient-Provided Description */}
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

                {/* Key AI Extracted Summary Pane */}
                {incidentDocs[0]?.extractedData && (
                  <GlassPanel variant="glow-teal" className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Extracted Key Findings</span>
                      </span>
                      <span className="text-[11px] text-brand-cyan font-mono">
                        {Math.round(incidentDocs[0].extractedData.confidenceScore * 100)}% Confidence
                      </span>
                    </div>

                    {incidentDocs[0].extractedData.labValues && (
                      <div className="space-y-1.5 mt-2">
                        {incidentDocs[0].extractedData.labValues.map((lv, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/40 text-xs">
                            <span className="text-slate-300">{lv.test}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{lv.result} {lv.unit}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                lv.status === 'HIGH' || lv.status === 'LOW' 
                                  ? 'bg-brand-amber/20 text-brand-amber' 
                                  : 'bg-brand-emerald/20 text-brand-emerald'
                              }`}>
                                {lv.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {incidentDocs[0].extractedData.keyAdvice && (
                      <p className="text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                        <strong>Clinical Directive:</strong> {incidentDocs[0].extractedData.keyAdvice}
                      </p>
                    )}
                  </GlassPanel>
                )}
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
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
                        {doc.extractedData?.diagnosis && (
                          <p className="text-xs text-slate-300 mt-2 bg-white/[0.02] p-2 rounded border border-white/5">
                            Extracted Diagnosis: {doc.extractedData.diagnosis}
                          </p>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => alert(`Document Preview: ${doc.title}`)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-brand-cyan border border-white/10"
                    >
                      Inspect
                    </button>
                  </GlassPanel>
                ))}

                {incidentDocs.length === 0 && (
                  <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-slate-400 text-xs">
                    No documents attached yet to this episode.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MEDICINES */}
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
                      <div className="font-semibold text-slate-300 mb-0.5">Clinical Instructions:</div>
                      {med.instructions}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-white/5">
                      <span>Schedule: {med.timing.join(', ')}</span>
                      <span>Duration: {med.duration}</span>
                    </div>
                  </GlassPanel>
                ))}

                {incidentMeds.length === 0 && (
                  <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-slate-400 text-xs">
                    No specific medications linked with this episode.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DOCTOR SUGGESTIONS */}
            {activeTab === 'suggestions' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Recorded Doctor Directives
                  </h4>
                  <Badge source="DOCTOR_RECORDED" />
                </div>

                {incidentSuggestions.map(sug => (
                  <GlassPanel key={sug.id} variant="glow-emerald" className="p-4 space-y-2">
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "{sug.suggestion}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-white/10">
                      <span>{sug.doctorName} ({sug.specialty})</span>
                      {sug.followUpDate && (
                        <span className="font-mono text-brand-amber">Next Review: {sug.followUpDate}</span>
                      )}
                    </div>
                  </GlassPanel>
                ))}

                {/* Doctor Role can add suggestions */}
                <form onSubmit={handleAddSuggestion} className="p-4 rounded-2xl bg-[#131824] border border-white/10 space-y-3">
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
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Follow-up Date (e.g. 10 Sep 2026)"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="flex-1 bg-[#0d111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:brightness-110"
                    >
                      Record Directive
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 5: AUDIT TRAIL */}
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
                      <div className="text-slate-400 text-[11px]">
                        Purpose: <span className="text-slate-300 font-medium">{log.purpose}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[10px]">
                        IP: {log.ipAddress} • {log.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
