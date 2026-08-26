import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initDatabase, isConnectedToPostgres } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import incidentsRoutes from './routes/incidentsRoutes.js';
import documentsRoutes from './routes/documentsRoutes.js';
import medicinesRoutes from './routes/medicinesRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import donationsRoutes from './routes/donationsRoutes.js';
import caseStudiesRoutes from './routes/caseStudiesRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Setup uploads static directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: [CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
app.use('/uploads', express.static(uploadDir));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'AURA Health Longitudinal Backend',
    database: isConnectedToPostgres ? 'PostgreSQL (Connected)' : 'PostgreSQL (Connecting / Standby)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/medicines', medicinesRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/casestudies', caseStudiesRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server & Connect to Database
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🏥 AURA Health Backend Server Running on Port ${PORT}`);
  console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
  console.log(`📁 File Uploads: http://localhost:${PORT}/uploads`);
  console.log(`====================================================`);
  
  await initDatabase();
});
