import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import SortSelector from '@/components/SortSelector'
import { CATEGORIES } from '@/lib/products-data'
import { fetchLiveProducts } from '@/lib/products-live'
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cat?: string; q?: string; sort?: string; minPrice?: string; maxPrice?: string }>
}) {
  const { locale } = await params
  const { cat, q, sort, minPrice, maxPrice } = await searchParams

  let products = await fetchLiveProducts({
    category: cat,
    query: q,
    sort: sort || 'popular',
  })

  if (minPrice) {
    const min = parseFloat(minPrice)
    if (!isNaN(min)) products = products.filter((p) => p.basePrice >= min)
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice)
    if (!isNaN(max)) products = products.filter((p) => p.basePrice <= max)
  }

  const t = {
    es: {
      title: 'Catálogo de Productos',
      desc: 'Explora nuestra gama de electrónica premium y accesorios de última generación.',
      allCategories: 'Todas las categorías',
      sortBy: 'Ordenar por',
      sortOptions: {
        popular: 'Más populares',
        newest: 'Novedades',
        priceAsc: 'Precio: menor a mayor',
        priceDesc: 'Precio: mayor a menor',
      },
      results: (count: number) => `${count} ${count === 1 ? 'producto encontrado' : 'productos encontrados'}`,
      noResults: 'No se encontraron productos con estos filtros',
      clearFilters: 'Restablecer filtros',
      categoriesTitle: 'Categorías',
      priceTitle: 'Rango de precio',
      searchPlaceholder: 'Filtrar por nombre o marca...',
    },
    fr: {
      title: 'Catalogue des Produits',
      desc: 'Découvrez l\'intégralité de notre catalogue électronique et profitez d\'expéditions rapides.',
      allCategories: 'Toutes les catégories',
      sortBy: 'Trier par',
      sortOptions: {
        popular: 'Plus populaires',
        newest: 'Nouveautés',
        priceAsc: 'Prix : croissant',
        priceDesc: 'Prix : décroissant',
      },
      results: (count: number) => `${count} ${count <= 1 ? 'produit trouvé' : 'produits trouvés'}`,
      noResults: 'Aucun produit ne correspond à vos critères',
      clearFilters: 'Réinitialiser les filtres',
      categoriesTitle: 'Catégories',
      priceTitle: 'Fourchette de prix',
      searchPlaceholder: 'Filtrer par nom ou marque...',
    },
    en: {
      title: 'Product Catalog',
      desc: 'Explore our curated range of cutting-edge electronics and accessories.',
      allCategories: 'All categories',
      sortBy: 'Sort by',
      sortOptions: {
        popular: 'Most popular',
        newest: 'Newest arrivals',
        priceAsc: 'Price: low to high',
        priceDesc: 'Price: high to low',
      },
      results: (count: number) => `${count} ${count === 1 ? 'product found' : 'products found'}`,
      noResults: 'No products match your filter criteria',
      clearFilters: 'Clear all filters',
      categoriesTitle: 'Categories',
      priceTitle: 'Price range',
      searchPlaceholder: 'Filter by name or brand...',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <div className="py-10 sm:py-14 bg-neutral-50/50 min-h-screen">
      <div className="container-shop">
        {/* Top Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            {c.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2 max-w-2xl">
            {c.desc}
          </p>
        </div>

        {/* Filter Bar & Category Chips */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
          {/* Category Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <Link
              href={`/${locale}/shop${q ? `?q=${q}` : ''}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                !cat
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {c.allCategories}
            </Link>

            {CATEGORIES.map((category) => {
              const isSelected = cat === category.slug
              const name = category.name[locale as keyof typeof category.name] || category.name.es
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/shop?cat=${category.slug}${q ? `&q=${q}` : ''}${sort ? `&sort=${sort}` : ''}`}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[var(--color-primary-700)] text-white shadow-sm'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {name}
                </Link>
              )
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">{c.sortBy}:</span>
            <div className="relative">
              <SortSelector currentSort={sort} options={c.sortOptions} />
            </div>
          </div>
        </div>

        {/* Results Info & Keyword Query Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            {c.results(products.length)}
          </span>

          {(cat || q || sort) && (
            <Link
              href={`/${locale}/shop`}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={12} />
              <span>{c.clearFilters}</span>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border border-neutral-200 text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-4">
              <Search size={28} />
            </div>
            <h3 className="font-semibold text-neutral-800 text-lg mb-1">{c.noResults}</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              Essayez de modifier vos critères de recherche ou réinitialisez les filtres pour voir l'ensemble de notre sélection.
            </p>
            <Link href={`/${locale}/shop`} className="btn btn-primary btn-md">
              {c.clearFilters}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
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
        )}
      </div>
    </div>
  )
}
