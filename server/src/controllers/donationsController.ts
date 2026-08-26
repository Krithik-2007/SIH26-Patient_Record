import { Request, Response } from 'express';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

let memoryCampaigns: any[] = [];

export const getCampaigns = async (_req: Request, res: Response) => {
  try {
    if (isConnectedToPostgres) {
      const sql = 'SELECT * FROM donation_campaigns ORDER BY id DESC;';
      const result = await query(sql);
      return res.json(result.rows.map(r => ({
        id: r.id,
        campaignCode: r.campaign_code,
        title: r.title,
        patientName: r.patient_name,
        patientAge: r.patient_age,
        location: r.location,
        condition: r.condition,
        category: r.category,
        hospital: r.hospital,
        doctorName: r.doctor_name,
        doctorRegNo: r.doctor_reg_no,
        verifiedByHospital: r.verified_hospital,
        verifiedByDoctor: r.verified_doctor,
        status: r.status,
        isMyCampaign: r.is_my_campaign,
        goalAmount: Number(r.goal_amount),
        raisedAmount: Number(r.raised_amount),
        donorCount: r.donor_count,
        daysLeft: r.days_left,
        summary: r.summary,
        treatmentBreakdown: r.treatment_breakdown_json,
        medicalProofDocuments: r.proof_docs_json,
        contributions: r.contributions_json || []
      })));
    }

    return res.json(memoryCampaigns);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      patientName = req.user?.name || 'Patient',
      patientAge = 28,
      location = 'Jaipur, Rajasthan',
      condition,
      category = 'TRAUMA_FRACTURE',
      hospital = 'SMS Hospital & Medical College',
      doctorName = 'Dr. Ram, MS Ortho',
      goalAmount = 150000,
      summary,
      treatmentBreakdown
    } = req.body;

    const newId = `CAMP-00${Date.now()}`;
    const code = `MED-AID-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const campObj = {
      id: newId,
      campaignCode: code,
      title: title || 'Emergency Orthopedic Treatment Assistance',
      patientName,
      patientAge,
      location,
      condition: condition || 'Right Forearm Comminuted Fracture Requiring ORIF Plating',
      category,
      hospital,
      doctorName,
      doctorRegNo: null,
      verifiedByHospital: false,
      verifiedByDoctor: false,
      status: 'PENDING_DOCTOR_VERIFICATION',
      isMyCampaign: true,
      goalAmount,
      raisedAmount: 0,
      donorCount: 0,
      daysLeft: 30,
      summary: summary || 'Patient requested verified crowdfunding assistance for critical surgery/trauma recovery.',
      treatmentBreakdown: treatmentBreakdown || [
        { item: 'Titanium Locking Plate & Screws', cost: goalAmount * 0.6 },
        { item: 'Inpatient Hospital Care & Physiotherapy', cost: goalAmount * 0.4 }
      ],
      medicalProofDocuments: ['SMS_Hospital_Clinical_Report.pdf', 'SMS_Arm_Fracture_XRay.pdf'],
      contributions: []
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO donation_campaigns (
          id, campaign_code, title, patient_name, patient_age, location, condition,
          category, hospital, doctor_name, doctor_reg_no, verified_hospital,
          verified_doctor, status, is_my_campaign, goal_amount, raised_amount,
          donor_count, days_left, summary, treatment_breakdown_json, proof_docs_json, contributions_json
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *;
      `;
      await query(sql, [
        newId, code, campObj.title, patientName, patientAge, location,
        campObj.condition, category, hospital, doctorName, null, false,
        false, 'PENDING_DOCTOR_VERIFICATION', true, goalAmount, 0,
        0, 30, campObj.summary, JSON.stringify(campObj.treatmentBreakdown),
        JSON.stringify(campObj.medicalProofDocuments), JSON.stringify([])
      ]);
    } else {
      memoryCampaigns.unshift(campObj);
    }

    return res.status(201).json({
      message: `Crowdfunding campaign ${code} submitted for doctor verification`,
      campaign: campObj
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const verifyCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const doctorRegNo = req.user?.role === 'DOCTOR' ? (req.body.doctorRegNo || 'MCI-VERIFIED-2026') : 'MCI-VERIFIED-2026';

    if (isConnectedToPostgres) {
      const sql = `
        UPDATE donation_campaigns
        SET verified_doctor = true, verified_hospital = true, status = 'VERIFIED_ACTIVE', doctor_reg_no = $1
        WHERE id = $2
        RETURNING *;
      `;
      const result = await query(sql, [doctorRegNo, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
      return res.json({ message: 'Campaign verified and published to Global Aid network', campaign: result.rows[0] });
    }

    const camp = memoryCampaigns.find(c => c.id === id);
    if (camp) {
      camp.verifiedByDoctor = true;
      camp.verifiedByHospital = true;
      camp.status = 'VERIFIED_ACTIVE';
      camp.doctorRegNo = doctorRegNo;
      return res.json({ message: 'Campaign verified and published', campaign: camp });
    }

    return res.status(404).json({ error: 'Campaign not found' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const processContribution = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod = 'UPI', donorName } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valid amount required' });

    const txnRef = `${paymentMethod}-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newContrib = {
      id: `DON-${Date.now()}`,
      donorName: donorName || req.user?.name || 'Generous Supporter',
      amount: Number(amount),
      paymentMethod,
      timestamp: 'Just now',
      transactionRef: txnRef
    };

    if (isConnectedToPostgres) {
      const getSql = 'SELECT * FROM donation_campaigns WHERE id = $1;';
      const result = await query(getSql, [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });

      const camp = result.rows[0];
      const nextRaised = Number(camp.raised_amount) + Number(amount);
      const contributions = camp.contributions_json || [];
      contributions.unshift(newContrib);

      const nextStatus = nextRaised >= Number(camp.goal_amount) ? 'GOAL_REACHED' : camp.status;

      const updSql = `
        UPDATE donation_campaigns
        SET raised_amount = $1, donor_count = donor_count + 1, status = $2, contributions_json = $3
        WHERE id = $4
        RETURNING *;
      `;
      const updated = await query(updSql, [nextRaised, nextStatus, JSON.stringify(contributions), id]);
      return res.json({
        message: `Contribution of ₹${amount.toLocaleString('en-IN')} successful via ${paymentMethod}`,
        transactionRef: txnRef,
        campaign: updated.rows[0]
      });
    }

    const camp = memoryCampaigns.find(c => c.id === id);
    if (camp) {
      camp.raisedAmount += Number(amount);
      camp.donorCount += 1;
      if (camp.raisedAmount >= camp.goalAmount) camp.status = 'GOAL_REACHED';
      camp.contributions = [newContrib, ...(camp.contributions || [])];
      return res.json({
        message: `Contribution of ₹${amount.toLocaleString('en-IN')} successful`,
        transactionRef: txnRef,
        campaign: camp
      });
    }

    return res.status(404).json({ error: 'Campaign not found' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
