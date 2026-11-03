const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkOrders() {
  const { data: cols, error } = await supabase.from('orders').select('*').limit(1);
  console.log('Orders check:', error ? error.message : 'OK');
  
  // Check if proof_image column exists or add it
  const { error: alterErr } = await supabase.rpc('execute_sql', {
    sql: 'ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;'
  });
  if (alterErr) console.log('RPC alter note:', alterErr.message);
}
checkOrders().catch(console.error);
