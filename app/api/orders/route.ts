import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(req: Request) {
  try {
    const supabase = getAdminClient()
    const body = await req.json()
    const {
      orderNumber,
      email,
      customerName,
      address,
      items,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      shippingMethod,
      paymentProofUrl,
    } = body

    // 1. Insert order into orders table
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        guest_email: email,
        subtotal: Number(subtotal),
        discount: Number(discount || 0),
        shipping_fee: Number(shippingFee || 0),
        total: Number(total),
        payment_method: paymentMethod || 'Virement / Preuve',
        payment_status: 'pending',
        status: 'pending',
        shipping_address: {
          customerName,
          address,
          email,
        },
        notes: paymentProofUrl ? `Preuve de paiement reçue: ${paymentProofUrl}` : null,
      })
      .select()
      .maybeSingle()

    if (orderErr) {
      console.error('Order creation error in Supabase:', orderErr)
    }

    // 2. Insert order items if order was created in DB
    if (newOrder && items && Array.isArray(items)) {
      const itemsPayload = items.map((it: any) => ({
        order_id: newOrder.id,
        product_id: it.productId && it.productId.length === 36 ? it.productId : null,
        title: it.name,
        unit_price: Number(it.price),
        quantity: Number(it.quantity || 1),
        total_price: Number(it.price * (it.quantity || 1)),
      }))
      await supabase.from('order_items').insert(itemsPayload)
    }

    return NextResponse.json({ success: true, order: newOrder || { order_number: orderNumber } })
  } catch (err: any) {
    console.error('API /api/orders error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
