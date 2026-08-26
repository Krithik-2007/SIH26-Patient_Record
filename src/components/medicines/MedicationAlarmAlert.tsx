import React, { useEffect, useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { Reminder } from '../../types';
import { Bell, CheckCircle2, Clock, X, Pill } from 'lucide-react';
import { playMedicationAlarmSound } from '../../utils/audioAlarm';

export const MedicationAlarmAlert: React.FC = () => {
  const { reminders, toggleReminderStatus } = usePatient();
  const [activeAlertReminder, setActiveAlertReminder] = useState<Reminder | null>(null);

  // Check every 30 seconds if any reminder matches current time
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const ampm = currentHours >= 12 ? 'PM' : 'AM';
      const hours12 = currentHours % 12 || 12;
      const formattedCurrentTime = `${hours12.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')} ${ampm}`;

      const dueReminder = reminders.find(r => 
        r.status === 'PENDING' && 
        r.time.toLowerCase().trim() === formattedCurrentTime.toLowerCase().trim()
      );

      if (dueReminder && (!activeAlertReminder || activeAlertReminder.id !== dueReminder.id)) {
        setActiveAlertReminder(dueReminder);
        playMedicationAlarmSound();
      }
    };

    const interval = setInterval(checkAlarms, 15000);
    return () => clearInterval(interval);
  }, [reminders, activeAlertReminder]);

  if (!activeAlertReminder) return null;

  const handleTakeDose = () => {
    toggleReminderStatus(activeAlertReminder.id);
    setActiveAlertReminder(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-subtle p-1">
      <div className="rounded-3xl bg-[#0e1422] border-2 border-brand-emerald p-5 shadow-[0_0_35px_rgba(16,185,129,0.35)] space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-emerald font-mono font-bold text-xs uppercase tracking-wider">
            <span className="w-3 h-3 rounded-full bg-brand-emerald animate-ping" />
            <Bell className="w-4 h-4 text-brand-emerald animate-bounce" />
            <span>Medication Alarm Due Now</span>
          </div>
          <button
            onClick={() => setActiveAlertReminder(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Medicine Details */}
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-white">
            {activeAlertReminder.medicineName}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <span className="text-brand-cyan font-bold">{activeAlertReminder.dosage}</span>
            <span>•</span>
            <span className="text-slate-400">Scheduled: {activeAlertReminder.time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleTakeDose}
            className="flex-1 py-2.5 rounded-xl bg-brand-emerald text-slate-950 font-extrabold text-xs shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Dose as Taken</span>
          </button>

          <button
            onClick={() => setActiveAlertReminder(null)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs transition-colors"
          >
            Snooze 5m
          </button>
        </div>
      </div>
    </div>
  );
};
