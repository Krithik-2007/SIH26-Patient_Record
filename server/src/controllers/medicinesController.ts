import { Request, Response } from 'express';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

let memoryMedicines: any[] = [];
let memoryReminders: any[] = [];

export const getMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.query.patientId as string || req.user?.id;

    if (isConnectedToPostgres && patientId) {
      const sql = 'SELECT * FROM medicines WHERE patient_id = $1 ORDER BY id DESC;';
      const result = await query(sql, [patientId]);
      return res.json(result.rows.map(r => ({
        id: r.id,
        incidentId: r.incident_id,
        patientId: r.patient_id,
        name: r.name,
        dosage: r.dosage,
        frequency: r.frequency,
        timing: r.timing_json,
        duration: r.duration,
        startDate: r.start_date,
        endDate: r.end_date,
        instructions: r.instructions,
        active: r.active
      })));
    }

    const filtered = memoryMedicines.filter(m => !patientId || m.patientId === patientId);
    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getReminders = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.query.patientId as string || req.user?.id;

    if (isConnectedToPostgres && patientId) {
      const sql = 'SELECT * FROM reminders WHERE patient_id = $1 ORDER BY id DESC;';
      const result = await query(sql, [patientId]);
      return res.json(result.rows.map(r => ({
        id: r.id,
        medicineId: r.medicine_id,
        patientId: r.patient_id,
        medicineName: r.medicine_name,
        dosage: r.dosage,
        time: r.time,
        period: r.period,
        status: r.status,
        scheduledDate: r.scheduled_date,
        takenAt: r.taken_at
      })));
    }

    const filtered = memoryReminders.filter(r => !patientId || r.patientId === patientId);
    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const addMedicineWithReminders = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.id || req.body.patientId || 'PAT-DEFAULT';
    const {
      incidentId = 'INC-001',
      name,
      dosage = '1 Tablet',
      frequency = '2 times daily',
      duration = '7 Days',
      instructions = 'Take after meals with water.',
      reminderTimes = ['08:00 AM', '08:30 PM']
    } = req.body;

    const medId = `MED-00${Date.now()}`;
    const now = new Date();
    const startDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const medObj = {
      id: medId,
      incidentId,
      patientId,
      name,
      dosage,
      frequency,
      timing: ['MORNING', 'NIGHT'],
      duration,
      startDate: startDateStr,
      endDate: 'As Prescribed',
      instructions,
      active: true
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO medicines (
          id, incident_id, patient_id, name, dosage, frequency, timing_json,
          duration, start_date, end_date, instructions, active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `;
      await query(sql, [
        medId, incidentId, patientId, name, dosage, frequency,
        JSON.stringify(medObj.timing), duration, startDateStr, 'As Prescribed', instructions, true
      ]);

      await query('UPDATE incidents SET medicines_count = medicines_count + 1 WHERE id = $1;', [incidentId]);
    } else {
      memoryMedicines.unshift(medObj);
    }

    const createdReminders: any[] = [];

    for (let i = 0; i < reminderTimes.length; i++) {
      const time = reminderTimes[i];
      const remId = `REM-${Date.now()}-${i}`;
      let period = 'MORNING';
      const tLower = time.toLowerCase();
      if (tLower.includes('pm')) {
        const hour = parseInt(time.split(':')[0], 10);
        period = (hour >= 1 && hour < 5) || hour === 12 ? 'AFTERNOON' : 'NIGHT';
      }

      const remObj = {
        id: remId,
        medicineId: medId,
        patientId,
        medicineName: name,
        dosage,
        time,
        period,
        status: 'PENDING',
        scheduledDate: startDateStr,
        takenAt: null
      };

      if (isConnectedToPostgres) {
        const sqlRem = `
          INSERT INTO reminders (
            id, medicine_id, patient_id, medicine_name, dosage, time, period, status, scheduled_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `;
        await query(sqlRem, [remId, medId, patientId, name, dosage, time, period, 'PENDING', startDateStr]);
      } else {
        memoryReminders.unshift(remObj);
      }

      createdReminders.push(remObj);
    }

    return res.status(201).json({
      message: 'Medicine and timed alarm reminders scheduled successfully',
      medicine: medObj,
      reminders: createdReminders
    });
  } catch (err) {
    console.error('Add Medicine Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const toggleReminderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToPostgres) {
      const getSql = 'SELECT * FROM reminders WHERE id = $1;';
      const current = await query(getSql, [id]);
      if (current.rows.length === 0) return res.status(404).json({ error: 'Reminder not found' });

      const rem = current.rows[0];
      const nextStatus = rem.status === 'PENDING' ? 'TAKEN' : rem.status === 'TAKEN' ? 'SKIPPED' : 'PENDING';
      const takenAtStr = nextStatus === 'TAKEN' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

      const updSql = `
        UPDATE reminders
        SET status = $1, taken_at = $2
        WHERE id = $3
        RETURNING *;
      `;
      const updated = await query(updSql, [nextStatus, takenAtStr, id]);
      return res.json({ message: 'Reminder status updated', reminder: updated.rows[0] });
    }

    const rem = memoryReminders.find(r => r.id === id);
    if (rem) {
      rem.status = rem.status === 'PENDING' ? 'TAKEN' : rem.status === 'TAKEN' ? 'SKIPPED' : 'PENDING';
      rem.takenAt = rem.status === 'TAKEN' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
      return res.json({ message: 'Reminder status updated', reminder: rem });
    }

    return res.status(404).json({ error: 'Reminder not found' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
