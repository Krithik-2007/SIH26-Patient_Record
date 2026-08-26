import React from 'react';
import { clsx } from 'clsx';
import { Sparkles, Stethoscope, User, ShieldCheck, AlertTriangle, Pill } from 'lucide-react';

interface BadgeProps {
  type?: 'source' | 'status' | 'severity' | 'custom';
  source?: 'PATIENT_PROVIDED' | 'DOCTOR_RECORDED' | 'AI_EXTRACTED' | 'PRESCRIPTION';
  status?: string;
  severity?: string;
  variant?: 'teal' | 'emerald' | 'amber' | 'rose' | 'slate' | 'violet';
  label?: string;
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'custom',
  source,
  status,
  severity,
  variant = 'teal',
  label,
  icon = true,
  className = ''
}) => {
  if (type === 'source' || source) {
    const src = source || 'PATIENT_PROVIDED';
    if (src === 'DOCTOR_RECORDED') {
      return (
        <span className={clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wider uppercase border",
          "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
          className
        )}>
          {icon && <Stethoscope className="w-3 h-3 text-brand-emerald" />}
          <span>Doctor Recorded</span>
        </span>
      );
    }
    if (src === 'AI_EXTRACTED') {
      return (
        <span className={clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wider uppercase border",
          "bg-brand-teal/10 text-brand-cyan border-brand-teal/30 shadow-[0_0_12px_rgba(14,165,233,0.15)]",
          className
        )}>
          {icon && <Sparkles className="w-3 h-3 text-brand-cyan animate-pulse" />}
          <span>AI Extracted</span>
        </span>
      );
    }
    if (src === 'PRESCRIPTION') {
      return (
        <span className={clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wider uppercase border",
          "bg-brand-teal/10 text-brand-teal border-brand-teal/30",
          className
        )}>
          {icon && <Pill className="w-3 h-3 text-brand-teal" />}
          <span>Prescription</span>
        </span>
      );
    }
    return (
      <span className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wider uppercase border",
        "bg-brand-slate/10 text-slate-300 border-slate-700",
        className
      )}>
        {icon && <User className="w-3 h-3 text-slate-400" />}
        <span>Patient Provided</span>
      </span>
    );
  }

  if (type === 'severity' || severity) {
    const sev = severity || 'MODERATE';
    const styles = {
      CRITICAL: 'bg-brand-rose/10 text-brand-rose border-brand-rose/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
      MODERATE: 'bg-brand-amber/10 text-brand-amber border-brand-amber/30',
      MILD: 'bg-brand-teal/10 text-brand-cyan border-brand-teal/30',
      ROUTINE: 'bg-slate-800 text-slate-300 border-slate-700'
    }[sev as 'CRITICAL' | 'MODERATE' | 'MILD' | 'ROUTINE'] || 'bg-slate-800 text-slate-300 border-slate-700';

    return (
      <span className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
        styles,
        className
      )}>
        {sev === 'CRITICAL' && <AlertTriangle className="w-2.5 h-2.5" />}
        <span>{sev}</span>
      </span>
    );
  }

  if (type === 'status' || status) {
    const stat = status || 'ACTIVE';
    const isAct = stat === 'ACTIVE';
    return (
      <span className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
        isAct 
          ? "bg-brand-teal/15 text-brand-cyan border-brand-teal/30" 
          : "bg-slate-800 text-slate-400 border-slate-700",
        className
      )}>
        <span className={clsx("w-1.5 h-1.5 rounded-full", isAct ? "bg-brand-cyan animate-ping" : "bg-slate-500")} />
        <span>{stat.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  const customStyles = {
    teal: 'bg-brand-teal/10 text-brand-cyan border-brand-teal/30',
    emerald: 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30',
    amber: 'bg-brand-amber/10 text-brand-amber border-brand-amber/30',
    rose: 'bg-brand-rose/10 text-brand-rose border-brand-rose/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
    violet: 'bg-brand-violet/10 text-brand-violet border-brand-violet/30'
  }[variant];

  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border",
      customStyles,
      className
    )}>
      {label}
    </span>
  );
};
