import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { Modal } from '../common/Modal';
import { Pill, Clock, Plus, X, Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import { playMedicationAlarmSound } from '../../utils/audioAlarm';

interface CreateMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMedicineModal: React.FC<CreateMedicineModalProps> = ({ isOpen, onClose }) => {
  const { incidents, addMedicineAndReminder, showToast } = usePatient();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet (650mg)');
  const [frequency, setFrequency] = useState('Twice Daily (Morning & Night)');
  const [duration, setDuration] = useState('7 Days');
  const [instructions, setInstructions] = useState('Take strictly after meals with water.');
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || 'INC-001');
  
  // Custom Alarm Times list
  const [alarmTimes, setAlarmTimes] = useState<string[]>(['08:00 AM', '08:30 PM']);
  const [customTimeInput, setCustomTimeInput] = useState('02:00 PM');

  const handleAddTime = () => {
    if (customTimeInput && !alarmTimes.includes(customTimeInput)) {
      setAlarmTimes([...alarmTimes, customTimeInput]);
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    setAlarmTimes(alarmTimes.filter(t => t !== timeToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || alarmTimes.length === 0) return;

    addMedicineAndReminder({
      incidentId: selectedIncidentId,
      name,
      dosage,
      frequency,
      duration,
      instructions,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: 'As Scheduled',
      active: true
    }, alarmTimes);

    // Play test confirmation chime
    playMedicationAlarmSound();

    // Reset
    setName('');
    setDosage('1 Tablet (650mg)');
    setAlarmTimes(['08:00 AM', '08:30 PM']);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Medicine & Schedule Alarm Reminders"
      subtitle="Configure dosage, frequency, and timed audio-visual medication alerts."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        <div>
          <label className="block text-slate-400 font-mono mb-1">Medicine Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Tab Paracetamol 650mg, Cap Amoxicillin 500mg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-emerald/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Dosage</label>
            <input
              type="text"
              placeholder="e.g. 1 Tablet (650mg)"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-mono mb-1">Duration</label>
            <input
              type="text"
              placeholder="e.g. 7 Days, Ongoing"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Timed Alarms Picker */}
        <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-brand-emerald font-bold flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-brand-emerald animate-bounce-subtle" />
              <span>Scheduled Daily Alarm Times ({alarmTimes.length})</span>
            </span>
            <button
              type="button"
              onClick={playMedicationAlarmSound}
              className="text-[10px] font-mono text-brand-cyan hover:underline"
            >
              🔊 Test Chime
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {alarmTimes.map((time, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 font-mono font-bold"
              >
                <Clock className="w-3 h-3" />
                <span>{time}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTime(time)}
                  className="hover:text-brand-rose ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <select
              value={customTimeInput}
              onChange={(e) => setCustomTimeInput(e.target.value)}
              className="bg-[#131824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
            >
              <option value="07:00 AM">07:00 AM (Early Morning)</option>
              <option value="08:00 AM">08:00 AM (Breakfast)</option>
              <option value="01:30 PM">01:30 PM (Lunch)</option>
              <option value="05:00 PM">05:00 PM (Evening)</option>
              <option value="08:30 PM">08:30 PM (Dinner)</option>
              <option value="10:00 PM">10:00 PM (Bedtime)</option>
            </select>
            
            <button
              type="button"
              onClick={handleAddTime}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Time</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-mono mb-1">Clinical Instructions</label>
          <input
            type="text"
            placeholder="e.g. Take strictly after meals with water"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-emerald to-teal-500 text-slate-950 font-extrabold text-xs shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          <span>Save Medicine & Activate Timed Alarm Reminders</span>
        </button>
      </form>
    </Modal>
  );
};
