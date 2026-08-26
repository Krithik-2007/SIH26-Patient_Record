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

export const DATABASE_TYPE = 'Client-Side Secure Persistent Storage (LocalStorage Engine)';
export const DATABASE_VERSION = '2.1.0';

const USERS_KEY = 'aura_db_users_v2';
const SESSION_KEY = 'aura_db_session_v2';

export const db = {
  // --- USER AUTHENTICATION & CREDENTIALS ---
  getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUser(newUser: UserAccount): void {
    const users = this.getUsers();
    const existingIdx = users.findIndex(u => u.id === newUser.id || (u.email && u.email === newUser.email) || (u.abhaId && u.abhaId === newUser.abhaId));
    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...newUser };
    } else {
      users.push(newUser);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  authenticateUser(identifier: string, password: string): UserAccount | null {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    
    return users.find(u => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone && u.phone === identifier.trim();
      const matchAbha = u.abhaId && u.abhaId === identifier.trim();
      const matchOfficial = u.officialId && u.officialId.toLowerCase() === cleanId;
      const matchDocReg = u.doctorRegNo && u.doctorRegNo.toLowerCase() === cleanId;
      const matchName = u.name && u.name.toLowerCase() === cleanId;

      const isUserMatch = matchEmail || matchPhone || matchAbha || matchOfficial || matchDocReg || matchName;
      const isPasswordMatch = u.password ? u.password === password : true;

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
