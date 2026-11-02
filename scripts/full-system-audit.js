const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function fullCheck() {
  console.log('=== VERIFICATION SYSTEME COMPLETE ===');

  // 1. Check Tables
  const tables = ['profiles', 'products', 'product_images', 'categories', 'orders', 'admin_permissions'];
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) console.log(`[-] Table ${t}: ERREUR - ${error.message}`);
    else console.log(`[+] Table ${t}: OK (${count} enregistrements)`);
  }

  // 2. Check Storage Buckets
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.log(`[-] Storage Buckets: ERREUR - ${bErr.message}`);
  } else {
    const pBucket = buckets.find(b => b.name === 'products');
    if (pBucket) console.log(`[+] Bucket "products": OK (public = ${pBucket.public})`);
    else console.log('[-] Bucket "products": MANQUANT');
  }

  // 3. Check Admin User
  const { data: adminProf, error: aErr } = await supabase
    .from('profiles')
    .select('email, role')
    .eq('email', 'admin@elara.es')
    .maybeSingle();

  if (adminProf) {
    console.log(`[+] Compte Admin admin@elara.es: OK (role = ${adminProf.role})`);
  } else {
    console.log('[-] Compte Admin: Non trouvé dans profiles');
  }

  // 4. Check Products and Images
  const { data: prods } = await supabase
    .from('products')
    .select('id, title_fr, price, stock, product_images(url)');
  console.log(`[+] Produits disponibles (${prods?.length || 0}):`);
  prods?.forEach(p => {
    const img = p.product_images?.[0]?.url || 'AUCUNE_IMAGE';
    console.log(`    - ${p.title_fr} (${p.price}€) | Stock: ${p.stock} | Image: ${img.substring(0, 60)}...`);
  });

  console.log('======================================');
}

fullCheck().catch(console.error);
