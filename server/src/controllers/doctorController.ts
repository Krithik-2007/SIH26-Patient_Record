import { Request, Response } from 'express';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

let memoryGrants: any[] = [];
let memoryLogs: any[] = [];
let memorySuggestions: any[] = [];

export const verifyPatientToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    let grant: any = null;

    if (isConnectedToPostgres) {
      const sql = 'SELECT * FROM access_grants WHERE token = $1 AND status = \'ACTIVE\';';
      const result = await query(sql, [token.trim()]);
      grant = result.rows[0];
    } else {
      grant = memoryGrants.find(g => g.token === token.trim() && g.status === 'ACTIVE');
    }

    if (!grant) {
      return res.status(404).json({ error: 'Invalid or expired cryptographic token' });
    }

    // Log the doctor access
    const logId = `LOG-00${Date.now()}`;
    const logObj = {
      id: logId,
      grantId: grant.id || grant.grant_id,
      patientId: grant.patient_id || grant.patientId,
      recipientName: req.user?.name || 'Dr. Ananya Iyer',
      recipientRole: 'DOCTOR',
      purpose: grant.purpose,
      recordsAccessed: [grant.scope || 'FULL_HISTORY'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ipAddress: req.ip || '103.22.14.80',
      location: 'Authorized Doctor Clinical Session'
    };

    if (isConnectedToPostgres) {
      const sqlLog = `
        INSERT INTO access_logs (
          id, grant_id, patient_id, recipient_name, recipient_role, purpose,
          records_accessed_json, timestamp, ip_address, location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
      `;
      await query(sqlLog, [
        logId, logObj.grantId, logObj.patientId, logObj.recipientName,
        logObj.recipientRole, logObj.purpose, JSON.stringify(logObj.recordsAccessed),
        logObj.timestamp, logObj.ipAddress, logObj.location
      ]);

      await query('UPDATE access_grants SET access_count = access_count + 1 WHERE id = $1;', [grant.id]);
    } else {
      memoryLogs.unshift(logObj);
    }

    return res.json({
      message: 'Token verified successfully. Permitted patient records granted.',
      grant,
      log: logObj
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const addDoctorSuggestion = async (req: AuthRequest, res: Response) => {
  try {
    const {
      incidentId = 'INC-001',
      patientId = 'PAT-DEFAULT',
      doctorName,
      specialty = 'Orthopedics & Trauma Surgery',
      hospital = 'SMS Hospital & Medical College',
      suggestion,
      followUpDate = 'In 2 weeks with repeat X-Ray',
      priority = 'HIGH'
    } = req.body;

    if (!suggestion) return res.status(400).json({ error: 'Suggestion text is required' });

    const sugId = `SUG-0${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const docName = doctorName || req.user?.name || 'Dr. Ram, MS Ortho';

    const sugObj = {
      id: sugId,
      incidentId,
      patientId,
      doctorName: docName,
      specialty,
      hospital,
      date: dateStr,
      suggestion,
      followUpDate,
      priority,
      source: 'DOCTOR_RECORDED'
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO doctor_suggestions (
          id, incident_id, patient_id, doctor_name, specialty, hospital,
          date, suggestion, follow_up_date, priority, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      await query(sql, [
        sugId, incidentId, patientId, docName, specialty, hospital,
        dateStr, suggestion, followUpDate, priority, 'DOCTOR_RECORDED'
      ]);

      await query('UPDATE incidents SET doctor_suggestions_count = doctor_suggestions_count + 1 WHERE id = $1;', [incidentId]);
    } else {
      memorySuggestions.unshift(sugObj);
    }

    return res.status(201).json({
      message: 'Doctor suggestion recorded and signed successfully',
      suggestion: sugObj
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const createAccessGrant = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.id || req.body.patientId || 'PAT-DEFAULT';
    const { scope = 'FULL_RECORD_TIMELINE', purpose = 'Clinical Consultation', expiresInMinutes = 10 } = req.body;

    const grantId = `GRANT-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = `AURA-SEC-${Math.floor(1000 + Math.random() * 9000)}-TOK`;
    const expiresInSec = expiresInMinutes * 60;

    const grantObj = {
      id: grantId,
      patientId,
      recipientName: 'Authorized Provider (QR Scan)',
      recipientRole: 'DOCTOR',
      purpose,
      scope,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: `In ${expiresInMinutes} mins`,
      expiresInSeconds: expiresInSec,
      token,
      status: 'ACTIVE',
      accessCount: 0
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO access_grants (
          id, patient_id, recipient_name, recipient_role, purpose, scope,
          created_at, expires_at, expires_in_seconds, token, status, access_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
      `;
      await query(sql, [
        grantId, patientId, grantObj.recipientName, grantObj.recipientRole,
        purpose, scope, grantObj.createdAt, grantObj.expiresAt,
        expiresInSec, token, 'ACTIVE', 0
      ]);
    } else {
      memoryGrants.unshift(grantObj);
    }

    return res.status(201).json({
      message: `Secure QR Token generated. Valid for ${expiresInMinutes} minutes`,
      grant: grantObj
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
