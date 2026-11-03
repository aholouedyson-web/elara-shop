const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const supabaseAnon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testFetch() {
  const { data, error } = await supabaseAnon
    .from('products')
    .select('*, product_images(*), categories(slug)')
    .order('created_at', { ascending: false });

  console.log('ANON ERROR:', error);
  console.log('ANON COUNT:', data?.length);
  const talon = data?.find(p => p.title_fr === 'TALON');
  console.log('TALON IMAGES via ANON:', JSON.stringify(talon?.product_images, null, 2));
}

testFetch().catch(console.error);
