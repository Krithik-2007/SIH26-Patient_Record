import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: { text: string; type: 'success' | 'info' | 'warning' } | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#131824]/95 backdrop-blur-2xl border border-white/10 shadow-spatial-lg text-sm"
        >
          {message.type === 'success' && <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />}
          {message.type === 'info' && <Info className="w-5 h-5 text-brand-cyan shrink-0" />}
          {message.type === 'warning' && <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0" />}

          <span className="text-slate-100 font-medium">{message.text}</span>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
