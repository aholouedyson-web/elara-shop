'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSelector({
  currentSort = 'popular',
  options,
}: {
  currentSort?: string
  options: {
    popular: string
    newest: string
    priceAsc: string
    priceDesc: string
  }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`?${params.toString()}`)
  }

  return (
    <select
      defaultValue={currentSort}
      onChange={handleChange}
      className="text-xs font-semibold bg-white border border-neutral-200 rounded-xl px-3 py-2 pr-8 text-neutral-800 outline-none focus:border-[var(--color-primary-600)] cursor-pointer"
    >
      <option value="popular">{options.popular}</option>
      <option value="newest">{options.newest}</option>
      <option value="priceAsc">{options.priceAsc}</option>
      <option value="priceDesc">{options.priceDesc}</option>
    </select>
  )
}
