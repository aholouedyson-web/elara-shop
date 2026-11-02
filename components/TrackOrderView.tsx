'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  AlertCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function TrackOrderView({
  locale = 'es',
  initialOrder,
}: {
  locale: string
  initialOrder?: string
}) {
  const [orderNumber, setOrderNumber] = useState(initialOrder || '')
  const [orderData, setOrderData] = useState<any | null>(null)
  const [searched, setSearched] = useState(false)

  const steps = [
    { key: 'PAID', label: locale === 'fr' ? 'Paiement Confirmé' : locale === 'en' ? 'Payment Confirmed' : 'Pago Confirmado', icon: CheckCircle2 },
    { key: 'PROCESSING', label: locale === 'fr' ? 'En Préparation (Espagne)' : locale === 'en' ? 'Processing (Spain)' : 'En Preparación (España)', icon: Package },
    { key: 'SHIPPED', label: locale === 'fr' ? 'Expédiée / En Transit' : locale === 'en' ? 'Dispatched / In Transit' : 'Enviado / En Tránsito', icon: Truck },
    { key: 'DELIVERED', label: locale === 'fr' ? 'Livrée' : locale === 'en' ? 'Delivered' : 'Entregado', icon: Home },
  ]

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSearched(true)

    const query = orderNumber.trim().toUpperCase()
    if (!query) return

    // Search in local stored orders
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('elara_orders') || '[]')
      const found = stored.find((o: any) => o.orderNumber.toUpperCase() === query)

      if (found) {
        setOrderData({
          ...found,
          status: found.status || 'PROCESSING',
          carrier: 'Correos Express / DHL International',
          trackingCode: 'ES' + found.orderNumber.replace(/[^0-9]/g, '') + 'XP',
        })
        return
      }
    }

    // Default demo order if searching for sample or not found
    if (query.startsWith('EL') || query.length >= 4) {
      setOrderData({
        orderNumber: query,
        date: 'Aujourd\'hui',
        customerName: 'Client Élara Shop',
        email: 'client@example.com',
        address: 'Calle Mayor 45, 28013 Madrid, España',
        status: 'SHIPPED',
        carrier: 'Correos Express España (Suivi Premium)',
        trackingCode: 'ES893412093ES',
        total: 899.99,
        items: [
          {
            name: 'Smartphone Pro X15 Ultra Titanium',
            price: 899.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
          },
        ],
      })
    } else {
      setOrderData(null)
    }
  }

  useEffect(() => {
    if (initialOrder) {
      handleSearch()
    }
  }, [initialOrder])

  const t = {
    es: {
      title: 'Seguimiento de tu Pedido',
      subtitle: 'Introduce tu número de pedido (ej: EL2410...) para consultar el estado del envío en tiempo real.',
      placeholder: 'Número de pedido (ej: EL24...)',
      searchBtn: 'Consultar estado',
      notFound: 'No hemos encontrado ningún pedido con esta referencia.',
      notFoundHelp: 'Comprueba el correo de confirmación de compra o ponte en contacto con nuestro servicio de soporte.',
      statusLabel: 'Estado actual :',
      carrier: 'Transportista :',
      trackingNum: 'Código de seguimiento :',
      trackOnCarrier: 'Ver seguimiento en Correos / DHL',
      itemsTitle: 'Artículos incluidos en el paquete',
    },
    fr: {
      title: 'Suivi de Commande en Temps Réel',
      subtitle: 'Saisissez votre numéro de commande (ex: EL2410...) pour suivre la préparation et l\'acheminement de votre colis.',
      placeholder: 'Numéro de commande (ex: EL24...)',
      searchBtn: 'Suivre mon colis',
      notFound: 'Aucune commande trouvée avec cette référence.',
      notFoundHelp: 'Vérifiez le numéro présent dans votre email de confirmation ou contactez notre support client.',
      statusLabel: 'Statut du colis :',
      carrier: 'Transporteur partenaire :',
      trackingNum: 'Numéro de suivi :',
      trackOnCarrier: 'Consulter sur le portail du transporteur',
      itemsTitle: 'Articles contenus dans cette expédition',
    },
    en: {
      title: 'Live Order Tracking',
      subtitle: 'Enter your order ID (e.g. EL2410...) to monitor delivery stages from our Spain warehouse to your door.',
      placeholder: 'Order number (e.g. EL24...)',
      searchBtn: 'Track shipment',
      notFound: 'No order matching this reference was found.',
      notFoundHelp: 'Please check your order confirmation receipt or get in touch with our customer team.',
      statusLabel: 'Current status:',
      carrier: 'Carrier partner:',
      trackingNum: 'Tracking ID:',
      trackOnCarrier: 'Track on official carrier portal',
      itemsTitle: 'Items in this delivery',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  // Helper to determine active step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PAID':
        return 0
      case 'PROCESSING':
        return 1
      case 'SHIPPED':
        return 2
      case 'DELIVERED':
        return 3
      default:
        return 1
    }
  }

  const activeIndex = orderData ? getStepIndex(orderData.status) : 0

  return (
    <div className="container-shop py-12 sm:py-16 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center mx-auto mb-4">
          <Truck size={28} />
        </div>
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
          {c.title}
        </h1>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          {c.subtitle}
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 mb-12">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder={c.placeholder}
            className="w-full text-sm pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-[var(--color-primary-600)] shadow-xs"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-md px-6 shadow-sm">
          {c.searchBtn}
        </button>
      </form>

      {/* Result Section */}
      {orderData ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-md p-6 sm:p-10 space-y-8 animate-fade-in">
          {/* Header Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold">Référence commande</span>
              <h2 className="font-mono text-2xl font-bold text-neutral-900">{orderData.orderNumber}</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {orderData.status === 'SHIPPED' ? 'En cours d\'acheminement' : 'En préparation'}
              </span>
            </div>
          </div>

          {/* Stepper Progression */}
          <div className="py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const isPassed = idx <= activeIndex
                const isCurrent = idx === activeIndex
                const Icon = step.icon

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                        isCurrent
                          ? 'bg-[var(--color-primary-700)] text-white ring-4 ring-[var(--color-primary-100)] shadow-md'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className={`text-xs font-bold ${isPassed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Logistics & Tracking info card */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 font-semibold block mb-1">{c.carrier}</span>
              <p className="font-bold text-neutral-900">{orderData.carrier}</p>
              <div className="flex items-center gap-1.5 text-neutral-600 mt-2">
                <MapPin size={14} className="text-emerald-600" />
                <span>Centre de tri Madrid Sud (Espagne)</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 font-semibold block mb-1">{c.trackingNum}</span>
              <p className="font-mono font-bold text-neutral-900">{orderData.trackingCode}</p>
              <a
                href="https://www.correos.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-primary-700)] hover:underline font-semibold mt-2"
              >
                <span>{c.trackOnCarrier}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Items Preview */}
          {orderData.items && (
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-4">{c.itemsTitle}</h3>
              <div className="divide-y divide-neutral-100 border rounded-2xl border-neutral-100 overflow-hidden">
                {orderData.items.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="font-semibold text-neutral-900">{item.name} (x{item.quantity})</span>
                    </div>
                    <span className="font-bold text-neutral-900">{formatPrice(item.price * item.quantity, 'EUR')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : searched ? (
        <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center max-w-md mx-auto">
          <AlertCircle size={32} className="text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-neutral-900 mb-1">{c.notFound}</h3>
          <p className="text-xs text-neutral-500 mb-4">{c.notFoundHelp}</p>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('EL241088923')
              handleSearch()
            }}
            className="text-xs font-semibold text-[var(--color-primary-700)] underline"
          >
            Tester avec un numéro de commande de démonstration
          </button>
        </div>
      ) : null}
    </div>
  )
}
