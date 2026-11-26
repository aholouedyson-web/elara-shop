import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ÉlaraShop | Boutique Électronique Premium',
  description: 'ÉlaraShop - Votre boutique high-tech : smartphones, ordinateurs, audio et accessoires expédiés dans le monde entier.',
  keywords: ['e-commerce', 'électronique', 'smartphones', 'laptops', 'audio', 'ÉlaraShop'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased selection:bg-[var(--color-primary-100)] selection:text-[var(--color-primary-900)]">
        {children}
      </body>
    </html>
  )
}
