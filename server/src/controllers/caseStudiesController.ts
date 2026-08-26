import { Request, Response } from 'express';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

let memoryCaseStudies: any[] = [];

export const getCaseStudies = async (_req: Request, res: Response) => {
  try {
    if (isConnectedToPostgres) {
      const sql = 'SELECT * FROM case_studies ORDER BY id DESC;';
      const result = await query(sql);
      return res.json(result.rows.map(r => ({
        id: r.id,
        caseId: r.case_id,
        title: r.title,
        specialty: r.specialty,
        ageRange: r.age_range,
        gender: r.gender,
        isDeceasedCase: r.is_deceased_case,
        causeOfDemise: r.cause_of_demise,
        consentType: r.consent_type,
        clinicalHistory: r.clinical_history,
        pathologySummary: r.pathology_summary,
        timelineMilestones: r.timeline_milestones_json,
        keyFindings: r.key_findings_json,
        educationalTakeaways: r.educational_takeaways_json,
        peerReviewedBy: r.peer_reviewed_by,
        publishedDate: r.published_date,
        submittedByRole: r.submitted_by_role
      })));
    }

    return res.json(memoryCaseStudies);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const submitCaseStudy = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      specialty = 'Critical Care & Pathology',
      ageRange = '25 - 30 years',
      gender = 'Male (De-identified)',
      causeOfDemise,
      clinicalHistory,
      pathologySummary,
      timelineMilestones,
      keyFindings,
      educationalTakeaways
    } = req.body;

    const newId = `CASE-${Date.now()}`;
    const caseId = `CASE-EDU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const studyObj = {
      id: newId,
      caseId,
      title: title || 'De-identified Post-Mortem Clinical Trajectory & Histopathological Study',
      specialty,
      ageRange,
      gender,
      isDeceasedCase: true,
      causeOfDemise: causeOfDemise || 'Terminal refractory illness secondary to acute mechanical trauma/infection',
      consentType: 'LEGAL_FAMILY_POSTMORTEM_CONSENT',
      clinicalHistory: clinicalHistory || 'Patient with documented longitudinal medical episodes. De-identified complete timeline milestones contributed for institutional educational research.',
      pathologySummary: pathologySummary || 'Post-mortem core biopsy review confirmed cellular trauma response with acute osteoblast suppression.',
      timelineMilestones: timelineMilestones || [
        { phase: 'Initial Acute Presentation', duration: 'Day 1', clinicalAction: 'Emergency triage & closed reduction', outcome: 'Initial stabilization' },
        { phase: 'Follow-up ICU Monitoring', duration: 'Days 2 - 5', clinicalAction: 'Vital monitoring and supportive care', outcome: 'Sustained vitals' }
      ],
      keyFindings: keyFindings || [
        'Rapid trajectory demonstrates the importance of early diagnostic radiographic screening.',
        'Zero PII exposed in compliance with HIPAA/ABHA standards.'
      ],
      educationalTakeaways: educationalTakeaways || [
        'Pre-morbid longitudinal medical histories significantly improve clinical insight.',
        'Post-mortem histopathology provides crucial baseline training data.'
      ],
      peerReviewedBy: 'National Academic Board of Post-Mortem Medical Education',
      publishedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedByRole: 'Legal Family Consent & Academic Research Ethics Board'
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO case_studies (
          id, case_id, title, specialty, age_range, gender, is_deceased_case,
          cause_of_demise, consent_type, clinical_history, pathology_summary,
          timeline_milestones_json, key_findings_json, educational_takeaways_json,
          peer_reviewed_by, published_date, submitted_by_role
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *;
      `;
      await query(sql, [
        newId, caseId, studyObj.title, specialty, ageRange, gender, true,
        studyObj.causeOfDemise, studyObj.consentType, studyObj.clinicalHistory,
        studyObj.pathologySummary, JSON.stringify(studyObj.timelineMilestones),
        JSON.stringify(studyObj.keyFindings), JSON.stringify(studyObj.educationalTakeaways),
        studyObj.peerReviewedBy, studyObj.publishedDate, studyObj.submittedByRole
      ]);
    } else {
      memoryCaseStudies.unshift(studyObj);
    }

    return res.status(201).json({
      message: `Case study ${caseId} submitted to academic knowledge repository`,
      caseStudy: studyObj
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
