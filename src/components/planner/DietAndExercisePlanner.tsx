import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { AIDietTimetable } from '../ai/AIDietTimetable';
import { AIExerciseTimetable } from '../ai/AIExerciseTimetable';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Utensils, 
  Dumbbell, 
  Sparkles, 
  Leaf, 
  FlaskConical, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  HeartPulse, 
  Zap, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';

export const DietAndExercisePlanner: React.FC = () => {
  const { 
    incidents, 
    patient, 
    aiMode, 
    setAiMode, 
    selectedIncidentId, 
    setSelectedIncidentId 
  } = usePatient();

  const [activePlannerView, setActivePlannerView] = useState<'diet' | 'exercise'>('diet');
  const [selectedIncidentForPlan, setSelectedIncidentForPlan] = useState<string>(
    selectedIncidentId || incidents[0]?.id || 'INC-001'
  );

  const currentIncident = incidents.find(i => i.id === selectedIncidentForPlan) || incidents[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Episode Grounding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
              <span>AI Evidence-Grounded Recovery Engine</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Incident Timetables</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Diet & Safe Exercise Timetable Planner
          </h1>
        </div>

        {/* Dual Mode Switcher: Allopathic vs Ayurvedic */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-[#090d16] p-1 rounded-2xl border border-white/[0.08] shadow-spatial-sm text-xs">
            <button
              onClick={() => setAiMode('ALLOPATHIC')}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5",
                aiMode === 'ALLOPATHIC'
                  ? "bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold shadow-glow-teal"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Modern Medicine</span>
            </button>
            <button
              onClick={() => setAiMode('AYURVEDIC')}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5",
                aiMode === 'AYURVEDIC'
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-glow-emerald"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Leaf className="w-3.5 h-3.5 text-slate-950" />
              <span>Full Ayurvedic Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incident Selection Ribbon */}
      <div className="p-4 rounded-2xl bg-[#090d16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-spatial-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center text-brand-emerald shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Condition Grounding</span>
            <div className="font-bold text-white text-sm">
              {currentIncident?.title || 'Active Medical Episode'}
              <span className="text-brand-emerald font-mono font-normal text-xs ml-2">
                ({currentIncident?.diagnosis})
              </span>
            </div>
          </div>
        </div>

        {incidents.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-slate-400 font-mono text-[11px]">Switch Incident:</span>
            <select
              value={selectedIncidentForPlan}
              onChange={(e) => {
                setSelectedIncidentForPlan(e.target.value);
                setSelectedIncidentId(e.target.value);
              }}
              className="bg-[#131824] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-emerald/50"
            >
              {incidents.map(inc => (
                <option key={inc.id} value={inc.id}>{inc.id} - {inc.title.substring(0, 28)}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Switcher Bar: Diet Timetable vs Safe Exercise Timetable */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActivePlannerView('diet')}
          className={clsx(
            "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all text-xs border shadow-spatial-sm",
            activePlannerView === 'diet'
              ? "bg-gradient-to-r from-brand-teal/20 via-cyan-500/20 to-teal-500/10 text-brand-cyan border-brand-teal/60 shadow-glow-teal scale-102"
              : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
          )}
        >
          <Utensils className="w-4 h-4 text-brand-amber" />
          <span>Weekly Diet Plan Timetable</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber font-bold">
            MON - SUN
          </span>
        </button>

        <button
          onClick={() => setActivePlannerView('exercise')}
          className={clsx(
            "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all text-xs border shadow-spatial-sm",
            activePlannerView === 'exercise'
              ? "bg-gradient-to-r from-brand-emerald/20 via-teal-500/20 to-emerald-500/10 text-brand-emerald border-brand-emerald/60 shadow-glow-emerald scale-102"
              : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
          )}
        >
          <Dumbbell className="w-4 h-4 text-brand-emerald" />
          <span>Safe Exercise Routine Timetable</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-bold">
            100% CLINICALLY SAFE
          </span>
        </button>
      </div>

      {/* Render Selected Timetable */}
      {activePlannerView === 'diet' && <AIDietTimetable />}
      {activePlannerView === 'exercise' && <AIExerciseTimetable />}

    </div>
  );
};
