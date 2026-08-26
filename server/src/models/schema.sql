-- AURA Longitudinal Health Platform PostgreSQL Schema
-- Database: aura_health_db

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    role VARCHAR(32) NOT NULL DEFAULT 'PATIENT',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(32),
    blood_group VARCHAR(16),
    abha_id VARCHAR(64),
    doctor_reg_no VARCHAR(64),
    specialty VARCHAR(255),
    hospital_affiliation VARCHAR(255),
    official_id VARCHAR(64),
    department VARCHAR(255),
    institution_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    date VARCHAR(64) NOT NULL,
    created_at VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    doctor VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    patient_description TEXT,
    diagnosis VARCHAR(255) NOT NULL,
    treatment TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    severity VARCHAR(32) NOT NULL DEFAULT 'MODERATE',
    scale VARCHAR(32) NOT NULL DEFAULT 'ACUTE_TEMPORARY',
    resolved_at VARCHAR(64),
    closing_notes TEXT,
    documents_count INTEGER DEFAULT 0,
    medicines_count INTEGER DEFAULT 0,
    doctor_suggestions_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS medical_documents (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512),
    file_size VARCHAR(32),
    type VARCHAR(64) NOT NULL,
    upload_date VARCHAR(64) NOT NULL,
    source VARCHAR(64) NOT NULL DEFAULT 'PATIENT_UPLOAD',
    verification_status VARCHAR(64) NOT NULL DEFAULT 'EXTRACTED',
    preview_url TEXT,
    extracted_data_json JSONB
);

CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(128) NOT NULL,
    frequency VARCHAR(128) NOT NULL,
    timing_json JSONB,
    duration VARCHAR(128),
    start_date VARCHAR(64),
    end_date VARCHAR(64),
    instructions TEXT,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reminders (
    id VARCHAR(64) PRIMARY KEY,
    medicine_id VARCHAR(64) REFERENCES medicines(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(128) NOT NULL,
    time VARCHAR(32) NOT NULL,
    period VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    scheduled_date VARCHAR(64),
    taken_at VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS doctor_suggestions (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    date VARCHAR(64) NOT NULL,
    suggestion TEXT NOT NULL,
    follow_up_date VARCHAR(128),
    priority VARCHAR(32) DEFAULT 'HIGH',
    source VARCHAR(64) DEFAULT 'DOCTOR_RECORDED'
);

CREATE TABLE IF NOT EXISTS access_grants (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_role VARCHAR(64) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    scope VARCHAR(64) NOT NULL,
    created_at VARCHAR(64) NOT NULL,
    expires_at VARCHAR(64) NOT NULL,
    expires_in_seconds INTEGER NOT NULL,
    token VARCHAR(128) UNIQUE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    access_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS access_logs (
    id VARCHAR(64) PRIMARY KEY,
    grant_id VARCHAR(64),
    patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_role VARCHAR(64) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    records_accessed_json JSONB,
    timestamp VARCHAR(64) NOT NULL,
    ip_address VARCHAR(64),
    location VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS donation_campaigns (
    id VARCHAR(64) PRIMARY KEY,
    campaign_code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    condition TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    doctor_reg_no VARCHAR(64),
    verified_hospital BOOLEAN DEFAULT FALSE,
    verified_doctor BOOLEAN DEFAULT FALSE,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING_DOCTOR_VERIFICATION',
    is_my_campaign BOOLEAN DEFAULT FALSE,
    goal_amount NUMERIC(12, 2) NOT NULL,
    raised_amount NUMERIC(12, 2) DEFAULT 0,
    donor_count INTEGER DEFAULT 0,
    days_left INTEGER DEFAULT 30,
    summary TEXT,
    treatment_breakdown_json JSONB,
    proof_docs_json JSONB,
    contributions_json JSONB
);

CREATE TABLE IF NOT EXISTS case_studies (
    id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    age_range VARCHAR(64) NOT NULL,
    gender VARCHAR(64) NOT NULL,
    is_deceased_case BOOLEAN DEFAULT TRUE,
    cause_of_demise TEXT NOT NULL,
    consent_type VARCHAR(128) NOT NULL,
    clinical_history TEXT NOT NULL,
    pathology_summary TEXT NOT NULL,
    timeline_milestones_json JSONB,
    key_findings_json JSONB,
    educational_takeaways_json JSONB,
    peer_reviewed_by VARCHAR(255) NOT NULL,
    published_date VARCHAR(64) NOT NULL,
    submitted_by_role VARCHAR(255) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_incidents_patient ON incidents(patient_id);
CREATE INDEX IF NOT EXISTS idx_docs_incident ON medical_documents(incident_id);
CREATE INDEX IF NOT EXISTS idx_meds_incident ON medicines(incident_id);
CREATE INDEX IF NOT EXISTS idx_reminders_patient ON reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_grants_token ON access_grants(token);
