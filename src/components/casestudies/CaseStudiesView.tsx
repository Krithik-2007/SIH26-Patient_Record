import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { CaseStudy } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { Modal } from '../common/Modal';
import { 
  GraduationCap, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  AlertCircle,
  Heart,
  Plus,
  ArrowRight,
  Download,
  Building2,
  Stethoscope
} from 'lucide-react';
import { clsx } from 'clsx';

export const CaseStudiesView: React.FC = () => {
  const { caseStudies, incidents, submitDeceasedCaseStudy } = usePatient();
  const [activeTab, setActiveTab] = useState<'repository' | 'contribute'>('repository');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');

  // Deceased Case Contribution Form State
  const [caseTitle, setCaseTitle] = useState('');
  const [specialty, setSpecialty] = useState('Critical Care & Pulmonology');
  const [causeOfDemise, setCauseOfDemise] = useState('');
  const [clinicalHistory, setClinicalHistory] = useState('');
  const [pathologyNotes, setPathologyNotes] = useState('');
  const [keyFinding, setKeyFinding] = useState('');
  const [educationalTakeaway, setEducationalTakeaway] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  const filteredStudies = caseStudies.filter(cs => {
    if (specialtyFilter === 'ALL') return true;
    if (specialtyFilter === 'DECEASED') return cs.isDeceasedCase;
    return cs.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
  });

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim() || !consentConfirmed) return;

    await submitDeceasedCaseStudy({
      title: caseTitle,
      specialty,
      causeOfDemise,
      clinicalHistory,
      pathologySummary: pathologyNotes,
      keyFindings: [keyFinding || 'Critical longitudinal trajectory highlights need for early intervention.'],
      educationalTakeaways: [educationalTakeaway || 'De-identified longitudinal data provides vital teaching insights for clinical trainees.']
    }, consentConfirmed);

    setCaseTitle('');
    setCauseOfDemise('');
    setClinicalHistory('');
    setPathologyNotes('');
    setKeyFinding('');
    setEducationalTakeaway('');
    setConsentConfirmed(false);
    setActiveTab('repository');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-violet uppercase flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Anonymized Clinical Knowledge Base</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Post-Mortem & Critical Case Studies for Researchers</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Educational Case Studies
          </h1>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center bg-[#0d111a] p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveTab('repository')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'repository' ? "bg-[#1a2233] text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-white"
              )}
            >
              <BookOpen className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Research Repository ({caseStudies.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('contribute')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'contribute' ? "bg-[#1a2233] text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-white"
              )}
            >
              <Heart className="w-3.5 h-3.5 text-brand-rose" />
              <span>Contribute Deceased Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ethical De-identification Trust Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-brand-violet shrink-0" />
          <span>Zero PII Exposure (100% Anonymized)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
          <span>Legal Family & Ethics Consent Verified</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <GraduationCap className="w-4 h-4 text-brand-cyan shrink-0" />
          <span>Institutional Peer-Reviewed Lessons</span>
        </div>
      </div>

      {/* TAB 1: RESEARCH REPOSITORY */}
      {activeTab === 'repository' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Case Studies' },
              { id: 'DECEASED', label: '🕊️ Post-Mortem & Fatal Cases' },
              { id: 'Pulmonology', label: 'Pulmonology & Critical Care' },
              { id: 'Orthopedics', label: 'Orthopedics & Trauma' },
              { id: 'Pathology', label: 'Pathology & Histology' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSpecialtyFilter(cat.id)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all border",
                  specialtyFilter === cat.id
                    ? "bg-brand-violet/20 text-brand-violet border-brand-violet/40 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                    : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStudies.map(cs => (
              <GlassPanel
                key={cs.id}
                variant="base"
                className="p-6 flex flex-col justify-between space-y-4 hover:border-brand-violet/40 transition-all cursor-pointer"
                onClick={() => setSelectedCase(cs)}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
                        {cs.caseId}
                      </span>
                      {cs.isDeceasedCase && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-rose/20 text-brand-rose border border-brand-rose/30">
                          Post-Mortem Case
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                      Family Consent Verified ✓
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug mb-2 hover:text-brand-cyan transition-colors">
                    {cs.title}
                  </h3>

                  {cs.causeOfDemise && (
                    <div className="text-xs text-brand-rose font-semibold mb-2 bg-brand-rose/5 p-2 rounded-lg border border-brand-rose/20">
                      Primary Cause of Demise: <span className="font-normal text-slate-300">{cs.causeOfDemise}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-3">
                    <span className="text-slate-300 font-semibold">{cs.specialty}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono">{cs.ageRange} ({cs.gender})</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    {cs.clinicalHistory}
                  </p>

                  {/* Takeaways snippet */}
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Key Clinical Takeaway for Researchers:</div>
                    <p className="text-xs text-slate-300 italic line-clamp-2">
                      "{cs.educationalTakeaways[0]}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Peer reviewed: {cs.publishedDate}
                  </span>

                  <span className="text-brand-cyan font-bold flex items-center gap-1">
                    <span>Inspect Full Clinical Case Study</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CONTRIBUTE DECEASED CASE REPORT (PATIENT / FAMILY CONSENT) */}
      {activeTab === 'contribute' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <GlassPanel variant="base" className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-rose" />
                <span>Contribute Deceased Patient Medical History to Research</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a patient passes away from a terminal condition or severe trauma, legal family/patient consent enables their longitudinal records to be fully de-identified and transformed into an institutional case study to help medical researchers and students save future lives.
              </p>
            </div>

            <form onSubmit={handleSubmitContribution} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Case Study Descriptive Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Trajectory of Fatal Severe Respiratory Exacerbation following Viral Pneumonia"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-violet/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Clinical Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Critical Care & Pulmonology">Critical Care & Pulmonology</option>
                    <option value="Orthopedic & Trauma Surgery">Orthopedic & Trauma Surgery</option>
                    <option value="Oncology & Hematology">Oncology & Hematology</option>
                    <option value="Cardiovascular Medicine">Cardiovascular Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Primary Clinical Cause of Demise *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Refractory ARDS secondary to acute parenchymal alveolar injury"
                    value={causeOfDemise}
                    onChange={(e) => setCauseOfDemise(e.target.value)}
                    className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Longitudinal Clinical History & Presentation *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the initial symptoms, pre-morbid health history, hospital admission trajectory, and clinical response..."
                  value={clinicalHistory}
                  onChange={(e) => setClinicalHistory(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Post-Mortem Autopsy / Histopathological Summary</label>
                <textarea
                  rows={3}
                  placeholder="Summarize key biopsy, histopathology, or biomarker findings..."
                  value={pathologyNotes}
                  onChange={(e) => setPathologyNotes(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Primary Clinical Lesson / Takeaway</label>
                  <input
                    type="text"
                    placeholder="e.g. Early biomarker assessment predicts rapid alveolar collapse"
                    value={educationalTakeaway}
                    onChange={(e) => setEducationalTakeaway(e.target.value)}
                    className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Diagnostic Key Finding</label>
                  <input
                    type="text"
                    placeholder="e.g. High microvascular thrombosis in pre-existing fibrotic lungs"
                    value={keyFinding}
                    onChange={(e) => setKeyFinding(e.target.value)}
                    className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Ethical Consent Checkbox */}
              <div className="p-4 rounded-xl bg-brand-violet/10 border border-brand-violet/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent_checkbox"
                  required
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="w-5 h-5 accent-brand-violet shrink-0 mt-0.5 cursor-pointer"
                />
                <label htmlFor="consent_checkbox" className="text-slate-200 leading-relaxed cursor-pointer">
                  <strong>Legal Family & Post-Mortem Ethics Consent:</strong> I confirm that I am authorized to contribute this medical record. All patient names, government IDs, and direct identifiers will be stripped permanently, generating an anonymized <span className="font-mono text-brand-cyan">CASE-EDU-XXXX</span> academic record solely for medical education and research.
                </label>
              </div>

              <button
                type="submit"
                disabled={!consentConfirmed}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-violet via-purple-500 to-indigo-500 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Submit De-identified Post-Mortem Case Study to Science</span>
              </button>
            </form>
          </GlassPanel>
        </div>
      )}

      {/* DEEP CLINICAL CASE STUDY INSPECTION MODAL */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Clinical Case Analysis: ${selectedCase.caseId}`}
          subtitle={`Specialty: ${selectedCase.specialty} • ${selectedCase.ageRange} (${selectedCase.gender})`}
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs">
            
            {/* Post-Mortem Cause Banner */}
            {selectedCase.isDeceasedCase && (
              <div className="p-4 rounded-xl bg-brand-rose/10 border border-brand-rose/30 space-y-1">
                <div className="font-mono text-brand-rose uppercase font-bold text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Post-Mortem Case Study • Cause of Demise</span>
                </div>
                <p className="text-white font-semibold leading-relaxed">
                  {selectedCase.causeOfDemise}
                </p>
                <div className="text-slate-400 text-[11px] pt-1">
                  Consent: <strong>{selectedCase.consentType.replace(/_/g, ' ')}</strong> (Zero PII Exposure)
                </div>
              </div>
            )}

            {/* Clinical Overview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="font-mono text-slate-400 uppercase font-bold text-[11px]">Longitudinal Narrative History</div>
              <p className="text-slate-200 leading-relaxed text-xs">
                {selectedCase.clinicalHistory}
              </p>
            </div>

            {/* Pathology Summary */}
            {selectedCase.pathologySummary && (
              <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 space-y-1.5">
                <div className="font-mono text-brand-cyan uppercase font-bold text-[11px]">Histopathology & Diagnostic Biomarkers</div>
                <p className="text-slate-200 leading-relaxed">
                  {selectedCase.pathologySummary}
                </p>
              </div>
            )}

            {/* Timeline Milestones */}
            <div className="space-y-3">
              <div className="font-mono text-slate-400 uppercase font-bold text-[11px]">Clinical Phase Trajectory</div>
              <div className="space-y-2">
                {selectedCase.timelineMilestones.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>{m.phase}</span>
                      <span className="text-brand-cyan font-mono text-[11px]">{m.duration}</span>
                    </div>
                    <p className="text-slate-300">{m.clinicalAction}</p>
                    <p className="text-brand-emerald font-semibold text-[11px]">Outcome: {m.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Takeaways */}
            <div className="p-4 rounded-xl bg-brand-violet/10 border border-brand-violet/30 space-y-2">
              <div className="font-mono text-brand-violet uppercase font-bold text-[11px]">Academic & Clinical Insights for Medical Researchers</div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-200">
                {selectedCase.educationalTakeaways.map((t, i) => (
                  <li key={i} className="leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
