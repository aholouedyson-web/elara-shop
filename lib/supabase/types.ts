export type UserRole = 'customer' | 'admin' | 'super_admin'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  phone_country_code?: string | null
  role: UserRole
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface AdminPermissions {
  id: string
  user_id: string
  can_manage_products: boolean
  can_manage_orders: boolean
  can_manage_admins: boolean
  can_view_finance: boolean
  can_manage_discounts: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  slug: string
  name_es: string
  name_fr: string
  name_en: string
  description_es?: string | null
  description_fr?: string | null
  description_en?: string | null
  image_url?: string | null
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface Product {
  id: string
  slug: string
  category_id?: string | null
  title_es: string
  title_fr: string
  title_en: string
  description_es: string
  description_fr: string
  description_en: string
  price: number
  sale_price?: number | null
  stock: number
  is_featured: boolean
  is_new: boolean
  sku?: string | null
  features: Array<{ label: string; value: string }> | string[]
  rating: number
  review_count: number
  images?: ProductImage[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id?: string | null
  guest_email?: string | null
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  payment_method: string
  subtotal: number
  discount: number
  shipping_fee: number
  total: number
  shipping_address: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    city: string
    postal_code: string
    country: string
  }
  tracking_number?: string | null
  carrier: string
  notes?: string | null
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string | null
  title: string
  price: number
  quantity: number
  image_url?: string | null
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
  created_at: string
}
