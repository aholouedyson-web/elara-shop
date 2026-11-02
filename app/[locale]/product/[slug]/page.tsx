import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductDetailView from '@/components/ProductDetailView'
import ProductCard from '@/components/ProductCard'
import { fetchLiveProductBySlug, fetchLiveProducts } from '@/lib/products-live'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  const product = await fetchLiveProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get similar products from the same category or brand
  const allCategoryProducts = await fetchLiveProducts({ category: product.categorySlug })
  const similarProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const t = {
    es: {
      similarTitle: 'Productos Similares',
      similarSubtitle: 'Otros dispositivos que también podrían interesarte.',
      viewCategory: 'Ver toda la categoría',
    },
    fr: {
      similarTitle: 'Produits Similares & Recommandations',
      similarSubtitle: 'D\'autres appareils d\'exception qui pourraient vous plaire.',
      viewCategory: 'Voir toute la catégorie',
    },
    en: {
      similarTitle: 'You May Also Like',
      similarSubtitle: 'Explore complementary tech gear matching this selection.',
      viewCategory: 'View entire category',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <div className="bg-white">
      {/* Product Detail Interactive View */}
      <ProductDetailView product={product} locale={locale} />

      {/* Similar Products Carousel / Grid */}
      {similarProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-neutral-50/60 border-t border-neutral-100">
          <div className="container-shop">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                  {c.similarTitle}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {c.similarSubtitle}
                </p>
              </div>
              <Link
                href={`/${locale}/shop?cat=${product.categorySlug}`}
                className="text-xs sm:text-sm font-semibold text-[var(--color-primary-700)] hover:underline flex items-center gap-1"
              >
                <span>{c.viewCategory}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  brand={p.brand}
                  price={p.basePrice}
                  compareAtPrice={p.compareAtPrice}
                  image={p.images[0]}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  isNew={p.isNew}
                  isFeatured={p.isFeatured}
                  badge={p.badge}
                  stock={p.stock}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
