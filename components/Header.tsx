'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, User, Globe, ChevronDown, Package } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

const locales = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

const navLinks = [
  { href: '/shop', labelEs: 'Tienda', labelFr: 'Boutique', labelEn: 'Shop' },
  { href: '/shop?cat=smartphones', labelEs: 'Smartphones', labelFr: 'Smartphones', labelEn: 'Smartphones' },
  { href: '/shop?cat=laptops', labelEs: 'Laptops', labelFr: 'Laptops', labelEn: 'Laptops' },
  { href: '/shop?cat=audio', labelEs: 'Audio', labelFr: 'Audio', labelEn: 'Audio' },
  { href: '/track-order', labelEs: 'Seguir pedido', labelFr: 'Suivre commande', labelEn: 'Track order' },
  { href: '/about', labelEs: 'Sobre nosotros', labelFr: 'À propos', labelEn: 'About' },
]

export default function Header({ locale = 'es' }: { locale?: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const { getItemCount, toggleCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setLangOpen(false)
  }, [pathname])

  const itemCount = mounted ? getItemCount() : 0

  const getLinkLabel = (link: typeof navLinks[0]) => {
    if (locale === 'fr') return link.labelFr
    if (locale === 'en') return link.labelEn
    return link.labelEs
  }

  const cartLabel = locale === 'fr' ? 'Panier' : locale === 'en' ? 'Cart' : 'Carrito'
  const searchPlaceholder =
    locale === 'fr' ? 'Rechercher un produit, une marque...'
    : locale === 'en' ? 'Search products, brands...'
    : 'Buscar productos, marcas...'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/shop?q=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
            : 'bg-white border-b border-neutral-100'
        )}
      >
        {/* Top notification bar */}
        <div className="bg-[var(--color-neutral-900)] text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
          <div className="container-shop flex items-center justify-between">
            <span className="hidden sm:inline-block text-neutral-400">
              🇪🇸 {locale === 'fr' ? 'Expédié depuis l\'Espagne' : locale === 'en' ? 'Shipped from Spain' : 'Envíos desde España'}
            </span>
            <span className="mx-auto sm:mx-0">
              {locale === 'fr' && '✨ Livraison offerte dès 50€ d\'achats en Espagne et tarif réduit en Europe !'}
              {locale === 'en' && '✨ Free shipping from €50 in Spain & discounted shipping across Europe!'}
              {locale === 'es' && '✨ Envío gratuito a partir de 50€ en España y tarifa reducida en Europa!'}
            </span>
            <div className="hidden sm:flex items-center gap-4 text-neutral-400">
              <Link href={`/${locale}/track-order`} className="hover:text-white transition-colors flex items-center gap-1">
                <Package size={13} />
                <span>{locale === 'fr' ? 'Suivi' : locale === 'en' ? 'Tracking' : 'Seguimiento'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="container-shop">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-base font-display">É</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-600)] transition-colors">
                  Élara<span className="text-[var(--color-primary-600)] font-serif italic ml-1">Shop</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-neutral-400)] font-semibold -mt-1">
                  International Boutique
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === `/${locale}${link.href}` || (link.href !== '/shop' && pathname.includes(link.href))
                return (
                  <Link
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    className={cn(
                      'px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'text-[var(--color-primary-700)] bg-[var(--color-primary-50)] font-semibold'
                        : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-50)]'
                    )}
                  >
                    {getLinkLabel(link)}
                  </Link>
                )
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-icon btn-ghost text-[var(--color-neutral-700)] hover:text-[var(--color-primary-600)]"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="btn-ghost flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[var(--color-neutral-700)] uppercase hover:bg-neutral-100 transition-colors"
                  aria-label="Changer de langue"
                >
                  <Globe size={16} className="text-[var(--color-neutral-500)]" />
                  <span>{locale}</span>
                  <ChevronDown size={12} className={cn('transition-transform duration-200', langOpen && 'rotate-180')} />
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-[var(--color-neutral-100)] py-1.5 min-w-[150px] z-50 animate-scale-in">
                    {locales.map((loc) => (
                      <Link
                        key={loc.code}
                        href={`/${loc.code}${pathname.replace(/^\/(es|fr|en)/, '') || ''}`}
                        onClick={() => setLangOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 px-4 py-2 text-sm transition-colors',
                          locale === loc.code
                            ? 'text-[var(--color-primary-700)] font-semibold bg-[var(--color-primary-50)]'
                            : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]'
                        )}
                      >
                        <span className="text-base">{loc.flag}</span>
                        <span>{loc.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Account Link */}
              <Link
                href={`/${locale}/account`}
                className="btn-icon btn-ghost text-[var(--color-neutral-700)] hover:text-[var(--color-primary-600)] p-2"
                title={locale === 'es' ? 'Mi cuenta' : locale === 'en' ? 'My account' : 'Mon compte'}
                aria-label={locale === 'es' ? 'Mi cuenta' : locale === 'en' ? 'My account' : 'Mon compte'}
              >
                <User size={20} />
              </Link>

              {/* Shopping Cart Button */}
              <button
                onClick={toggleCart}
                className="relative btn-icon btn-ghost text-[var(--color-neutral-800)] hover:text-[var(--color-primary-600)] p-2.5"
                aria-label={cartLabel}
                id="cart-toggle-btn"
              >
                <ShoppingCart size={21} />
                {itemCount > 0 && (
                  <span className="absolute 1 top-0.5 right-0.5 min-w-[19px] h-[19px] px-1 bg-[var(--color-primary-600)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-icon btn-ghost text-[var(--color-neutral-700)] lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--color-neutral-100)] bg-white shadow-lg animate-fade-in">
            <div className="container-shop py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-xl transition-all',
                    pathname.includes(link.href)
                      ? 'text-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                      : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]'
                  )}
                >
                  {getLinkLabel(link)}
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-[var(--color-neutral-100)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {locales.map((loc) => (
                    <Link
                      key={loc.code}
                      href={`/${loc.code}`}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors',
                        locale === loc.code
                          ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]'
                          : 'text-[var(--color-neutral-600)] bg-neutral-100'
                      )}
                    >
                      <span>{loc.flag}</span>
                      <span>{loc.code}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/${locale}/account`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-neutral-700)] px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  <User size={14} />
                  <span>{locale === 'es' ? 'Mi cuenta' : locale === 'en' ? 'My account' : 'Mon compte'}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay & Dialog */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl border-b border-neutral-200 p-4 sm:p-6 animate-slide-down">
            <div className="container-shop max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search size={22} className="text-[var(--color-primary-600)] flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex-1 text-base sm:text-lg outline-none font-medium text-neutral-800 placeholder:text-neutral-400 bg-transparent"
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 hidden sm:inline-flex"
                >
                  {locale === 'fr' ? 'Rechercher' : locale === 'en' ? 'Search' : 'Buscar'}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="btn-icon btn-ghost text-neutral-500 hover:text-neutral-800"
                >
                  <X size={22} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Fixed Header Spacer */}
      <div className="h-[96px]" />
    </>
  )
}
