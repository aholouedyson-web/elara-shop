'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Headphones } from 'lucide-react'
import { useState } from 'react'

export default function HeroBanner({ locale = 'fr' }: { locale?: string }) {
  const [slide, setSlide] = useState(0)

  const slides = [
    {
      badge: locale === 'fr' ? 'Nouveauté' : locale === 'en' ? 'New In' : 'Novedad',
      title1: locale === 'fr' ? 'Le son qui vous accompagne' : locale === 'en' ? 'Sound that moves' : 'El sonido que te acompaña',
      highlight: locale === 'fr' ? 'partout' : locale === 'en' ? 'everywhere' : 'a todas partes',
      desc: locale === 'fr'
        ? 'Découvrez notre nouvelle collection audio haut de gamme avec une qualité sonore exceptionnelle et un design moderne.'
        : locale === 'en'
        ? 'Experience our brand new premium audio lineup with pristine acoustic clarity and sleek modern craft.'
        : 'Descubre nuestra nueva colección de audio de alta gama con sonido excepcional y diseño vanguardista.',
      cta: locale === 'fr' ? 'Découvrir la collection' : locale === 'en' ? 'Explore collection' : 'Descubrir colección',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
      tagline: 'Feel the sound',
      price: '199,00 €',
    },
    {
      badge: locale === 'fr' ? 'Édition Limitée' : locale === 'en' ? 'Limited Edition' : 'Edición Limitada',
      title1: locale === 'fr' ? 'Puissance & Écran' : locale === 'en' ? 'Pure Power & Ultra' : 'Potencia y Pantalla',
      highlight: locale === 'fr' ? 'Titanium Next-Gen' : locale === 'en' ? 'Titanium Next-Gen' : 'Titanio Next-Gen',
      desc: locale === 'fr'
        ? 'Smartphones et tablettes ultra-performants pour capturer chaque instant avec une netteté spectaculaire.'
        : locale === 'en'
        ? 'Flagship smartphones and lightweight tablets engineered for peak performance and all-day power.'
        : 'Smartphones de alto rendimiento diseñados para capturar cada momento con máxima precisión.',
      cta: locale === 'fr' ? 'Voir les Smartphones' : locale === 'en' ? 'View Smartphones' : 'Ver Smartphones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80',
      tagline: 'Pure Performance',
      price: '899,00 €',
    },
  ]

  const current = slides[slide]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-orange-100/60">
      {/* Decorative organic shapes inspired by Nexora */}
      <div className="absolute top-10 right-1/3 w-80 h-80 rounded-full bg-orange-400/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-blue-900/15 blur-2xl pointer-events-none" />

      <div className="container-shop relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Orange Tag badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs tracking-wide">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>{current.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.12]">
              {current.title1}{' '}
              <span className="text-orange-500 block sm:inline">
                {current.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-neutral-600 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
              {current.desc}
            </p>

            {/* Call to action button */}
            <div className="pt-2">
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all hover:gap-3 cursor-pointer"
              >
                <span>{current.cta}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust Perks row under button */}
            <div className="pt-6 border-t border-neutral-200/60 flex flex-wrap gap-6 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Truck size={17} className="text-orange-500" />
                <span>{locale === 'fr' ? 'Livraison rapide avec suivi' : locale === 'en' ? 'Fast tracked delivery' : 'Envío rápido con seguimiento'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-orange-500" />
                <span>{locale === 'fr' ? 'Paiement 100% sécurisé' : locale === 'en' ? '100% secure checkout' : 'Pago 100% seguro'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones size={17} className="text-orange-500" />
                <span>{locale === 'fr' ? 'Service client réactif' : locale === 'en' ? 'Dedicated customer support' : 'Atención al cliente 24/7'}</span>
              </div>
            </div>
          </div>

          {/* Right Product Spotlight Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Circular organic backdrop */}
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-tr from-blue-900 via-slate-800 to-orange-500 p-3 sm:p-4 shadow-2xl shadow-orange-950/15">
              <div className="relative w-full h-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-neutral-900">
                <Image
                  src={current.image}
                  alt={current.highlight}
                  fill
                  priority
                  className="object-cover"
                />

                {/* Aesthetic script tagline on top right */}
                <div className="absolute top-4 right-4 text-white/90 font-serif italic text-sm sm:text-base font-semibold drop-shadow-md">
                  {current.tagline}
                </div>

                {/* Floating bottom badge with price */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white flex items-center justify-between border border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 block">Édition spéciale</span>
                    <span className="text-xs font-semibold">{current.highlight}</span>
                  </div>
                  <span className="font-mono font-bold text-base text-white">{current.price}</span>
                </div>
              </div>

              {/* Slider Arrows */}
              <button
                type="button"
                onClick={() => setSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer"
                aria-label="Précédent"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer"
                aria-label="Suivant"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
