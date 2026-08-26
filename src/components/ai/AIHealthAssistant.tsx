import React, { useState, useRef, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { 
  Sparkles, 
  Send, 
  ShieldAlert, 
  FileText, 
  Activity, 
  Pill, 
  Stethoscope, 
  ArrowUpRight, 
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Dumbbell,
  Leaf,
  FlaskConical,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

// Clean text formatter removing raw markdown symbols (##, ###, **, *, `)
const formatCleanAIText = (text: string) => {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
};

export const AIHealthAssistant: React.FC = () => {
  const { 
    aiMessages, 
    sendAIMessage, 
    incidents, 
    documents, 
    medicines, 
    doctorSuggestions,
    aiMode,
    setAiMode,
    setSelectedIncidentId
  } = usePatient();

  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isSending]);

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
  const closedIncidents = incidents.filter(i => i.status === 'CLOSED');
  const primaryActive = activeIncidents[0];

  const hasActiveFever = incidents.some(i => i.status === 'ACTIVE' && i.title.toLowerCase().includes('fever'));
  const hasActiveFracture = incidents.some(i => i.status === 'ACTIVE' && (i.title.toLowerCase().includes('fracture') || i.diagnosis.toLowerCase().includes('fracture') || i.reason.toLowerCase().includes('fall') || i.title.toLowerCase().includes('arm')));

  // Contextual Dynamic Suggestions
  const suggestedPrompts = aiMode === 'AYURVEDIC'
    ? [
        'What is my current medical problem in Ayurveda?',
        'My current medical problem...What should I eat to cure it?',
        'What Ayurvedic herbs help my bone fracture heal faster?',
        'Can I eat ice cream with active fever in Ayurveda?',
        'Explain my Tridosha balance (Vata-Pitta-Kapha).'
      ]
    : hasActiveFracture
    ? [
        'What is my current medical problem?',
        'My current medical problem...What should I eat to cure it?',
        'Can I lift anything heavy with my fracture?',
        'Can I go running with my broken arm in cast?',
        'What did Dr. Ram recommend for my recovery?'
      ]
    : hasActiveFever
    ? [
        'What is my current medical problem?',
        'Can I eat ice cream with my active fever?',
        'What foods should I eat to recover from fever?',
        'Can I go for a run today?'
      ]
    : [
        'What is my current medical condition?',
        'Can I eat ice cream if I feel healthy?',
        'Can I lift weights if I have no pain?',
        'If I have asthma, what would happen if I go running?'
      ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isSending) return;

    setInputQuery('');
    setIsSending(true);
    await sendAIMessage(text);
    setIsSending(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Grounded Clinical Intelligence</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Evidence Grounding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Health Assistant
          </h1>
        </div>

        {/* Dual Mode Switcher: Allopathic vs Ayurvedic */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-[#090d16] p-1 rounded-xl border border-white/[0.08] shadow-spatial-sm text-xs">
            <button
              onClick={() => setAiMode('ALLOPATHIC')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
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
                "px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
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

      {/* Dynamic Context Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#090d16]/80 border border-white/[0.08] text-xs backdrop-blur-xl shadow-spatial-sm">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span>Active Patient Context:</span>
          <strong className="text-brand-emerald">{activeIncidents.length} Active Incident(s)</strong>
          {primaryActive && (
            <span className="text-white font-medium">({primaryActive.title} under {primaryActive.doctor})</span>
          )}
          {closedIncidents.length > 0 && (
            <span className="text-slate-500">• {closedIncidents.length} Cured & Closed</span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-400">Clinical Reasoning Engine:</span>
          <span className={clsx(
            "px-2.5 py-0.5 rounded-full font-bold uppercase border",
            aiMode === 'AYURVEDIC' 
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
              : "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30"
          )}>
            {aiMode === 'AYURVEDIC' ? '🌿 Tridosha & Classical Dhatu Nutrition' : '🏥 Clinical Pharmacology & Trauma Care'}
          </span>
        </div>
      </div>

      {/* Main Chat & Intelligence Workspace */}
      <div className="rounded-3xl bg-gradient-to-b from-[#090d16] via-[#0f1524] to-[#05070b] border border-white/[0.08] shadow-spatial-xl p-6 flex flex-col justify-between min-h-[540px] space-y-6">
        
        {/* Messages Feed */}
        <div className="space-y-6 overflow-y-auto max-h-[520px] pr-2">
          {aiMessages.map(msg => {
            const isAssistant = msg.role === 'assistant';
            const isNegativeVerdict = msg.content.includes('⛔') || msg.content.includes('NO, YOU SHOULD STRICTLY AVOID') || msg.content.includes('AVOID RUNNING');
            const isCautionVerdict = msg.content.includes('⚠️');
            const cleanContent = formatCleanAIText(msg.content);

            return (
              <div
                key={msg.id}
                className={clsx(
                  "flex gap-3.5 max-w-3xl animate-fadeIn",
                  isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                )}
              >
                {/* Avatar Icon */}
                <div className={clsx(
                  "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md",
                  isAssistant 
                    ? msg.mode === 'AYURVEDIC'
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-glow-emerald"
                      : "bg-gradient-to-tr from-brand-teal/30 via-brand-cyan/20 to-brand-emerald/20 border border-brand-teal/50 text-brand-cyan shadow-glow-teal" 
                    : "bg-[#1f293d] text-white border border-white/10"
                )}>
                  {isAssistant ? (
                    msg.mode === 'AYURVEDIC' ? <Leaf className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse-subtle" />
                  ) : 'YOU'}
                </div>

                {/* Message Bubble */}
                <div className={clsx(
                  "rounded-2xl p-5 text-xs space-y-3 shadow-spatial-sm",
                  isAssistant
                    ? "bg-[#0f1524]/90 backdrop-blur-xl border border-white/[0.08] text-slate-200"
                    : "bg-gradient-to-r from-brand-teal via-cyan-500 to-sky-500 text-slate-950 font-bold text-[13px]"
                )}>
                  
                  {/* Verdict Pill Badge */}
                  {isAssistant && (isNegativeVerdict || isCautionVerdict) && (
                    <div className={clsx(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border",
                      isNegativeVerdict 
                        ? "bg-brand-rose/15 text-brand-rose border-brand-rose/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        : "bg-brand-amber/15 text-brand-amber border-brand-amber/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    )}>
                      {isNegativeVerdict ? <XCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{isNegativeVerdict ? 'Clinical Verdict: Activity Restricted' : 'Clinical Caution: Precaution Advised'}</span>
                    </div>
                  )}

                  {/* Clean Content Lines */}
                  <div className="whitespace-pre-line leading-relaxed text-slate-200 text-xs space-y-2 font-normal">
                    {cleanContent}
                  </div>

                  {/* Grounded Citations & References */}
                  {msg.groundedSources && msg.groundedSources.length > 0 && (
                    <div className="pt-3 border-t border-white/[0.08] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                        Grounded Evidence In Your Record:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundedSources.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (src.type === 'INCIDENT') setSelectedIncidentId(src.refId);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-brand-cyan/30 hover:border-brand-cyan text-[11px] font-mono text-brand-cyan transition-all"
                          >
                            <FileText className="w-3 h-3 text-brand-cyan" />
                            <span className="font-bold">{src.refId}</span>
                            <span className="text-slate-400 truncate max-w-[180px]">({src.title})</span>
                            <ArrowUpRight className="w-3 h-3 text-brand-cyan" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-brand-cyan p-3 rounded-xl bg-white/[0.02]">
              <Sparkles className="w-4 h-4 animate-spin text-brand-cyan" />
              <span>
                {aiMode === 'AYURVEDIC' 
                  ? 'Synthesizing Ayurvedic Tridosha analysis & classical herbs...'
                  : 'Analyzing active medical episodes and synthesizing clinical precautions...'}
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Bottom Input Area & Quick Action Chips */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
          
          {/* Quick Context Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-brand-cyan/15 hover:border-brand-cyan/40 hover:text-brand-cyan border border-white/10 text-[11px] text-slate-300 whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Text Input Form Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 bg-[#090d16] border border-white/10 focus-within:border-brand-cyan/60 rounded-2xl p-1.5 shadow-inner transition-all"
          >
            <input
              type="text"
              placeholder={aiMode === 'AYURVEDIC' 
                ? "Ask about bone-healing diet (Hadjod, Ashwagandha, Milk + Ghee), Tridosha, or Pathya..."
                : "Ask about your active condition, bone fracture diet, heavy lifting, ice cream, or medicines..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isSending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-teal hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
