'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/products-data'

export default function CategoryGrid({ locale = 'es' }: { locale?: string }) {
  const titles = {
    es: {
      heading: 'Nuestras Colecciones',
      subheading: 'Explora lo último en tecnología de alta gama seleccionada con los más altos estándares.',
      viewAll: 'Ver toda la colección',
    },
    fr: {
      heading: 'Nos Collections',
      subheading: 'Parcourez les catégories d\'électronique de pointe sélectionnées avec rigueur.',
      viewAll: 'Explorer la collection',
    },
    en: {
      heading: 'Curated Collections',
      subheading: 'Explore high-grade consumer electronics selected with uncompromising precision.',
      viewAll: 'View collection',
    },
  }

  const t = titles[locale as keyof typeof titles] || titles.es

  return (
    <section className="py-16 sm:py-20 bg-neutral-50/60 border-b border-neutral-100">
      <div className="container-shop">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 max-w-xl mt-2">
              {t.subheading}
            </p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="text-xs sm:text-sm font-semibold text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] flex items-center gap-1 group self-start md:self-auto"
          >
            <span>{t.viewAll}</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const catName = cat.name[locale as keyof typeof cat.name] || cat.name.es
            const catDesc = cat.description[locale as keyof typeof cat.description] || cat.description.es
            const isLarge = idx === 0

            return (
              <Link
                key={cat.id}
                href={`/${locale}/shop?cat=${cat.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isLarge ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={cat.image}
                    alt={catName}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-lg text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                      {cat.productCount} {locale === 'fr' ? 'modèles' : locale === 'en' ? 'products' : 'modelos'}
                    </span>
                  </div>

                  {/* Bottom overlay text */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold font-display group-hover:text-[var(--color-primary-300)] transition-colors flex items-center justify-between">
                      <span>{catName}</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight size={18} />
                      </div>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-200 line-clamp-1 mt-1 font-normal">
                      {catDesc}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
