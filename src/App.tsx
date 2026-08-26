import React from 'react';
import { PatientProvider, usePatient } from './context/PatientContext';
import { AuthPortal } from './components/auth/AuthPortal';
import { DoctorPortal } from './components/portals/DoctorPortal';
import { GovernmentPortal } from './components/portals/GovernmentPortal';
import { SpatialShell } from './components/common/SpatialShell';
import { HealthJourneyHero } from './components/timeline/HealthJourneyHero';
import { TimelineView } from './components/timeline/TimelineView';
import { DocumentCenter } from './components/documents/DocumentCenter';
import { MedicinesSchedule } from './components/medicines/MedicinesSchedule';
import { AIHealthAssistant } from './components/ai/AIHealthAssistant';
import { SecureQRShare } from './components/share/SecureQRShare';
import { HealthcareSchemes } from './components/schemes/HealthcareSchemes';
import { DonationCampaigns } from './components/donations/DonationCampaigns';
import { CaseStudiesView } from './components/casestudies/CaseStudiesView';
import { PrivacyCenter } from './components/privacy/PrivacyCenter';
import { IncidentInspector } from './components/incidents/IncidentInspector';
import { CreateIncidentModal } from './components/incidents/CreateIncidentModal';
import { CreateMedicineModal } from './components/medicines/CreateMedicineModal';
import { MedicationAlarmAlert } from './components/medicines/MedicationAlarmAlert';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { 
    currentUser,
    activeRole,
    activeTab, 
    selectedIncidentId, 
    setSelectedIncidentId, 
    toastMessage, 
    incidents,
    setIsCreateIncidentOpen,
    isCreateMedicineOpen,
    setIsCreateMedicineOpen
  } = usePatient();

  // If user is not authenticated, show role-selection Auth Gateway
  if (!currentUser) {
    return (
      <>
        <AuthPortal />
        <Toast message={toastMessage} />
      </>
    );
  }

  // Doctor Dedicated Portal View
  if (activeRole === 'DOCTOR') {
    return (
      <SpatialShell>
        <DoctorPortal />
        <IncidentInspector
          incidentId={selectedIncidentId}
          onClose={() => setSelectedIncidentId(null)}
        />
        <Toast message={toastMessage} />
      </SpatialShell>
    );
  }

  // Government Official Dedicated Portal View
  if (activeRole === 'GOVERNMENT_OFFICIAL') {
    return (
      <SpatialShell>
        <GovernmentPortal />
        <Toast message={toastMessage} />
      </SpatialShell>
    );
  }

  // Medical Researcher Dedicated Portal View
  if (activeRole === 'RESEARCHER') {
    return (
      <SpatialShell>
        <CaseStudiesView />
        <Toast message={toastMessage} />
      </SpatialShell>
    );
  }

  // Patient Core Health Environment
  const renderPatientActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HealthJourneyHero />;
      case 'timeline':
      case 'incidents':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Longitudinal Incidents & Episodes
                </h1>
                <p className="text-xs text-slate-400">
                  {incidents.length > 0
                    ? `${incidents.length} recorded episode(s) in your medical timeline.`
                    : 'No incidents recorded yet. Click below to add your first healthcare episode.'}
                </p>
              </div>
              <button
                onClick={() => setIsCreateIncidentOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-teal hover:brightness-110 self-start sm:self-auto"
              >
                + Register New Episode
              </button>
            </div>
            <TimelineView
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={(id) => setSelectedIncidentId(id)}
            />
          </div>
        );
      case 'documents':
        return <DocumentCenter />;
      case 'medicines':
        return <MedicinesSchedule />;
      case 'ai':
        return <AIHealthAssistant />;
      case 'share':
        return <SecureQRShare />;
      case 'schemes':
        return <HealthcareSchemes />;
      case 'donations':
        return <DonationCampaigns />;
      case 'casestudies':
        return <CaseStudiesView />;
      case 'privacy':
        return <PrivacyCenter />;
      default:
        return <HealthJourneyHero />;
    }
  };

  return (
    <SpatialShell>
      {renderPatientActiveTab()}
      
      {/* Deep Incident Inspector Slide Drawer */}
      <IncidentInspector
        incidentId={selectedIncidentId}
        onClose={() => setSelectedIncidentId(null)}
      />

      {/* 2-Step Multi-File Incident Creator Modal */}
      <CreateIncidentModal />

      {/* Create Medicine & Schedule Alarms Modal */}
      <CreateMedicineModal
        isOpen={isCreateMedicineOpen}
        onClose={() => setIsCreateMedicineOpen(false)}
      />

      {/* Live In-App Audio-Visual Alarm Alert Banner */}
      <MedicationAlarmAlert />

      {/* Global Interactive Feedback Toast */}
      <Toast message={toastMessage} />
    </SpatialShell>
  );
};

export function App() {
  return (
    <PatientProvider>
      <AppContent />
    </PatientProvider>
  );
}

export default App;
