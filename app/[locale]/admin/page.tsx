import AdminDashboardView from '@/components/AdminDashboardView'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div>
      <AdminDashboardView locale={locale} />
    </div>
  )
}
