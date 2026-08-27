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
  PatientProfile,
  AIMode
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

const getAuthHeader = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('aura_jwt_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // --- AUTH ---
  async register(userData: Partial<UserAccount>): Promise<{ user: UserAccount; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    if (data.token) localStorage.setItem('aura_jwt_token', data.token);
    return data;
  },

  async login(identifier: string, password: string, role?: string): Promise<{ user: UserAccount; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Invalid credentials');
    }
    const data = await res.json();
    if (data.token) localStorage.setItem('aura_jwt_token', data.token);
    return data;
  },

  async getCurrentUser(): Promise<UserAccount | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeader()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // --- INCIDENTS ---
  async getIncidents(patientId?: string): Promise<Incident[]> {
    const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
    const res = await fetch(`${API_BASE}/incidents${query}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return await res.json();
  },

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(incidentData)
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return await res.json();
  },

  async closeIncident(id: string, closingNotes?: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}/close`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ closingNotes })
    });
    if (!res.ok) throw new Error('Failed to close incident');
    const data = await res.json();
    return data.incident;
  },

  async reopenIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}/reopen`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error('Failed to reopen incident');
    const data = await res.json();
    return data.incident;
  },

  // --- DOCUMENTS ---
  async uploadDocuments(files: File[], incidentId: string, patientId?: string): Promise<MedicalDocument[]> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('incidentId', incidentId);
    if (patientId) formData.append('patientId', patientId);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload documents');
    const data = await res.json();
    return data.documents;
  },

  async getDocuments(patientId?: string, incidentId?: string): Promise<MedicalDocument[]> {
    const params = new URLSearchParams();
    if (patientId) params.append('patientId', patientId);
    if (incidentId) params.append('incidentId', incidentId);

    const res = await fetch(`${API_BASE}/documents?${params.toString()}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch documents');
    return await res.json();
  },

  // --- MEDICINES & REMINDERS ---
  async getMedicines(patientId?: string): Promise<Medicine[]> {
    const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
    const res = await fetch(`${API_BASE}/medicines${query}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch medicines');
    return await res.json();
  },

  async getReminders(patientId?: string): Promise<Reminder[]> {
    const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
    const res = await fetch(`${API_BASE}/medicines/reminders${query}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch reminders');
    return await res.json();
  },

  async addMedicine(medicineData: Partial<Medicine>, reminderTimes: string[]): Promise<{ medicine: Medicine; reminders: Reminder[] }> {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ...medicineData, reminderTimes })
    });
    if (!res.ok) throw new Error('Failed to add medicine');
    return await res.json();
  },

  async toggleReminder(reminderId: string): Promise<Reminder> {
    const res = await fetch(`${API_BASE}/medicines/reminders/${reminderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error('Failed to toggle reminder');
    const data = await res.json();
    return data.reminder;
  },

  // --- DOCTOR OPERATIONS ---
  async verifyDoctorToken(token: string): Promise<any> {
    const res = await fetch(`${API_BASE}/doctor/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ token })
    });
    if (!res.ok) throw new Error('Invalid token');
    return await res.json();
  },

  async addDoctorSuggestion(suggestionData: any): Promise<DoctorSuggestion> {
    const res = await fetch(`${API_BASE}/doctor/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(suggestionData)
    });
    if (!res.ok) throw new Error('Failed to add suggestion');
    const data = await res.json();
    return data.suggestion;
  },

  // --- CROWDFUNDING DONATIONS ---
  async getCampaigns(): Promise<DonationCampaign[]> {
    const res = await fetch(`${API_BASE}/donations`);
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return await res.json();
  },

  async createCampaign(campaignData: Partial<DonationCampaign>): Promise<DonationCampaign> {
    const res = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(campaignData)
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    const data = await res.json();
    return data.campaign;
  },

  async verifyCampaign(campaignId: string, doctorRegNo?: string): Promise<DonationCampaign> {
    const res = await fetch(`${API_BASE}/donations/${campaignId}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ doctorRegNo })
    });
    if (!res.ok) throw new Error('Failed to verify campaign');
    const data = await res.json();
    return data.campaign;
  },

  async contributeDonation(campaignId: string, amount: number, paymentMethod: string, donorName?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/donations/${campaignId}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ amount, paymentMethod, donorName })
    });
    if (!res.ok) throw new Error('Payment processing failed');
    return await res.json();
  },

  // --- CASE STUDIES ---
  async getCaseStudies(): Promise<CaseStudy[]> {
    const res = await fetch(`${API_BASE}/casestudies`);
    if (!res.ok) throw new Error('Failed to fetch case studies');
    return await res.json();
  },

  async submitCaseStudy(studyData: Partial<CaseStudy>): Promise<CaseStudy> {
    const res = await fetch(`${API_BASE}/casestudies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(studyData)
    });
    if (!res.ok) throw new Error('Failed to submit case study');
    const data = await res.json();
    return data.caseStudy;
  },

  // --- AI HEALTH INTELLIGENCE ---
  async queryAI(userQuery: string, aiMode: AIMode, patientId?: string): Promise<AIMessage> {
    const res = await fetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ userQuery, aiMode, patientId })
    });
    if (!res.ok) throw new Error('Failed to query AI');
    const data = await res.json();
    return {
      id: `MSG-${Date.now()}`,
      role: 'assistant',
      content: data.content,
      timestamp: 'Just now',
      confidence: data.confidence || 'HIGH',
      mode: aiMode,
      groundedSources: data.groundedSources || []
    };
  }
};
