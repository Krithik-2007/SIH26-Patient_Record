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

export const DEFAULT_USERS: UserAccount[] = [];

export const INITIAL_PATIENT: PatientProfile = {
  id: 'PAT-001',
  name: 'Krithik',
  age: 26,
  gender: 'Male',
  bloodGroup: 'O+',
  abhaId: '91-4920-8193-4412',
  phone: '8778537405',
  emergencyContact: {
    name: 'Tulasiraman',
    relationship: 'Father',
    phone: '9443219081'
  },
  allergies: ['Penicillin (Mild Rash)', 'Sulfa Drugs'],
  chronicConditions: ['Orthopedic Trauma Recovery'],
  organDonorStatus: 'Registered Organ Donor (NOTTO Registry - Heart, Cornea, Kidneys)',
  isDemoData: true
};

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    patientId: 'PAT-001',
    year: 2026,
    date: '26 Aug 2026',
    createdAt: '2026-08-26T10:00:00Z',
    title: 'Right Distal Radius Bone Fracture',
    hospital: 'SMS Hospital & Medical College, Jaipur',
    doctor: 'Dr. Ram, MS Ortho',
    department: 'Orthopedics & Trauma Surgery',
    reason: 'Fell from motorcycle onto outstretched right wrist. Immediate sharp localized pain, swelling, and deformity.',
    patientDescription: 'Slipped on wet road while riding bike, fell onto right wrist. Severe pain and inability to flex fingers.',
    diagnosis: 'Non-displaced Right Distal Radius Hairline Fracture (Colles Type)',
    treatment: 'Closed anatomical reduction, short-arm fiberglass cast for 4 weeks, Tab Aceclofenac 100mg SOS, Calcium + Vitamin D3 supplements.',
    status: 'ACTIVE',
    severity: 'MODERATE',
    scale: 'ACUTE_TEMPORARY',
    documentsCount: 2,
    medicinesCount: 2,
    doctorSuggestionsCount: 1,
    isChronic: false,
    stageOrCycle: 'Phase 1 - Immobilization in Cast',
    branchesCount: 1,
    milestones: [
      {
        id: 'MLS-001',
        title: 'Emergency Admission & Digital AP/Lateral X-Ray',
        date: '26 Aug 2026',
        type: 'DIAGNOSIS',
        notes: 'X-ray confirmed non-displaced distal radial fracture with intact dorsal cortex.',
        doctorName: 'Dr. Ram, MS Ortho',
        hospitalName: 'SMS Hospital, Jaipur',
        status: 'COMPLETED'
      },
      {
        id: 'MLS-002',
        title: 'Closed Reduction & Short-Arm Fiberglass Casting',
        date: '26 Aug 2026',
        type: 'SURGERY',
        notes: 'Cast applied with wrist in neutral extension. Neurovascular examination intact.',
        doctorName: 'Dr. Ram, MS Ortho',
        hospitalName: 'SMS Hospital, Jaipur',
        status: 'COMPLETED'
      },
      {
        id: 'MLS-003',
        title: 'Repeat Follow-up X-Ray for Bone Callus Formation',
        date: '10 Sep 2026',
        type: 'FOLLOW_UP',
        notes: 'Assess union and bone callus bridging across fracture gap.',
        doctorName: 'Dr. Ram, MS Ortho',
        hospitalName: 'SMS Hospital, Jaipur',
        status: 'SCHEDULED'
      },
      {
        id: 'MLS-004',
        title: 'Cast Removal & Active Range of Motion Physiotherapy',
        date: '24 Sep 2026',
        type: 'REHABILITATION',
        notes: 'Progressive grip strengthening and pronation-supination exercises.',
        doctorName: 'Physiotherapy Unit',
        hospitalName: 'SMS Hospital, Jaipur',
        status: 'SCHEDULED'
      }
    ]
  },
  {
    id: 'INC-002',
    patientId: 'PAT-001',
    parentIncidentId: 'INC-001',
    year: 2026,
    date: '27 Aug 2026',
    createdAt: '2026-08-27T08:00:00Z',
    title: 'Post-Trauma Hand Physiotherapy & Tendon Gliding',
    hospital: 'SMS Hospital Rehabilitation Center, Jaipur',
    doctor: 'Dr. Alok Verma, MPT Ortho',
    department: 'Physical Medicine & Rehabilitation',
    reason: 'Follow-up branch to prevent finger stiffness and median nerve impingement during forearm cast immobilization.',
    patientDescription: 'Prescribed daily active finger flexions and shoulder isometric rotations while arm is in cast.',
    diagnosis: 'Preventative Post-Fracture Metacarpophalangeal Joint Mobilization',
    treatment: 'Active tendon gliding exercises 10 repetitions x 3 times daily, passive thumb abduction, ice compression on exposed fingers.',
    status: 'ACTIVE',
    severity: 'MILD',
    scale: 'ACUTE_TEMPORARY',
    documentsCount: 1,
    medicinesCount: 0,
    doctorSuggestionsCount: 1,
    isChronic: false,
    stageOrCycle: 'Branch 1: Active Motion Maintenance',
    milestones: [
      {
        id: 'MLS-005',
        title: 'Baseline Grip Dynamometer & Range Assessment',
        date: '27 Aug 2026',
        type: 'DIAGNOSIS',
        notes: 'Finger flexion intact, mild swelling in dorsal web spaces.',
        doctorName: 'Dr. Alok Verma',
        hospitalName: 'SMS Rehab Center',
        status: 'COMPLETED'
      },
      {
        id: 'MLS-006',
        title: 'Mid-Cast Isometric Strength Check',
        date: '12 Sep 2026',
        type: 'FOLLOW_UP',
        notes: 'Evaluate intrinsic muscle tone and lymphatic drainage.',
        status: 'SCHEDULED'
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'DOC-001',
    incidentId: 'INC-001',
    title: 'Right Forearm AP and Lateral Radiograph (X-Ray)',
    filename: 'arm_fracture_xray.jpg',
    type: 'IMAGING_SCAN',
    fileSize: '2.4 MB',
    uploadDate: '26 Aug 2026',
    source: 'HOSPITAL_PORTAL',
    verificationStatus: 'VERIFIED',
    extractedData: {
      hospitalName: 'SMS Hospital & Medical College, Jaipur',
      doctorName: 'Dr. Ram, MS Ortho',
      visitDate: '26 Aug 2026',
      diagnosis: 'Non-displaced transverse fracture of right distal radial metaphysis without articular involvement.',
      confidenceScore: 0.99,
      keyAdvice: 'Immobilization in short arm fiberglass cast for 4 weeks. Review with repeat X-Ray in 2 weeks.'
    }
  },
  {
    id: 'DOC-002',
    incidentId: 'INC-001',
    title: 'Orthopedic Outpatient Prescription & Clinical Notes',
    filename: 'sms_prescription_doc.jpg',
    type: 'PRESCRIPTION',
    fileSize: '1.8 MB',
    uploadDate: '26 Aug 2026',
    source: 'HOSPITAL_PORTAL',
    verificationStatus: 'VERIFIED',
    extractedData: {
      hospitalName: 'SMS Hospital & Medical College, Jaipur',
      doctorName: 'Dr. Ram, MS Ortho',
      visitDate: '26 Aug 2026',
      diagnosis: 'Right Distal Radius Hairline Fracture',
      confidenceScore: 0.98,
      keyAdvice: 'Strict immobilization. Elevate arm in sling. Tab Aceclofenac 100mg after food. Calcium + D3 OD.'
    }
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'MED-001',
    incidentId: 'INC-001',
    name: 'Aceclofenac + Paracetamol (100mg / 325mg)',
    dosage: '1 Tablet',
    frequency: 'Twice daily after food',
    timing: ['MORNING', 'NIGHT'],
    duration: '5 Days (SOS for acute fracture pain)',
    startDate: '26 Aug 2026',
    endDate: '31 Aug 2026',
    source: 'PRESCRIPTION',
    instructions: 'Take strictly after meals with plenty of water. Do not take on empty stomach.',
    active: true
  },
  {
    id: 'MED-002',
    incidentId: 'INC-001',
    name: 'Calcium Carbonate (500mg) + Vitamin D3 (400 IU)',
    dosage: '1 Tablet',
    frequency: 'Once daily after breakfast',
    timing: ['MORNING'],
    duration: '30 Days',
    startDate: '26 Aug 2026',
    endDate: '25 Sep 2026',
    source: 'PRESCRIPTION',
    instructions: 'Bone mineralization supplement. Continue throughout casting and callus formation.',
    active: true
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'REM-001',
    medicineId: 'MED-001',
    medicineName: 'Aceclofenac + Paracetamol',
    dosage: '1 Tablet',
    time: '08:30 AM',
    period: 'MORNING',
    status: 'TAKEN',
    scheduledDate: '27 Aug 2026',
    takenAt: '08:35 AM'
  },
  {
    id: 'REM-002',
    medicineId: 'MED-002',
    medicineName: 'Calcium Carbonate + Vit D3',
    dosage: '1 Tablet',
    time: '09:00 AM',
    period: 'MORNING',
    status: 'TAKEN',
    scheduledDate: '27 Aug 2026',
    takenAt: '09:05 AM'
  },
  {
    id: 'REM-003',
    medicineId: 'MED-001',
    medicineName: 'Aceclofenac + Paracetamol',
    dosage: '1 Tablet',
    time: '08:30 PM',
    period: 'NIGHT',
    status: 'PENDING',
    scheduledDate: '27 Aug 2026'
  }
];

export const INITIAL_DOCTOR_SUGGESTIONS: DoctorSuggestion[] = [
  {
    id: 'SUG-001',
    incidentId: 'INC-001',
    doctorName: 'Dr. Ram, MS Ortho',
    specialty: 'Orthopedic & Trauma Surgery',
    hospital: 'SMS Hospital & Medical College, Jaipur',
    date: '26 Aug 2026',
    suggestion: 'Strict immobilization in short arm cast for 4 weeks. Keep arm elevated above heart level when resting. Active finger movements encouraged to prevent stiffness. Avoid all lifting, running, and impact sports until bone union on follow-up X-Ray.',
    followUpDate: '10 Sep 2026 with repeat AP/Lateral X-Ray',
    source: 'DOCTOR_RECORDED',
    priority: 'HIGH'
  }
];

export const INITIAL_ACCESS_GRANTS: AccessGrant[] = [
  {
    id: 'GRANT-9021',
    patientId: 'PAT-001',
    recipientName: 'Attending Clinician (SMS Trauma Care)',
    recipientRole: 'DOCTOR',
    purpose: 'Orthopedic Outpatient Follow-up & X-Ray Review',
    scope: 'FULL_MEDICAL_HISTORY',
    createdAt: '10:15 AM',
    expiresAt: 'In 10 mins',
    expiresInSeconds: 580,
    token: 'AURA-SEC-1474-TOK',
    status: 'ACTIVE',
    accessCount: 1
  }
];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'LOG-001',
    grantId: 'GRANT-9021',
    recipientName: 'Dr. Ram, MS Ortho (SMS Hospital)',
    recipientRole: 'DOCTOR',
    purpose: 'Orthopedic Episode Assessment',
    recordsAccessed: ['INC-001', 'DOC-001', 'DOC-002', 'Pharmacotherapy'],
    timestamp: '26 Aug 2026, 10:30 AM',
    ipAddress: '14.139.242.18',
    location: 'Jaipur, Rajasthan'
  }
];

export const INITIAL_SCHEMES: HealthcareScheme[] = [
  {
    id: 'SCH-01',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    shortCode: 'PM-JAY',
    ministry: 'National Health Authority (NHA) & MoHFW',
    coverageAmount: '₹5,00,000 / family / year',
    description: 'National cashless health protection covering secondary and tertiary hospitalization across 27,000+ empaneled hospitals for eligible citizens.',
    eligibilityStatus: 'LIKELY_ELIGIBLE',
    matchScore: 98,
    eligibilityCriteria: [
      'Identified under SECC deprivation or state ration registry',
      'Valid ABHA Health ID linked with Aadhaar',
      'Covers pre-existing conditions from Day 1'
    ],
    applicableConditions: ['All', 'Orthopedic / Fracture', 'Cancer', 'Surgery', 'Cardiac'],
    requiredDocuments: ['Aadhaar Card', 'ABHA Health ID', 'Income Certificate'],
    benefits: [
      '1,949 treatment packages (Orthopedics, Oncology, Cardiology)',
      '100% cashless hospitalization, diagnostics, and medicines'
    ],
    activeEnrollment: true,
    enrollmentId: 'PMJAY-DEL-2026-9021',
    applicationDeadline: 'Open Year-Round'
  },
  {
    id: 'SCH-02',
    name: 'National Trauma & Orthopedic Rehabilitation Scheme',
    shortCode: 'NTORS',
    ministry: 'Ministry of Health and Family Welfare',
    coverageAmount: 'Subsidized Fracture Fixation & Physical Therapy',
    description: 'Financial and diagnostic support for bone fractures, accident trauma recovery, fiberglass casting, and post-op physiotherapy.',
    eligibilityStatus: 'LIKELY_ELIGIBLE',
    matchScore: 94,
    eligibilityCriteria: [
      'Documented orthopedic trauma or fracture diagnosis (INC-001)',
      'Valid ABHA ID with verified X-ray radiograph report'
    ],
    applicableConditions: ['Orthopedic / Fracture', 'Trauma'],
    requiredDocuments: ['Orthopedic Prescription', 'Digital Radiograph X-Ray Report', 'Aadhaar ID'],
    benefits: [
      'Free fracture immobilization review and cast removal',
      'Subsidized physical therapy rehabilitation sessions'
    ],
    activeEnrollment: false,
    applicationDeadline: '31 Dec 2026'
  },
  {
    id: 'SCH-03',
    name: 'National Cancer Care & Multi-Stage Oncology Mission',
    shortCode: 'NCCM',
    ministry: 'Ministry of Health and Family Welfare & Tata Memorial',
    coverageAmount: 'Up to ₹10,00,000 for Chemotherapy & Radiation',
    description: 'Specialized financial assistance for longitudinal cancer treatments, branched chemotherapy cycles, and surgical resections.',
    eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
    matchScore: 85,
    eligibilityCriteria: [
      'Biopsy-proven malignancy (Carcinoma, Sarcoma, Leukemia)',
      'Multi-stage oncology treatment protocol under empaneled oncologist'
    ],
    applicableConditions: ['Cancer', 'Oncology', 'Chemotherapy'],
    requiredDocuments: ['Histopathology Biopsy Report', 'Oncologist Protocol Plan', 'Income Certificate'],
    benefits: [
      '100% subsidized targeted chemotherapy and immunotherapy',
      'Free PET-CT scans and post-remission monitoring'
    ],
    activeEnrollment: false,
    applicationDeadline: 'Open Year-Round'
  },
  {
    id: 'SCH-04',
    name: 'Rashtriya Arogya Nidhi (RAN) Tertiary Aid Fund',
    shortCode: 'RAN',
    ministry: 'Ministry of Health and Family Welfare',
    coverageAmount: 'Up to ₹15,00,000 for Super-Specialty Care',
    description: 'One-time financial assistance for patients living below state poverty thresholds receiving treatment at super-specialty government hospitals.',
    eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
    matchScore: 70,
    eligibilityCriteria: [
      'Patients undergoing specialized treatment in recognized government tertiary hospitals',
      'Family annual income below designated state threshold'
    ],
    applicableConditions: ['All', 'Rare Disease', 'Major Surgery'],
    requiredDocuments: ['Income Certificate', 'Doctor Medical Certificate & Cost Estimate', 'BPL Card copy'],
    benefits: ['One-time financial grant for surgery and hospitalization'],
    activeEnrollment: false
  }
];

export const INITIAL_DONATIONS: DonationCampaign[] = [
  {
    id: 'CAMP-001',
    campaignCode: 'MED-AID-2026-104',
    title: 'Emergency Titanium Locking Plate Fixation for Bike Trauma Victim',
    patientName: 'Krithik',
    patientAge: 26,
    location: 'Jaipur, Rajasthan',
    condition: 'Right Distal Radius Bone Fracture',
    category: 'TRAUMA_FRACTURE',
    hospital: 'SMS Hospital & Medical College, Jaipur',
    doctorName: 'Dr. Ram, MS Ortho',
    doctorRegNo: 'MCI-2014-9812',
    verifiedByHospital: true,
    verifiedByDoctor: true,
    status: 'VERIFIED_ACTIVE',
    isMyCampaign: true,
    goalAmount: 85000,
    raisedAmount: 52000,
    donorCount: 34,
    daysLeft: 18,
    summary: 'Krithik suffered a bone fracture following a road slip. Digital X-ray confirmed distal radius metaphysis fracture requiring anatomical casting and rehabilitation. Clinical documents verified by treating orthopedic specialist Dr. Ram at SMS Hospital.',
    treatmentBreakdown: [
      { item: 'Diagnostic X-Ray Series & Cast Application', cost: 18000 },
      { item: 'Pharmacotherapy & Bone Callus Supplements', cost: 15000 },
      { item: 'Outpatient Follow-up Reviews & Cast Removal', cost: 22000 },
      { item: 'Physical Therapy Rehabilitation (8 Sessions)', cost: 30000 }
    ],
    medicalProofDocuments: ['arm_fracture_xray.jpg', 'sms_prescription_doc.jpg'],
    contributions: [
      { id: 'DON-1', donorName: 'Suresh Menon', amount: 5000, paymentMethod: 'UPI', timestamp: '2 hours ago', transactionRef: 'UPI-TXN-881290' },
      { id: 'DON-2', donorName: 'Dr. Ananya Iyer', amount: 10000, paymentMethod: 'CARD', timestamp: '4 hours ago', transactionRef: 'CARD-TXN-492104' }
    ]
  }
];

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'CASE-01',
    caseId: 'CASE-EDU-2026-018',
    title: 'Longitudinal Management of Distal Radius Metaphyseal Fracture with Non-Surgical Rigid Casting: Union & Functional Recovery',
    specialty: 'Orthopedics & Sports Traumatology',
    ageRange: '25 - 30 years',
    gender: 'Male (De-identified)',
    isDeceasedCase: false,
    consentType: 'PATIENT_ADVANCE_DIRECTIVE',
    clinicalHistory: 'A 26-year-old active male presented with acute right wrist pain following a slip and fall. Plain radiographs demonstrated a non-displaced extra-articular distal radius fracture. Closed reduction and short-arm casting were initiated with longitudinal digital tracking.',
    pathologySummary: 'Closed bone trauma with intact periosteal sleeve. Rapid callus bridging noted at Week 2 follow-up without rotational deformity.',
    timelineMilestones: [
      {
        phase: 'Week 1: Acute Reduction & Immobilization',
        duration: 'Days 1 - 7',
        clinicalAction: 'Cast application in slight palmar flexion; active MCP finger mobilization protocol.',
        outcome: 'Stable reduction maintained; neurovascular status intact.'
      },
      {
        phase: 'Week 3: Radiographic Callus Assessment',
        duration: 'Days 8 - 21',
        clinicalAction: 'AP/Lateral repeat X-rays; confirmation of trabecular bridging.',
        outcome: 'Adequate callus formation without collapse.'
      },
      {
        phase: 'Week 5: Cast Removal & Physiotherapy',
        duration: 'Days 22 - 35',
        clinicalAction: 'Cast bivalved and removed; active tendon gliding and grip strength exercises initiated.',
        outcome: 'Grip strength returned to 85% of contralateral limb.'
      }
    ],
    keyFindings: [
      'Early digit mobilization during cast immobilization prevents median nerve irritation and wrist contracture.',
      'High-resolution digital patient EMR tracking enhances follow-up compliance by 40%.'
    ],
    educationalTakeaways: [
      'Non-operative management of non-displaced distal radius fractures provides excellent functional outcomes with lower morbidity than plate fixation.',
      'Longitudinal incident milestone tracking allows seamless multidisciplinary care between surgeons and physical therapists.'
    ],
    peerReviewedBy: 'National Board of Orthopedic & Trauma Research',
    publishedDate: '26 Aug 2026',
    submittedByRole: 'Orthopedic Trauma Clinical Faculty'
  }
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'MSG-001',
    role: 'assistant',
    content: 'Hello Krithik. I am your AURA Health Intelligence Assistant.\n\nI have analyzed your active incident (INC-001: Right Distal Radius Bone Fracture under Dr. Ram at SMS Hospital), your verified X-Ray, prescription, and scheduled medications.\n\nYou can switch between Modern Clinical Pharmacology and Classical Ayurvedic Bone Healing Mode using the toggle above.\n\nHow can I assist your recovery today?',
    timestamp: 'Just now',
    confidence: 'HIGH'
  }
];
