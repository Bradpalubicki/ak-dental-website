/* eslint-disable */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(
  path.join(__dirname, '../supabase/migrations/040_message_templates_and_call_logs.sql'),
  'utf-8'
);

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.xrjftoilbrxycaixwvia',
  password: 'Machine#2023##',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected to Supabase');
  try {
    await client.query(sql);
    console.log('Migration 040 applied successfully');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

main();
