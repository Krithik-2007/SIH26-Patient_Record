import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aura_super_secure_jwt_secret_key_2026_production';

// In-memory fallback if postgres is disconnected
const memoryUsers: any[] = [];

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'PATIENT',
      age,
      gender,
      bloodGroup,
      abhaId,
      doctorRegNo,
      specialty,
      hospitalAffiliation,
      officialId,
      department,
      institutionId
    } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `USR-${role.substring(0, 3)}-${Date.now()}`;

    const userObj = {
      id: userId,
      role,
      name,
      email: email || '',
      phone: phone || '',
      age: age || 30,
      gender: gender || 'Not Specified',
      blood_group: bloodGroup || 'O+',
      abha_id: abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      doctor_reg_no: doctorRegNo || null,
      specialty: specialty || null,
      hospital_affiliation: hospitalAffiliation || null,
      official_id: officialId || null,
      department: department || null,
      institution_id: institutionId || null
    };

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO users (
          id, role, name, email, phone, password_hash, age, gender, blood_group, abha_id,
          doctor_reg_no, specialty, hospital_affiliation, official_id, department, institution_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *;
      `;
      const values = [
        userId, role, name, email || null, phone || null, passwordHash,
        age || null, gender || null, bloodGroup || null, userObj.abha_id,
        doctorRegNo || null, specialty || null, hospitalAffiliation || null,
        officialId || null, department || null, institutionId || null
      ];
      await query(sql, values);
    } else {
      memoryUsers.push({ ...userObj, passwordHash });
    }

    const token = jwt.sign({ id: userId, role, name }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: userId,
        role,
        name,
        email,
        phone,
        age: userObj.age,
        gender: userObj.gender,
        bloodGroup: userObj.blood_group,
        abhaId: userObj.abha_id,
        doctorRegNo: userObj.doctor_reg_no,
        specialty: userObj.specialty,
        hospitalAffiliation: userObj.hospital_affiliation,
        officialId: userObj.official_id,
        department: userObj.department,
        institutionId: userObj.institution_id
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    let userRecord: any = null;

    if (isConnectedToPostgres) {
      const sql = `
        SELECT * FROM users
        WHERE LOWER(email) = LOWER($1)
           OR phone = $1
           OR abha_id = $1
           OR LOWER(official_id) = LOWER($1)
           OR LOWER(doctor_reg_no) = LOWER($1)
           OR LOWER(name) = LOWER($1)
        LIMIT 1;
      `;
      const result = await query(sql, [identifier.trim()]);
      userRecord = result.rows[0];
    } else {
      const cleanId = identifier.trim().toLowerCase();
      userRecord = memoryUsers.find(u => 
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.phone && u.phone === identifier.trim()) ||
        (u.abha_id && u.abha_id === identifier.trim()) ||
        (u.official_id && u.official_id.toLowerCase() === cleanId) ||
        (u.doctor_reg_no && u.doctor_reg_no.toLowerCase() === cleanId) ||
        (u.name && u.name.toLowerCase() === cleanId)
      );
    }

    if (!userRecord) {
      return res.status(404).json({ error: 'Invalid credentials or user not found' });
    }

    const isMatch = await bcrypt.compare(password, userRecord.password_hash || userRecord.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if (role && userRecord.role !== role) {
      return res.status(403).json({ error: `Account registered as ${userRecord.role}. Please switch to correct portal.` });
    }

    const token = jwt.sign(
      { id: userRecord.id, role: userRecord.role, name: userRecord.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userRecord.id,
        role: userRecord.role,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone,
        age: userRecord.age,
        gender: userRecord.gender,
        bloodGroup: userRecord.blood_group,
        abhaId: userRecord.abha_id,
        doctorRegNo: userRecord.doctor_reg_no,
        specialty: userRecord.specialty,
        hospitalAffiliation: userRecord.hospital_affiliation,
        officialId: userRecord.official_id,
        department: userRecord.department,
        institutionId: userRecord.institution_id
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (isConnectedToPostgres) {
      const sql = 'SELECT * FROM users WHERE id = $1;';
      const result = await query(sql, [req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      const u = result.rows[0];
      return res.json({
        id: u.id,
        role: u.role,
        name: u.name,
        email: u.email,
        phone: u.phone,
        age: u.age,
        gender: u.gender,
        bloodGroup: u.blood_group,
        abhaId: u.abha_id,
        doctorRegNo: u.doctor_reg_no,
        specialty: u.specialty,
        hospitalAffiliation: u.hospital_affiliation,
        officialId: u.official_id,
        department: u.department,
        institutionId: u.institution_id
      });
    }

    const u = memoryUsers.find(u => u.id === req.user?.id);
    return res.json(u || req.user);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
