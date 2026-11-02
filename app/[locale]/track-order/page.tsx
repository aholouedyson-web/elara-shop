import TrackOrderView from '@/components/TrackOrderView'

export default async function TrackOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ order?: string }>
}) {
  const { locale } = await params
  const { order } = await searchParams

  return (
    <div className="bg-neutral-50/40 min-h-screen">
      <TrackOrderView locale={locale} initialOrder={order} />
    </div>
  )
}
