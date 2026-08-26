import React from 'react';
import { usePatient } from '../../context/PatientContext';
import { SpatialCanvas } from '../3d/SpatialCanvas';
import { TimelineView } from './TimelineView';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { 
  Activity, 
  Pill, 
  FileText, 
  Stethoscope, 
  QrCode, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Heart,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthJourneyHero: React.FC = () => {
  const { 
    patient, 
    incidents, 
    documents, 
    medicines, 
    reminders, 
    doctorSuggestions, 
    selectedIncidentId, 
    setSelectedIncidentId,
    setActiveTab,
    toggleReminderStatus,
    setIsCreateIncidentOpen
  } = usePatient();

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
  const currentIncident = activeIncidents[0] || incidents[0];
  const activeMeds = medicines.filter(m => m.active);
  const todayReminders = reminders.slice(0, 3);
  const activeDoctorSuggestion = doctorSuggestions[0];
  const takenCount = reminders.filter(r => r.status === 'TAKEN').length;
  const adherenceRate = reminders.length > 0 ? Math.round((takenCount / reminders.length) * 100) : 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Spatial Patient Biometric Identity Ribbon */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#090d16] via-[#0f1524] to-[#090d16] border border-white/[0.08] shadow-spatial-md overflow-hidden">
        {/* Ambient background light flare */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Sparkles className="w-3 h-3 text-brand-cyan animate-pulse" />
                <span>Longitudinal Health State</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">ABHA ID: <strong className="text-white font-medium">{patient.abhaId}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-brand-rose font-bold">Blood: {patient.bloodGroup}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {patient.name}’s Health Journey
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {incidents.length > 0
                ? `${incidents.length} healthcare episode(s) recorded across your continuous timeline with ${documents.length} verified diagnostic document(s).`
                : 'Your continuous health trajectory starts here. Register consultations, upload X-rays, and track recovery in real time.'}
            </p>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('share')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151e32]/90 hover:bg-[#1a2640] border border-white/10 text-slate-200 text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-brand-cyan" />
              <span>Doctor QR Share</span>
            </button>
            
            <button
              onClick={() => setIsCreateIncidentOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 text-xs font-extrabold shadow-glow-teal hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>+ Add Incident</span>
            </button>
          </div>
        </div>
      </div>

      {/* Centerpiece 3D Spatial Trajectory Map */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Spatial Health Trajectory Canvas (2024 — 2026)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Interactive Orbit • Rotate & click node to inspect
          </span>
        </div>

        {incidents.length > 0 ? (
          <SpatialCanvas
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(id) => setSelectedIncidentId(id)}
          />
        ) : (
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#090d16] via-[#0f1524] to-[#05070b] border border-white/[0.08] text-center space-y-4 shadow-spatial-md">
            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto shadow-glow-cyan">
              <Activity className="w-7 h-7 animate-pulse-subtle" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-white">Your Medical Timeline is Clean</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No active episodes recorded yet. Click below to add your consultation, broken bone, prescription, or scan.
              </p>
            </div>
            <button
              onClick={() => setIsCreateIncidentOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-teal hover:brightness-110 active:scale-95 transition-all"
            >
              + Register Your First Healthcare Incident
            </button>
          </div>
        )}
      </div>

      {/* Tri-Perspective Intelligence HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* HUD Card 1: Active Health Context */}
        <GlassPanel 
          variant={currentIncident?.status === 'ACTIVE' ? "highlight" : "base"} 
          className="p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-brand-cyan font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <span>Active Health Context</span>
              </span>
              {currentIncident && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentIncident.status === 'ACTIVE' ? 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40' : 'bg-slate-800 text-slate-400'}`}>
                  {currentIncident.status}
                </span>
              )}
            </div>

            {currentIncident ? (
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-slate-400">{currentIncident.id} • {currentIncident.date}</div>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {currentIncident.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {currentIncident.diagnosis}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>{currentIncident.doctor}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-[11px] text-slate-400">{currentIncident.hospital}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4">
                No active health episode recorded. Your vital baseline is normal.
              </p>
            )}
          </div>

          {currentIncident ? (
            <button
              onClick={() => setSelectedIncidentId(currentIncident.id)}
              className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-brand-cyan hover:text-white transition-colors"
            >
              <span>Inspect Deep Episode Drawer</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsCreateIncidentOpen(true)}
              className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-brand-teal hover:text-white transition-colors"
            >
              <span>Log Consultation</span>
              <Plus className="w-4 h-4" />
            </button>
          )}
        </GlassPanel>

        {/* HUD Card 2: Daily Medication Rhythm & Alarms */}
        <GlassPanel variant="base" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-brand-emerald font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Daily Medication Rhythm</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {takenCount}/{reminders.length || 0} Doses ({adherenceRate}%)
              </span>
            </div>

            {todayReminders.length > 0 ? (
              <div className="space-y-2.5 mt-1">
                {todayReminders.map(rem => (
                  <div 
                    key={rem.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/[0.06] text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-100 truncate">{rem.medicineName.split('(')[0]}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{rem.time} • {rem.dosage}</div>
                    </div>
                    
                    <button
                      onClick={() => toggleReminderStatus(rem.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        rem.status === 'TAKEN'
                          ? 'bg-brand-emerald/25 text-brand-emerald border border-brand-emerald/50'
                          : rem.status === 'SKIPPED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-brand-teal/20 text-brand-cyan hover:bg-brand-teal/30 border border-brand-teal/40'
                      }`}
                    >
                      {rem.status === 'TAKEN' ? 'Taken ✓' : rem.status === 'SKIPPED' ? 'Skipped' : 'Take Dose'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4">
                No active daily medications scheduled right now. Click below to add prescribed tablets.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('medicines')}
            className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>View Full Med Schedule & Alarms</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </GlassPanel>

        {/* HUD Card 3: Grounded Health Intelligence */}
        <GlassPanel variant="base" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-brand-violet font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
                <span>Clinical Intelligence</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/15 text-brand-violet font-bold">
                Dual AI Ready
              </span>
            </div>

            {activeDoctorSuggestion ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed">
                  "{activeDoctorSuggestion.suggestion}"
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium pt-1">
                  <Stethoscope className="w-3 h-3 text-brand-emerald" />
                  <span>{activeDoctorSuggestion.doctorName}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-brand-amber font-mono">Review: {activeDoctorSuggestion.followUpDate}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Grounded AI analyzes your active episodes, X-rays, and medications.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-brand-cyan">🏥 Allopathic Pharmacology</span>
                  <span>•</span>
                  <span className="text-brand-emerald">🌿 Classical Ayurveda</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('ai')}
            className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-brand-cyan hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Ask AI Health Assistant</span>
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </GlassPanel>
      </div>

      {/* Main Longitudinal Timeline Stream */}
      {incidents.length > 0 && (
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Longitudinal Health Trajectory
              </h2>
              <p className="text-xs text-slate-400">
                Chronological record of verified clinical incidents, prescriptions, and radiographs.
              </p>
            </div>
          </div>

          <TimelineView
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(id) => setSelectedIncidentId(id)}
          />
        </div>
      )}
    </div>
  );
};
