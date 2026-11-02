'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react'

export default function HeroBanner({ locale = 'es' }: { locale?: string }) {
  const content = {
    es: {
      badge: 'Boutique Électronique Premium en Espagne',
      title1: 'Tecnología de élite para',
      title2: 'transformar tu vida.',
      desc: 'Seleccionamos los mejores smartphones, portátiles y accesorios del mundo. Envío prioritario desde España a toda Europa e internacional con seguimiento.',
      primaryBtn: 'Explorar la Tienda',
      secondaryBtn: 'Ofertas y Novedades',
      trustBadges: [
        { icon: Truck, label: 'Envíos rápidos desde España' },
        { icon: ShieldCheck, label: 'Garantía europea 2 años' },
        { icon: Award, label: 'Productos 100% auténticos' },
      ],
    },
    fr: {
      badge: 'Boutique Électronique Premium en Espagne',
      title1: 'La technologie d\'élite pour',
      title2: 'sublimer votre quotidien.',
      desc: 'Une sélection minutieuse de smartphones haute précision, ultrabooks et accessoires d\'exception. Expéditions prioritaires et sécurisées vers la France, l\'Europe et le monde.',
      primaryBtn: 'Découvrir la Boutique',
      secondaryBtn: 'Nouveautés & Promotions',
      trustBadges: [
        { icon: Truck, label: 'Expédition directe d\'Espagne' },
        { icon: ShieldCheck, label: 'Garantie européenne 2 ans' },
        { icon: Award, label: 'Produits 100% neufs & certifiés' },
      ],
    },
    en: {
      badge: 'Premium Electronics Boutique based in Spain',
      title1: 'Elite technology designed to',
      title2: 'elevate your world.',
      desc: 'Curated collection of flagship smartphones, sleek ultrabooks, and studio audio gear. Shipped directly from Spain across Europe and worldwide.',
      primaryBtn: 'Explore the Catalog',
      secondaryBtn: 'New Drops & Deals',
      trustBadges: [
        { icon: Truck, label: 'Fast EU & Global delivery' },
        { icon: ShieldCheck, label: '2-Year official warranty' },
        { icon: Award, label: '100% Genuine guaranteed' },
      ],
    },
  }

  const c = content[locale as keyof typeof content] || content.es

  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white pt-8 pb-16 sm:py-20 lg:py-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-primary-600)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[var(--color-accent-500)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-shop relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 w-fit mb-6 shadow-xs">
              <Sparkles size={14} className="text-[var(--color-accent-400)]" />
              <span className="text-xs font-medium text-neutral-300 tracking-wide">
                {c.badge}
              </span>
            </div>

            {/* Main title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] mb-6">
              {c.title1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">
                {c.title2}
              </span>
            </h1>

            {/* Paragraph description */}
            <p className="text-base sm:text-lg text-neutral-300/90 max-w-xl font-normal leading-relaxed mb-8">
              {c.desc}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Link
                href={`/${locale}/shop`}
                className="btn btn-primary btn-lg shadow-lg group flex items-center justify-center gap-2"
              >
                <span>{c.primaryBtn}</span>
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/${locale}/shop?sort=popular`}
                className="btn btn-secondary btn-lg bg-neutral-800/90 text-white hover:bg-neutral-700/90 border border-neutral-700 flex items-center justify-center"
              >
                {c.secondaryBtn}
              </Link>
            </div>

            {/* Trust bullet badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-800/90">
              {c.trustBadges.map((badge, idx) => {
                const Icon = badge.icon
                return (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Icon size={17} className="text-[var(--color-primary-400)] flex-shrink-0" />
                    <span className="text-xs font-medium text-neutral-300">{badge.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Product Hero Image Card */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-800/50">
                <Image
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=80"
                  alt="Élara Shop Flagship Smartphone"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Floating Product Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-400)] block">
                        Édition Limitée
                      </span>
                      <h3 className="text-sm font-semibold text-white">Smartphone Pro X15 Titanium</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-white">899,99 €</span>
                      <span className="text-[11px] text-neutral-400 line-through block">1 099,99 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
