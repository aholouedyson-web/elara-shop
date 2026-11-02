import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  currency: string = 'EUR',
  locale: string = 'es-ES'
): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(
  date: Date | string,
  locale: string = 'es-ES',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `EL${year}${month}${random}`
}

export function calculateDiscount(
  price: number,
  compareAtPrice: number | null | undefined
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getLocaleFromCountry(country: string): string {
  const map: Record<string, string> = {
    ES: 'es',
    FR: 'fr',
    BE: 'fr',
    CH: 'fr',
    GB: 'en',
    US: 'en',
    CA: 'en',
    AU: 'en',
  }
  return map[country] || 'en'
}

export const COUNTRIES = [
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'NL', name: 'Nederland', flag: '🇳🇱' },
  { code: 'AT', name: 'Österreich', flag: '🇦🇹' },
  { code: 'PL', name: 'Polska', flag: '🇵🇱' },
  { code: 'SE', name: 'Sverige', flag: '🇸🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
]
