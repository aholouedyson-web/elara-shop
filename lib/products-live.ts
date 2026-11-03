import { supabaseAdmin } from '@/lib/supabase/admin'
import { Product, PRODUCTS } from '@/lib/products-data'

function mapDbProductToAppProduct(dbP: any): Product {
  const images = (dbP.product_images && dbP.product_images.length > 0)
    ? dbP.product_images
        .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
        .map((img: any) => img.url)
    : ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80']

  const featuresList = Array.isArray(dbP.features)
    ? dbP.features.map((f: any) => (typeof f === 'string' ? f : `${f.label || ''}: ${f.value || ''}`))
    : []

  const categorySlug = dbP.categories?.slug || (dbP.category_id ? 'smartphones' : 'smartphones')

  return {
    id: dbP.id,
    slug: dbP.slug,
    name: dbP.title_fr || dbP.title_es || dbP.title_en || 'Produit',
    brand: 'Élara Tech',
    categorySlug: categorySlug,
    basePrice: Number(dbP.price),
    compareAtPrice: dbP.sale_price ? Number(dbP.sale_price) : undefined,
    shortDescription: {
      fr: dbP.description_fr || '',
      es: dbP.description_es || dbP.description_fr || '',
      en: dbP.description_en || dbP.description_fr || '',
    },
    description: {
      fr: dbP.description_fr || '',
      es: dbP.description_es || dbP.description_fr || '',
      en: dbP.description_en || dbP.description_fr || '',
    },
    features: {
      fr: featuresList,
      es: featuresList,
      en: featuresList,
    },
    images: images,
    variants: [
      {
        id: `var-${dbP.id}`,
        name: 'Standard',
        sku: dbP.sku || `SKU-${dbP.id}`,
        price: Number(dbP.price),
        stock: dbP.stock !== undefined ? Number(dbP.stock) : 10,
        attributes: { Version: 'Standard' },
      },
    ],
    rating: Number(dbP.rating) || 5.0,
    reviewCount: Number(dbP.review_count) || 12,
    isFeatured: !!dbP.is_featured,
    isNew: !!dbP.is_new,
    badge: dbP.is_new ? 'Nouveau' : undefined,
    stock: dbP.stock !== undefined ? Number(dbP.stock) : 10,
  }
}

/**
 * Fetch all products directly from Supabase DB, with fallback to hardcoded PRODUCTS if offline
 */
export async function fetchLiveProducts(options?: {
  category?: string
  query?: string
  sort?: string
}): Promise<Product[]> {
  try {
    const { data: dbProducts, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*), categories(slug)')
      .order('created_at', { ascending: false })

    if (error || !dbProducts || dbProducts.length === 0) {
      // Fallback
      return filterAndSortProducts(PRODUCTS, options)
    }

    const liveList = dbProducts.map(mapDbProductToAppProduct)
    return filterAndSortProducts(liveList, options)
  } catch (err) {
    console.error('Error fetching live products from Supabase:', err)
    return filterAndSortProducts(PRODUCTS, options)
  }
}

/**
 * Fetch single product by slug directly from Supabase DB
 */
export async function fetchLiveProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { data: dbProduct, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*), categories(slug)')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !dbProduct) {
      return PRODUCTS.find((p) => p.slug === slug)
    }

    return mapDbProductToAppProduct(dbProduct)
  } catch (err) {
    return PRODUCTS.find((p) => p.slug === slug)
  }
}

function filterAndSortProducts(list: Product[], options?: { category?: string; query?: string; sort?: string }): Product[] {
  let result = [...list]

  if (options?.category) {
    result = result.filter((p) => p.categorySlug === options.category)
  }

  if (options?.query) {
    const q = options.query.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.shortDescription.fr.toLowerCase().includes(q) ||
        p.shortDescription.es.toLowerCase().includes(q) ||
        p.shortDescription.en.toLowerCase().includes(q)
    )
  }

  if (options?.sort) {
    if (options.sort === 'priceAsc') result.sort((a, b) => a.basePrice - b.basePrice)
    else if (options.sort === 'priceDesc') result.sort((a, b) => b.basePrice - a.basePrice)
    else if (options.sort === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (options.sort === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
  }

  return result
}
