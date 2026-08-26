import React from 'react';
import { usePatient } from '../../context/PatientContext';
import { 
  Activity, 
  Layers, 
  FileText, 
  Pill, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  HeartHandshake, 
  GraduationCap, 
  Plus, 
  User, 
  Stethoscope, 
  Landmark, 
  BookOpen,
  LogOut,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';

interface SpatialShellProps {
  children: React.ReactNode;
}

export const SpatialShell: React.FC<SpatialShellProps> = ({ children }) => {
  const { 
    currentUser,
    logout,
    patient, 
    activeTab, 
    setActiveTab, 
    activeRole, 
    setIsCreateIncidentOpen,
    accessGrants,
    reminders,
    incidents,
    documents
  } = usePatient();

  const activeGrant = accessGrants.find(g => g.status === 'ACTIVE');
  const pendingRemindersCount = reminders.filter(r => r.status === 'PENDING').length;

  const patientNavItems = [
    { id: 'home', label: 'Health Journey', icon: Activity, badge: null },
    { id: 'timeline', label: 'Medical Timeline', icon: Layers, badge: null },
    { id: 'incidents', label: 'Episodes & Incidents', icon: Activity, badge: incidents.length > 0 ? `${incidents.length}` : null },
    { id: 'documents', label: 'Document Vault', icon: FileText, badge: documents.length > 0 ? `${documents.length}` : null },
    { id: 'medicines', label: 'Medicines & Alarms', icon: Pill, badge: pendingRemindersCount > 0 ? `${pendingRemindersCount}` : null },
    { id: 'ai', label: 'Clinical AI Intelligence', icon: Sparkles, badge: 'Grounded' },
    { id: 'share', label: 'Secure QR Share', icon: QrCode, badge: activeGrant ? 'Active' : null },
    { id: 'schemes', label: 'Healthcare Schemes', icon: Landmark, badge: 'Eligible' },
    { id: 'donations', label: 'Crowdfunding Aid', icon: HeartHandshake, badge: null },
    { id: 'casestudies', label: 'Research Studies', icon: GraduationCap, badge: null },
    { id: 'privacy', label: 'Privacy & Audit Log', icon: ShieldCheck, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col spatial-mesh relative selection:bg-brand-cyan/20 selection:text-brand-cyan">
      
      {/* Universal Top Spatial Command Header */}
      <header className="sticky top-0 z-40 bg-[#05070b]/85 backdrop-blur-2xl border-b border-white/[0.07] px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Portal Type */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-cyan/20 via-brand-teal/15 to-brand-emerald/20 border border-brand-cyan/40 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-brand-cyan animate-pulse-subtle" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-sans">
                    AURA
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                    {activeRole.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  One Patient. One Continuous Medical History.
                </p>
              </div>
            </button>
          </div>

          {/* Center Patient Identity Ribbon (Patient View Only) */}
          {activeRole === 'PATIENT' && (
            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0f1524]/90 border border-white/[0.08] text-xs shadow-inner">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                <span>{patient.name}</span>
                <span className="text-slate-500 font-normal">({patient.age}y / {patient.bloodGroup})</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                <span className="text-slate-500">ABHA:</span>
                <span className="text-brand-cyan font-medium">{patient.abhaId}</span>
              </div>
            </div>
          )}

          {/* Right Action: User Status & Logout */}
          <div className="flex items-center gap-3">
            
            {/* Logged in User Card */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0f1524] border border-white/10 text-xs">
              <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              <div className="hidden sm:block text-left">
                <div className="font-bold text-white leading-tight truncate max-w-[140px]">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] font-mono text-brand-cyan leading-tight">
                  {activeRole.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Patient Incident Action */}
            {activeRole === 'PATIENT' && (
              <button
                onClick={() => setIsCreateIncidentOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs hover:brightness-110 shadow-glow-teal active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Incident</span>
              </button>
            )}

            {/* Logout / Switch Portal Button */}
            <button
              onClick={logout}
              title="Logout & Switch Portal"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Switch Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
        
        {/* Desktop Navigation Rail (Rendered ONLY for Patient Portal) */}
        {activeRole === 'PATIENT' && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-5">
              
              <div className="bg-[#090d16]/75 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3 shadow-spatial-sm space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Health Space
                </div>

                {patientNavItems.slice(0, 7).map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                        isActive
                          ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/35 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={clsx("w-4 h-4 transition-colors", isActive ? "text-brand-cyan" : "text-slate-500 group-hover:text-slate-300")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={clsx(
                          "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold",
                          isActive ? "bg-brand-cyan/20 text-brand-cyan" : "bg-white/5 text-slate-400"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-2 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Public & Research
                </div>

                {patientNavItems.slice(7).map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                        isActive
                          ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/35 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={clsx("w-4 h-4 transition-colors", isActive ? "text-brand-cyan" : "text-slate-500 group-hover:text-slate-300")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={clsx(
                          "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold",
                          isActive ? "bg-brand-cyan/20 text-brand-cyan" : "bg-white/5 text-slate-400"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Live Access Token Card */}
              <div className="bg-gradient-to-br from-[#090d16] to-[#0f1524] border border-white/[0.08] rounded-2xl p-4 shadow-spatial-sm text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-400 font-medium">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Live Access Token</span>
                  <span className="w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
                </div>

                {activeGrant ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-brand-cyan text-[11px] font-semibold">{activeGrant.token}</span>
                      <span className="text-brand-amber font-mono font-bold text-[11px]">
                        {Math.floor(activeGrant.expiresInSeconds / 60)}:
                        {(activeGrant.expiresInSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{activeGrant.recipientName}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">No active external QR tokens sharing records right now.</p>
                )}

                <button
                  onClick={() => setActiveTab('share')}
                  className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-[11px] transition-colors flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Generate QR Share</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Center Main Content Outlet */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Rail (Only for Patient) */}
      {activeRole === 'PATIENT' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05070b]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around">
          {patientNavItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-[10px] font-medium transition-all relative",
                  isActive ? "text-brand-cyan font-bold" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive && "text-brand-cyan scale-110")} />
                <span>{item.label.split(' ')[0]}</span>
                {item.badge && (
                  <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-brand-cyan" />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
