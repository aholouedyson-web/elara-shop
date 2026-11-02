const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function clean() {
  await supabase.from('product_images').delete().eq('product_id', 'd602d11a-4614-4657-b067-f600784eb9c6');
  await supabase.from('products').delete().eq('id', 'd602d11a-4614-4657-b067-f600784eb9c6');
  console.log('Test product with broken blob image deleted successfully.');
}
clean().catch(console.error);
