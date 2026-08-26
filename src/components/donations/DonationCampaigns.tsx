import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { DonationCampaign, DonationCampaignCategory } from '../../types';
import { GlassPanel } from '../common/GlassPanel';
import { Modal } from '../common/Modal';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText,
  Heart,
  Plus,
  CreditCard,
  Smartphone,
  Globe,
  Upload,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';

export const DonationCampaigns: React.FC = () => {
  const { 
    donations, 
    incidents, 
    currentUser, 
    createPatientDonationCampaign, 
    processDonationPayment 
  } = usePatient();

  const [activeTab, setActiveTab] = useState<'global' | 'my_box'>('global');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // Payment Modal State
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<DonationCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(1500);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  // Create Campaign Modal State
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [conditionDesc, setConditionDesc] = useState('');
  const [campaignCategory, setCampaignCategory] = useState<DonationCampaignCategory>('TRAUMA_FRACTURE');
  const [goalAmount, setGoalAmount] = useState<number>(180000);
  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [storySummary, setStorySummary] = useState('');
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  const myCampaigns = donations.filter(c => c.isMyCampaign);
  const globalCampaigns = donations.filter(c => !c.isMyCampaign);

  const filteredGlobalCampaigns = globalCampaigns.filter(camp => {
    if (categoryFilter === 'ALL') return true;
    return camp.category === categoryFilter;
  });

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForDonation) return;
    processDonationPayment(
      selectedCampaignForDonation.id, 
      donationAmount, 
      paymentMethod, 
      donorName || 'Generous Supporter'
    );
    setSelectedCampaignForDonation(null);
  };

  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim() || !conditionDesc.trim()) return;

    await createPatientDonationCampaign({
      title: campaignTitle,
      condition: conditionDesc,
      category: campaignCategory,
      goalAmount,
      hospital: hospitalName || 'Tertiary Medical Center',
      doctorName: doctorName || 'Attending Surgeon',
      summary: storySummary || 'Patient crowdfunding request for specialized medical procedure.'
    }, proofFiles);

    // Reset
    setCampaignTitle('');
    setConditionDesc('');
    setGoalAmount(180000);
    setHospitalName('');
    setDoctorName('');
    setStorySummary('');
    setProofFiles([]);
    setIsCreateCampaignOpen(false);
    setActiveTab('my_box');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-rose uppercase flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Verified Medical Aid & Crowdfunding Network</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Doctor & Hospital Authenticated</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Medical Donations & Aid Box
          </h1>
        </div>

        {/* Action / View Switcher */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center bg-[#0d111a] p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveTab('global')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'global' ? "bg-[#1a2233] text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-white"
              )}
            >
              <Globe className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Global Verified Aid ({globalCampaigns.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('my_box')}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'my_box' ? "bg-[#1a2233] text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-white"
              )}
            >
              <Heart className="w-3.5 h-3.5 text-brand-rose" />
              <span>My Donation Box ({myCampaigns.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateCampaignOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-rose via-rose-500 to-amber-500 text-white font-bold text-xs shadow-glow-amber hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Request Medical Aid Box</span>
          </button>
        </div>
      </div>

      {/* Trust Principles Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
          <span>Doctor Signature Verified via Medical Council</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Building2 className="w-4 h-4 text-brand-cyan shrink-0" />
          <span>Direct Hospital Escrow Disbursement</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-brand-teal shrink-0" />
          <span>Transparent Multi-Channel Giving</span>
        </div>
      </div>

      {/* TAB 1: GLOBAL VERIFIED CAMPAIGNS */}
      {activeTab === 'global' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Global Cases' },
              { id: 'TRAUMA_FRACTURE', label: 'Trauma & Bone Fractures' },
              { id: 'PEDIATRIC', label: 'Pediatric Surgeries' },
              { id: 'SURGERY', label: 'Critical Procedures' },
              { id: 'ONCOLOGY', label: 'Oncology Care' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all border",
                  categoryFilter === cat.id
                    ? "bg-brand-rose/20 text-brand-rose border-brand-rose/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                    : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGlobalCampaigns.map(camp => {
              const percentRaised = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));

              return (
                <GlassPanel
                  key={camp.id}
                  variant="base"
                  className="p-6 flex flex-col justify-between space-y-5"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 text-brand-cyan font-bold">
                        {camp.campaignCode}
                      </span>
                      
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Doctor Verified ✓</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug mb-1">
                      {camp.title}
                    </h3>
                    
                    <div className="text-xs text-brand-rose font-semibold mb-2">
                      Patient: {camp.patientName} ({camp.patientAge}y) • {camp.condition}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{camp.hospital}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Stethoscope className="w-3.5 h-3.5 text-brand-emerald" />
                        <span>{camp.doctorName}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                      {camp.summary}
                    </p>

                    {/* Progress Bar & Amount Raised */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-baseline justify-between text-xs">
                        <div className="text-white font-mono font-bold text-sm">
                          ₹{camp.raisedAmount.toLocaleString('en-IN')}{' '}
                          <span className="text-slate-500 text-xs font-normal">
                            raised of ₹{camp.goalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-brand-emerald font-mono font-bold">{percentRaised}%</span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-rose via-amber-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${percentRaised}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{camp.donorCount} Donors</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-amber" />
                          <span>{camp.daysLeft} Days Remaining</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedCampaignForDonation(camp);
                        setDonationAmount(2000);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose via-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-glow-amber hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Donate to this Medical Case</span>
                    </button>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY MEDICAL AID BOX */}
      {activeTab === 'my_box' && (
        <div className="space-y-6 animate-fadeIn">
          {myCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCampaigns.map(camp => {
                const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
                const isVerified = camp.status === 'VERIFIED_ACTIVE';

                return (
                  <GlassPanel key={camp.id} variant="base" className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold text-brand-cyan px-2 py-0.5 rounded bg-white/5">
                        {camp.campaignCode}
                      </span>
                      <span className={clsx(
                        "text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border",
                        isVerified
                          ? "bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30"
                          : "bg-brand-amber/15 text-brand-amber border-brand-amber/30"
                      )}>
                        {isVerified ? 'Doctor Verified & Published ✓' : 'Pending Doctor Verification'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{camp.title}</h3>
                      <p className="text-xs text-brand-rose font-semibold mt-0.5">{camp.condition}</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{camp.summary}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white">₹{camp.raisedAmount.toLocaleString('en-IN')}</span>
                        <span className="text-brand-emerald">{percent}% of ₹{camp.goalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-brand-emerald" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                        <span>{camp.donorCount} Generous Contributors</span>
                        <span>{camp.daysLeft} Days Left</span>
                      </div>
                    </div>

                    {camp.contributions && camp.contributions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="text-[11px] font-mono text-slate-400">Recent Contributions:</div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {camp.contributions.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] text-xs">
                              <span className="text-white font-semibold">{c.donorName}</span>
                              <span className="font-mono text-brand-emerald font-bold">+₹{c.amount.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </GlassPanel>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0d111a] border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-rose/10 border border-brand-rose/30 flex items-center justify-center text-brand-rose mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-white">No Active Fundraising Campaigns</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If you or a family member face high-cost medical surgery, trauma fixation, or cancer therapy, you can create a doctor-verified donation box here.
                </p>
              </div>
              <button
                onClick={() => setIsCreateCampaignOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-rose text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.25)] hover:brightness-110"
              >
                + Create My Medical Aid Box
              </button>
            </div>
          )}
        </div>
      )}

      {/* CREATE MEDICAL AID BOX MODAL */}
      <Modal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        title="Start Verified Medical Crowdfunding Campaign"
        subtitle="Submit your clinical episode for authentic Hospital & Doctor verification."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Urgent Arm Fracture ORIF Titanium Plating & Nerve Repair"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-rose/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Medical Category</label>
              <select
                value={campaignCategory}
                onChange={(e) => setCampaignCategory(e.target.value as any)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="TRAUMA_FRACTURE">Trauma & Bone Fractures</option>
                <option value="SURGERY">Surgical Procedures</option>
                <option value="PEDIATRIC">Pediatric Surgeries</option>
                <option value="ONCOLOGY">Oncology / Cancer Care</option>
                <option value="RARE_DISEASE">Rare Medical Conditions</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Fundraising Target (INR) *</label>
              <input
                type="number"
                required
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Diagnosis & Medical Condition *</label>
            <input
              type="text"
              required
              placeholder="e.g. Comminuted Distal Radius Fracture requiring Titanium Implant"
              value={conditionDesc}
              onChange={(e) => setConditionDesc(e.target.value)}
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Treating Hospital</label>
              <input
                type="text"
                placeholder="e.g. Fortis Orthopedic & Trauma Center"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">Attending Doctor</label>
              <input
                type="text"
                placeholder="e.g. Dr. Ananya Iyer, MS Ortho"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Patient Story & Surgical Necessity</label>
            <textarea
              rows={3}
              placeholder="Describe the medical necessity, trauma episode, and urgent treatment timeline..."
              value={storySummary}
              onChange={(e) => setStorySummary(e.target.value)}
              className="w-full bg-[#131824] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-rose via-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-glow-amber hover:brightness-110"
            >
              Submit for Doctor & Hospital Verification
            </button>
          </div>
        </form>
      </Modal>

      {/* DONATION PAYMENT MODAL (UPI / Card / NetBanking) */}
      {selectedCampaignForDonation && (
        <Modal
          isOpen={!!selectedCampaignForDonation}
          onClose={() => setSelectedCampaignForDonation(null)}
          title={`Donate to ${selectedCampaignForDonation.patientName}`}
          subtitle={`Hospital Escrow: ${selectedCampaignForDonation.hospital} • Verified by ${selectedCampaignForDonation.doctorName}`}
          maxWidth="md"
        >
          <form onSubmit={handleDonateSubmit} className="space-y-5 text-xs">
            {/* Condition preview */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-slate-400 text-[11px]">Clinical Condition:</div>
              <div className="font-semibold text-white">{selectedCampaignForDonation.condition}</div>
            </div>

            {/* Quick Amount Chips */}
            <div>
              <label className="block text-slate-400 font-mono mb-2">Select Donation Amount (INR)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[500, 1500, 5000, 10000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={clsx(
                      "py-2 rounded-xl text-xs font-mono font-bold border transition-all",
                      donationAmount === amt
                        ? "bg-brand-rose/20 text-brand-rose border-brand-rose/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                        : "bg-white/[0.02] text-slate-400 border-white/[0.06]"
                    )}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono font-bold focus:outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-400 font-mono mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'CARD', label: 'Cards', icon: CreditCard },
                  { id: 'NET_BANKING', label: 'NetBanking', icon: Building2 }
                ].map(pm => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={clsx(
                        "p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all",
                        paymentMethod === pm.id
                          ? "bg-brand-teal/20 text-brand-cyan border-brand-teal/40"
                          : "bg-white/[0.02] text-slate-400 border-white/[0.06]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div>
                <label className="block text-slate-400 font-mono mb-1">Enter UPI VPA (GPay / PhonePe / Paytm)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-brand-cyan font-mono focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-mono mb-1">Your Name (or Leave for Anonymous)</label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-[#131824] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-rose via-rose-500 to-amber-500 text-white font-extrabold text-xs hover:brightness-110 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Complete Donation of ₹{donationAmount.toLocaleString('en-IN')}</span>
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
