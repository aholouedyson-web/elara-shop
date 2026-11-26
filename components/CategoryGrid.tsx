'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Smartphone, Laptop, Headphones, Watch, Gamepad2, Package } from 'lucide-react'

export default function CategoryGrid({ locale = 'fr' }: { locale?: string }) {
  const categories = [
    {
      id: 'smartphones',
      name: locale === 'fr' ? 'Smartphones' : locale === 'en' ? 'Smartphones' : 'Smartphones',
      href: `/${locale}/shop?cat=smartphones`,
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'laptops',
      name: locale === 'fr' ? 'Ordinateurs' : locale === 'en' ? 'Laptops' : 'Ordenadores',
      href: `/${locale}/shop?cat=laptops`,
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'audio',
      name: locale === 'fr' ? 'Accessoires audio' : locale === 'en' ? 'Audio Gear' : 'Audio y Auriculares',
      href: `/${locale}/shop?cat=audio`,
      icon: Headphones,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'watches',
      name: locale === 'fr' ? 'Montres connectées' : locale === 'en' ? 'Smartwatches' : 'Relojes inteligentes',
      href: `/${locale}/shop?cat=smartphones`,
      icon: Watch,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'gaming',
      name: locale === 'fr' ? 'Gaming & Consoles' : locale === 'en' ? 'Gaming' : 'Gaming',
      href: `/${locale}/shop`,
      icon: Gamepad2,
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'accessories',
      name: locale === 'fr' ? 'Accessoires & Câbles' : locale === 'en' ? 'Accessories' : 'Accesorios',
      href: `/${locale}/shop?cat=accessoires`,
      icon: Package,
      image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=300&auto=format&fit=crop&q=80',
    },
  ]

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="container-shop">
        {/* Section title styled with orange bar like Nexora */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-0.5 bg-orange-500 rounded-full" />
              <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">
                {locale === 'fr' ? 'Nos catégories' : locale === 'en' ? 'Categories' : 'Nuestras categorías'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {locale === 'fr' ? 'Explorez nos univers' : locale === 'en' ? 'Explore our collections' : 'Explora nuestros universos'}
            </h2>
          </div>

          <Link
            href={`/${locale}/shop`}
            className="text-xs sm:text-sm font-bold text-neutral-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
          >
            <span>{locale === 'fr' ? 'Voir toutes les catégories' : locale === 'en' ? 'View all' : 'Ver todas'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Minimalist Cards Carousel/Grid as seen on image 2 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center p-3 rounded-2xl bg-neutral-50/80 hover:bg-orange-50/70 border border-neutral-100/80 hover:border-orange-200 transition-all text-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2.5 rounded-xl overflow-hidden bg-white shadow-xs p-1">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-neutral-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
