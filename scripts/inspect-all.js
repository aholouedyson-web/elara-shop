const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function inspectTalon() {
  const { data: prods } = await supabase
    .from('products')
    .select('id, title_fr, product_images(*)')
    .order('created_at', { ascending: false });
  console.log('ALL_PRODUCTS_IN_DB:');
  console.log(JSON.stringify(prods, null, 2));
}
inspectTalon().catch(console.error);
