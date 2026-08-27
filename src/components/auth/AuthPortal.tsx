import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { UserRole } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Activity, 
  Stethoscope, 
  Landmark, 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Database,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { DATABASE_TYPE } from '../../services/db';

export const AuthPortal: React.FC = () => {
  const { login, register } = usePatient();
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign in state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Patient fields
  const [regAge, setRegAge] = useState<number>(26);
  const [regGender, setRegGender] = useState('Male');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regAbhaId, setRegAbhaId] = useState('');

  // Doctor fields
  const [regDocRegNo, setRegDocRegNo] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('Orthopedic & Trauma Surgery');
  const [regHospital, setRegHospital] = useState('SMS Hospital & Medical College, Jaipur');

  // Government fields
  const [regOfficialId, setRegOfficialId] = useState('');
  const [regDepartment, setRegDepartment] = useState('National Health Authority (NHA)');

  // Researcher fields
  const [regInstitutionId, setRegInstitutionId] = useState('');

  const roles = [
    {
      id: 'PATIENT' as UserRole,
      title: 'Patient',
      subtitle: 'Personal Health Journey & Medical Vault',
      icon: Activity,
      color: 'text-brand-cyan',
      border: 'border-brand-cyan/40',
      bgGlow: 'from-brand-cyan/20 to-teal-500/10'
    },
    {
      id: 'DOCTOR' as UserRole,
      title: 'Doctor / Provider',
      subtitle: 'Clinical Directives & QR Scanner',
      icon: Stethoscope,
      color: 'text-brand-emerald',
      border: 'border-brand-emerald/40',
      bgGlow: 'from-brand-emerald/20 to-teal-500/10'
    },
    {
      id: 'GOVERNMENT_OFFICIAL' as UserRole,
      title: 'Government Official',
      subtitle: 'PM-JAY Scheme & Case Verification',
      icon: Landmark,
      color: 'text-brand-amber',
      border: 'border-brand-amber/40',
      bgGlow: 'from-brand-amber/20 to-yellow-500/10'
    },
    {
      id: 'RESEARCHER' as UserRole,
      title: 'Medical Researcher',
      subtitle: 'De-identified Case Study Studies',
      icon: GraduationCap,
      color: 'text-brand-violet',
      border: 'border-brand-violet/40',
      bgGlow: 'from-brand-violet/20 to-purple-500/10'
    }
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, loginIdentifier, loginPassword);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      role: selectedRole,
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      age: selectedRole === 'PATIENT' ? regAge : undefined,
      gender: selectedRole === 'PATIENT' ? regGender : undefined,
      bloodGroup: selectedRole === 'PATIENT' ? regBloodGroup : undefined,
      abhaId: selectedRole === 'PATIENT' ? (regAbhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      doctorRegNo: selectedRole === 'DOCTOR' ? (regDocRegNo || 'MCI-2026-VERIFIED') : undefined,
      specialty: selectedRole === 'DOCTOR' ? regSpecialty : undefined,
      hospitalAffiliation: selectedRole === 'DOCTOR' ? regHospital : undefined,
      officialId: selectedRole === 'GOVERNMENT_OFFICIAL' ? (regOfficialId || 'NHA-OFFICIAL-2026') : undefined,
      department: selectedRole === 'GOVERNMENT_OFFICIAL' ? regDepartment : undefined,
      institutionId: selectedRole === 'RESEARCHER' ? (regInstitutionId || 'AIIMS-ACAD-2026') : undefined
    });
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col justify-between spatial-mesh relative p-4 sm:p-8">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-cyan/20 via-brand-teal/15 to-brand-emerald/20 border border-brand-cyan/40 flex items-center justify-center shadow-glow-cyan">
            <Activity className="w-6 h-6 text-brand-cyan animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AURA
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 font-mono">
                LONGITUDINAL V2.1
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              One Patient. One Continuous Medical History.
            </p>
          </div>
        </div>

        {/* Database Specification Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1524] border border-white/10 text-[11px] text-slate-400 font-mono shadow-spatial-sm">
          <Database className="w-3.5 h-3.5 text-brand-emerald" />
          <span className="hidden sm:inline">Database Engine:</span>
          <strong className="text-white">PostgreSQL & Secure Vault</strong>
        </div>
      </div>

      {/* Main Center Auth Gateway */}
      <div className="max-w-4xl mx-auto w-full my-8 z-10 space-y-6">
        
        {/* Role Selector Grid */}
        <div>
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Your Access Portal
            </h2>
            <p className="text-xs text-slate-400">
              Each portal provides dedicated workspace tools scoped specifically to your role.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {roles.map(r => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={clsx(
                    "p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-spatial-sm",
                    isSelected
                      ? `bg-gradient-to-b ${r.bgGlow} ${r.border} shadow-[0_0_20px_rgba(6,182,212,0.18)] ring-1 ring-white/20`
                      : "bg-[#090d16]/75 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10", r.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">{r.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                      {r.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Form Container (Sign In / Register) */}
        <GlassPanel variant="base" className="max-w-xl mx-auto p-6 sm:p-8 space-y-6 shadow-spatial-xl">
          
          {/* Auth Mode Switcher */}
          <div className="flex items-center bg-[#05070b] p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={clsx(
                "flex-1 py-2 rounded-lg font-bold transition-all text-center",
                authMode === 'signin' ? "bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 shadow-glow-teal font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              Sign In to {roles.find(r => r.id === selectedRole)?.title}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={clsx(
                "flex-1 py-2 rounded-lg font-bold transition-all text-center",
                authMode === 'register' ? "bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 shadow-glow-teal font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              Register New Account
            </button>
          </div>

          {/* SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs animate-fadeIn">
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  {selectedRole === 'PATIENT' ? 'Email, Phone, or ABHA ID *' :
                   selectedRole === 'DOCTOR' ? 'Doctor Name, Email, or MCI Reg No *' :
                   selectedRole === 'GOVERNMENT_OFFICIAL' ? 'Official ID or Email *' :
                   'Researcher ID or Email *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedRole === 'PATIENT' ? 'e.g. Krithik or 8778537405 or 91-4920-8193-4412' :
                    selectedRole === 'DOCTOR' ? 'e.g. Dr. Ram or dr.ram@sms.gov.in' :
                    selectedRole === 'GOVERNMENT_OFFICIAL' ? 'e.g. NHA-VERIF-DEL-889' :
                    'e.g. smehta@aiims.edu.in'
                  }
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-3 pr-10 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-teal hover:brightness-110 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate & Enter {roles.find(r => r.id === selectedRole)?.title} Portal</span>
                </button>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Instant Verified Access</span>
                  <span className="text-brand-emerald font-bold">1-Click Auto-Fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('PATIENT');
                      setLoginIdentifier('Krithik');
                      setLoginPassword('Krithik@2007');
                    }}
                    className="p-2.5 rounded-xl bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-left text-[11px] transition-all"
                  >
                    <div className="font-bold text-brand-cyan">Patient: Krithik</div>
                    <div className="text-slate-400 text-[10px]">Pass: Krithik@2007</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('DOCTOR');
                      setLoginIdentifier('Dr. Ram');
                      setLoginPassword('Krithik@2007');
                    }}
                    className="p-2.5 rounded-xl bg-brand-emerald/10 hover:bg-brand-emerald/20 border border-brand-emerald/30 text-left text-[11px] transition-all"
                  >
                    <div className="font-bold text-brand-emerald">Doctor: Dr. Ram</div>
                    <div className="text-slate-400 text-[10px]">Pass: Krithik@2007</div>
                  </button>
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-brand-cyan font-bold hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs animate-fadeIn">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'DOCTOR' ? 'e.g. Dr. Ram, MS Ortho' : 'e.g. Krithik'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. krithik@aura.health"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 8778537405"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Patient specific details */}
              {selectedRole === 'PATIENT' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Age</label>
                      <input
                        type="number"
                        value={regAge}
                        onChange={(e) => setRegAge(Number(e.target.value))}
                        className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Gender</label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value)}
                        className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Blood Group</label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value)}
                        className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-brand-rose font-bold"
                      >
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">ABHA Health ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 91-4920-8193-4412"
                      value={regAbhaId}
                      onChange={(e) => setRegAbhaId(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-brand-cyan font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Doctor specific details */}
              {selectedRole === 'DOCTOR' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">MCI / NMC Reg Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. MCI-2014-9812"
                        value={regDocRegNo}
                        onChange={(e) => setRegDocRegNo(e.target.value)}
                        className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-brand-emerald font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Specialty</label>
                      <input
                        type="text"
                        placeholder="e.g. MS Orthopedics"
                        value={regSpecialty}
                        onChange={(e) => setRegSpecialty(e.target.value)}
                        className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Hospital Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. SMS Hospital & Medical College, Jaipur"
                      value={regHospital}
                      onChange={(e) => setRegHospital(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Government specific details */}
              {selectedRole === 'GOVERNMENT_OFFICIAL' && (
                <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Official ID / Clearance Code</label>
                    <input
                      type="text"
                      placeholder="e.g. NHA-VERIF-DEL-889"
                      value={regOfficialId}
                      onChange={(e) => setRegOfficialId(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-brand-amber font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Statutory Department</label>
                    <input
                      type="text"
                      placeholder="e.g. National Health Authority (NHA) & PM-JAY Registry"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full bg-[#0f1524] border border-white/10 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">Create Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Set a secure password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#0f1524] border border-white/10 rounded-xl p-3 pr-10 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-teal hover:brightness-110 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Create Account & Save to Database</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 pt-2">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-brand-cyan font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </GlassPanel>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 font-mono z-10 pt-4 border-t border-white/[0.06]">
        AURA Longitudinal Health Enclave • {DATABASE_TYPE} • All accounts & incidents permanently stored in PostgreSQL
      </div>
    </div>
  );
};
