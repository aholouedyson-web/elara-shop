import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Headphones, Award } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CategoryGrid from '@/components/CategoryGrid'
import ProductCard from '@/components/ProductCard'
import { fetchLiveProducts } from '@/lib/products-live'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const allProducts = await fetchLiveProducts()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Banner style Nexora */}
      <HeroBanner locale={locale} />

      {/* 2. Explorez nos univers */}
      <CategoryGrid locale={locale} />

      {/* 3. Les meilleures ventes */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-shop">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-0.5 bg-orange-500 rounded-full" />
                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">
                  {locale === 'fr' ? 'Produits phares' : locale === 'en' ? 'Featured Items' : 'Productos destacados'}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {locale === 'fr' ? 'Les meilleures ventes' : locale === 'en' ? 'Best Sellers' : 'Los más vendidos'}
              </h2>
            </div>

            {/* Slider arrows decoration */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-orange-500 hover:border-orange-500 transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-orange-500 hover:border-orange-500 transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Grille de 4 colonnes comme l'image 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.brand}
                price={product.basePrice}
                compareAtPrice={product.compareAtPrice}
                image={product.images[0]}
                rating={product.rating}
                reviewCount={product.reviewCount}
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                badge={product.badge}
                stock={product.stock}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bannière promotionnelle Nexora "Jusqu'à -30%" */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="container-shop">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-orange-500 p-6 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md z-10 space-y-3 sm:space-y-4 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-orange-200 text-xs font-semibold backdrop-blur-xs">
                {locale === 'fr' ? 'Offre spéciale' : locale === 'en' ? 'Special Deal' : 'Oferta especial'}
              </span>
              <h3 className="text-3xl sm:text-5xl font-black leading-tight">
                Jusqu'à <span className="text-orange-400">-30%</span>
                <span className="block text-xl sm:text-2xl font-bold font-sans text-neutral-100 mt-1">
                  sur une sélection de produits
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Équipez-vous avec les meilleures marques et profitez de nos offres limitées !
              </p>
              <div className="pt-2">
                <Link
                  href={`/${locale}/shop`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
                >
                  <span>{locale === 'fr' ? "Voir l'offre" : locale === 'en' ? 'View Offer' : 'Ver oferta'}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Visual illustration image right */}
            <div className="relative w-full max-w-sm h-48 sm:h-64 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80"
                  alt="Tech & Style"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div className="absolute top-2 right-2 text-white/90 font-serif italic text-base font-bold drop-shadow">
                Tech & Style
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Réassurance icones Nexora en bas */}
      <section className="py-10 bg-white border-t border-neutral-100">
        <div className="container-shop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50">
              <Award size={24} className="text-orange-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Produits originaux</h4>
                <p className="text-[11px] text-neutral-500">Garantie constructeur</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50">
              <Truck size={24} className="text-orange-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Livraison rapide</h4>
                <p className="text-[11px] text-neutral-500">Suivi en direct</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50">
              <ShieldCheck size={24} className="text-orange-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Paiement sécurisé</h4>
                <p className="text-[11px] text-neutral-500">100% fiable</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50">
              <Headphones size={24} className="text-orange-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Support client</h4>
                <p className="text-[11px] text-neutral-500">Toujours à votre écoute</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
