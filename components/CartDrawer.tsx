'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Check, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer({ locale = 'es' }: { locale?: string }) {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const subtotal = mounted ? getSubtotal() : 0
  const discount = mounted ? getDiscount() : 0
  const total = mounted ? getTotal() : 0
  const itemCount = mounted ? getItemCount() : 0

  const freeShippingThreshold = 50
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    const code = couponInput.trim().toUpperCase()

    if (code === 'BIENVENUE10') {
      applyCoupon({
        code: 'BIENVENUE10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        description: '10% de réduction de bienvenue',
      })
      setCouponInput('')
    } else if (code === 'ETE20') {
      if (subtotal < 100) {
        setCouponError(locale === 'fr' ? 'Minimum 100€ d\'achats requis' : locale === 'en' ? 'Minimum €100 order required' : 'Pedido mínimo de 100€')
        return
      }
      applyCoupon({
        code: 'ETE20',
        discountType: 'FIXED',
        discountValue: 20,
        description: '20€ de réduction spéciale',
      })
      setCouponInput('')
    } else {
      setCouponError(locale === 'fr' ? 'Code promo invalide' : locale === 'en' ? 'Invalid promo code' : 'Código promocional no válido')
    }
  }

  const t = {
    es: {
      title: 'Tu Carrito',
      empty: 'Tu carrito está vacío',
      emptyDesc: 'Explora nuestra selección de electrónica premium y añade tus artículos favoritos.',
      continue: 'Explorar la tienda',
      subtotal: 'Subtotal',
      discount: 'Descuento aplicado',
      total: 'Total estimado',
      freeShipProgress: remainingForFreeShipping === 0
        ? '¡Enhorabuena! Tienes envío gratuito a España 🚚'
        : `Añade ${formatPrice(remainingForFreeShipping, 'EUR', 'es-ES')} más para tener envío gratuito`,
      couponPlaceholder: 'Código de descuento (ej: BIENVENUE10)',
      apply: 'Aplicar',
      checkout: 'Tramitar Pedido',
      secureCheckout: 'Pago 100% cifrado y seguro',
    },
    fr: {
      title: 'Votre Panier',
      empty: 'Votre panier est vide',
      emptyDesc: 'Découvrez notre sélection électronique de pointe et ajoutez vos produits coup de cœur.',
      continue: 'Découvrir la boutique',
      subtotal: 'Sous-total',
      discount: 'Remise appliquée',
      total: 'Total estimé',
      freeShipProgress: remainingForFreeShipping === 0
        ? 'Félicitations ! Vous bénéficiez de la livraison offerte en Espagne 🚚'
        : `Plus que ${formatPrice(remainingForFreeShipping, 'EUR', 'fr-FR')} pour la livraison offerte`,
      couponPlaceholder: 'Code promo (ex: BIENVENUE10)',
      apply: 'Appliquer',
      checkout: 'Commander maintenant',
      secureCheckout: 'Paiement 100% chiffré et sécurisé',
    },
    en: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptyDesc: 'Browse our catalog of premium electronics and find the gear that fits your lifestyle.',
      continue: 'Explore the shop',
      subtotal: 'Subtotal',
      discount: 'Discount applied',
      total: 'Estimated Total',
      freeShipProgress: remainingForFreeShipping === 0
        ? 'Congratulations! You unlocked free shipping in Spain 🚚'
        : `Add ${formatPrice(remainingForFreeShipping, 'EUR', 'en-US')} more for free shipping`,
      couponPlaceholder: 'Voucher code (e.g. BIENVENUE10)',
      apply: 'Apply',
      checkout: 'Proceed to Checkout',
      secureCheckout: '100% Secure & encrypted checkout',
    },
  }

  const c = t[locale as keyof typeof t] || t.es
  const localeFormat = locale === 'fr' ? 'fr-FR' : locale === 'en' ? 'en-US' : 'es-ES'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={20} className="text-[var(--color-primary-600)]" />
              <h2 className="text-lg font-bold text-neutral-900 font-display">{c.title}</h2>
              {itemCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-700 rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          {items.length > 0 && (
            <div className="bg-[var(--color-primary-50)]/80 px-6 py-3 border-b border-[var(--color-primary-100)]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary-900)] mb-1.5">
                <Sparkles size={14} className="text-[var(--color-accent-500)] flex-shrink-0" />
                <span>{c.freeShipProgress}</span>
              </div>
              <div className="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="gradient-primary h-full transition-all duration-500 ease-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-300 mb-4">
                  <ShoppingBag size={36} />
                </div>
                <h3 className="text-base font-bold text-neutral-800 mb-1">{c.empty}</h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
                  {c.emptyDesc}
                </p>
                <button
                  onClick={closeCart}
                  className="btn btn-primary btn-md shadow-sm"
                >
                  {c.continue}
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-neutral-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 truncate mb-0.5">
                          {item.name}
                        </h4>
                        {item.variantName && (
                          <p className="text-xs text-neutral-500 mb-1">{item.variantName}</p>
                        )}
                        <span className="text-sm font-bold text-[var(--color-primary-700)]">
                          {formatPrice(item.price * item.quantity, 'EUR', localeFormat)}
                        </span>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-neutral-500 hover:bg-neutral-100 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-2 text-xs font-bold text-neutral-800 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="p-1 px-2 text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-30"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
              {/* Coupon form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag size={14} className="text-emerald-600" />
                    <span>{appliedCoupon.code} ({appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-red-500 text-xs font-semibold underline ml-2"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={c.couponPlaceholder}
                      className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:border-[var(--color-primary-600)]"
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary btn-sm px-3 text-xs"
                    >
                      {c.apply}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-500 font-medium pl-1">{couponError}</p>
                  )}
                </form>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>{c.subtotal}</span>
                  <span className="font-semibold text-neutral-800">
                    {formatPrice(subtotal, 'EUR', localeFormat)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 text-xs font-medium">
                    <span>{c.discount}</span>
                    <span>-{formatPrice(discount, 'EUR', localeFormat)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>{c.total}</span>
                  <span className="text-[var(--color-primary-700)]">
                    {formatPrice(total, 'EUR', localeFormat)}
                  </span>
                </div>
              </div>

              {/* Checkout link */}
              <Link
                href={`/${locale}/checkout`}
                onClick={closeCart}
                className="btn btn-primary btn-lg w-full flex items-center justify-between shadow-md group"
              >
                <span>{c.checkout}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="text-[11px] text-center text-neutral-400">
                🔒 {c.secureCheckout}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
