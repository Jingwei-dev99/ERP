import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Connect to postgres database to create/drop our target database
const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'postgres',
  user: process.env.DB_USER || 'jessie',
  password: process.env.DB_PASSWORD || '',
});

// Pool for our application database
const appPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'erp_db',
  user: process.env.DB_USER || 'jessie',
  password: process.env.DB_PASSWORD || '',
});

async function recreateDatabase() {
  const client = await pgPool.connect();
  try {
    // Drop connections to the database
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'erp_db'
      AND pid <> pg_backend_pid();
    `);
    
    // Drop and recreate database
    await client.query('DROP DATABASE IF EXISTS erp_db;');
    await client.query('CREATE DATABASE erp_db;');
    console.log('Database recreated successfully');
  } finally {
    client.release();
  }
}

async function runMigrations() {
  const client = await appPool.connect();
  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, '../server/src/models/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    // Run each migration in a transaction
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`Migration completed: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Migration failed: ${file}`, error);
        throw error;
      }
    }
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await recreateDatabase();
    await runMigrations();
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    pgPool.end();
    appPool.end();
  }
}

main(); 