import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// GET all products with images and categories
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(*)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ products: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Add new product
export async function POST(req: Request) {
  try {
    const supabase = getAdminClient()
    const body = await req.json()
    const {
      title,
      description,
      price,
      sale_price,
      category_id,
      stock,
      sku,
      features,
      images,
      slug,
    } = body

    const productSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // 1. Insert into products
    const { data: newProd, error: prodErr } = await supabase
      .from('products')
      .insert({
        slug: `${productSlug}-${Date.now().toString().slice(-4)}`,
        title_es: title,
        title_fr: title,
        title_en: title,
        description_es: description,
        description_fr: description,
        description_en: description,
        price: Number(price),
        sale_price: sale_price ? Number(sale_price) : null,
        category_id: category_id || null,
        stock: Number(stock || 0),
        sku: sku || null,
        features: Array.isArray(features) ? features : [],
        is_featured: true,
        is_new: true,
      })
      .select()
      .single()

    if (prodErr) {
      return NextResponse.json({ error: prodErr.message }, { status: 500 })
    }

    // 2. Insert images if any
    if (images && Array.isArray(images) && images.length > 0) {
      const imgPayload = images.map((url: string, index: number) => ({
        product_id: newProd.id,
        url,
        display_order: index,
        is_primary: index === 0,
      }))
      await supabase.from('product_images').insert(imgPayload)
    }

    // Return the full product with images
    const { data: fullProduct } = await supabase
      .from('products')
      .select('*, product_images(*), categories(*)')
      .eq('id', newProd.id)
      .single()

    return NextResponse.json({ product: fullProduct })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Update existing product
export async function PUT(req: Request) {
  try {
    const supabase = getAdminClient()
    const body = await req.json()
    const {
      id,
      title,
      description,
      price,
      sale_price,
      category_id,
      stock,
      sku,
      features,
      images,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const { data: updatedProd, error: updateErr } = await supabase
      .from('products')
      .update({
        title_es: title,
        title_fr: title,
        title_en: title,
        description_es: description,
        description_fr: description,
        description_en: description,
        price: Number(price),
        sale_price: sale_price ? Number(sale_price) : null,
        category_id: category_id || null,
        stock: Number(stock !== undefined ? stock : 0),
        sku: sku || null,
        features: Array.isArray(features) ? features : [],
      })
      .eq('id', id)
      .select()
      .single()

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // Refresh images
    if (images && Array.isArray(images)) {
      await supabase.from('product_images').delete().eq('product_id', id)
      if (images.length > 0) {
        const imgPayload = images.map((url: string, index: number) => ({
          product_id: id,
          url,
          display_order: index,
          is_primary: index === 0,
        }))
        await supabase.from('product_images').insert(imgPayload)
      }
    }

    const { data: fullProduct } = await supabase
      .from('products')
      .select('*, product_images(*), categories(*)')
      .eq('id', id)
      .single()

    return NextResponse.json({ product: fullProduct })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete product
export async function DELETE(req: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Delete child images first
    await supabase.from('product_images').delete().eq('product_id', id)

    // Delete product
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
