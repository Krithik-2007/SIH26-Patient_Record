import { Request, Response } from 'express';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

let memoryIncidents: any[] = [];

export const getIncidents = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.query.patientId as string || req.user?.id;

    if (isConnectedToPostgres && patientId) {
      const sql = 'SELECT * FROM incidents WHERE patient_id = $1 ORDER BY id DESC;';
      const result = await query(sql, [patientId]);
      return res.json(result.rows.map(row => ({
        id: row.id,
        patientId: row.patient_id,
        year: row.year,
        date: row.date,
        createdAt: row.created_at,
        title: row.title,
        hospital: row.hospital,
        doctor: row.doctor,
        department: row.department,
        reason: row.reason,
        patientDescription: row.patient_description,
        diagnosis: row.diagnosis,
        treatment: row.treatment,
        status: row.status,
        severity: row.severity,
        scale: row.scale,
        resolvedAt: row.resolved_at,
        closingNotes: row.closing_notes,
        documentsCount: row.documents_count,
        medicinesCount: row.medicines_count,
        doctorSuggestionsCount: row.doctor_suggestions_count
      })));
    }

    const filtered = memoryIncidents.filter(i => !patientId || i.patientId === patientId);
    return res.json(filtered);
  } catch (err) {
    console.error('Get Incidents Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const createIncident = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.id || req.body.patientId || 'PAT-DEFAULT';
    const {
      title,
      hospital,
      doctor,
      department,
      reason,
      patientDescription,
      diagnosis,
      treatment,
      severity = 'MODERATE',
      scale
    } = req.body;

    const now = new Date();
    const incCount = isConnectedToPostgres ? (await query('SELECT COUNT(*) FROM incidents WHERE patient_id = $1;', [patientId])).rows[0].count : memoryIncidents.length;
    const newId = `INC-00${Number(incCount) + 1}`;

    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const createdAtStr = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const isMajor = scale || 
      ((title && (title.toLowerCase().includes('fracture') || title.toLowerCase().includes('surgery') || title.toLowerCase().includes('cardiac') || title.toLowerCase().includes('asthma') || title.toLowerCase().includes('arm'))) || severity === 'CRITICAL' ? 'MAJOR_LONG_TERM' : 'ACUTE_TEMPORARY');

    const incidentData = {
      id: newId,
      patientId,
      year: now.getFullYear(),
      date: dateStr,
      createdAt: createdAtStr,
      title: title || 'New Healthcare Episode',
      hospital: hospital || 'SMS Hospital & Medical College',
      doctor: doctor || 'Dr. Ram, MS Ortho',
      department: department || 'Orthopedics & Trauma Care',
      reason: reason || patientDescription || 'Broke arm from fall',
      patientDescription: patientDescription || '',
      diagnosis: diagnosis || title || 'Right Forearm Distal Radius Fracture',
      treatment: treatment || 'Cast immobilization for 4 weeks, analgesics, and rest',
      status: 'ACTIVE',
      severity,
      scale: isMajor,
      documentsCount: 0,
      medicinesCount: 0,
      doctorSuggestionsCount: 0
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO incidents (
          id, patient_id, year, date, created_at, title, hospital, doctor, department,
          reason, patient_description, diagnosis, treatment, status, severity, scale,
          documents_count, medicines_count, doctor_suggestions_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *;
      `;
      const values = [
        newId, patientId, incidentData.year, incidentData.date, incidentData.createdAt,
        incidentData.title, incidentData.hospital, incidentData.doctor, incidentData.department,
        incidentData.reason, incidentData.patientDescription, incidentData.diagnosis, incidentData.treatment,
        incidentData.status, incidentData.severity, incidentData.scale, 0, 0, 0
      ];
      await query(sql, values);
    } else {
      memoryIncidents.unshift(incidentData);
    }

    return res.status(201).json(incidentData);
  } catch (err) {
    console.error('Create Incident Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const closeIncident = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { closingNotes } = req.body;
    const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const notes = closingNotes || 'Marked as clinically resolved and cured by patient.';

    if (isConnectedToPostgres) {
      const sql = `
        UPDATE incidents
        SET status = 'CLOSED', resolved_at = $1, closing_notes = $2
        WHERE id = $3
        RETURNING *;
      `;
      const result = await query(sql, [nowStr, notes, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });
      return res.json({ message: 'Incident closed successfully', incident: result.rows[0] });
    }

    const inc = memoryIncidents.find(i => i.id === id);
    if (inc) {
      inc.status = 'CLOSED';
      inc.resolvedAt = nowStr;
      inc.closingNotes = notes;
      return res.json({ message: 'Incident closed successfully', incident: inc });
    }

    return res.status(404).json({ error: 'Incident not found' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const reopenIncident = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToPostgres) {
      const sql = `
        UPDATE incidents
        SET status = 'ACTIVE', resolved_at = NULL
        WHERE id = $1
        RETURNING *;
      `;
      const result = await query(sql, [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });
      return res.json({ message: 'Incident reopened', incident: result.rows[0] });
    }

    const inc = memoryIncidents.find(i => i.id === id);
    if (inc) {
      inc.status = 'ACTIVE';
      inc.resolvedAt = undefined;
      return res.json({ message: 'Incident reopened', incident: inc });
    }

    return res.status(404).json({ error: 'Incident not found' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
