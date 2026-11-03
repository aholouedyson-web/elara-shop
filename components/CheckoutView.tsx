'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Package,
  Camera,
  Upload,
  X,
  Send,
  ExternalLink,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, COUNTRIES, generateOrderNumber } from '@/lib/utils'

export default function CheckoutView({ locale = 'es' }: { locale: string }) {
  const { items, getSubtotal, getDiscount, appliedCoupon, clearCart } = useCartStore()

  // Form states
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('ES')

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('123')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState<any | null>(null)
  const [mounted, setMounted] = useState(false)

  // Payment proof image states
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null)
  const [uploadingProof, setUploadingProof] = useState(false)
  const [proofError, setProofError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = mounted ? getSubtotal() : 0
  const discount = mounted ? getDiscount() : 0

  // Delivery rules calculation based on country
  const getShippingFee = (targetCountry: string, currentSubtotal: number) => {
    if (targetCountry === 'ES') {
      return currentSubtotal >= 50 ? 0 : 3.99
    } else if (['FR', 'DE', 'IT', 'PT', 'BE', 'NL', 'AT', 'PL', 'SE', 'CH'].includes(targetCountry)) {
      return currentSubtotal >= 120 ? 0 : 7.99
    } else {
      return 18.99
    }
  }

  const getShippingLabel = (targetCountry: string) => {
    if (targetCountry === 'ES') {
      return {
        name: locale === 'fr' ? 'Livraison Standard Espagne (Péninsule)' : locale === 'en' ? 'Spain Standard Delivery' : 'Envío Estándar España (Península)',
        days: '2 - 4 jours ouvrés',
      }
    } else if (['FR', 'DE', 'IT', 'PT', 'BE', 'NL', 'AT', 'PL', 'SE', 'CH'].includes(targetCountry)) {
      return {
        name: locale === 'fr' ? 'Livraison Standard Europe (Union Européenne)' : locale === 'en' ? 'EU Standard Tracked' : 'Envío Estándar Europa (UE)',
        days: '3 - 6 jours ouvrés',
      }
    } else {
      return {
        name: locale === 'fr' ? 'Livraison Internationale Prioritaire' : locale === 'en' ? 'International Priority Air' : 'Envío Internacional Prioritario',
        days: '5 - 10 jours ouvrés',
      }
    }
  }

  const shippingFee = getShippingFee(country, subtotal)
  const shippingInfo = getShippingLabel(country)
  const total = Math.max(0, subtotal - discount + shippingFee)

  const localeFormat = locale === 'fr' ? 'fr-FR' : locale === 'en' ? 'en-US' : 'es-ES'

  // Upload payment proof image to Supabase Storage via Server API
  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingProof(true)
    setProofError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.publicUrl) {
        setPaymentProofUrl(data.publicUrl)
      } else {
        setProofError(data.error || "Erreur lors de l'envoi de la photo de preuve.")
      }
    } catch (err: any) {
      setProofError(err.message || "Erreur de connexion lors de l'upload.")
    } finally {
      setUploadingProof(false)
    }
  }

  // Redirect to Gmail with pre-filled order details & payment proof
  const openGmailConfirmation = (orderData: any) => {
    const recipient = 'elara.boutique.es@gmail.com'
    const subject = encodeURIComponent(`Confirmation Commande #${orderData.orderNumber} - ${orderData.customerName}`)
    const bodyContent = `Bonjour,\n\nJe confirme le règlement de ma commande effectuée sur Élara Shop.\n\n` +
      `--------------------------------------\n` +
      `DÉTAILS DE LA COMMANDE :\n` +
      `Numéro de commande : ${orderData.orderNumber}\n` +
      `Date : ${orderData.date}\n` +
      `Client : ${orderData.customerName}\n` +
      `Email : ${orderData.email}\n` +
      `Adresse de livraison : ${orderData.address}\n` +
      `Montant total : ${orderData.total} €\n` +
      `Mode de paiement : ${orderData.paymentMethod}\n` +
      (orderData.paymentProofUrl ? `Preuve de paiement (Lien sécurisé) : ${orderData.paymentProofUrl}\n` : '') +
      `--------------------------------------\n\n` +
      `Articles commandés :\n` +
      orderData.items.map((i: any) => `- ${i.name} x${i.quantity} (${i.price} €)`).join('\n') +
      `\n\nMerci de bien vouloir valider la préparation et l'expédition de mon colis.\n\nCordialement,\n${orderData.customerName}`

    const encodedBody = encodeURIComponent(bodyContent)
    
    // Web Gmail direct link (desktop & mobile browser)
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${encodedBody}`
    
    // Mailto fallback
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${encodedBody}`

    // Open Gmail directly in a new tab
    if (typeof window !== 'undefined') {
      const opened = window.open(webGmailUrl, '_blank')
      if (!opened) {
        window.location.href = mailtoUrl
      }
    }
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentProofUrl) {
      setProofError("Veuillez insérer la photo de votre preuve de paiement avant de valider.")
      alert("Veuillez insérer la photo de votre preuve de paiement avant de confirmer votre commande.")
      return
    }

    setIsProcessing(true)

    const newOrderNumber = generateOrderNumber()
    const orderData = {
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString(localeFormat),
      email,
      customerName: `${firstName} ${lastName}`,
      address: `${address}, ${postalCode} ${city}, ${country}`,
      country,
      items: [...items],
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod: paymentMethod === 'stripe' ? 'Carte bancaire' : 'PayPal',
      shippingMethod: shippingInfo.name,
      paymentProofUrl,
    }

    try {
      // 1. Save to Supabase backend
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
    } catch (err) {
      console.error('Failed to save order to API:', err)
    }

    // 2. Save to localStorage for instant tracking
    if (typeof window !== 'undefined') {
      const storedOrders = JSON.parse(localStorage.getItem('elara_orders') || '[]')
      storedOrders.unshift(orderData)
      localStorage.setItem('elara_orders', JSON.stringify(storedOrders))
    }

    setOrderComplete(orderData)
    clearCart()
    setIsProcessing(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // 3. Automatically redirect user to Gmail
    setTimeout(() => {
      openGmailConfirmation(orderData)
    }, 1200)
  }

  const t = {
    es: {
      checkoutTitle: 'Tramitación del Pedido Seguro',
      stepContact: '1. Datos de Contacto y Envío',
      stepShipping: '2. Método de Envío Seleccionado',
      stepPayment: '3. Pago Seguro Cifrado',
      email: 'Correo electrónico',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      phone: 'Teléfono',
      address: 'Dirección completa',
      city: 'Ciudad',
      postalCode: 'Código postal',
      country: 'País de destino',
      subtotal: 'Subtotal productos',
      discount: 'Descuento cupón',
      shipping: 'Gastos de envío',
      free: 'Gratis',
      total: 'Total del pedido (TVA incluida)',
      payNow: 'Confirmar y Pagar el Pedido',
      orderSummary: 'Resumen de tu pedido',
      emptyCart: 'Tu carrito está vacío. Añade productos para tramitar tu pedido.',
      goToShop: 'Volver a la tienda',
      successTitle: '¡Pedido Confirmado con Éxito!',
      successSub: 'Te hemos enviado un correo de confirmación y factura proforma.',
      trackOrderBtn: 'Seguir este pedido en tiempo real',
    },
    fr: {
      checkoutTitle: 'Finalisation Sécurisée de la Commande',
      stepContact: '1. Coordonnées et Adresse de Livraison',
      stepShipping: '2. Mode d\'Expédition Sélectionné',
      stepPayment: '3. Paiement Sécurisé',
      email: 'Adresse email',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      phone: 'Numéro de téléphone',
      address: 'Adresse de livraison',
      city: 'Ville',
      postalCode: 'Code postal',
      country: 'Pays de destination',
      subtotal: 'Sous-total articles',
      discount: 'Remise code promo',
      shipping: 'Frais de livraison',
      free: 'Offert',
      total: 'Total de la commande (TTC)',
      payNow: 'Confirmer et Régler la Commande',
      orderSummary: 'Récapitulatif de la commande',
      emptyCart: 'Votre panier est vide. Veuillez ajouter des produits avant de commander.',
      goToShop: 'Retourner à la boutique',
      successTitle: 'Commande Validée avec Succès !',
      successSub: 'Un email récapitulatif avec votre reçu a été généré.',
      trackOrderBtn: 'Suivre ma commande en direct',
    },
    en: {
      checkoutTitle: 'Secure Order Checkout',
      stepContact: '1. Contact & Shipping Details',
      stepShipping: '2. Selected Shipping Method',
      stepPayment: '3. Encrypted Payment',
      email: 'Email address',
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone number',
      address: 'Shipping street address',
      city: 'City',
      postalCode: 'Postal / ZIP code',
      country: 'Destination country',
      subtotal: 'Items subtotal',
      discount: 'Applied voucher',
      shipping: 'Shipping cost',
      free: 'Free',
      total: 'Order total (tax included)',
      payNow: 'Confirm & Place Order',
      orderSummary: 'Order overview',
      emptyCart: 'Your cart is empty. Please add items to checkout.',
      goToShop: 'Return to shop',
      successTitle: 'Order Placed Successfully!',
      successSub: 'We have dispatched your invoice confirmation email.',
      trackOrderBtn: 'Track this order live',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  // If order complete screen
  if (orderComplete) {
    return (
      <div className="container-shop py-16 sm:py-24 max-w-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 size={44} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full inline-block mb-3">
          {locale === 'fr' ? 'Paiement confirmé' : locale === 'en' ? 'Payment confirmed' : 'Pago confirmado'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
          {c.successTitle}
        </h1>
        <p className="text-neutral-600 text-sm mb-8">{c.successSub}</p>

        {/* Order confirmation card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-left mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2">
            <div>
              <span className="text-xs text-neutral-500 font-semibold uppercase">Numéro de commande</span>
              <p className="font-mono font-bold text-lg text-neutral-900">{orderComplete.orderNumber}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-neutral-500 font-semibold uppercase">Date</span>
              <p className="text-sm font-semibold text-neutral-800">{orderComplete.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 pb-4 border-b border-neutral-200">
            <div>
              <span className="font-semibold text-neutral-800 block mb-1">Destinataire :</span>
              <p>{orderComplete.customerName}</p>
              <p>{orderComplete.email}</p>
            </div>
            <div>
              <span className="font-semibold text-neutral-800 block mb-1">Adresse de livraison :</span>
              <p>{orderComplete.address}</p>
              <p className="text-emerald-700 font-semibold mt-1">🇪🇸 Expédié depuis Madrid (Espagne)</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-neutral-900 pt-2">
            <span>Montant total réglé :</span>
            <span className="text-xl text-[var(--color-primary-700)] font-display">
              {formatPrice(orderComplete.total, 'EUR', localeFormat)}
            </span>
          </div>

          {orderComplete.paymentProofUrl && (
            <div className="pt-3 border-t border-neutral-200">
              <span className="text-xs font-semibold text-neutral-700 block mb-2">Preuve de paiement transmise :</span>
              <a
                href={orderComplete.paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-semibold hover:underline"
              >
                <ExternalLink size={13} />
                <span>Voir le reçu hébergé sur Supabase</span>
              </a>
            </div>
          )}
        </div>

        {/* Gmail Redirection Prompt */}
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-left mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              <Send size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">Confirmation automatique par Gmail</h4>
              <p className="text-xs text-red-700">Votre client Gmail s'ouvre avec le message pré-rempli à destination de notre service client.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openGmailConfirmation(orderComplete)}
            className="btn bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <Send size={14} />
            <span>Ouvrir Gmail maintenant</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/${locale}/track-order?order=${orderComplete.orderNumber}`}
            className="btn btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Package size={16} />
            <span>{c.trackOrderBtn}</span>
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="btn btn-secondary btn-md w-full sm:w-auto"
          >
            {c.goToShop}
          </Link>
        </div>
      </div>
    )
  }

  // If empty cart
  if (items.length === 0) {
    return (
      <div className="container-shop py-20 text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-4">
          <Truck size={30} />
        </div>
        <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
          {c.emptyCart}
        </h2>
        <Link href={`/${locale}/shop`} className="btn btn-primary btn-md mt-4 inline-flex">
          {c.goToShop}
        </Link>
      </div>
    )
  }

  return (
    <div className="container-shop py-10 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mb-8">
          {c.checkoutTitle}
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Checkout Tunnel Steps */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Details */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary-700)] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>{c.stepContact}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.firstName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.lastName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  {c.address} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="12 rue de la Paix"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.postalCode} *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="75001"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.city} *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {c.country} *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-white cursor-pointer"
                  >
                    {COUNTRIES.map((cty) => (
                      <option key={cty.code} value={cty.code}>
                        {cty.flag} {cty.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Method */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary-700)] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>{c.stepShipping}</span>
              </h2>

              <div className="p-4 rounded-2xl border-2 border-[var(--color-primary-600)] bg-[var(--color-primary-50)]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-700)] text-white flex items-center justify-center flex-shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{shippingInfo.name}</h4>
                    <p className="text-xs text-neutral-500">Délai estimé : {shippingInfo.days}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-[var(--color-primary-800)]">
                    {shippingFee === 0 ? c.free : formatPrice(shippingFee, 'EUR', localeFormat)}
                  </span>
                  {shippingFee === 0 && (
                    <span className="block text-[10px] text-emerald-600 font-semibold uppercase">Offert</span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Secure Payment */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary-700)] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>{c.stepPayment}</span>
              </h2>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-[var(--color-primary-700)] bg-[var(--color-primary-50)] text-[var(--color-primary-900)] ring-1 ring-[var(--color-primary-700)]'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Carte Bancaire (Stripe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <span className="font-extrabold text-[#003087]">Pay</span>
                  <span className="font-extrabold text-[#0079C1]">Pal</span>
                </button>
              </div>

              {/* Stripe Card Input Form */}
              {paymentMethod === 'stripe' ? (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      {locale === 'es' ? 'Número de tarjeta' : locale === 'en' ? 'Card number' : 'Numéro de carte bancaire'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-neutral-300 bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                        Expiration
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-neutral-300 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-neutral-300 bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                  <p className="font-semibold">
                    {locale === 'es' ? 'Conexión segura y cifrada con PayPal.' : locale === 'en' ? 'Secure encrypted connection with PayPal.' : 'Connexion sécurisée avec PayPal.'}
                  </p>
                  <p className="text-blue-700">
                    Vous serez redirigé vers le portail sécurisé PayPal pour autoriser votre paiement sans partager vos informations bancaires.
                  </p>
                </div>
              )}

              {/* Step 4: Preuve de Paiement */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 flex items-center gap-2">
                    <Camera size={16} className="text-amber-700" />
                    <span>Preuve de paiement (Capture / Reçu de virement ou carte) *</span>
                  </label>
                  {paymentProofUrl && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Photo insérée
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Après avoir entré vos coordonnées bancaires, veuillez joindre une capture d'écran ou photo de la confirmation de transaction pour valider votre commande.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer py-2.5 px-4 rounded-xl border border-dashed border-amber-600 bg-white hover:bg-amber-100/50 text-amber-900 text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs">
                    <Upload size={14} className="text-amber-700" />
                    <span>{uploadingProof ? 'Téléchargement de la photo...' : paymentProofUrl ? 'Changer la photo' : 'Insérer la photo du paiement'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      disabled={uploadingProof}
                      className="hidden"
                    />
                  </label>

                  {paymentProofUrl && (
                    <button
                      type="button"
                      onClick={() => setPaymentProofUrl(null)}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <X size={12} />
                      <span>Supprimer</span>
                    </button>
                  )}
                </div>

                {proofError && (
                  <p className="text-[11px] font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{proofError}</span>
                  </p>
                )}

                {/* Preview Thumbnail */}
                {paymentProofUrl && (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm mt-2">
                    <img
                      src={paymentProofUrl}
                      alt="Preuve de paiement"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                <Lock size={13} className="text-emerald-600" />
                <span>Chiffrement SSL 256 bits conforme PCI-DSS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-6 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-6">
              <h3 className="font-display font-bold text-lg text-neutral-900">
                {c.orderSummary}
              </h3>

              {/* Cart Items List */}
              <div className="divide-y divide-neutral-200 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-neutral-200 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-neutral-800 block truncate">{item.name}</span>
                        <span className="text-neutral-400">Qté: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity, 'EUR', localeFormat)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>{c.subtotal}</span>
                  <span className="font-semibold">{formatPrice(subtotal, 'EUR', localeFormat)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{c.discount} ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount, 'EUR', localeFormat)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>{c.shipping} ({country})</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? c.free : formatPrice(shippingFee, 'EUR', localeFormat)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>{c.total}</span>
                  <span className="text-[var(--color-primary-700)] font-display text-xl">
                    {formatPrice(total, 'EUR', localeFormat)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{locale === 'fr' ? 'Traitement en cours...' : 'Processing...'}</span>
                ) : (
                  <>
                    <span>{c.payNow}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Garantie remboursement 14 jours & SAV en Espagne</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
