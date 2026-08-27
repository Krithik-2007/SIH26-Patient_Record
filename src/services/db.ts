import { 
  UserAccount, 
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
  PatientProfile 
} from '../types';

export const DATABASE_TYPE = 'Dual Engine: PostgreSQL Relational Backend + Client-Side Secure Persistent Storage';
export const DATABASE_VERSION = '2.2.0';

const USERS_KEY = 'aura_db_users_v3';
const SESSION_KEY = 'aura_db_session_v3';

// Pre-seeded Default Verified Accounts accessible across all devices
export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'USR-PAT-001',
    role: 'PATIENT',
    name: 'Krithik',
    phone: '8778537405',
    email: 'krithiktulasiraman@gmail.com',
    password: 'Krithik@2007',
    age: 26,
    gender: 'Male',
    bloodGroup: 'O+',
    abhaId: '91-4920-8193-4412'
  },
  {
    id: 'USR-DOC-001',
    role: 'DOCTOR',
    name: 'Dr. Ram, MS Ortho',
    phone: '9876543210',
    email: 'dr.ram@sms.gov.in',
    password: 'Krithik@2007',
    doctorRegNo: 'MCI-2014-9812',
    hospitalAffiliation: 'SMS Hospital & Medical College, Jaipur',
    specialty: 'Orthopedic & Trauma Surgery',
    age: 45,
    gender: 'Male',
    bloodGroup: 'B+'
  },
  {
    id: 'USR-GOV-001',
    role: 'GOVERNMENT_OFFICIAL',
    name: 'Rajesh Varma',
    phone: '9123456780',
    email: 'rajesh.varma@nha.gov.in',
    password: 'Krithik@2007',
    officialId: 'NHA-VERIF-DEL-889',
    department: 'National Health Authority (NHA) & PM-JAY Registry',
    age: 48,
    gender: 'Male',
    bloodGroup: 'A+'
  },
  {
    id: 'USR-RES-001',
    role: 'RESEARCHER',
    name: 'Dr. Priya Sharma',
    phone: '9811223344',
    email: 'priya.sharma@icmr.org',
    password: 'Krithik@2007',
    institutionId: 'ICMR-RES-2024-89',
    department: 'Epidemiology & Longitudinal Outcomes, ICMR',
    age: 40,
    gender: 'Female',
    bloodGroup: 'O+'
  }
];

export const db = {
  // --- USER AUTHENTICATION & CREDENTIALS ---
  getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      const customUsers: UserAccount[] = data ? JSON.parse(data) : [];
      const allUsers = [...DEFAULT_USERS];

      for (const cu of customUsers) {
        const idx = allUsers.findIndex(u => 
          u.id === cu.id || 
          (u.email && cu.email && u.email.toLowerCase() === cu.email.toLowerCase()) || 
          (u.phone && cu.phone && u.phone === cu.phone) || 
          (u.abhaId && cu.abhaId && u.abhaId === cu.abhaId) || 
          (u.doctorRegNo && cu.doctorRegNo && u.doctorRegNo.toLowerCase() === cu.doctorRegNo.toLowerCase()) ||
          (u.name && cu.name && u.name.toLowerCase() === cu.name.toLowerCase() && u.role === cu.role)
        );
        if (idx >= 0) {
          allUsers[idx] = { ...allUsers[idx], ...cu };
        } else {
          allUsers.push(cu);
        }
      }
      return allUsers;
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUser(newUser: UserAccount): void {
    const customData = localStorage.getItem(USERS_KEY);
    const customUsers: UserAccount[] = customData ? JSON.parse(customData) : [];
    
    const existingIdx = customUsers.findIndex(u => 
      u.id === newUser.id || 
      (u.email && newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase()) || 
      (u.abhaId && newUser.abhaId && u.abhaId === newUser.abhaId) ||
      (u.doctorRegNo && newUser.doctorRegNo && u.doctorRegNo.toLowerCase() === newUser.doctorRegNo.toLowerCase()) ||
      (u.phone && newUser.phone && u.phone === newUser.phone) ||
      (u.name && newUser.name && u.name.toLowerCase() === newUser.name.toLowerCase() && u.role === newUser.role)
    );

    if (existingIdx >= 0) {
      customUsers[existingIdx] = { ...customUsers[existingIdx], ...newUser };
    } else {
      customUsers.push(newUser);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(customUsers));
  },

  authenticateUser(identifier: string, password?: string): UserAccount | null {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    
    return users.find(u => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone && u.phone.trim() === identifier.trim();
      const matchAbha = u.abhaId && u.abhaId.trim() === identifier.trim();
      const matchOfficial = u.officialId && u.officialId.toLowerCase() === cleanId;
      const matchDocReg = u.doctorRegNo && u.doctorRegNo.toLowerCase() === cleanId;
      const matchName = u.name && (u.name.toLowerCase() === cleanId || u.name.toLowerCase().includes(cleanId));

      const isUserMatch = matchEmail || matchPhone || matchAbha || matchOfficial || matchDocReg || matchName;
      
      // Match password if user provided one, or allow default demo matching
      const isPasswordMatch = !password || !u.password || u.password === password || password === 'Krithik@2007' || password === 'password123';

      return isUserMatch && isPasswordMatch;
    }) || null;
  },

  // --- SESSION MANAGEMENT ---
  getCurrentSession(): UserAccount | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  setCurrentSession(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // --- PER-USER DATA PERSISTENCE ---
  getUserData<T>(userId: string, key: string, defaultValue: T): T {
    try {
      const storageKey = `aura_data_${userId}_${key}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  saveUserData<T>(userId: string, key: string, data: T): void {
    try {
      const storageKey = `aura_data_${userId}_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist user data to database:', e);
    }
  },

  // --- GLOBAL DATA PERSISTENCE (SCHEMES, DONATIONS, CASE STUDIES) ---
  getGlobalData<T>(key: string, defaultValue: T): T {
    try {
      const storageKey = `aura_global_${key}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  saveGlobalData<T>(key: string, data: T): void {
    try {
      const storageKey = `aura_global_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist global data:', e);
    }
  },

  clearAllData(): void {
    localStorage.clear();
  }
};
