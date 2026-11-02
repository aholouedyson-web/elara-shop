'use client'

import { useState } from 'react'
import { Tag, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PromoBanner({ locale = 'es' }: { locale?: string }) {
  const [copied, setCopied] = useState(false)
  const code = 'BIENVENUE10'

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const t = {
    es: {
      badge: 'Oferta Especial de Bienvenida',
      title: 'Disfruta de un 10% de descuento en tu primer pedido',
      desc: 'Utiliza el código al tramitar tu compra. Válido en todos los smartphones, laptops, audio y accesorios.',
      copy: 'Copiar código',
      copied: '¡Copiado!',
      shopNow: 'Ir a la tienda',
    },
    fr: {
      badge: 'Offre Spéciale de Bienvenue',
      title: 'Profitez de -10% de réduction sur votre première commande',
      desc: 'Utilisez le code promo lors de votre commande. Valable sur tout le catalogue smartphones, ordinateurs et son.',
      copy: 'Copier le code',
      copied: 'Copié !',
      shopNow: 'Profiter de l\'offre',
    },
    en: {
      badge: 'Exclusive Welcome Deal',
      title: 'Save 10% on your very first order',
      desc: 'Apply voucher during checkout. Valid sitewide across flagship phones, computers, audio, and gear.',
      copy: 'Copy code',
      copied: 'Copied!',
      shopNow: 'Shop with discount',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <section className="py-12 sm:py-16">
      <div className="container-shop">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-[var(--color-primary-800)] to-neutral-900 text-white p-8 sm:p-12 shadow-xl border border-teal-800/40">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-4">
              <Tag size={13} />
              <span>{c.badge}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              {c.title}
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 mb-8 leading-relaxed">
              {c.desc}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyCode}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>{code}</span>
                {copied ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-sans">
                    <Check size={14} /> {c.copied}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400 font-sans font-normal underline">
                    {c.copy}
                  </span>
                )}
              </button>

              <Link
                href={`/${locale}/shop`}
                className="btn btn-primary btn-md shadow-md flex items-center gap-2"
              >
                <span>{c.shopNow}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
