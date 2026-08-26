import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { MedicineList } from './MedicineList';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Bell, 
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Plus,
  Volume2
} from 'lucide-react';
import { clsx } from 'clsx';
import { playMedicationAlarmSound } from '../../utils/audioAlarm';

export const MedicinesSchedule: React.FC = () => {
  const { 
    reminders, 
    medicines, 
    toggleReminderStatus, 
    setIsCreateMedicineOpen, 
    showToast 
  } = usePatient();
  const [viewMode, setViewMode] = useState<'schedule' | 'all'>('schedule');

  const takenCount = reminders.filter(r => r.status === 'TAKEN').length;
  const adherencePercent = reminders.length === 0 ? 0 : Math.round((takenCount / reminders.length) * 100);

  const handleTestAlarm = (medicineName: string) => {
    playMedicationAlarmSound();
    showToast(`🔔 Audio alarm activated for ${medicineName}!`, 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Prescription & Timed Alarms</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">Audio-Visual Medication Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Medicines & Daily Reminders
          </h1>
        </div>

        {/* Action / View Switcher */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center bg-[#090d16] p-1 rounded-xl border border-white/[0.08] shadow-spatial-sm text-xs">
            <button
              onClick={() => setViewMode('schedule')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === 'schedule'
                  ? "bg-[#151e32] text-white shadow-sm border border-white/10"
                  : "text-slate-400 hover:text-white"
              )}
            >
              Today's Schedule ({reminders.length})
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === 'all'
                  ? "bg-[#151e32] text-white shadow-sm border border-white/10"
                  : "text-slate-400 hover:text-white"
              )}
            >
              All Prescriptions ({medicines.length})
            </button>
          </div>

          <button
            onClick={() => setIsCreateMedicineOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-teal-500 text-slate-950 font-extrabold text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>+ Add Medicine & Alarm</span>
          </button>
        </div>
      </div>

      {viewMode === 'schedule' ? (
        <div className="space-y-6">
          
          {/* Daily Adherence Progress Bar */}
          <GlassPanel variant="base" className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shadow-glow-emerald">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Daily Medication Adherence</h3>
                <p className="text-xs text-slate-400">
                  {takenCount} of {reminders.length} doses logged for today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-40 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-teal to-brand-emerald transition-all duration-500"
                  style={{ width: `${adherencePercent}%` }}
                />
              </div>
              <span className="text-sm font-mono font-bold text-brand-emerald">{adherencePercent}%</span>
            </div>
          </GlassPanel>

          {/* Today's Action Timeline Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Scheduled Daily Doses
              </span>
              {reminders.length > 0 && (
                <button
                  onClick={() => handleTestAlarm('Scheduled Medications')}
                  className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Audio Alarm Chime</span>
                </button>
              )}
            </div>

            {reminders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reminders.map(rem => {
                  const isTaken = rem.status === 'TAKEN';
                  const isSkipped = rem.status === 'SKIPPED';

                  return (
                    <GlassPanel
                      key={rem.id}
                      variant="base"
                      className={clsx(
                        "p-4 flex flex-col justify-between space-y-3 transition-all",
                        isTaken && "opacity-75 border-brand-emerald/30 bg-brand-emerald/[0.02]"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-brand-cyan px-2 py-0.5 rounded bg-black/40 border border-white/10 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{rem.time}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              {rem.period}
                            </span>
                          </div>

                          <h4 className={clsx(
                            "text-sm font-bold text-white",
                            isTaken && "line-through text-slate-400"
                          )}>
                            {rem.medicineName}
                          </h4>
                          <p className="text-xs text-brand-emerald font-mono font-medium">
                            {rem.dosage}
                          </p>
                        </div>

                        {/* Status Icon */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTestAlarm(rem.medicineName)}
                            title="Test Alarm Sound"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-brand-cyan transition-colors"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {isTaken ? `Taken at ${rem.takenAt || 'today'}` : 'Scheduled Dose'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleReminderStatus(rem.id)}
                            className={clsx(
                              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                              isTaken
                                ? "bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40"
                                : "bg-brand-emerald text-slate-950 hover:brightness-110 shadow-glow-emerald"
                            )}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isTaken ? 'Dose Taken ✓' : 'Take Dose'}</span>
                          </button>
                        </div>
                      </div>
                    </GlassPanel>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-[#090d16] border border-white/10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald mx-auto shadow-glow-emerald">
                  <Bell className="w-7 h-7 animate-pulse-subtle" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-white">No Medicines or Alarms Scheduled</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Add your prescribed tablets, syrups, or inhalers to receive audio and visual alarms at your designated times.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateMedicineOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110"
                >
                  + Add Medication & Configure Alarms
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <MedicineList />
      )}
    </div>
  );
};
