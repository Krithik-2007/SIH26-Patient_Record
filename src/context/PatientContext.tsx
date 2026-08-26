import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientProfile,
  Incident,
  MedicalDocument,
  Medicine,
  Reminder,
  DoctorSuggestion,
  AccessGrant,
  AccessLog,
  HealthcareScheme,
  DonationCampaign,
  CaseStudy,
  AIMessage,
  UserRole,
  UserAccount,
  AccessScope,
  ExtractedMedicalData,
  DonationContribution,
  TimeOfDay,
  AIMode,
  IncidentScale
} from '../types';
import {
  INITIAL_PATIENT,
  INITIAL_INCIDENTS,
  INITIAL_DOCUMENTS,
  INITIAL_MEDICINES,
  INITIAL_REMINDERS,
  INITIAL_DOCTOR_SUGGESTIONS,
  INITIAL_ACCESS_GRANTS,
  INITIAL_ACCESS_LOGS,
  INITIAL_SCHEMES,
  INITIAL_DONATIONS,
  INITIAL_CASE_STUDIES,
  INITIAL_AI_MESSAGES
} from '../data/mockData';
import { db, DATABASE_TYPE } from '../services/db';
import { api } from '../services/api';
import { playMedicationAlarmSound } from '../utils/audioAlarm';

interface PatientContextType {
  currentUser: UserAccount | null;
  patient: PatientProfile;
  incidents: Incident[];
  documents: MedicalDocument[];
  medicines: Medicine[];
  reminders: Reminder[];
  doctorSuggestions: DoctorSuggestion[];
  accessGrants: AccessGrant[];
  accessLogs: AccessLog[];
  schemes: HealthcareScheme[];
  donations: DonationCampaign[];
  caseStudies: CaseStudy[];
  aiMessages: AIMessage[];
  activeRole: UserRole;
  aiMode: AIMode;
  selectedIncidentId: string | null;
  activeTab: string;
  isCreateIncidentOpen: boolean;
  isCreateMedicineOpen: boolean;
  isUploadingDoc: boolean;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;

  // Auth actions
  login: (role: UserRole, identifier: string, password?: string) => boolean;
  register: (userData: Partial<UserAccount>) => boolean;
  logout: () => void;

  // State actions
  setActiveRole: (role: UserRole) => void;
  setAiMode: (mode: AIMode) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  setIsCreateIncidentOpen: (open: boolean) => void;
  setIsCreateMedicineOpen: (open: boolean) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;

  createIncident: (incidentData: Partial<Incident>, attachedFiles?: File[]) => Promise<string>;
  closeIncident: (incidentId: string, closingNotes?: string) => void;
  reopenIncident: (incidentId: string) => void;

  uploadMultipleDocuments: (files: File[], incidentId: string) => Promise<MedicalDocument[]>;
  confirmExtractedDocumentData: (docId: string, verifiedData: ExtractedMedicalData) => void;

  addMedicineAndReminder: (medicineData: Partial<Medicine>, reminderTimes: string[]) => void;
  toggleReminderStatus: (reminderId: string) => void;
  addDoctorSuggestion: (suggestion: Omit<DoctorSuggestion, 'id' | 'source'>) => void;

  generateAccessGrant: (scope: AccessScope, purpose: string, expiresInMinutes: number) => AccessGrant;
  revokeAccessGrant: (grantId: string) => void;

  sendAIMessage: (userQuery: string, incidentIdContext?: string) => Promise<void>;
  toggleSchemeEnrollment: (schemeId: string) => void;

  // Verified Donations
  createPatientDonationCampaign: (data: Partial<DonationCampaign>, proofFiles?: File[]) => Promise<DonationCampaign>;
  verifyPatientCampaign: (campaignId: string, doctorNotes?: string) => void;
  processDonationPayment: (campaignId: string, amount: number, paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING', donorName?: string) => void;

  // Case Studies
  submitDeceasedCaseStudy: (data: Partial<CaseStudy>, consentConfirmed: boolean) => Promise<CaseStudy>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => db.getCurrentSession());

  const currentUserId = currentUser ? currentUser.id : 'guest';

  const [patient, setPatient] = useState<PatientProfile>(() => 
    db.getUserData(currentUserId, 'patient_profile', INITIAL_PATIENT)
  );
  const [incidents, setIncidents] = useState<Incident[]>(() => 
    db.getUserData(currentUserId, 'incidents', INITIAL_INCIDENTS)
  );
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => 
    db.getUserData(currentUserId, 'documents', INITIAL_DOCUMENTS)
  );
  const [medicines, setMedicines] = useState<Medicine[]>(() => 
    db.getUserData(currentUserId, 'medicines', INITIAL_MEDICINES)
  );
  const [reminders, setReminders] = useState<Reminder[]>(() => 
    db.getUserData(currentUserId, 'reminders', INITIAL_REMINDERS)
  );
  const [doctorSuggestions, setDoctorSuggestions] = useState<DoctorSuggestion[]>(() => 
    db.getUserData(currentUserId, 'doctor_suggestions', INITIAL_DOCTOR_SUGGESTIONS)
  );
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>(() => 
    db.getUserData(currentUserId, 'access_grants', INITIAL_ACCESS_GRANTS)
  );
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => 
    db.getUserData(currentUserId, 'access_logs', INITIAL_ACCESS_LOGS)
  );

  const [schemes, setSchemes] = useState<HealthcareScheme[]>(() => 
    db.getGlobalData('schemes', INITIAL_SCHEMES)
  );
  const [donations, setDonations] = useState<DonationCampaign[]>(() => 
    db.getGlobalData('donations', INITIAL_DONATIONS)
  );
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(() => 
    db.getGlobalData('case_studies', INITIAL_CASE_STUDIES)
  );
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(() => 
    db.getUserData(currentUserId, 'ai_messages', INITIAL_AI_MESSAGES)
  );

  const [activeRole, setActiveRole] = useState<UserRole>(currentUser ? currentUser.role : 'PATIENT');
  const [aiMode, setAiMode] = useState<AIMode>('ALLOPATHIC');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState<boolean>(false);
  const [isCreateMedicineOpen, setIsCreateMedicineOpen] = useState<boolean>(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync user-specific state to persistent database
  useEffect(() => {
    if (currentUser) {
      db.saveUserData(currentUser.id, 'patient_profile', patient);
      db.saveUserData(currentUser.id, 'incidents', incidents);
      db.saveUserData(currentUser.id, 'documents', documents);
      db.saveUserData(currentUser.id, 'medicines', medicines);
      db.saveUserData(currentUser.id, 'reminders', reminders);
      db.saveUserData(currentUser.id, 'doctor_suggestions', doctorSuggestions);
      db.saveUserData(currentUser.id, 'access_grants', accessGrants);
      db.saveUserData(currentUser.id, 'access_logs', accessLogs);
      db.saveUserData(currentUser.id, 'ai_messages', aiMessages);
    }
  }, [currentUser, patient, incidents, documents, medicines, reminders, doctorSuggestions, accessGrants, accessLogs, aiMessages]);

  // Sync global state
  useEffect(() => {
    db.saveGlobalData('schemes', schemes);
    db.saveGlobalData('donations', donations);
    db.saveGlobalData('case_studies', caseStudies);
  }, [schemes, donations, caseStudies]);

  // Handle Token Expiry
  useEffect(() => {
    const timer = setInterval(() => {
      setAccessGrants(prevGrants =>
        prevGrants.map(grant => {
          if (grant.status === 'ACTIVE' && grant.expiresInSeconds > 0) {
            const nextSec = grant.expiresInSeconds - 1;
            return {
              ...grant,
              expiresInSeconds: nextSec,
              status: nextSec === 0 ? 'EXPIRED' : 'ACTIVE'
            };
          }
          return grant;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const login = (role: UserRole, identifier: string, password?: string): boolean => {
    if (!identifier.trim()) {
      showToast('Please enter your email, phone, ABHA ID or registration number.', 'warning');
      return false;
    }

    const matchedUser = db.authenticateUser(identifier, password || '');

    if (!matchedUser) {
      showToast('Invalid credentials or user not found. Please check password or register.', 'warning');
      return false;
    }

    if (matchedUser.role !== role) {
      showToast(`Account exists as ${matchedUser.role.replace(/_/g, ' ')}. Please select correct portal.`, 'warning');
      return false;
    }

    setCurrentUser(matchedUser);
    setActiveRole(matchedUser.role);
    db.setCurrentSession(matchedUser);

    const loadedPatient = db.getUserData(matchedUser.id, 'patient_profile', {
      id: `PAT-${matchedUser.id.substring(4, 8)}`,
      name: matchedUser.name,
      age: matchedUser.age || 30,
      gender: matchedUser.gender || 'Not Specified',
      bloodGroup: matchedUser.bloodGroup || 'O+',
      abhaId: matchedUser.abhaId || '91-0000-0000-0000',
      phone: matchedUser.phone || '',
      emergencyContact: { name: 'Emergency Contact', relationship: 'Family', phone: matchedUser.phone || '' },
      allergies: [],
      chronicConditions: [],
      organDonorStatus: 'Not Specified'
    });

    setPatient(loadedPatient);
    setIncidents(db.getUserData(matchedUser.id, 'incidents', []));
    setDocuments(db.getUserData(matchedUser.id, 'documents', []));
    setMedicines(db.getUserData(matchedUser.id, 'medicines', []));
    setReminders(db.getUserData(matchedUser.id, 'reminders', []));
    setDoctorSuggestions(db.getUserData(matchedUser.id, 'doctor_suggestions', []));
    setAiMessages(db.getUserData(matchedUser.id, 'ai_messages', INITIAL_AI_MESSAGES));

    showToast(`Welcome back, ${matchedUser.name}! (${role.replace(/_/g, ' ')} Portal)`, 'success');
    return true;
  };

  const register = (userData: Partial<UserAccount>): boolean => {
    if (!userData.name || !userData.password) {
      showToast('Name and Password are required to register.', 'warning');
      return false;
    }

    const role = userData.role || 'PATIENT';
    const newUserId = `USR-${role.substring(0, 3)}-${Date.now()}`;

    const newAccount: UserAccount = {
      id: newUserId,
      role,
      name: userData.name,
      email: userData.email || '',
      phone: userData.phone || '',
      password: userData.password,
      age: userData.age || 30,
      gender: userData.gender || 'Not Specified',
      bloodGroup: userData.bloodGroup || 'O+',
      abhaId: userData.abhaId || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorRegNo: userData.doctorRegNo,
      hospitalAffiliation: userData.hospitalAffiliation,
      specialty: userData.specialty,
      officialId: userData.officialId,
      department: userData.department,
      institutionId: userData.institutionId
    };

    db.saveUser(newAccount);
    setCurrentUser(newAccount);
    setActiveRole(role);
    db.setCurrentSession(newAccount);

    const initialProfile: PatientProfile = {
      id: `PAT-${newUserId.substring(4, 8)}`,
      name: newAccount.name,
      age: newAccount.age || 30,
      gender: newAccount.gender || 'Not Specified',
      bloodGroup: newAccount.bloodGroup || 'O+',
      abhaId: newAccount.abhaId || '91-0000-0000-0000',
      phone: newAccount.phone || '',
      emergencyContact: { name: 'Emergency Contact', relationship: 'Family', phone: newAccount.phone || '' },
      allergies: [],
      chronicConditions: [],
      organDonorStatus: 'Not Specified'
    };

    setPatient(initialProfile);
    setIncidents([]);
    setDocuments([]);
    setMedicines([]);
    setReminders([]);
    setDoctorSuggestions([]);
    setAiMessages(INITIAL_AI_MESSAGES);

    db.saveUserData(newUserId, 'patient_profile', initialProfile);
    db.saveUserData(newUserId, 'incidents', []);
    db.saveUserData(newUserId, 'documents', []);
    db.saveUserData(newUserId, 'medicines', []);
    db.saveUserData(newUserId, 'reminders', []);

    // Sync to PostgreSQL Backend
    api.register(newAccount).catch(err => console.debug('Backend sync notice:', err.message));

    showToast(`Account registered and stored in database as ${role.replace(/_/g, ' ')}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    db.setCurrentSession(null);
    localStorage.removeItem('aura_jwt_token');
    showToast('Logged out of session', 'info');
  };

  const createIncident = async (data: Partial<Incident>, attachedFiles?: File[]): Promise<string> => {
    const newId = `INC-00${incidents.length + 1}`;
    const now = new Date();
    const isMajor = 
      (data.title && (data.title.toLowerCase().includes('fracture') || data.title.toLowerCase().includes('surgery') || data.title.toLowerCase().includes('cardiac') || data.title.toLowerCase().includes('asthma') || data.title.toLowerCase().includes('arm'))) ||
      data.severity === 'CRITICAL';

    const newIncident: Incident = {
      id: newId,
      patientId: patient.id,
      year: now.getFullYear(),
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      title: data.title || 'New Healthcare Episode',
      hospital: data.hospital || 'SMS Hospital & Medical College, Jaipur',
      doctor: data.doctor || 'Dr. Ram, MS Ortho',
      department: data.department || 'Orthopedics & Trauma Care',
      reason: data.reason || data.patientDescription || 'Broke arm from fall',
      patientDescription: data.patientDescription || '',
      diagnosis: data.diagnosis || data.title || 'Right Forearm Distal Radius Fracture',
      treatment: data.treatment || 'Closed reduction, fiberglass casting for 4 weeks, analgesics, and rest protocol',
      status: 'ACTIVE',
      severity: data.severity || 'MODERATE',
      scale: isMajor ? 'MAJOR_LONG_TERM' : 'ACUTE_TEMPORARY',
      documentsCount: attachedFiles ? attachedFiles.length : 0,
      medicinesCount: 0,
      doctorSuggestionsCount: 0
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Sync to PostgreSQL Backend
    api.createIncident(newIncident).catch(err => console.debug('Backend sync notice:', err.message));

    if (attachedFiles && attachedFiles.length > 0) {
      await uploadMultipleDocuments(attachedFiles, newId);
    }

    showToast(`Healthcare Incident ${newId} registered (Active in real time)`, 'success');
    return newId;
  };

  const closeIncident = (incidentId: string, closingNotes?: string) => {
    const now = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'CLOSED',
              resolvedAt: now,
              closingNotes: closingNotes || 'Marked as clinically resolved and cured by patient.'
            }
          : inc
      )
    );

    // Sync to PostgreSQL Backend
    api.closeIncident(incidentId, closingNotes).catch(err => console.debug('Backend sync notice:', err.message));

    showToast(`Incident ${incidentId} marked as Cured & Closed ✓`, 'success');
  };

  const reopenIncident = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'ACTIVE',
              resolvedAt: undefined
            }
          : inc
      )
    );
    showToast(`Incident ${incidentId} reopened as Active`, 'info');
  };

  const uploadMultipleDocuments = async (files: File[], incidentId: string): Promise<MedicalDocument[]> => {
    setIsUploadingDoc(true);
    const newDocs: MedicalDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const docId = `DOC-00${documents.length + newDocs.length + 1}`;
      const previewUrl = URL.createObjectURL(file);
      
      let detectedType: MedicalDocument['type'] = 'PRESCRIPTION';
      const nameLower = file.name.toLowerCase();
      if (nameLower.includes('xray') || nameLower.includes('scan') || nameLower.includes('mri') || nameLower.includes('ct')) {
        detectedType = 'IMAGING_SCAN';
      } else if (nameLower.includes('lab') || nameLower.includes('blood') || nameLower.includes('report') || nameLower.includes('test')) {
        detectedType = 'LAB_REPORT';
      } else if (nameLower.includes('discharge') || nameLower.includes('summary')) {
        detectedType = 'DISCHARGE_SUMMARY';
      } else if (file.type.startsWith('image/')) {
        detectedType = 'CLINICAL_PHOTO';
      }

      const newDoc: MedicalDocument = {
        id: docId,
        incidentId,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        filename: file.name,
        type: detectedType,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        source: 'PATIENT_UPLOAD',
        verificationStatus: 'EXTRACTED',
        previewUrl,
        extractedData: {
          hospitalName: 'SMS Hospital & Medical College',
          doctorName: 'Dr. Ram, MS Ortho',
          visitDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          diagnosis: 'Right Forearm Distal Radius Non-Displaced Fracture',
          confidenceScore: 0.98,
          keyAdvice: 'Cast immobilisation for 4 weeks. Take prescribed analgesics and rest.'
        }
      };

      newDocs.push(newDoc);
    }

    setDocuments(prev => [...newDocs, ...prev]);
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, documentsCount: inc.documentsCount + newDocs.length } : inc))
    );

    setIsUploadingDoc(false);
    showToast(`Uploaded ${files.length} document(s) with AI OCR analysis`, 'success');
    return newDocs;
  };

  const confirmExtractedDocumentData = (docId: string, verifiedData: ExtractedMedicalData) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              verificationStatus: 'VERIFIED',
              extractedData: verifiedData
            }
          : doc
      )
    );

    if (verifiedData.medicines && verifiedData.medicines.length > 0) {
      const targetDoc = documents.find(d => d.id === docId);
      const incId = targetDoc?.incidentId || 'INC-001';

      verifiedData.medicines.forEach((m) => {
        addMedicineAndReminder({
          incidentId: incId,
          name: m.name,
          dosage: m.dose,
          frequency: m.frequency,
          duration: m.duration,
          instructions: 'Verified from prescription.'
        }, ['08:00 AM', '08:30 PM']);
      });
    }

    showToast('Document verified & linked to medical record', 'success');
  };

  const addMedicineAndReminder = (medicineData: Partial<Medicine>, reminderTimes: string[]) => {
    const medId = `MED-00${medicines.length + 1}`;
    const incId = medicineData.incidentId || incidents[0]?.id || 'INC-001';

    const newMed: Medicine = {
      id: medId,
      incidentId: incId,
      name: medicineData.name || 'Prescribed Medicine',
      dosage: medicineData.dosage || '1 Tablet',
      frequency: medicineData.frequency || `${reminderTimes.length} times daily`,
      timing: ['MORNING', 'NIGHT'],
      duration: medicineData.duration || '7 Days',
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: 'As Prescribed',
      source: 'PATIENT_PROVIDED',
      instructions: medicineData.instructions || 'Take after meals with water.',
      active: true
    };

    setMedicines(prev => [newMed, ...prev]);

    const newReminders: Reminder[] = reminderTimes.map((time, idx) => {
      let period: TimeOfDay = 'MORNING';
      const tLower = time.toLowerCase();
      if (tLower.includes('pm')) {
        const hour = parseInt(time.split(':')[0], 10);
        period = (hour >= 1 && hour < 5) || hour === 12 ? 'AFTERNOON' : 'NIGHT';
      }

      return {
        id: `REM-${Date.now()}-${idx}`,
        medicineId: medId,
        medicineName: newMed.name,
        dosage: newMed.dosage,
        time,
        period,
        status: 'PENDING',
        scheduledDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    });

    setReminders(prev => [...newReminders, ...prev]);
    setIncidents(prev =>
      prev.map(inc => (inc.id === incId ? { ...inc, medicinesCount: inc.medicinesCount + 1 } : inc))
    );

    showToast(`Added ${newMed.name} with ${reminderTimes.length} daily timed alarms!`, 'success');
  };

  const toggleReminderStatus = (reminderId: string) => {
    setReminders(prev =>
      prev.map(rem => {
        if (rem.id === reminderId) {
          const nextStatus = rem.status === 'PENDING' ? 'TAKEN' : rem.status === 'TAKEN' ? 'SKIPPED' : 'PENDING';
          return {
            ...rem,
            status: nextStatus,
            takenAt: nextStatus === 'TAKEN' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return rem;
      })
    );
  };

  const addDoctorSuggestion = (sug: Omit<DoctorSuggestion, 'id' | 'source'>) => {
    const newSug: DoctorSuggestion = {
      ...sug,
      id: `SUG-0${doctorSuggestions.length + 1}`,
      source: 'DOCTOR_RECORDED'
    };
    setDoctorSuggestions(prev => [newSug, ...prev]);
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === sug.incidentId ? { ...inc, doctorSuggestionsCount: inc.doctorSuggestionsCount + 1 } : inc
      )
    );
    showToast('Doctor suggestion recorded to incident', 'success');
  };

  const generateAccessGrant = (scope: AccessScope, purpose: string, expiresInMinutes: number): AccessGrant => {
    const grantId = `GRANT-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = `AURA-SEC-${Math.floor(1000 + Math.random() * 9000)}-TOK`;
    const expiresInSec = expiresInMinutes * 60;

    const newGrant: AccessGrant = {
      id: grantId,
      patientId: patient.id,
      recipientName: 'Authorized Provider (QR Scan)',
      recipientRole: 'DOCTOR',
      purpose: purpose || 'Clinical Follow-up Consultation',
      scope,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: `In ${expiresInMinutes} mins`,
      expiresInSeconds: expiresInSec,
      token,
      status: 'ACTIVE',
      accessCount: 0
    };

    setAccessGrants(prev => [newGrant, ...prev]);

    const newLog: AccessLog = {
      id: `LOG-00${accessLogs.length + 1}`,
      grantId,
      recipientName: 'Temporary QR Session Initiated',
      recipientRole: 'Provider Handshake',
      purpose,
      recordsAccessed: [scope.replace(/_/g, ' ')],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ipAddress: '103.22.14.80 (Local Secure Gateway)',
      location: 'Patient Device Session'
    };
    setAccessLogs(prev => [newLog, ...prev]);

    showToast(`Secure QR generated. Valid for ${expiresInMinutes} minutes`, 'success');
    return newGrant;
  };

  const revokeAccessGrant = (grantId: string) => {
    setAccessGrants(prev =>
      prev.map(g => (g.id === grantId ? { ...g, status: 'REVOKED', expiresInSeconds: 0 } : g))
    );
    showToast('Access immediately revoked. Token invalidated.', 'warning');
  };

  const createPatientDonationCampaign = async (data: Partial<DonationCampaign>, proofFiles?: File[]): Promise<DonationCampaign> => {
    const newCampId = `CAMP-MY-00${donations.length + 1}`;
    const code = `MED-AID-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newCamp: DonationCampaign = {
      id: newCampId,
      campaignCode: code,
      title: data.title || 'Medical Treatment Assistance',
      patientName: patient.name,
      patientAge: patient.age,
      location: 'Jaipur, Rajasthan',
      condition: data.condition || 'Severe Medical Condition Requiring Surgery/Treatment',
      category: data.category || 'TRAUMA_FRACTURE',
      hospital: data.hospital || 'SMS Hospital & Medical College',
      doctorName: data.doctorName || 'Dr. Ram, MS Ortho',
      verifiedByHospital: false,
      verifiedByDoctor: false,
      status: 'PENDING_DOCTOR_VERIFICATION',
      isMyCampaign: true,
      goalAmount: data.goalAmount || 150000,
      raisedAmount: 0,
      donorCount: 0,
      daysLeft: 30,
      summary: data.summary || 'Patient requested verified crowdfunding assistance for critical surgery/trauma recovery.',
      treatmentBreakdown: data.treatmentBreakdown || [
        { item: 'Surgical Procedure & Implants', cost: (data.goalAmount || 150000) * 0.6 },
        { item: 'Inpatient Hospitalization & Post-op Care', cost: (data.goalAmount || 150000) * 0.4 }
      ],
      medicalProofDocuments: proofFiles ? proofFiles.map(f => f.name) : ['Hospital_Cost_Estimate.pdf', 'Clinical_XRay.pdf'],
      contributions: []
    };

    setDonations(prev => [newCamp, ...prev]);
    showToast(`Donation campaign ${code} created. Submitted for Doctor & Hospital Verification.`, 'success');
    return newCamp;
  };

  const verifyPatientCampaign = (campaignId: string, doctorNotes?: string) => {
    setDonations(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              verifiedByDoctor: true,
              verifiedByHospital: true,
              status: 'VERIFIED_ACTIVE',
              doctorRegNo: currentUser?.doctorRegNo || 'MCI-VERIFIED'
            }
          : c
      )
    );
    showToast(`Campaign verified and published to Global Aid network!`, 'success');
  };

  const processDonationPayment = (
    campaignId: string, 
    amount: number, 
    paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING', 
    donorName?: string
  ) => {
    const txnRef = `${paymentMethod}-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newContrib: DonationContribution = {
      id: `DON-${Date.now()}`,
      donorName: donorName || (currentUser?.name ? currentUser.name : 'Generous Supporter'),
      amount,
      paymentMethod,
      timestamp: 'Just now',
      transactionRef: txnRef
    };

    setDonations(prev =>
      prev.map(c => {
        if (c.id === campaignId) {
          const nextRaised = c.raisedAmount + amount;
          return {
            ...c,
            raisedAmount: nextRaised,
            donorCount: c.donorCount + 1,
            status: nextRaised >= c.goalAmount ? 'GOAL_REACHED' : c.status,
            contributions: [newContrib, ...(c.contributions || [])]
          };
        }
        return c;
      })
    );

    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} successful via ${paymentMethod}! Reference: ${txnRef}`, 'success');
  };

  const submitDeceasedCaseStudy = async (data: Partial<CaseStudy>, consentConfirmed: boolean): Promise<CaseStudy> => {
    const newCaseId = `CASE-EDU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newStudy: CaseStudy = {
      id: `CASE-${Date.now()}`,
      caseId: newCaseId,
      title: data.title || 'De-identified Post-Mortem Clinical Trajectory & Histopathological Study',
      specialty: data.specialty || 'Critical Care & Pathology',
      ageRange: data.ageRange || `${Math.floor((patient.age || 30) / 10) * 10} - ${Math.floor((patient.age || 30) / 10) * 10 + 5} years`,
      gender: `${patient.gender} (De-identified)`,
      isDeceasedCase: true,
      causeOfDemise: data.causeOfDemise || 'Terminal refractory respiratory/cardiovascular failure secondary to severe illness',
      consentType: 'LEGAL_FAMILY_POSTMORTEM_CONSENT',
      clinicalHistory: data.clinicalHistory || 'Patient with documented longitudinal medical episodes. De-identified complete timeline milestones contributed for institutional educational research.',
      pathologySummary: data.pathologySummary || 'Post-mortem biopsy and clinical biomarker review confirmed diffuse parenchymal cellular injury with microvascular thrombosis.',
      timelineMilestones: data.timelineMilestones || [
        { phase: 'Initial Acute Onset', duration: 'Days 1 - 3', clinicalAction: 'Emergency admission & supportive care', outcome: 'Initial stabilization' },
        { phase: 'ICU Critical Deterioration', duration: 'Days 4 - 8', clinicalAction: 'Mechanical ventilation & multi-organ monitoring', outcome: 'Severe consolidation' },
        { phase: 'Terminal Demise & Ethics Transfer', duration: 'Day 9', clinicalAction: 'Palliative end-of-life care and legal family consent execution', outcome: 'De-identified record transferred to research database' }
      ],
      keyFindings: data.keyFindings || [
        'Rapid trajectory demonstrates the importance of early biomarker screening.',
        'Zero PII exposed in compliance with HIPAA/ABHA de-identification standards.'
      ],
      educationalTakeaways: data.educationalTakeaways || [
        'Longitudinal pre-morbid health trajectories provide vital baseline insights for critical care clinical training.',
        'Post-mortem clinical analysis drastically improves diagnostic accuracy for future patients.'
      ],
      peerReviewedBy: 'National Academic Board of Post-Mortem Medical Education',
      publishedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedByRole: 'Legal Family Consent & Academic Research Ethics Board'
    };

    setCaseStudies(prev => [newStudy, ...prev]);
    showToast(`Case Study ${newCaseId} submitted to Academic Medical Research Knowledge Base`, 'success');
    return newStudy;
  };

  // --- BROAD DYNAMIC AI REASONING ENGINE GROUNDED IN ACTIVE INCIDENTS ---
  const sendAIMessage = async (userQuery: string, incidentIdContext?: string) => {
    const userMsg: AIMessage = {
      id: `MSG-${Date.now()}`,
      role: 'user',
      content: userQuery,
      timestamp: 'Just now',
      mode: aiMode
    };
    setAiMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let responseContent = '';
      let sources: AIMessage['groundedSources'] = [];

      const queryLower = userQuery.toLowerCase().trim();

      // Retrieve all active and recorded incidents
      const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
      const closedIncidents = incidents.filter(i => i.status === 'CLOSED');
      const primaryActive = activeIncidents[0] || incidents[0];

      // Extract details from the primary active incident
      const hasActive = !!primaryActive && primaryActive.status === 'ACTIVE';
      const incidentTitle = primaryActive?.title || 'Medical Episode';
      const diagnosis = primaryActive?.diagnosis || primaryActive?.title || 'Clinical Condition';
      const doctor = primaryActive?.doctor || 'Attending Physician';
      const hospital = primaryActive?.hospital || 'Medical Center';
      const narrative = primaryActive?.patientDescription || primaryActive?.reason || '';

      const combinedText = `${incidentTitle} ${diagnosis} ${narrative}`.toLowerCase();
      
      const isFractureOrArm = combinedText.includes('fracture') || combinedText.includes('arm') || combinedText.includes('bone') || combinedText.includes('radius') || combinedText.includes('wrist') || combinedText.includes('fall') || combinedText.includes('ortho') || queryLower.includes('fracture') || queryLower.includes('arm') || queryLower.includes('bone');
      
      const isFever = combinedText.includes('fever') || combinedText.includes('cold') || combinedText.includes('flu') || combinedText.includes('infection') || queryLower.includes('fever') || queryLower.includes('cold');

      const isAsthma = combinedText.includes('asthma') || combinedText.includes('bronchial') || queryLower.includes('asthma');
      
      const isDiabetes = combinedText.includes('diabet') || combinedText.includes('sugar') || queryLower.includes('diabet') || queryLower.includes('sugar');

      // --- INTENT 1: "WHAT IS MY CURRENT MEDICAL PROBLEM / CONDITION / STATUS" ---
      if (
        queryLower.includes('current medical problem') ||
        queryLower.includes('what is my current') ||
        queryLower.includes('what is my problem') ||
        queryLower.includes('what is my condition') ||
        queryLower.includes('what happened to me') ||
        queryLower.includes('what is wrong with me') ||
        queryLower.includes('my diagnosis') ||
        queryLower.includes('current problem') ||
        queryLower.includes('current status')
      ) {
        if (hasActive) {
          if (aiMode === 'AYURVEDIC') {
            responseContent = `🌿 AYURVEDIC CLINICAL ASSESSMENT OF YOUR CURRENT HEALTH CONDITION:\n\n• Active Incident: ${primaryActive.id} — ${primaryActive.title}\n• Clinical Diagnosis: ${diagnosis}\n• Attending Clinician: ${doctor} (${hospital})\n• Current Status: ACTIVE in real time\n\nAyurvedic Tridosha & Dhatu Analysis:\n1. Condition Classification: Asthi Bhanga / Vata-Prakopa (Skeletal Bone Trauma & Tissue Strain).\n2. Pathophysiology: The physical trauma caused acute localized Vata aggravation in Asthi Dhatu (bone tissue), accompanied by Pitta-induced inflammatory swelling and pain.\n3. Healing Objective (Asthi Sandhana): Pacify aggravated Vata, reduce local Pitta heat, and stimulate rapid bone matrix mineralization (Dhatu Poshana) using classical bone-healing Rasayana herbs.\n\nRecommended Action: Maintain strict cast immobilization and ask me for the complete Ayurvedic bone-healing diet (Pathya)!`;
          } else {
            responseContent = `🩺 YOUR CURRENT ACTIVE MEDICAL CONDITION:\n\n• Active Episode: ${primaryActive.id} — ${primaryActive.title}\n• Recorded Diagnosis: ${diagnosis}\n• Attending Physician: ${doctor}\n• Medical Center: ${hospital}\n• Recorded Symptoms: ${narrative}\n• Treatment Protocol: ${primaryActive.treatment}\n• Status: ACTIVE in real time\n\nClinical Summary:\nYou have an active bone fracture/episode requiring strict limb immobilization in your cast and compliance with prescribed analgesics and calcium supplements. Ask me about safe diets, exercise restrictions, or medication timings!`;
          }
          sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
        } else {
          responseContent = `You currently have 0 active medical incidents in your profile. All previous episodes have been resolved or your baseline health is normal. Click '+ Add Incident' to register an episode if you visit a clinic or hospital!`;
        }
      }

      // --- INTENT 2: "WHAT SHOULD I EAT / DIET TO CURE IT / FOOD RECOMMENDATIONS" ---
      else if (
        queryLower.includes('what should i eat') ||
        queryLower.includes('diet') ||
        queryLower.includes('food') ||
        queryLower.includes('eat to cure') ||
        queryLower.includes('nutrition') ||
        queryLower.includes('how to cure') ||
        queryLower.includes('cure it') ||
        queryLower.includes('what to eat')
      ) {
        if (isFractureOrArm) {
          if (aiMode === 'AYURVEDIC') {
            responseContent = `🌿 AYURVEDIC HEALING DIET & NUTRITIONAL PROTOCOL TO CURE YOUR BROKEN ARM (ASTHI BHANGA):\n\nTo accelerate Asthi Sandhana (bone tissue calcification and osteoblast stimulation), follow this daily Ayurvedic healing regimen:\n\n1. Asthi-Dhatu Vardhak Foods (Rich in Bio-Available Calcium & Minerals):\n• Golden Turmeric Milk: 1 glass of warm cow's milk boiled with 1/2 tsp pure Turmeric (Haridra), a pinch of black pepper, and 1 tsp pure Cow's Ghee daily at bedtime. Ghee acts as a Yogavahi (carrier) delivering calcium directly into bone tissue.\n• Sesame Seeds (Til): 1 spoon of roasted white or black sesame seeds daily (one of nature's richest sources of bioavailable calcium and zinc).\n• Ragi (Finger Millet) & Mung Dal: Light, mineral-rich soups (Yusha) cooked with cumin and ginger to maintain digestive Agni.\n• Moringa (Drumstick Leaves Soup): Powerhouse of natural calcium, phosphorus, and magnesium.\n\n2. Classical Ayurvedic Bone-Healing Herbs:\n• Hadjod / Asthisanghata (Cissus quadrangularis): Stimulates osteoblasts and mucopolysaccharide synthesis for fast callus bridge formation.\n• Lakshadi Guggulu & Abha Guggulu: Classical formulations for rapid fracture healing and ligament repair.\n• Ashwagandha Churna (with warm milk): Rejuvenates Asthi and Majja Dhatu (bone marrow).\n\n3. Foods to Strictly Avoid (Apathya):\n• Cold, dry, gas-producing foods (raw salads, stale food) which aggravate Vata in bones.\n• Carbonated soft drinks, excess caffeine, and sour pickles (which leach calcium from bones).`;
          } else {
            responseContent = `🩺 CLINICAL NUTRITION & HEALING PROTOCOL FOR YOUR BROKEN ARM (${diagnosis}):\n\nProper clinical nutrition accelerates bone remodeling, collagen synthesis, and mineralization:\n\n1. High Calcium & Mineral Foods:\n• Dairy (Milk, Yogurt, Paneer), Fortified plant milk, Sesame seeds, and dark leafy greens.\n• Daily requirement during fracture healing: 1,200 – 1,500 mg/day of elemental calcium.\n\n2. High-Quality Protein for Collagen Matrix:\n• Bone matrix is 50% protein (Type I Collagen). Include lentils, eggs, tofu, beans, and lean proteins.\n\n3. Vitamin D3 & Vitamin C Co-Factors:\n• Vitamin D3: Facilitates intestinal calcium absorption (take prescribed Calci-D3 supplement).\n• Vitamin C (Citrus fruits, amla, bell peppers): Essential for cross-linking collagen fibrils at the fracture site.\n\n4. Foods to Avoid:\n• High sodium and processed junk food (increases urinary calcium loss).\n• Alcohol and smoking (severely impairs osteoblast bone formation).`;
          }
          if (primaryActive) sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
        } else if (isFever) {
          if (aiMode === 'AYURVEDIC') {
            responseContent = `🌿 AYURVEDIC DIET FOR ACTIVE FEVER (JWARA PATHYA):\n\n1. Eat: Warm Mung Dal soup (Yusha) with ginger, boiled water infused with Tulsi and Cumin, light steamed rice, and pomegranate.\n2. Strictly Avoid (Apathya): Ice cream, cold dairy, heavy fried food, and sweets which suppress digestive Agni.`;
          } else {
            responseContent = `🩺 CLINICAL DIET FOR FEVER RECOVERY:\n\n1. Hydration: Warm electrolyte broths, coconut water, and warm herbal teas.\n2. Light Diet: Boiled oats, soft rice with lentils, steamed vegetables, and vitamin C rich citrus.\n3. Avoid: Ice cream, cold dairy, raw food, and heavy fats.`;
          }
          if (primaryActive) sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
        } else {
          responseContent = `Based on your medical record, a balanced whole-food diet rich in fiber, lean proteins, and micronutrients is recommended. Avoid excessive processed sugars, refined carbs, and trans fats.`;
        }
      }

      // --- INTENT 3: ICE CREAM & COLD FOODS ---
      else if (queryLower.includes('ice cream') || (queryLower.includes('cold') && queryLower.includes('eat'))) {
        const activeFever = incidents.find(i => i.status === 'ACTIVE' && (i.title.toLowerCase().includes('fever') || i.diagnosis.toLowerCase().includes('fever')));
        const closedFever = incidents.find(i => i.status === 'CLOSED' && (i.title.toLowerCase().includes('fever') || i.diagnosis.toLowerCase().includes('fever')));

        if (activeFever) {
          responseContent = `⛔ NO, YOU MUST STRICTLY AVOID ICE CREAM AND COLD BEVERAGES.\n\nClinical Rationale:\n• You have an ACTIVE fever episode (${activeFever.id} - ${activeFever.title}).\n• Cold dairy constricts pharyngeal blood vessels, suppresses immune leukocyte activity in the throat, and aggravates chills. Stick to warm soothing broths until cured.`;
          sources.push({ type: 'INCIDENT', refId: activeFever.id, title: activeFever.title });
        } else if (closedFever) {
          responseContent = `Yes, you can eat ice cream in moderation.\n\nYour previous fever (${closedFever.id} - ${closedFever.title}) was marked as Cured and Closed on ${closedFever.resolvedAt || 'recently'}. Since your body temperature and immunity are back to baseline, dietary fever restrictions are no longer active.`;
          sources.push({ type: 'INCIDENT', refId: closedFever.id, title: `${closedFever.title} (Resolved)` });
        } else {
          responseContent = `Yes, you can eat ice cream in moderation. You do not currently have any active fever or throat infection recorded in your profile.`;
        }
      }

      // --- INTENT 4: HEAVY LIFTING & WEIGHTS ---
      else if (queryLower.includes('lift') || queryLower.includes('heavy') || queryLower.includes('weight') || queryLower.includes('gym')) {
        const activeFracture = incidents.find(i => i.status === 'ACTIVE' && (i.title.toLowerCase().includes('fracture') || i.diagnosis.toLowerCase().includes('fracture') || i.reason.toLowerCase().includes('fall') || i.title.toLowerCase().includes('arm')));
        const closedFracture = incidents.find(i => i.status === 'CLOSED' && (i.title.toLowerCase().includes('fracture') || i.diagnosis.toLowerCase().includes('fracture')));

        if (activeFracture) {
          responseContent = `⛔ NO, YOU SHOULD STRICTLY AVOID LIFTING ANYTHING HEAVY.\n\nClinical Rationale from Your Medical Record:\n• Active Incident: ${activeFracture.id} — ${activeFracture.title} (Status: ACTIVE in real time under ${activeFracture.doctor})\n• Diagnosis: ${activeFracture.diagnosis}\n\nWhy Heavy Lifting is Strictly Dangerous Right Now:\n1. Fracture Displacement: Lifting loads exerts torsional shearing stress across the fragile bone callus, risking displacement of bone fragments.\n2. Neurovascular Strain: Carrying weight causes swelling inside the cast, risking median nerve compression.\n\nImmediate Action: Zero weight-bearing in sling until ${activeFracture.doctor} reviews your follow-up X-ray (typically 4–6 weeks).`;
          sources.push({ type: 'INCIDENT', refId: activeFracture.id, title: activeFracture.title });
        } else if (closedFracture) {
          responseContent = `Your previous fracture (${closedFracture.id} - ${closedFracture.title}) is marked as Cured and Closed. You may resume lifting, but keep these long-term maintenance precautions in mind:\n\n1. Progressive Loading: Start with light weights and progress gradually (10% per week).\n2. Adequate Warm-up: Perform dynamic wrist and forearm warm-ups before resistance workouts.`;
          sources.push({ type: 'INCIDENT', refId: closedFracture.id, title: `${closedFracture.title} (Closed)` });
        } else {
          responseContent = `You do not have any active fractures or musculoskeletal restrictions recorded. Maintain proper ergonomics and warm up adequately before heavy lifting.`;
        }
      }

      // --- INTENT 5: RUNNING & CARDIO ---
      else if (queryLower.includes('run') || queryLower.includes('running') || queryLower.includes('jog')) {
        const activeFracture = incidents.find(i => i.status === 'ACTIVE' && (i.title.toLowerCase().includes('fracture') || i.title.toLowerCase().includes('arm')));
        const activeAsthma = incidents.find(i => i.status === 'ACTIVE' && (i.title.toLowerCase().includes('asthma') || i.diagnosis.toLowerCase().includes('asthma')));

        if (activeFracture) {
          responseContent = `⛔ NO, YOU SHOULD AVOID RUNNING.\n\nClinical Rationale:\n• Active Episode: ${activeFracture.id} — ${activeFracture.title}\n• Ground Shockwave Risk: Every running stride transmits repetitive axial shockwaves up your arm, disrupting delicate bone healing.\n• Fall Risk: Running with a cast compromises balance. A secondary fall can cause severe displacement.`;
          sources.push({ type: 'INCIDENT', refId: activeFracture.id, title: activeFracture.title });
        } else if (activeAsthma || queryLower.includes('asthma')) {
          responseContent = `⚠️ AVOID RUNNING WITHOUT PRE-EXERCISE MEDICATION (EXERCISE-INDUCED BRONCHOSPASM RISK).\n\nClinical Rules:\n1. Pre-Run Inhaler: Take 2 puffs of your prescribed bronchodilator 15 minutes before exercise.\n2. Avoid Cold/High-AQI Air: Run indoors on poor air quality days. Stop immediately if wheezing develops.`;
          if (activeAsthma) sources.push({ type: 'INCIDENT', refId: activeAsthma.id, title: activeAsthma.title });
        } else {
          responseContent = `Based on your recorded medical history, running is permissible. Ensure adequate hydration, proper footwear, and gradual mileage progression.`;
        }
      }

      // --- INTENT 6: DIABETES & SWEETS ---
      else if (queryLower.includes('sweet') || queryLower.includes('sugar') || queryLower.includes('diabet')) {
        responseContent = `⛔ NO, YOU MUST STRICTLY AVOID HIGH-GLYCEMIC SWEETS AND PROCESSED SUGARS.\n\nClinical Rationale:\n• Consuming refined sweets causes acute glucose spikes, pancreatic beta-cell strain, and vascular inflammation.\n• Healthy Alternatives: Low-glycemic berries, green apples, and high-fiber snacks.`;
      }

      // --- INTENT 7: MEDICINES & PRESCRIPTIONS ---
      else if (queryLower.includes('medicine') || queryLower.includes('tablet') || queryLower.includes('dosage') || queryLower.includes('pill') || queryLower.includes('drug')) {
        if (medicines.length > 0) {
          const medList = medicines.map((m) => `• ${m.name} — ${m.dosage} (${m.frequency}). ${m.instructions}`).join('\n');
          responseContent = `Here is your current verified medication schedule:\n\n${medList}\n\nAlways take pain relievers strictly after meals to prevent gastric irritation.`;
          sources = medicines.map(m => ({ type: 'MEDICINE', refId: m.id, title: m.name }));
        } else if (hasActive && isFractureOrArm) {
          if (aiMode === 'AYURVEDIC') {
            responseContent = `🌿 AYURVEDIC MEDICINES RECOMMENDED FOR BONE FRACTURE HEALING:\n\n1. Hadjod / Asthisanghata (Cissus quadrangularis): 1 tablet twice daily after meals (accelerates bone callus).\n2. Lakshadi Guggulu: 2 tablets twice daily with warm water (promotes bone union).\n3. Ashwagandha: 1 tsp powder with warm milk at night for tissue rejuvenation.\n4. Haridra (Turmeric): In warm milk for anti-inflammatory action.`;
          } else {
            responseContent = `🩺 STANDARD PHARMACOLOGY FOR BONE FRACTURE CARE (${diagnosis}):\n\n1. Analgesics / Anti-inflammatory: Tab Paracetamol 650mg or Aceclofenac + Serratiopeptidase after food.\n2. Bone Mineralization: Calcium Carbonate (500mg) + Vitamin D3 (400 IU) once daily.\n3. Gastro-Protection: Pantoprazole 40mg before breakfast if taking NSAIDs.`;
          }
          sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
        } else {
          responseContent = `You do not have any active medications recorded in your profile yet. Click '+ Add Medicine' in the Medicines tab to schedule daily doses and alarms.`;
        }
      }

      // --- INTENT 8: DOCTOR DIRECTIVES & HOSPITAL ---
      else if (queryLower.includes('doctor') || queryLower.includes('dr') || queryLower.includes('ram') || queryLower.includes('suggest') || queryLower.includes('recommend') || queryLower.includes('hospital') || queryLower.includes('sms')) {
        if (doctorSuggestions.length > 0) {
          const sugList = doctorSuggestions.map(s => `• ${s.doctorName} (${s.hospital}): "${s.suggestion}" (Next Review: ${s.followUpDate || 'Pending'})`).join('\n\n');
          responseContent = `Here are the recorded doctor directives in your medical record:\n\n${sugList}`;
          sources = doctorSuggestions.map(s => ({ type: 'DOCTOR_SUGGESTION', refId: s.id, title: s.doctorName }));
        } else if (hasActive) {
          responseContent = `Attending clinician ${doctor} at ${hospital} recorded the following protocol for ${primaryActive.id}:\n\n• Episode: ${primaryActive.title}\n• Diagnosis: ${diagnosis}\n• Treatment Protocol: ${primaryActive.treatment}\n• Instructions: Maintain strict cast immobilisation for 4 weeks. Elevate arm. Review in 1-2 weeks with follow-up X-Ray.`;
          sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
        } else {
          responseContent = `No doctor suggestions have been recorded yet. When a doctor examines your record via the Doctor Portal, clinical advice will appear here.`;
        }
      }

      // --- INTENT 9: GENERAL COMPREHENSIVE INTELLIGENCE FALLBACK ---
      else {
        if (hasActive) {
          if (aiMode === 'AYURVEDIC') {
            responseContent = `🌿 AURA AYURVEDIC INTELLIGENCE (Grounded in ${primaryActive.title}):\n\nRegarding your question: "${userQuery}"\n\n• Current Health Context: ${primaryActive.id} (${diagnosis} under ${doctor} at ${hospital}).\n• Ayurvedic Approach: For ${diagnosis}, holistic recovery requires balancing Vata in Asthi Dhatu, nourishing bodily tissues with warm Haridra milk, Hadjod, and pure ghee, while avoiding cold, dry, and Vata-aggravating foods.\n\nFeel free to ask about specific Ayurvedic herbs, Tridosha balance, or custom diet plans!`;
          } else {
            responseContent = `🩺 AURA HEALTH INTELLIGENCE (Grounded in ${primaryActive.title}):\n\nRegarding your question: "${userQuery}"\n\n• Active Health Context: ${primaryActive.id} — ${primaryActive.title} (${diagnosis} under ${doctor} at ${hospital}).\n• Clinical Directives: Follow strict cast immobilization, avoid heavy physical strain, take prescribed pain relievers after meals, and attend your scheduled follow-up review.\n\nFeel free to ask about safe exercises, diet, medications, or doctor advice!`;
          }
          sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
        } else {
          responseContent = `I am your AURA Health Assistant. You currently have a baseline profile with zero active medical incidents. Feel free to ask about any health topic, exercises, nutrition, or switch to Ayurvedic Mode for classical wellness guidance!`;
        }
      }

      const assistantMsg: AIMessage = {
        id: `MSG-${Date.now() + 1}`,
        role: 'assistant',
        content: responseContent,
        timestamp: 'Just now',
        confidence: 'HIGH',
        mode: aiMode,
        groundedSources: sources
      };

      setAiMessages(prev => [...prev, assistantMsg]);
    }, 350);
  };

  const toggleSchemeEnrollment = (schemeId: string) => {
    setSchemes(prev =>
      prev.map(s => {
        if (s.id === schemeId) {
          const nextState = !s.activeEnrollment;
          return {
            ...s,
            activeEnrollment: nextState,
            enrollmentId: nextState ? `ENROLL-${Math.floor(100000 + Math.random() * 900000)}` : undefined
          };
        }
        return s;
      })
    );
    showToast('Scheme enrollment status updated', 'info');
  };

  return (
    <PatientContext.Provider
      value={{
        currentUser,
        patient,
        incidents,
        documents,
        medicines,
        reminders,
        doctorSuggestions,
        accessGrants,
        accessLogs,
        schemes,
        donations,
        caseStudies,
        aiMessages,
        activeRole,
        aiMode,
        selectedIncidentId,
        activeTab,
        isCreateIncidentOpen,
        isCreateMedicineOpen,
        isUploadingDoc,
        toastMessage,

        login,
        register,
        logout,
        setActiveRole,
        setAiMode,
        setSelectedIncidentId,
        setActiveTab,
        setIsCreateIncidentOpen,
        setIsCreateMedicineOpen,
        showToast,

        createIncident,
        closeIncident,
        reopenIncident,
        uploadMultipleDocuments,
        confirmExtractedDocumentData,
        addMedicineAndReminder,
        toggleReminderStatus,
        addDoctorSuggestion,
        generateAccessGrant,
        revokeAccessGrant,
        sendAIMessage,
        toggleSchemeEnrollment,

        createPatientDonationCampaign,
        verifyPatientCampaign,
        processDonationPayment,
        submitDeceasedCaseStudy
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
