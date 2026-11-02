'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, Check } from 'lucide-react'
import { cn, formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

export interface ProductCardProps {
  id: string
  slug: string
  name: string
  brand?: string
  price: number
  compareAtPrice?: number
  image: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isFeatured?: boolean
  badge?: string
  variantId?: string
  stock?: number
  locale?: string
  currency?: string
}

export default function ProductCard({
  id,
  slug,
  name,
  brand,
  price,
  compareAtPrice,
  image,
  rating = 4.8,
  reviewCount = 12,
  isNew,
  badge,
  variantId,
  stock = 15,
  locale = 'es',
  currency = 'EUR',
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem, openCart } = useCartStore()
  const discount = calculateDiscount(price, compareAtPrice)
  const isOutOfStock = stock <= 0

  const addToCartLabel =
    locale === 'fr' ? 'Ajouter au panier'
    : locale === 'en' ? 'Add to cart'
    : 'Añadir al carrito'

  const addedLabel =
    locale === 'fr' ? 'Ajouté !'
    : locale === 'en' ? 'Added!'
    : '¡Añadido!'

  const outOfStockLabel =
    locale === 'fr' ? 'Épuisé'
    : locale === 'en' ? 'Out of stock'
    : 'Agotado'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    addItem({
      id: variantId || id,
      productId: id,
      variantId,
      name,
      slug,
      price,
      image,
      maxStock: stock,
    })
    setAddedToCart(true)
    openCart()
    setTimeout(() => setAddedToCart(false), 2200)
  }

  const localeMap: Record<string, string> = { es: 'es-ES', fr: 'fr-FR', en: 'en-US' }

  return (
    <div className="product-card group relative flex flex-col h-full bg-white rounded-2xl border border-neutral-100/90 shadow-sm hover:shadow-lg transition-all duration-300">
      <Link href={`/${locale}/product/${slug}`} className="flex flex-col flex-1">
        {/* Product Image Box */}
        <div className="product-card-image relative w-full aspect-square overflow-hidden rounded-t-2xl bg-neutral-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges list */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="badge badge-sale font-bold">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="badge badge-new font-semibold">
                {locale === 'fr' ? 'Nouveau' : locale === 'en' ? 'New' : 'Nuevo'}
              </span>
            )}
            {badge && (
              <span className="badge badge-hot font-semibold">
                {badge}
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-sm',
              isWishlisted
                ? 'bg-red-50 text-red-500 opacity-100'
                : 'bg-white/90 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
            )}
            aria-label="Ajouter aux favoris"
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Add overlay button */}
          {!isOutOfStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                'absolute bottom-3 left-3 right-3 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-300 z-10',
                'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
                addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/95 backdrop-blur-sm text-neutral-900 hover:bg-[var(--color-primary-600)] hover:text-white'
              )}
            >
              {addedToCart ? (
                <>
                  <Check size={14} className="animate-scale-in" />
                  <span>{addedLabel}</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>{addToCartLabel}</span>
                </>
              )}
            </button>
          )}

          {/* Out of Stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="badge badge-neutral text-xs px-3 py-1.5 font-bold uppercase tracking-wider">
                {outOfStockLabel}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {brand && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                {brand}
              </span>
            )}
            <h3 className="font-semibold text-sm sm:text-base text-neutral-900 line-clamp-2 leading-snug group-hover:text-[var(--color-primary-600)] transition-colors mb-2">
              {name}
            </h3>
          </div>

          <div className="pt-2">
            {/* Reviews rating */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
                    className={s <= Math.round(rating) ? 'text-amber-400' : 'text-neutral-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-600">{rating}</span>
              <span className="text-[11px] text-neutral-400">({reviewCount})</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--color-neutral-900)]">
                {formatPrice(price, currency, localeMap[locale] || 'es-ES')}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(compareAtPrice, currency, localeMap[locale] || 'es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
