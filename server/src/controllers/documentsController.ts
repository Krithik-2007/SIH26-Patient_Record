import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Setup uploads directory
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage engine
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

let memoryDocuments: any[] = [];

export const uploadDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { incidentId = 'INC-001' } = req.body;
    const patientId = req.user?.id || req.body.patientId || 'PAT-DEFAULT';

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const savedDocs: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const docId = `DOC-00${Date.now()}-${i + 1}`;
      const nameLower = file.originalname.toLowerCase();

      let detectedType = 'PRESCRIPTION';
      if (nameLower.includes('xray') || nameLower.includes('scan') || nameLower.includes('mri') || nameLower.includes('ct')) {
        detectedType = 'IMAGING_SCAN';
      } else if (nameLower.includes('lab') || nameLower.includes('blood') || nameLower.includes('report')) {
        detectedType = 'LAB_REPORT';
      } else if (nameLower.includes('discharge') || nameLower.includes('summary')) {
        detectedType = 'DISCHARGE_SUMMARY';
      } else if (file.mimetype.startsWith('image/')) {
        detectedType = 'CLINICAL_PHOTO';
      }

      const extractedData = {
        hospitalName: 'SMS Hospital & Medical College',
        doctorName: 'Dr. Ram, MS Ortho',
        visitDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        diagnosis: 'Right Forearm Distal Radius Non-Displaced Fracture',
        confidenceScore: 0.98,
        keyAdvice: 'Follow recorded cast immobilization and medication instructions.'
      };

      const docObj = {
        id: docId,
        incidentId,
        patientId,
        title: file.originalname.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        filename: file.filename,
        filePath: file.path,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: detectedType,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        source: 'PATIENT_UPLOAD',
        verificationStatus: 'EXTRACTED',
        previewUrl: `/uploads/${file.filename}`,
        extractedData
      };

      if (isConnectedToPostgres) {
        const sql = `
          INSERT INTO medical_documents (
            id, incident_id, patient_id, title, filename, file_path, file_size,
            type, upload_date, source, verification_status, preview_url, extracted_data_json
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *;
        `;
        const values = [
          docId, incidentId, patientId, docObj.title, docObj.filename, docObj.filePath,
          docObj.fileSize, docObj.type, docObj.uploadDate, docObj.source,
          docObj.verificationStatus, docObj.previewUrl, JSON.stringify(extractedData)
        ];
        await query(sql, values);

        // Update incident documents count
        await query('UPDATE incidents SET documents_count = documents_count + 1 WHERE id = $1;', [incidentId]);
      } else {
        memoryDocuments.unshift(docObj);
      }

      savedDocs.push(docObj);
    }

    return res.status(201).json({
      message: `Uploaded ${files.length} document(s) successfully`,
      documents: savedDocs
    });
  } catch (err) {
    console.error('Document Upload Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.query.patientId as string || req.user?.id;
    const incidentId = req.query.incidentId as string;

    if (isConnectedToPostgres) {
      let sql = 'SELECT * FROM medical_documents WHERE 1=1';
      const params: any[] = [];

      if (patientId) {
        params.push(patientId);
        sql += ` AND patient_id = $${params.length}`;
      }
      if (incidentId) {
        params.push(incidentId);
        sql += ` AND incident_id = $${params.length}`;
      }
      sql += ' ORDER BY id DESC;';

      const result = await query(sql, params);
      return res.json(result.rows.map(row => ({
        id: row.id,
        incidentId: row.incident_id,
        patientId: row.patient_id,
        title: row.title,
        filename: row.filename,
        fileSize: row.file_size,
        type: row.type,
        uploadDate: row.upload_date,
        source: row.source,
        verificationStatus: row.verification_status,
        previewUrl: row.preview_url,
        extractedData: row.extracted_data_json
      })));
    }

    let filtered = memoryDocuments;
    if (patientId) filtered = filtered.filter(d => d.patientId === patientId);
    if (incidentId) filtered = filtered.filter(d => d.incidentId === incidentId);
    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
