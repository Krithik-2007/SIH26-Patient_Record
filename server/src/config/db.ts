import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool, Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to extract connection details safely even with special characters in password (e.g. '@')
const getDbConfig = () => {
  const dbUrl = process.env.DATABASE_URL || '';

  if (process.env.PGPASSWORD) {
    return {
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || 'aura_health_db',
    };
  }

  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    try {
      const match = dbUrl.match(/^postgres(?:ql)?:\/\/([^:]+):(.+)@([^:/]+)(?::(\d+))?\/([^?]+)/);
      if (match) {
        return {
          user: decodeURIComponent(match[1]),
          password: decodeURIComponent(match[2]),
          host: match[3],
          port: match[4] ? Number(match[4]) : 5432,
          database: match[5],
        };
      }
    } catch (e) {
      console.warn('URL parse warning, using raw connection string:', e);
    }
  }

  return { connectionString: dbUrl || 'postgresql://postgres:postgres@localhost:5432/aura_health_db' };
};

const dbConfig = getDbConfig();

export let pool = new Pool({
  ...dbConfig,
  ssl: process.env.NODE_ENV === 'production' && !JSON.stringify(dbConfig).includes('localhost') 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export let isConnectedToPostgres = false;

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('PostgreSQL Query Error:', { text, error: (err as Error).message });
    throw err;
  }
};

// Automatic database creation helper
const ensureDatabaseExists = async (targetDb: string, config: any) => {
  try {
    // Connect to default 'postgres' database
    const adminClient = new Client({
      ...config,
      database: 'postgres'
    });
    await adminClient.connect();
    
    const checkRes = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [targetDb]
    );

    if (checkRes.rows.length === 0) {
      console.log(`Database '${targetDb}' does not exist yet. Creating it automatically...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}";`);
      console.log(`✅ Database '${targetDb}' created successfully!`);
    }

    await adminClient.end();
  } catch (err) {
    console.debug('Database auto-create notice (database may already exist):', (err as Error).message);
  }
};

export const initDatabase = async () => {
  try {
    const targetDbName = ('database' in dbConfig && dbConfig.database) ? dbConfig.database : 'aura_health_db';
    
    // Auto-create database if it doesn't exist
    await ensureDatabaseExists(targetDbName, dbConfig);

    console.log('Connecting to PostgreSQL database...');
    
    const client = await pool.connect();
    isConnectedToPostgres = true;
    console.log('✅ PostgreSQL connected successfully!');

    // Read and run schema.sql
    const schemaPath = path.join(__dirname, '../models/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('✅ Database schema and 10 relational tables verified/migrated.');
    }

    client.release();
  } catch (err) {
    isConnectedToPostgres = false;
    console.warn('⚠️ PostgreSQL Connection Notice:', (err as Error).message);
    console.warn('💡 Tip: Verify your password in server/.env.');
  }
};
