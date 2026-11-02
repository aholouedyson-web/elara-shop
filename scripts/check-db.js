const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: cat } = await supabase.from('categories').select('*');
  const { data: prod } = await supabase.from('products').select('*, product_images(*)');
  console.log('Categories count:', cat?.length);
  console.log('Products count:', prod?.length);
  if (prod && prod.length) console.log('Sample product:', JSON.stringify(prod[0], null, 2));
}
check().catch(console.error);
