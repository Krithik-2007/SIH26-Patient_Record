import React from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Server, 
  FileText, 
  UserCheck, 
  Stethoscope, 
  AlertCircle 
} from 'lucide-react';

export const AccessHistoryLog: React.FC = () => {
  const { accessLogs, accessGrants } = usePatient();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Immutable Access Audit Log ({accessLogs.length} Events)
        </h3>
        <span className="text-[11px] text-brand-cyan font-mono">
          Cryptographically Verified
        </span>
      </div>

      <div className="space-y-3">
        {accessLogs.map(log => (
          <GlassPanel key={log.id} variant="base" className="p-4 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-cyan">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{log.recipientName}</h4>
                  <span className="text-[11px] text-slate-400">{log.recipientRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{log.timestamp}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="text-[11px] text-slate-400">
                Authorized Purpose: <strong className="text-slate-200">{log.purpose}</strong>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Records Handled:</span>
                {log.recordsAccessed.map((rec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-brand-cyan font-mono text-[10px]">
                    {rec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-slate-600" />
                <span>Gateway: {log.ipAddress}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-600" />
                <span>{log.location}</span>
              </span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};
