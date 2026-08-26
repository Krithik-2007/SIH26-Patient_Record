import React from 'react';
import { usePatient } from '../../context/PatientContext';
import { Medicine } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { Pill, Clock, Calendar, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export const MedicineList: React.FC = () => {
  const { medicines, setSelectedIncidentId } = usePatient();

  const activeMedicines = medicines.filter(m => m.active);
  const pastMedicines = medicines.filter(m => !m.active);

  return (
    <div className="space-y-6">
      
      {/* Active Medications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-emerald flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span>Currently Active Pharmacotherapy ({activeMedicines.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Linked to incidents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMedicines.map(med => (
            <GlassPanel key={med.id} variant="base" className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{med.name}</h4>
                    <span className="font-mono text-xs text-brand-cyan font-bold">{med.dosage}</span>
                  </div>
                  <Badge source={med.source} />
                </div>

                <p className="text-xs text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5 leading-relaxed mb-3">
                  {med.instructions}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div className="p-2 rounded bg-black/30">
                    <span className="text-slate-500 block">Frequency:</span>
                    <span className="text-slate-200 font-semibold">{med.frequency}</span>
                  </div>
                  <div className="p-2 rounded bg-black/30">
                    <span className="text-slate-500 block">Duration:</span>
                    <span className="text-slate-200 font-semibold">{med.duration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedIncidentId(med.incidentId)}
                  className="text-brand-teal font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Prescribed in {med.incidentId}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-slate-500 font-mono text-[10px]">
                  {med.startDate} → {med.endDate}
                </span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Past Completed Medications */}
      {pastMedicines.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Completed / Historical Prescriptions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastMedicines.map(med => (
              <GlassPanel key={med.id} variant="base" className="p-4 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{med.name}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">{med.dosage} • {med.frequency}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Completed
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-2">
                  Incident: {med.incidentId} • {med.duration}
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
