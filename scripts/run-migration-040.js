// Run migration 040 via Supabase Management API
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://xrjftoilbrxycaixwvia.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyamZ0b2lsYnJ4eWNhaXh3dmlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUyODQyNCwiZXhwIjoyMDczMTA0NDI0fQ.7GesX_wWonSLgrqXbxLS6B0D3h9pXdfHfv7gI0bdbfs';

// Split SQL into individual statements
const sqlFile = path.join(__dirname, '../supabase/migrations/040_message_templates_and_call_logs.sql');
const sql = fs.readFileSync(sqlFile, 'utf-8');

async function runSQL(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  return res;
}

// Use pg directly via the connection string
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log('Running migration 040...');

  // We'll test the table creation worked by querying
  const { data, error } = await supabase
    .from('oe_message_templates')
    .select('count')
    .limit(1);

  if (error && error.code === '42P01') {
    console.log('Table does not exist — needs manual migration run');
    console.log('SQL to run in Supabase SQL editor:');
    console.log(sql);
  } else if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Table oe_message_templates already exists');
    const { count } = await supabase.from('oe_message_templates').select('*', { count: 'exact', head: true });
    console.log('Row count:', count);
  }
}

main().catch(console.error);
