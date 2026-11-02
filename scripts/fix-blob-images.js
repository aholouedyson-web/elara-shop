const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanBlobs() {
  const { data: prods } = await supabase.from('products').select('id, title_fr, product_images(*)');
  for (const p of (prods || [])) {
    for (const img of (p.product_images || [])) {
      if (img.url && img.url.startsWith('blob:')) {
        console.log(`Correction image blob pour ${p.title_fr}...`);
        await supabase.from('product_images').update({
          url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'
        }).eq('id', img.id);
        console.log(`Image blob corrigée vers URL stable.`);
      }
    }
  }
}
cleanBlobs().catch(console.error);
