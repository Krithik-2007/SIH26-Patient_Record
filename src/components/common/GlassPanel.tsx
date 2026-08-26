import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'base' | 'elevated' | 'highlight' | 'glow-teal' | 'glow-emerald' | 'glow-amber' | 'interactive';
  depth?: 1 | 2 | 3;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  variant = 'base',
  depth = 1,
  ...props
}) => {
  const variantStyles = {
    base: 'bg-[#090d16]/75 backdrop-blur-xl border border-white/[0.07] shadow-spatial-sm',
    elevated: 'bg-[#0f1524]/85 backdrop-blur-2xl border border-white/[0.1] shadow-spatial-md',
    highlight: 'bg-[#151e32]/90 backdrop-blur-2xl border border-brand-cyan/35 shadow-glow-cyan',
    'glow-teal': 'bg-[#090d16]/90 backdrop-blur-xl border border-brand-teal/40 shadow-glow-teal',
    'glow-emerald': 'bg-[#090d16]/90 backdrop-blur-xl border border-brand-emerald/40 shadow-glow-emerald',
    'glow-amber': 'bg-[#090d16]/90 backdrop-blur-xl border border-brand-amber/40 shadow-glow-amber',
    interactive: 'glass-surface-interactive cursor-pointer'
  };

  const depthStyles = {
    1: 'hover:border-white/[0.14] transition-all duration-300',
    2: 'hover:border-brand-cyan/40 hover:-translate-y-0.5 transition-all duration-300',
    3: 'hover:shadow-spatial-xl transition-all duration-300'
  };

  return (
    <div
      className={twMerge(
        'rounded-2xl relative overflow-hidden',
        variantStyles[variant],
        depthStyles[depth],
        className
      )}
      {...props}
    >
      {/* Subtle top surface specular light highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
