const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { PRODUCTS } = require('../lib/products-data');

async function seed() {
  console.log('--- SEEDING INITIAL PRODUCTS TO SUPABASE DB ---');
  const { data: existing } = await supabase.from('products').select('id');
  if (existing && existing.length > 0) {
    console.log(`Database already has ${existing.length} products.`);
    return;
  }

  // Get categories to map slug to category_id
  const { data: cats } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  cats?.forEach(c => { catMap[c.slug] = c.id; });

  for (const p of PRODUCTS) {
    const categoryId = catMap[p.categorySlug] || null;
    const { data: newP, error: pErr } = await supabase
      .from('products')
      .insert({
        slug: p.slug,
        category_id: categoryId,
        title_es: p.name,
        title_fr: p.name,
        title_en: p.name,
        description_es: p.description?.es || p.shortDescription?.es || '',
        description_fr: p.description?.fr || p.shortDescription?.fr || '',
        description_en: p.description?.en || p.shortDescription?.en || '',
        price: Number(p.basePrice),
        sale_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        stock: Number(p.stock !== undefined ? p.stock : 15),
        sku: p.variants?.[0]?.sku || `SKU-${p.id}`,
        features: p.features?.fr || [],
        is_featured: !!p.isFeatured,
        is_new: !!p.isNew,
        rating: Number(p.rating || 4.8),
        review_count: Number(p.reviewCount || 10),
      })
      .select()
      .single();

    if (pErr) {
      console.error(`Error inserting ${p.name}:`, pErr.message);
      continue;
    }

    if (newP && p.images && p.images.length > 0) {
      const imgPayload = p.images.map((url, idx) => ({
        product_id: newP.id,
        url,
        display_order: idx,
        is_primary: idx === 0,
      }));
      await supabase.from('product_images').insert(imgPayload);
    }

    console.log(`[+] Seeded: ${p.name} (UUID: ${newP.id})`);
  }

  console.log('--- SEEDING COMPLETE ---');
}

seed().catch(console.error);
