import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import MobileBottomNav from '@/components/MobileBottomNav'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <CartDrawer locale={locale} />
      <Footer locale={locale} />
      <MobileBottomNav locale={locale} />
    </div>
  )
}
