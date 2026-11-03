const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const supabaseAnon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testSelectImages() {
  const { data, error } = await supabaseAnon.from('product_images').select('*');
  console.log('ANON PRODUCT IMAGES ERROR:', error);
  console.log('ANON PRODUCT IMAGES COUNT:', data?.length);
  if (data) {
    console.log('SAMPLE IMAGES:', JSON.stringify(data.slice(0, 3), null, 2));
  }
}

testSelectImages().catch(console.error);
