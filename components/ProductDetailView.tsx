'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Share2,
  Heart,
  PackageCheck,
  Info,
} from 'lucide-react'
import { Product, ProductVariant } from '@/lib/products-data'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

export default function ProductDetailView({
  product,
  locale = 'es',
}: {
  product: Product
  locale: string
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc')
  const [added, setAdded] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const { addItem, openCart } = useCartStore()

  const currentPrice = selectedVariant?.price || product.basePrice
  const discount = calculateDiscount(currentPrice, product.compareAtPrice)

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant?.id || product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      image: product.images[selectedImage] || product.images[0],
      quantity,
      maxStock: selectedVariant?.stock || product.stock,
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2500)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const t = {
    es: {
      inStock: 'En stock · Preparado y enviado en 24h desde España',
      outOfStock: 'Temporalmente agotado',
      chooseVariant: 'Configuración / Opciones disponibles :',
      quantityLabel: 'Cantidad :',
      addToCart: 'Añadir a la cesta',
      addedToCart: '¡Añadido a tu cesta!',
      tabDesc: 'Descripción',
      tabSpecs: 'Ficha técnica',
      tabShipping: 'Envíos y devoluciones',
      share: 'Compartir',
      copied: '¡Enlace copiado!',
      freeShipNotice: '🚚 Envío gratuito en España a partir de 50€',
      warranty: 'Garantía oficial europea de 2 años incluida',
      returns: '14 días naturales para devoluciones sin compromiso',
    },
    fr: {
      inStock: 'En stock · Préparé et expédié sous 24h depuis l\'Espagne',
      outOfStock: 'Rupture temporaire',
      chooseVariant: 'Configuration / Options disponibles :',
      quantityLabel: 'Quantité :',
      addToCart: 'Ajouter au panier',
      addedToCart: 'Ajouté à votre panier !',
      tabDesc: 'Description détaillée',
      tabSpecs: 'Caractéristiques techniques',
      tabShipping: 'Livraison & Retours',
      share: 'Partager',
      copied: 'Lien copié !',
      freeShipNotice: '🚚 Livraison offerte en Espagne dès 50€ d\'achats',
      warranty: 'Garantie européenne officielle de 2 ans incluse',
      returns: '14 jours pour changer d\'avis et retourner le produit',
    },
    en: {
      inStock: 'In stock · Dispatched within 24h from Spain',
      outOfStock: 'Temporarily out of stock',
      chooseVariant: 'Choose configuration / options:',
      quantityLabel: 'Quantity:',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to your cart!',
      tabDesc: 'Product overview',
      tabSpecs: 'Technical specifications',
      tabShipping: 'Shipping & Returns',
      share: 'Share',
      copied: 'Link copied!',
      freeShipNotice: '🚚 Free shipping across Spain for orders €50+',
      warranty: '2-Year official European manufacturer warranty included',
      returns: '14-Day hassle-free returns policy',
    },
  }

  const c = t[locale as keyof typeof t] || t.es
  const localeFormat = locale === 'fr' ? 'fr-FR' : locale === 'en' ? 'en-US' : 'es-ES'

  const descriptionText = product.description[locale as keyof typeof product.description] || product.description.es
  const featuresList = product.features[locale as keyof typeof product.features] || product.features.es

  return (
    <div className="container-shop py-10 sm:py-14">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href={`/${locale}`} className="hover:text-neutral-900 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link href={`/${locale}/shop`} className="hover:text-neutral-900 transition-colors">
          Boutique
        </Link>
        <span>/</span>
        <Link href={`/${locale}/shop?cat=${product.categorySlug}`} className="hover:text-neutral-900 transition-colors capitalize">
          {product.categorySlug}
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 mb-16">
        {/* Gallery (Left Column) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-100 ${
                    selectedImage === idx
                      ? 'border-[var(--color-primary-600)] shadow-md'
                      : 'border-transparent hover:border-neutral-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-md">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {discount > 0 && (
              <span className="absolute top-4 left-4 badge badge-sale text-sm px-3 py-1 font-bold shadow-sm">
                -{discount}% de réduction
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Add to Cart (Right Column) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Brand & Share */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-700)]">
                {product.brand}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors"
              >
                <Share2 size={13} />
                <span>{copiedLink ? c.copied : c.share}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'}
                    className={s <= Math.round(product.rating) ? 'text-amber-400' : 'text-neutral-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-700">{product.rating}</span>
              <span className="text-xs text-neutral-400">· {product.reviewCount} avis certifiés</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-extrabold text-[var(--color-neutral-900)] font-display">
                  {formatPrice(currentPrice, 'EUR', localeFormat)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.compareAtPrice, 'EUR', localeFormat)}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                TVA incluse · Paiement sécurisé avec Stripe et PayPal
              </p>
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{c.inStock}</span>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide block mb-2.5">
                  {c.chooseVariant}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2.5 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[var(--color-primary-700)] bg-[var(--color-primary-50)] text-[var(--color-primary-900)] ring-1 ring-[var(--color-primary-700)] shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.price && (
                          <span className="text-neutral-500 text-[11px] font-mono">
                            {formatPrice(v.price, 'EUR', localeFormat)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart button */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'btn-primary'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>{c.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>{c.addToCart}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-neutral-500 font-medium">
                {c.freeShipNotice}
              </p>
            </div>

            {/* Reassurance list */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[var(--color-primary-600)] flex-shrink-0" />
                <span>Expédition suivie avec remise contre signature</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[var(--color-primary-600)] flex-shrink-0" />
                <span>{c.warranty}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={16} className="text-[var(--color-primary-600)] flex-shrink-0" />
                <span>{c.returns}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t border-neutral-200 pt-10 mb-16">
        <div className="flex items-center gap-6 border-b border-neutral-200 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold tracking-wide transition-colors relative whitespace-nowrap ${
              activeTab === 'desc'
                ? 'text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-700)]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {c.tabDesc}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold tracking-wide transition-colors relative whitespace-nowrap ${
              activeTab === 'specs'
                ? 'text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-700)]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {c.tabSpecs}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-bold tracking-wide transition-colors relative whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-700)]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {c.tabShipping}
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="max-w-3xl space-y-4 animate-fade-in text-neutral-700 text-sm leading-relaxed">
            <p className="text-base text-neutral-800 font-medium leading-relaxed">
              {product.shortDescription[locale as keyof typeof product.shortDescription] || product.shortDescription.es}
            </p>
            <p>{descriptionText}</p>

            <div className="mt-6 pt-6 border-t border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-sm mb-3">Points forts du produit :</h3>
              <ul className="space-y-2">
                {featuresList.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl animate-fade-in">
            <div className="rounded-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
              {featuresList.map((item, i) => {
                const parts = item.split(':')
                return (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm bg-white">
                    <span className="font-semibold text-neutral-600 sm:col-span-1">
                      {parts.length > 1 ? parts[0] : `Spécification ${i + 1}`}
                    </span>
                    <span className="text-neutral-900 sm:col-span-2">
                      {parts.length > 1 ? parts.slice(1).join(':').trim() : item}
                    </span>
                  </div>
                )
              })}
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm bg-neutral-50">
                <span className="font-semibold text-neutral-600 sm:col-span-1">Garantie constructeur</span>
                <span className="text-neutral-900 sm:col-span-2">24 mois pièces et main-d'œuvre (UE)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Shipping */}
        {activeTab === 'shipping' && (
          <div className="max-w-3xl space-y-4 animate-fade-in text-sm text-neutral-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
              <strong>Origine d'expédition :</strong> Tous les colis sont expédiés directement depuis notre entrepôt situé à Madrid/Barcelone en Espagne.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <h4 className="font-bold text-neutral-900 text-sm mb-1">🇪🇸 Espagne</h4>
                <p className="text-xs text-neutral-500 mb-2">2 à 4 jours ouvrés</p>
                <span className="text-xs font-semibold text-emerald-700">3,99 € (Gratuit dès 50€)</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <h4 className="font-bold text-neutral-900 text-sm mb-1">🇪🇺 Europe (UE)</h4>
                <p className="text-xs text-neutral-500 mb-2">3 à 6 jours ouvrés</p>
                <span className="text-xs font-semibold text-neutral-800">7,99 € (Gratuit dès 120€)</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <h4 className="font-bold text-neutral-900 text-sm mb-1">🌍 International</h4>
                <p className="text-xs text-neutral-500 mb-2">5 à 10 jours ouvrés</p>
                <span className="text-xs font-semibold text-neutral-800">18,99 € suivi prioritaire</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
