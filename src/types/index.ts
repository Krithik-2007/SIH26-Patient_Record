export type UserRole = 'PATIENT' | 'DOCTOR' | 'GOVERNMENT_OFFICIAL' | 'RESEARCHER' | 'POLICE_OFFICER';

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
  // Role specific fields
  abhaId?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  doctorRegNo?: string;
  hospitalAffiliation?: string;
  specialty?: string;
  officialId?: string;
  department?: string;
  institutionId?: string;
  badgeNumber?: string;
  policeStation?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  abhaId: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  organDonorStatus?: string;
  isDemoData?: boolean;
}

export type IncidentStatus = 'ACTIVE' | 'CLOSED';
export type IncidentSeverity = 'MILD' | 'MODERATE' | 'CRITICAL' | 'ROUTINE';
export type IncidentScale = 'ACUTE_TEMPORARY' | 'MAJOR_LONG_TERM';

export type MilestoneType = 
  | 'DIAGNOSIS' 
  | 'SURGERY' 
  | 'CHEMO_CYCLE' 
  | 'RADIATION' 
  | 'MEDICATION_CHANGE' 
  | 'REMISSION_CHECK' 
  | 'REHABILITATION' 
  | 'FOLLOW_UP';

export interface IncidentMilestone {
  id: string;
  title: string;
  date: string;
  type: MilestoneType;
  notes: string;
  doctorName?: string;
  hospitalName?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
}

export interface Incident {
  id: string; // INC-001, INC-002, etc.
  patientId: string;
  year: number;
  date: string;
  createdAt: string;
  resolvedAt?: string;
  closingNotes?: string;
  title: string;
  hospital: string;
  doctor: string;
  department: string;
  reason: string;
  patientDescription: string;
  diagnosis: string;
  treatment: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  scale: IncidentScale;
  documentsCount: number;
  medicinesCount: number;
  doctorSuggestionsCount: number;
  
  // Longitudinal Staging & Branching (e.g. Cancer, Chronic Illness, Rehab)
  parentIncidentId?: string;
  isChronic?: boolean;
  stageOrCycle?: string;
  milestones?: IncidentMilestone[];
  branchesCount?: number;
}

export type DocumentType = 
  | 'PRESCRIPTION' 
  | 'LAB_REPORT' 
  | 'IMAGING_SCAN' 
  | 'DISCHARGE_SUMMARY' 
  | 'HOSPITAL_BILL' 
  | 'CLINICAL_PHOTO'
  | 'VACCINATION_CERTIFICATE'
  | 'MEDICO_LEGAL_REPORT';

export type DataSourceTag = 'PATIENT_PROVIDED' | 'DOCTOR_RECORDED' | 'AI_EXTRACTED' | 'PRESCRIPTION' | 'POLICE_VERIFIED';

export interface ExtractedLabValue {
  test: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW';
}

export interface ExtractedMedicineItem {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface ExtractedMedicalData {
  doctorName?: string;
  hospitalName?: string;
  visitDate?: string;
  diagnosis?: string;
  medicines?: ExtractedMedicineItem[];
  labValues?: ExtractedLabValue[];
  keyAdvice?: string;
  confidenceScore: number;
}

export interface MedicalDocument {
  id: string;
  incidentId: string;
  title: string;
  filename: string;
  type: DocumentType;
  fileSize: string;
  uploadDate: string;
  source: 'PATIENT_UPLOAD' | 'HOSPITAL_PORTAL' | 'LAB_SYSTEM';
  verificationStatus: 'VERIFIED' | 'REVIEW_PENDING' | 'EXTRACTED';
  extractedData?: ExtractedMedicalData;
  previewUrl?: string;
  fileData?: string;
  notes?: string;
}

export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'NIGHT';

export interface Medicine {
  id: string;
  incidentId: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: TimeOfDay[];
  duration: string;
  startDate: string;
  endDate: string;
  source: 'PRESCRIPTION' | 'DOCTOR_RECORDED' | 'PATIENT_PROVIDED';
  instructions: string;
  active: boolean;
}

export interface Reminder {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  time: string; // e.g. "08:00 AM"
  period: TimeOfDay;
  status: 'PENDING' | 'TAKEN' | 'SKIPPED';
  scheduledDate: string;
  takenAt?: string;
}

export interface DoctorSuggestion {
  id: string;
  incidentId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  suggestion: string;
  followUpDate?: string;
  source: 'DOCTOR_RECORDED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
}

export type AccessScope = 
  | 'FULL_MEDICAL_HISTORY' 
  | 'CURRENT_INCIDENT_ONLY' 
  | 'MEDICINES_AND_ALLERGIES' 
  | 'EMERGENCY_TRIAGE_DATA';

export interface AccessGrant {
  id: string;
  patientId: string;
  recipientName: string;
  recipientRole: 'DOCTOR' | 'HOSPITAL' | 'OFFICIAL' | 'EMERGENCY' | 'POLICE';
  purpose: string;
  scope: AccessScope;
  createdAt: string;
  expiresAt: string;
  expiresInSeconds: number;
  token: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  accessCount: number;
}

export interface AccessLog {
  id: string;
  grantId: string;
  recipientName: string;
  recipientRole: string;
  purpose: string;
  recordsAccessed: string[];
  timestamp: string;
  ipAddress: string;
  location: string;
}

export interface HealthcareScheme {
  id: string;
  name: string;
  shortCode: string;
  ministry: string;
  coverageAmount: string;
  description: string;
  eligibilityStatus: 'LIKELY_ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'ADDITIONAL_INFO_REQUIRED';
  matchScore: number;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  benefits: string[];
  activeEnrollment?: boolean;
  enrollmentId?: string;
  applicationDeadline?: string;
  
  // Scheme Creation Metadata
  createdById?: string;
  createdByRole?: UserRole;
  applicableConditions?: string[];
  minAge?: number;
  maxAge?: number;
  incomeCeiling?: number;
}

export interface PoliceAccessVerification {
  officerName: string;
  badgeNumber: string;
  stationName: string;
  firNumber?: string;
  purpose: 'EMERGENCY_ACCIDENT_TRIAGE' | 'MEDICO_LEGAL_CASE' | 'IDENTITY_VERIFICATION' | 'UNCONSCIOUS_VICTIM_IDENTIFICATION';
  timestamp: string;
  patientToken: string;
}

export type DonationCampaignCategory = 
  | 'TRAUMA_FRACTURE' 
  | 'SURGERY' 
  | 'ONCOLOGY' 
  | 'PEDIATRIC' 
  | 'RARE_DISEASE';

export type DonationCampaignStatus = 
  | 'PENDING_DOCTOR_VERIFICATION' 
  | 'VERIFIED_ACTIVE' 
  | 'GOAL_REACHED' 
  | 'CLOSED';

export interface DonationContribution {
  id: string;
  donorName: string;
  amount: number;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING';
  timestamp: string;
  transactionRef: string;
}

export interface DonationCampaign {
  id: string;
  incidentId?: string;
  campaignCode: string;
  title: string;
  patientName: string;
  patientAge?: number;
  location?: string;
  condition: string;
  category: DonationCampaignCategory;
  hospital: string;
  doctorName: string;
  doctorRegNo?: string;
  verifiedByHospital: boolean;
  verifiedByDoctor: boolean;
  status: DonationCampaignStatus;
  isMyCampaign?: boolean;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  daysLeft: number;
  summary: string;
  treatmentBreakdown?: { item: string; cost: number }[];
  medicalProofDocuments: string[];
  contributions?: DonationContribution[];
}

export interface CaseStudyMilestone {
  phase: string;
  duration: string;
  clinicalAction: string;
  outcome: string;
}

export interface CaseStudy {
  id: string;
  caseId: string; // CASE-EDU-2026-001
  title: string;
  specialty: string;
  ageRange: string;
  gender: string;
  isDeceasedCase: boolean;
  causeOfDemise?: string;
  consentType: 'LEGAL_FAMILY_POSTMORTEM_CONSENT' | 'PATIENT_ADVANCE_DIRECTIVE' | 'ANONYMIZED_ETHICS_CLEARANCE';
  clinicalHistory: string;
  pathologySummary?: string;
  timelineMilestones: CaseStudyMilestone[];
  keyFindings: string[];
  educationalTakeaways: string[];
  peerReviewedBy: string;
  publishedDate: string;
  submittedByRole?: string;
}

export type AIMode = 'ALLOPATHIC' | 'AYURVEDIC';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  groundedSources?: {
    type: 'INCIDENT' | 'DOCUMENT' | 'MEDICINE' | 'DOCTOR_SUGGESTION';
    refId: string;
    title: string;
  }[];
  confidence?: 'HIGH' | 'PRELIMINARY';
  mode?: AIMode;
}

export interface DailyDietPlan {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  midMorning: string;
  lunch: string;
  eveningSnack: string;
  dinner: string;
  bedtime?: string;
  nutritionalFocus: string;
  hydrationTarget: string;
}

export interface WeeklyDietTimetable {
  title: string;
  conditionGrounded: string;
  mode: AIMode;
  caloriesTarget: string;
  calciumAndMineralTarget: string;
  strictlyAvoid: string[];
  days: DailyDietPlan[];
  doctorVerifiedNotes: string;
}

export interface DailyExercisePlan {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  routineName: string;
  durationMinutes: number;
  safetyIntensity: 'GENTLE_REHAB' | 'LOW_IMPACT' | 'MODERATE_REST';
  morningSession: {
    title: string;
    exercises: { name: string; repsOrDuration: string; safetyNote: string }[];
  };
  eveningSession: {
    title: string;
    exercises: { name: string; repsOrDuration: string; safetyNote: string }[];
  };
  prohibitedMovements: string[];
  clinicalRationale: string;
}

export interface WeeklyExerciseTimetable {
  title: string;
  conditionGrounded: string;
  mode: AIMode;
  weeklyTarget: string;
  safetyPrecautions: string[];
  prohibitedMovements: string[];
  days: DailyExercisePlan[];
}

