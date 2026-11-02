import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, HeartHandshake, Award } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CategoryGrid from '@/components/CategoryGrid'
import PromoBanner from '@/components/PromoBanner'
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
  const featured = allProducts.filter((p) => p.isFeatured)
  const newArrivals = allProducts.filter((p) => p.isNew)
  const promotions = allProducts.filter((p) => p.compareAtPrice && p.compareAtPrice > p.basePrice)

  const t = {
    es: {
      featuredTitle: 'Productos Populares y Destacados',
      featuredSubtitle: 'Lo más vendido y mejor valorado por nuestros clientes internacionales.',
      viewAll: 'Ver catálogo completo',
      newTitle: 'Novedades de Temporada',
      newSubtitle: 'Los lanzamientos más recientes del mundo de la tecnología.',
      promoTitle: 'Ofertas y Promociones Exclusivas',
      promoSubtitle: 'Aprovecha descuentos inmediatos en dispositivos seleccionados.',
      storyBadge: 'Sobre Élara Shop',
      storyTitle: 'Pasión por la tecnología, arraigada en España y abierta al mundo',
      storyP1: 'Fundada con la convicción de que el diseño minimalista y el alto rendimiento deben ir de la mano, Élara Shop selecciona cuidadosamente dispositivos electrónicos que marcan la diferencia.',
      storyP2: 'Desde nuestro centro logístico en España, preparamos cada paquete con el máximo rigor para garantizar una experiencia de unboxing impecable en cualquier rincón de Europa y el mundo.',
      storyPill1: 'Control de calidad 100%',
      storyPill2: 'Envíos asegurados',
      storyPill3: 'Atención personalizada',
    },
    fr: {
      featuredTitle: 'Produits Vedettes & Populaires',
      featuredSubtitle: 'Les meilleures ventes et les appareils les plus plébiscités par nos clients.',
      viewAll: 'Voir tout le catalogue',
      newTitle: 'Dernières Nouveautés',
      newSubtitle: 'Les innovations récentes tout juste arrivées dans notre boutique.',
      promoTitle: 'Offres & Promotions d\'Exception',
      promoSubtitle: 'Profitez de remises exclusives sur une sélection de produits phares.',
      storyBadge: 'À Propos d\'Élara Shop',
      storyTitle: 'La passion de la haute technologie, basée en Espagne et ouverte sur le monde',
      storyP1: 'Née de l\'exigence d\'offrir un service irréprochable et des produits électroniques d\'élite, Élara Shop allie design raffiné, performances brutes et satisfaction client sans compromis.',
      storyP2: 'Depuis notre plateforme logistique en Espagne, chaque commande est inspectée, protégée et expédiée avec un numéro de suivi en temps réel vers la France, l\'Union Européenne et l\'international.',
      storyPill1: 'Contrôle qualité certifié',
      storyPill2: 'Colis ultra-sécurisés',
      storyPill3: 'Support client réactif',
    },
    en: {
      featuredTitle: 'Featured & Trending Gear',
      featuredSubtitle: 'Best-sellers and top-rated devices loved by our worldwide customers.',
      viewAll: 'Browse all products',
      newTitle: 'Fresh New Arrivals',
      newSubtitle: 'The newest flagship releases and accessories in our collection.',
      promoTitle: 'Special Deals & Promotions',
      promoSubtitle: 'Instant price drops on high-demand premium tech.',
      storyBadge: 'About Élara Shop',
      storyTitle: 'Precision technology, headquartered in Spain with a global soul',
      storyP1: 'Élara Shop was founded with an obsession for sleek aesthetics, durable engineering, and attentive customer service.',
      storyP2: 'From our fulfillment center in Spain, every single package is handled with care to ensure a pristine unboxing experience anywhere across Europe and worldwide.',
      storyPill1: '100% Quality checked',
      storyPill2: 'Insured tracked parcels',
      storyPill3: 'Dedicated support',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Promotional Banner */}
      <HeroBanner locale={locale} />

      {/* 2. Collections & Categories Grid */}
      <CategoryGrid locale={locale} />

      {/* 3. Featured & Popular Products */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-shop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary-700)] uppercase tracking-wider mb-2">
                <TrendingUp size={14} />
                <span>Bestsellers</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
                {c.featuredTitle}
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 max-w-xl mt-2">
                {c.featuredSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/shop?sort=popular`}
              className="btn btn-secondary btn-md self-start md:self-auto flex items-center gap-2"
            >
              <span>{c.viewAll}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((product) => (
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

      {/* 4. Interactive Promo Banner */}
      <PromoBanner locale={locale} />

      {/* 5. New Arrivals */}
      <section className="py-16 sm:py-20 bg-neutral-50/70 border-y border-neutral-100">
        <div className="container-shop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent-600)] uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                <span>New Drops</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
                {c.newTitle}
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 max-w-xl mt-2">
                {c.newSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/shop?sort=newest`}
              className="text-sm font-semibold text-[var(--color-primary-700)] hover:underline flex items-center gap-1"
            >
              <span>{c.viewAll}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
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

      {/* 6. Brand Story & Trust Section */}
      <section className="py-20 bg-white">
        <div className="container-shop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1.5 rounded-full inline-block">
                {c.storyBadge}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
                {c.storyTitle}
              </h2>
              <p className="text-neutral-600 text-base leading-relaxed">
                {c.storyP1}
              </p>
              <p className="text-neutral-600 text-base leading-relaxed">
                {c.storyP2}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-semibold">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>{c.storyPill1}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-semibold">
                  <Award size={16} className="text-amber-600" />
                  <span>{c.storyPill2}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-semibold">
                  <HeartHandshake size={16} className="text-[var(--color-primary-600)]" />
                  <span>{c.storyPill3}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-primary-700)] block">
                  100%
                </span>
                <span className="text-sm font-semibold text-neutral-900 block">Authenticité Garantie</span>
                <p className="text-xs text-neutral-500">Tous nos appareils sont neufs dans leur emballage d'origine scellé.</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-primary-700)] block">
                  35+
                </span>
                <span className="text-sm font-semibold text-neutral-900 block">Pays Desservis</span>
                <p className="text-xs text-neutral-500">Expéditions prioritaires assurées vers toute l'Europe et l'international.</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-primary-700)] block">
                  2 Ans
                </span>
                <span className="text-sm font-semibold text-neutral-900 block">Garantie Européenne</span>
                <p className="text-xs text-neutral-500">Prise en charge et SAV direct avec nos techniciens agréés.</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-primary-700)] block">
                  4.9/5
                </span>
                <span className="text-sm font-semibold text-neutral-900 block">Avis Clients Vérifiés</span>
                <p className="text-xs text-neutral-500">Une satisfaction mesurée et reconnue auprès de notre communauté.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
