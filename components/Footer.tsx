'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard, Share2, MessageCircle } from 'lucide-react'

export default function Footer({ locale = 'es' }: { locale?: string }) {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const t = {
    es: {
      tagline: 'Tecnología premium seleccionada con pasión desde España. Envíos rápidos y seguros a todo el mundo.',
      shop: 'Catálogo',
      help: 'Atención al Cliente',
      legal: 'Información Legal',
      newsletter: 'Newsletter Élara',
      newsletterText: 'Suscríbete y recibe ofertas exclusivas, novedades y 10% de descuento en tu primer pedido con el código BIENVENUE10.',
      placeholder: 'tu@email.com',
      subscribe: 'Suscribirme',
      subscribedMsg: '¡Gracias por suscribirte!',
      copyright: `© ${year} Élara Shop S.L. Todos los derechos reservados.`,
      spainBadge: 'Empresa registrada en España (UE) · Envíos internacionales con seguimiento',
      links: {
        shop: 'Todos los productos',
        smartphones: 'Smartphones y Móviles',
        laptops: 'Laptops y Ordenadores',
        audio: 'Audio y Auriculares',
        accessories: 'Accesorios y Carga',
        about: 'Sobre Nosotros',
        contact: 'Contacto y Soporte',
        faq: 'Preguntas Frecuentes',
        track: 'Seguimiento de Envío',
        shipping: 'Política de Envíos',
        returns: 'Devoluciones y Garantía',
        privacy: 'Política de Privacidad',
        terms: 'Términos y Condiciones',
      },
      perks: [
        { icon: Truck, title: 'Envío Rápido y Rastreado', desc: 'Gratis a partir de 50€ en España' },
        { icon: ShieldCheck, title: 'Garantía Oficial 2 Años', desc: 'Productos 100% auténticos' },
        { icon: RefreshCw, title: 'Devoluciones Fáciles', desc: '14 días para cambiar de opinión' },
        { icon: CreditCard, title: 'Pago 100% Seguro', desc: 'Stripe, PayPal, Tarjetas bancarias' },
      ],
    },
    fr: {
      tagline: 'Technologies et électronique haut de gamme sélectionnées en Espagne. Expéditions rapides et soignées vers le monde entier.',
      shop: 'Catalogue',
      help: 'Service Client',
      legal: 'Informations Légales',
      newsletter: 'Club Privilège Élara',
      newsletterText: 'Inscrivez-vous pour recevoir nos offres privées et profitez de -10% sur votre première commande avec le code BIENVENUE10.',
      placeholder: 'votre@email.com',
      subscribe: "S'inscrire",
      subscribedMsg: 'Merci pour votre inscription !',
      copyright: `© ${year} Élara Shop S.L. Tous droits réservés.`,
      spainBadge: 'Boutique basée en Espagne (UE) · Expéditions internationales avec suivi',
      links: {
        shop: 'Tous les produits',
        smartphones: 'Smartphones & Téléphonie',
        laptops: 'Laptops & Ordinateurs',
        audio: 'Audio, Casques & Écouteurs',
        accessories: 'Accessoires & Chargeurs',
        about: 'Notre Histoire',
        contact: 'Contact & Support',
        faq: 'Foire Aux Questions',
        track: 'Suivre ma commande',
        shipping: 'Politique de Livraison',
        returns: 'Retours & Remboursements',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions Générales de Vente',
      },
      perks: [
        { icon: Truck, title: 'Livraison Rapide et Suivie', desc: 'Offerte dès 50€ en Espagne et tarif réduit en Europe' },
        { icon: ShieldCheck, title: 'Garantie Européenne 2 Ans', desc: 'Produits neufs et authentiques certifiés' },
        { icon: RefreshCw, title: 'Retours sous 14 jours', desc: 'Satisfait ou remboursé sans tracas' },
        { icon: CreditCard, title: 'Paiement Sécurisé SSL', desc: 'Stripe, PayPal, Cartes de crédit' },
      ],
    },
    en: {
      tagline: 'Premium technology handpicked in Spain. Fast, tracked shipping across Europe and worldwide.',
      shop: 'Catalogue',
      help: 'Customer Care',
      legal: 'Legal Information',
      newsletter: 'Élara Newsletter',
      newsletterText: 'Subscribe for exclusive member drops and get 10% off your first order with voucher code BIENVENUE10.',
      placeholder: 'your@email.com',
      subscribe: 'Subscribe',
      subscribedMsg: 'Thank you for subscribing!',
      copyright: `© ${year} Élara Shop S.L. All rights reserved.`,
      spainBadge: 'Registered business in Spain (EU) · Global tracked shipping',
      links: {
        shop: 'All Products',
        smartphones: 'Smartphones & Phones',
        laptops: 'Laptops & Computers',
        audio: 'Audio, Headphones & Earbuds',
        accessories: 'Accessories & Chargers',
        about: 'About Us',
        contact: 'Contact & Support',
        faq: 'Frequently Asked Questions',
        track: 'Track My Order',
        shipping: 'Shipping Policy',
        returns: 'Returns & Refunds',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      },
      perks: [
        { icon: Truck, title: 'Fast Tracked Delivery', desc: 'Free over €50 in Spain, fast EU delivery' },
        { icon: ShieldCheck, title: '2-Year Official Warranty', desc: '100% authentic genuine products' },
        { icon: RefreshCw, title: '14-Day Return Window', desc: 'Hassle-free return policy' },
        { icon: CreditCard, title: 'Secure Encrypted Checkout', desc: 'Stripe, PayPal, Major credit cards' },
      ],
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <footer className="bg-[var(--color-neutral-900)] text-white mt-20 border-t border-neutral-800">
      {/* Value props banner */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/60">
        <div className="container-shop py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.perks.map((perk, i) => {
              const Icon = perk.icon
              return (
                <div key={i} className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-800/40 border border-neutral-800/60">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-900)]/80 text-[var(--color-primary-400)] flex items-center justify-center flex-shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-100">{perk.title}</h4>
                    <p className="text-xs text-neutral-400">{perk.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main footer directory */}
      <div className="container-shop py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Presentation */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-base font-display">É</span>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Élara<span className="text-[var(--color-primary-400)] font-serif italic ml-1">Shop</span>
              </span>
            </Link>

            <p className="text-neutral-400 text-sm mb-6 max-w-sm leading-relaxed">
              {c.tagline}
            </p>

            <div className="space-y-2.5 mb-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[var(--color-primary-400)]" />
                <span>Madrid & Barcelone, España (UE)</span>
              </div>
              <a href="mailto:contact@elareshop.com" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail size={15} className="text-[var(--color-primary-400)]" />
                <span>contact@elareshop.com</span>
              </a>
              <a href="tel:+34900000000" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone size={15} className="text-[var(--color-primary-400)]" />
                <span>+34 900 123 456 (Lun - Ven, 9h - 18h)</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                { icon: MessageCircle, href: '#', label: 'Support Client' },
                { icon: Share2, href: '#', label: 'Partager' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-[var(--color-primary-600)] text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-300 mb-4">{c.shop}</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/shop', label: c.links.shop },
                { href: '/shop?cat=smartphones', label: c.links.smartphones },
                { href: '/shop?cat=laptops', label: c.links.laptops },
                { href: '/shop?cat=audio', label: c.links.audio },
                { href: '/shop?cat=accessoires', label: c.links.accessories },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Column */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-300 mb-4">{c.help}</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: c.links.about },
                { href: '/contact', label: c.links.contact },
                { href: '/track-order', label: c.links.track },
                { href: '/faq', label: c.links.faq },
                { href: '/shipping-policy', label: c.links.shipping },
                { href: '/returns', label: c.links.returns },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-300 mb-4">{c.newsletter}</h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">{c.newsletterText}</p>
            {subscribed ? (
              <div className="p-3 rounded-lg bg-[var(--color-primary-900)]/80 text-[var(--color-primary-300)] text-xs font-medium">
                ✅ {c.subscribedMsg}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={c.placeholder}
                  className="w-full px-3.5 py-2.5 bg-neutral-800/80 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[var(--color-primary-400)] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-opacity gradient-primary text-white hover:opacity-90 shadow-sm"
                >
                  {c.subscribe}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar & Payment badges */}
      <div className="border-t border-neutral-800 bg-neutral-950/80 py-6">
        <div className="container-shop flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['Visa', 'Mastercard', 'PayPal', 'Stripe', 'Apple Pay', 'Google Pay'].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 bg-neutral-800/80 border border-neutral-700/60 rounded text-[11px] font-semibold text-neutral-300 tracking-wide"
              >
                {method}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 text-center md:text-right">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{c.links.privacy}</Link>
            <span>·</span>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{c.links.terms}</Link>
            <span>·</span>
            <Link href={`/${locale}/admin`} className="hover:text-neutral-300 transition-colors opacity-50 hover:opacity-100" title="Accès Gestionnaire">⚙️</Link>
            <span>·</span>
            <span>{c.copyright}</span>
          </div>
        </div>
        <div className="container-shop pt-3 text-center">
          <p className="text-[11px] text-neutral-500">{c.spainBadge}</p>
        </div>
      </div>
    </footer>
  )
}
