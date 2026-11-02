const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkStorage() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets);
  if (error) console.error('Bucket error:', error);
  
  const hasProducts = buckets?.some(b => b.name === 'products');
  if (!hasProducts) {
    console.log('Creating products bucket...');
    const { data, error: createErr } = await supabase.storage.createBucket('products', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    if (createErr) console.error('Create error:', createErr);
    else console.log('Products bucket created successfully (public: true)!');
  } else {
    console.log('Products bucket exists. Ensuring it is public...');
    await supabase.storage.updateBucket('products', { public: true });
    console.log('Bucket updated to public.');
  }
}
checkStorage().catch(console.error);
