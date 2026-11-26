'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, ShoppingBag, User, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'

export default function MobileBottomNav({ locale = 'fr' }: { locale?: string }) {
  const pathname = usePathname()
  const { getItemCount, toggleCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? getItemCount() : 0

  const labels = {
    fr: { home: 'Accueil', catalog: 'Catalogue', search: 'Rechercher', cart: 'Panier', account: 'Compte' },
    es: { home: 'Inicio', catalog: 'Catálogo', search: 'Buscar', cart: 'Carrito', account: 'Cuenta' },
    en: { home: 'Home', catalog: 'Catalog', search: 'Search', cart: 'Cart', account: 'Account' },
  }

  const l = labels[locale as keyof typeof labels] || labels.fr

  const navItems = [
    { href: `/${locale}`, label: l.home, icon: Home },
    { href: `/${locale}/shop`, label: l.catalog, icon: Compass },
  ]

  const isCurrent = (path: string) => {
    if (path === `/${locale}`) return pathname === `/${locale}`
    return pathname.startsWith(path)
  }

  return (
    <nav 
      aria-label="Navigation mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        {/* Accueil */}
        <Link
          href={`/${locale}`}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname === `/${locale}`
              ? 'text-[var(--color-primary-700)] font-semibold'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Home size={20} strokeWidth={pathname === `/${locale}` ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">{l.home}</span>
        </Link>

        {/* Catalogue */}
        <Link
          href={`/${locale}/shop`}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname.startsWith(`/${locale}/shop`)
              ? 'text-[var(--color-primary-700)] font-semibold'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Compass size={20} strokeWidth={pathname.startsWith(`/${locale}/shop`) ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">{l.catalog}</span>
        </Link>

        {/* Panier avec badge */}
        <button
          type="button"
          onClick={toggleCart}
          className="flex flex-col items-center justify-center py-1.5 px-1 text-neutral-500 hover:text-neutral-900 rounded-xl transition-colors relative"
          aria-label={l.cart}
        >
          <div className="relative">
            <ShoppingBag size={20} strokeWidth={itemCount > 0 ? 2.2 : 1.8} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-primary-600)] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{l.cart}</span>
        </button>

        {/* Mon Compte */}
        <Link
          href={`/${locale}/account`}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            pathname.startsWith(`/${locale}/account`) || pathname.startsWith(`/${locale}/auth`)
              ? 'text-[var(--color-primary-700)] font-semibold'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <User size={20} strokeWidth={pathname.startsWith(`/${locale}/account`) || pathname.startsWith(`/${locale}/auth`) ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">{l.account}</span>
        </Link>
      </div>
    </nav>
  )
}
