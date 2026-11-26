import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Tenter l'upload sur Supabase Storage si configuré et joignable
    const supabase = getAdminClient()
    if (supabase) {
      try {
        const filePath = `payments/${fileName}`
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          })

        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(filePath)
          return NextResponse.json({ publicUrl: data.publicUrl })
        }
      } catch (supabaseErr) {
        console.warn('Supabase storage fallback to local:', supabaseErr)
      }
    }

    // 2. Fallback automatique et infaillible : enregistrement dans public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const localFilePath = path.join(uploadDir, fileName)
    fs.writeFileSync(localFilePath, buffer)

    // Déterminer l'URL publique de l'image (compatible WhatsApp)
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const publicUrl = `${protocol}://${host}/uploads/${fileName}`

    return NextResponse.json({ publicUrl })
  } catch (err: any) {
    console.error('API upload exception:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors du traitement du fichier' }, { status: 500 })
  }
}
