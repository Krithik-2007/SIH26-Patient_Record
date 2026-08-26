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
  UserAccount
} from '../types';

// Zero pre-seeded mock users: 100% user-registered accounts
export const DEFAULT_USERS: UserAccount[] = [];

export const INITIAL_PATIENT: PatientProfile = {
  id: 'PAT-DEFAULT',
  name: 'New Registered Patient',
  age: 30,
  gender: 'Not Specified',
  bloodGroup: 'O+',
  abhaId: '91-0000-0000-0000',
  phone: '',
  emergencyContact: {
    name: 'Emergency Contact',
    relationship: 'Family',
    phone: ''
  },
  allergies: [],
  chronicConditions: [],
  organDonorStatus: 'Not Specified',
  isDemoData: false
};

// Clean initial state for user-driven patient health record
export const INITIAL_INCIDENTS: Incident[] = [];
export const INITIAL_DOCUMENTS: MedicalDocument[] = [];
export const INITIAL_MEDICINES: Medicine[] = [];
export const INITIAL_REMINDERS: Reminder[] = [];
export const INITIAL_DOCTOR_SUGGESTIONS: DoctorSuggestion[] = [];
export const INITIAL_ACCESS_GRANTS: AccessGrant[] = [];
export const INITIAL_ACCESS_LOGS: AccessLog[] = [];

export const INITIAL_SCHEMES: HealthcareScheme[] = [
  {
    id: 'SCH-01',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    shortCode: 'PM-JAY',
    ministry: 'National Health Authority (NHA) & MoHFW',
    coverageAmount: '₹5,00,000 / family / year',
    description: 'Government-funded healthcare assurance scheme offering cashless inpatient secondary and tertiary hospital care at empaneled public and private hospitals across India.',
    eligibilityStatus: 'LIKELY_ELIGIBLE',
    matchScore: 94,
    eligibilityCriteria: [
      'Identified under SECC 2011 deprivation criteria or verified state ration card registry',
      'No cap on family size, age, or gender',
      'Pre-existing conditions covered from Day 1'
    ],
    requiredDocuments: ['Aadhaar Card', 'ABHA Health ID', 'Ration Card / Income Certificate'],
    benefits: [
      '1,949 treatment packages including oncology, cardiology, orthopedics',
      'Pre and post-hospitalization expenses for 3 and 15 days respectively',
      '100% cashless treatment at empaneled hospitals nationwide'
    ],
    activeEnrollment: false,
    applicationDeadline: 'Open Year-Round'
  },
  {
    id: 'SCH-02',
    name: 'National Trauma & Orthopedic Rehabilitation Scheme',
    shortCode: 'NTORS',
    ministry: 'Ministry of Health and Family Welfare',
    coverageAmount: 'Subsidized Fracture Fixation & Physical Therapy',
    description: 'Financial and diagnostic aid for road and sports accident trauma recovery, fiberglass casting, and post-operative orthopedic physiotherapy.',
    eligibilityStatus: 'LIKELY_ELIGIBLE',
    matchScore: 90,
    eligibilityCriteria: [
      'Documented emergency or outpatient orthopedic trauma diagnosis',
      'Valid ABHA ID linked with diagnostic X-ray or CT scan'
    ],
    requiredDocuments: ['Orthopedic Prescription', 'Digital X-Ray / Radiograph Report', 'Aadhaar ID'],
    benefits: [
      'Free fracture immobilization review and cast removal',
      'Subsidized physical therapy rehabilitation sessions'
    ],
    activeEnrollment: false,
    applicationDeadline: '31 Dec 2026'
  },
  {
    id: 'SCH-03',
    name: 'Rashtriya Arogya Nidhi (RAN) Financial Assistance',
    shortCode: 'RAN',
    ministry: 'Ministry of Health and Family Welfare',
    coverageAmount: 'Up to ₹15,00,000 for Tertiary Ailments',
    description: 'Financial assistance for patients living below designated income thresholds receiving treatment at super-specialty government hospitals.',
    eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
    matchScore: 68,
    eligibilityCriteria: [
      'Patients undergoing specialized treatment in recognized government tertiary hospitals',
      'Family annual income below designated state poverty threshold'
    ],
    requiredDocuments: ['Income Certificate', 'Doctor Medical Certificate & Cost Estimate', 'BPL Card copy'],
    benefits: ['One-time financial grant for surgery and hospitalization'],
    activeEnrollment: false
  }
];

export const INITIAL_DONATIONS: DonationCampaign[] = [
  {
    id: 'CAMP-001',
    campaignCode: 'MED-AID-2026-104',
    title: 'Emergency Open Reduction & Internal Fixation (ORIF) Titanium Plating for Bike Trauma Victim',
    patientName: 'Ramesh Kumar',
    patientAge: 28,
    location: 'New Delhi, India',
    condition: 'Comminuted Compound Distal Radius & Ulna Fracture with Tendon Laceration',
    category: 'TRAUMA_FRACTURE',
    hospital: 'AIIMS Apex Trauma Centre, New Delhi',
    doctorName: 'Dr. Ananya Iyer, MS (Ortho)',
    doctorRegNo: 'MCI-2014-9812',
    verifiedByHospital: true,
    verifiedByDoctor: true,
    status: 'VERIFIED_ACTIVE',
    isMyCampaign: false,
    goalAmount: 180000,
    raisedAmount: 124500,
    donorCount: 68,
    daysLeft: 12,
    summary: 'Ramesh is a sole breadwinner who suffered severe mechanical trauma following a bicycle road fall. Emergency X-rays revealed comminuted displacement of the distal radius requiring immediate open reduction internal fixation (ORIF) with locking titanium plates and flexor tendon repair. Hospital cost breakdown and clinical radiographs have been verified by treating orthopedic faculty.',
    treatmentBreakdown: [
      { item: 'Titanium Locking Plate & Screw Implant Set', cost: 65000 },
      { item: 'Surgical Theater & Anesthesia Charges', cost: 45000 },
      { item: 'Inpatient Hospitalization & Nursing Care (5 Days)', cost: 35000 },
      { item: 'Post-op Physical Therapy & Wound Care', cost: 35000 }
    ],
    medicalProofDocuments: ['XRay_Forearm_Comminuted.pdf', 'AIIMS_Surgical_Estimate_Signed.pdf'],
    contributions: [
      { id: 'DON-1', donorName: 'Anonymous Supporter', amount: 5000, paymentMethod: 'UPI', timestamp: '2 hours ago', transactionRef: 'UPI-TXN-881290' },
      { id: 'DON-2', donorName: 'Vikas Malhotra', amount: 2500, paymentMethod: 'CARD', timestamp: '5 hours ago', transactionRef: 'CARD-TXN-492104' }
    ]
  }
];

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'CASE-01',
    caseId: 'CASE-EDU-2026-018',
    title: 'Fatal Rapidly Progressive Idiopathic Pulmonary Fibrosis Exacerbation Following Influenza-A: Autopsy & Clinical Trajectory Study',
    specialty: 'Pulmonology, Critical Care & Pathology',
    ageRange: '55 - 60 years',
    gender: 'Male (De-identified)',
    isDeceasedCase: true,
    causeOfDemise: 'Acute Respiratory Distress Syndrome (ARDS) secondary to diffuse alveolar damage and end-stage fibrotic lung disease',
    consentType: 'LEGAL_FAMILY_POSTMORTEM_CONSENT',
    clinicalHistory: 'A 58-year-old patient with established usual interstitial pneumonia (UIP) presented with sudden hypoxemic respiratory collapse 4 days following viral influenza. Despite high-flow nasal cannula and veno-venous ECMO bridging, irreversible refractory hypoxemia ensued on ICU Day 11. Family provided formal notarized post-mortem scientific study consent.',
    pathologySummary: 'Post-mortem core lung biopsy revealed extensive hyaline membrane formation superimposed on dense architectural honeycomb remodeling, fibroblastic foci proliferation, and severe capillary microthrombosis.',
    timelineMilestones: [
      {
        phase: 'Day 1: Acute Presentation & Triage',
        duration: '0 - 24 hours',
        clinicalAction: 'Emergency ICU admission, ABG PaO2/FiO2 ratio 92; initiation of pulse methylprednisolone 1g IV and empirical broad-spectrum coverage.',
        outcome: 'Transient stabilization; PaO2 remained below 60 mmHg on 100% FiO2.'
      },
      {
        phase: 'Days 2 - 6: Mechanical Ventilation & ECMO',
        duration: '5 days',
        clinicalAction: 'Low-tidal-volume lung-protective ventilation (4 ml/kg PBW) + initiation of veno-venous extracorporeal membrane oxygenation (VV-ECMO).',
        outcome: 'Static compliance dropped below 12 mL/cmH2O indicating severe parenchymal consolidation.'
      },
      {
        phase: 'Days 7 - 11: Multi-Organ Collapse & Terminal Event',
        duration: '4 days',
        clinicalAction: 'Secondary refractory vasoplegic shock and oliguria requiring continuous renal replacement therapy (CRRT).',
        outcome: 'Patient suffered terminal cardiac arrest; resuscitation unsuccessful. De-identified records transferred to research repository.'
      }
    ],
    keyFindings: [
      'Viral coinfection (Influenza A) acts as an explosive trigger for diffuse alveolar damage in pre-existing fibrotic lungs.',
      'Antifibrotic maintenance therapy must be critically paired with aggressive early antiviral prophylaxis during seasonal surges.'
    ],
    educationalTakeaways: [
      'Early palliative goals-of-care discussions in end-stage interstitial lung disease prevent prolonged unviable invasive interventions.',
      'Post-mortem histopathology demonstrates that microvascular in-situ thrombosis significantly accelerates hypoxemic death in acute pulmonary fibrosis exacerbations.'
    ],
    peerReviewedBy: 'Academy of Pulmonary & Critical Care Autopsy Education',
    publishedDate: '18 Aug 2026',
    submittedByRole: 'Academic Medical ICU Research Board'
  }
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'MSG-001',
    role: 'assistant',
    content: 'Hello. I am your AURA Health Intelligence Assistant.\n\nI dynamically analyze your personal medical history, active incidents, diagnostic documents, and doctor directives.\n\nYou can switch between Modern Clinical Medicine and Full Ayurvedic Mode using the mode switcher above.\n\nHow can I help you today?',
    timestamp: 'Just now',
    confidence: 'HIGH'
  }
];
