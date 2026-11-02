import CheckoutView from '@/components/CheckoutView'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="bg-neutral-50/50 min-h-screen">
      <CheckoutView locale={locale} />
    </div>
  )
}
