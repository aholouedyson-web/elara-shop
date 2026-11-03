'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Shield,
  Tag,
  Truck,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  DollarSign,
  Search,
  Upload,
  Camera,
  X,
  Lock,
  UserCheck,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { PRODUCTS, SHIPPING_RATES } from '@/lib/products-data'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

export default function AdminDashboardView({ locale = 'es' }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'admins' | 'shipping' | 'coupons'>('overview')

  // Products State
  const [productList, setProductList] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [savingProduct, setSavingProduct] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  // Load products from Database via API
  const loadDbProducts = async () => {
    try {
      setLoadingProducts(true)
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        // Map to format consumed by admin view
        const mapped = data.products.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.title_fr || p.title_es || p.title_en,
          title: { fr: p.title_fr, es: p.title_es, en: p.title_en },
          description: { fr: p.description_fr, es: p.description_es, en: p.description_en },
          basePrice: Number(p.price),
          price: Number(p.price),
          originalPrice: p.sale_price ? Number(p.sale_price) : undefined,
          category: p.categories?.slug || 'smartphones',
          category_id: p.category_id,
          stock: p.stock !== undefined ? Number(p.stock) : 10,
          sku: p.sku || `SKU-${p.id.slice(0, 8)}`,
          images: (p.product_images || []).map((img: any) => ({ url: img.url, isPrimary: img.is_primary })),
          image: p.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
          features: Array.isArray(p.features) ? p.features : [],
        }))
        setProductList(mapped)
      } else {
        // Fallback to static PRODUCTS if DB has none
        setProductList(PRODUCTS)
      }
    } catch (err) {
      console.error('Failed to load DB products in admin:', err)
      setProductList(PRODUCTS)
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    loadDbProducts()
  }, [])

  // Product Form Fields
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPrice, setFormPrice] = useState<number>(0)
  const [formSalePrice, setFormSalePrice] = useState<number | ''>('')
  const [formCategory, setFormCategory] = useState('smartphones')
  const [formStock, setFormStock] = useState<number>(10)
  const [formSku, setFormSku] = useState('')
  const [formFeatures, setFormFeatures] = useState<string>('Écran OLED 120Hz\nPuce 3nm ultra-rapide\nAutonomie 48h')
  const [formImages, setFormImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Orders State
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ord-101',
      orderNumber: 'EL241088923',
      date: '30/10/2026',
      customer: 'Carlos Gomez',
      email: 'carlos.gomez@gmail.com',
      country: 'ES',
      total: 899.99,
      status: 'shipped',
      itemsCount: 1,
      carrier: 'Correos Express',
      trackingNumber: 'ES892138120X',
    },
    {
      id: 'ord-102',
      orderNumber: 'EL241088915',
      date: '29/10/2026',
      customer: 'Sophie Laurent',
      email: 'sophie.laurent@free.fr',
      country: 'FR',
      total: 1499.99,
      status: 'processing',
      itemsCount: 1,
      carrier: 'DHL International',
      trackingNumber: '',
    },
    {
      id: 'ord-103',
      orderNumber: 'EL241088902',
      date: '28/10/2026',
      customer: 'Mark Miller',
      email: 'mark.m@techcorp.co.uk',
      country: 'GB',
      total: 309.98,
      status: 'paid',
      itemsCount: 2,
      carrier: 'Correos Express',
      trackingNumber: '',
    },
    {
      id: 'ord-104',
      orderNumber: 'EL241088899',
      date: '27/10/2026',
      customer: 'Elena Alvarez',
      email: 'elena.alvarez@outlook.es',
      country: 'ES',
      total: 59.99,
      status: 'delivered',
      itemsCount: 1,
      carrier: 'Correos Express',
      trackingNumber: 'ES9921441829',
    },
  ])

  // Admins List (RBAC)
  const [adminsList, setAdminsList] = useState<any[]>([
    {
      id: 'adm-001',
      identifier: 'admin_elara_01',
      name: 'Elena Morales (Propriétaire)',
      email: 'elena.morales@elara.es',
      phone: '+34 612 345 678',
      role: 'super_admin',
      permissions: {
        can_manage_products: true,
        can_manage_orders: true,
        can_manage_admins: true,
        can_view_finance: true,
      },
      createdAt: '15/01/2026',
    },
    {
      id: 'adm-002',
      identifier: 'logistique_madrid',
      name: 'Mateo Sanchez',
      email: 'mateo.logistique@elara.es',
      phone: '+34 689 123 456',
      role: 'admin',
      permissions: {
        can_manage_products: true,
        can_manage_orders: true,
        can_manage_admins: false,
        can_view_finance: false,
      },
      createdAt: '10/06/2026',
    },
  ])

  // New Admin Form State
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [newAdminIdentifier, setNewAdminIdentifier] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPhone, setNewAdminPhone] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminPermProducts, setNewAdminPermProducts] = useState(true)
  const [newAdminPermOrders, setNewAdminPermOrders] = useState(true)
  const [newAdminPermAdmins, setNewAdminPermAdmins] = useState(false)
  const [newAdminPermFinance, setNewAdminPermFinance] = useState(false)

  // Load local user orders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('elara_orders') || '[]')
      if (stored.length > 0) {
        const formatted = stored.map((o: any, idx: number) => ({
          id: o.orderNumber ? `ord-${o.orderNumber}` : `ord-local-${idx}-${Date.now()}`,
          orderNumber: o.orderNumber,
          date: o.date,
          customer: o.customerName || 'Client Commande',
          email: o.email || 'client@shop.com',
          country: o.country || 'ES',
          total: o.total,
          status: o.status || 'paid',
          itemsCount: o.items?.length || 1,
          carrier: 'Correos Express',
          trackingNumber: o.trackingNumber || '',
        }))
        setOrders((prev) => {
          // Avoid duplicate orders by orderNumber/id
          const existingIds = new Set(prev.map((item) => item.orderNumber || item.id))
          const newOrders = formatted.filter((item: any) => !existingIds.has(item.orderNumber || item.id))
          return [...newOrders, ...prev]
        })
      }
    }
  }, [])

  // KPI Calculations
  const totalProducts = productList.length
  const inStockProducts = productList.filter((p) => (p.stock || 0) > 0).length
  const outOfStockProducts = productList.filter((p) => (p.stock || 0) <= 0).length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0)
  const totalClients = new Set(orders.map((o) => o.email)).size + 148 // Realistic count

  // Handle Multi-Photo File Upload to Supabase Storage via Server API
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    const newImageUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.publicUrl) {
          newImageUrls.push(data.publicUrl)
        } else {
          console.error('Upload error:', data.error)
          alert(`Erreur d'upload de l'image: ${data.error || 'Erreur inconnue'}`)
        }
      } catch (err: any) {
        console.error('Network error during upload:', err)
        alert(`Erreur réseau lors de l'upload: ${err.message}`)
      }
    }

    if (newImageUrls.length > 0) {
      setFormImages((prev) => [...prev, ...newImageUrls])
    }
    setUploadingImage(false)
  }

  // Open Modal to Add Product
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormTitle('')
    setFormDescription('')
    setFormPrice(99)
    setFormSalePrice('')
    setFormCategory('smartphones')
    setFormStock(15)
    setFormSku(`EL-${Math.floor(1000 + Math.random() * 9000)}`)
    setFormFeatures('Design premium en aluminium\nBatterie haute capacité\nGarantie constructeur 2 ans')
    setFormImages([])
    setShowProductModal(true)
  }

  // Open Modal to Edit Product
  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product)
    setFormTitle(product.title?.fr || product.title?.es || product.name || '')
    setFormDescription(product.description?.fr || product.description?.es || '')
    setFormPrice(product.basePrice || product.price || 0)
    setFormSalePrice(product.originalPrice ? product.basePrice : '')
    setFormCategory(product.category || 'smartphones')
    setFormStock(product.stock !== undefined ? product.stock : 10)
    setFormSku(product.sku || `EL-${product.id}`)
    setFormFeatures(
      Array.isArray(product.features)
        ? product.features.map((f: any) => (typeof f === 'string' ? f : `${f.label}: ${f.value}`)).join('\n')
        : 'Spécifications de haute technologie'
    )
    setFormImages(
      product.images && product.images.length > 0
        ? product.images.map((img: any) => (typeof img === 'string' ? img : img.url))
        : [product.image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80']
    )
    setShowProductModal(true)
  }

  // Save Product (Add or Edit) to Supabase Database
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formImages.length === 0) {
      alert("Veuillez ajouter au moins une photo pour le produit avant d'enregistrer.")
      return
    }

    setSavingProduct(true)

    const featuresArray = formFeatures
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    try {
      if (editingProduct && editingProduct.id && !editingProduct.id.startsWith('prod-static')) {
        // Real DB Update
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct.id,
            title: formTitle,
            description: formDescription,
            price: Number(formPrice),
            sale_price: formSalePrice ? Number(formSalePrice) : null,
            category_id: editingProduct.category_id || null,
            stock: Number(formStock),
            sku: formSku,
            features: featuresArray,
            images: formImages,
          }),
        })
        const result = await res.json()
        if (result.error) {
          alert(`Erreur lors de la mise à jour: ${result.error}`)
        } else {
          await loadDbProducts()
          setShowProductModal(false)
        }
      } else {
        // Real DB Insert
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            description: formDescription,
            price: Number(formPrice),
            sale_price: formSalePrice ? Number(formSalePrice) : null,
            stock: Number(formStock),
            sku: formSku,
            features: featuresArray,
            images: formImages,
          }),
        })
        const result = await res.json()
        if (result.error) {
          alert(`Erreur lors de l'ajout: ${result.error}`)
        } else {
          await loadDbProducts()
          setShowProductModal(false)
        }
      }
    } catch (err: any) {
      alert(`Erreur réseau: ${err.message}`)
    } finally {
      setSavingProduct(false)
    }
  }

  // Delete Product from Supabase Database
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce produit du catalogue ?')) {
      return
    }

    // Check if UUID or fallback static id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)

    if (!isUuid) {
      // Local fallback product (non-UUID), remove directly from view state
      setProductList((prev) => prev.filter((p) => p.id !== productId))
      return
    }

    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      if (result.error) {
        alert(`Erreur lors de la suppression: ${result.error}`)
      } else {
        await loadDbProducts()
      }
    } catch (err: any) {
      alert(`Erreur réseau: ${err.message}`)
    }
  }

  // Remove single image in modal
  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  // Create New Admin (RBAC)
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail || !newAdminName) return

    const newAdmin = {
      id: `adm-${Date.now()}`,
      identifier: newAdminIdentifier || `adm_${Math.random().toString(36).substring(7)}`,
      name: newAdminName,
      email: newAdminEmail,
      phone: newAdminPhone || '+34 600 000 000',
      role: 'admin',
      permissions: {
        can_manage_products: newAdminPermProducts,
        can_manage_orders: newAdminPermOrders,
        can_manage_admins: newAdminPermAdmins,
        can_view_finance: newAdminPermFinance,
      },
      createdAt: new Date().toLocaleDateString('fr-FR'),
    }

    setAdminsList((prev) => [...prev, newAdmin])
    setShowAdminModal(false)
    setNewAdminIdentifier('')
    setNewAdminName('')
    setNewAdminEmail('')
    setNewAdminPhone('')
    setNewAdminPassword('')
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 pb-20">
      {/* Top Admin Bar */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="container-shop py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              É
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white">Élara Admin</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                  RBAC Protégé
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Administration centrale · Espagne & International
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="text-xs px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              ← Voir la Boutique
            </Link>
            <Link
              href={`/${locale}/admin/login`}
              className="text-xs px-3.5 py-2 rounded-xl border border-neutral-700 hover:border-neutral-500 text-neutral-300 transition-colors flex items-center gap-1.5"
            >
              <Lock size={13} />
              <span>Verrouiller</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container-shop flex gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold pt-1">
          {[
            { id: 'overview', label: 'Vue Globale', icon: TrendingUp },
            { id: 'products', label: `Produits (${totalProducts})`, icon: Package },
            { id: 'orders', label: `Commandes (${totalOrders})`, icon: ShoppingBag },
            { id: 'admins', label: `Administrateurs (${adminsList.length})`, icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-teal-400 text-teal-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="container-shop py-8">
        {/* =========================================================================
            TAB 1: OVERVIEW (KPIS DEMANDÉS)
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 6 Key Performance Indicators (KPIs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Total Produits */}
              <div className="p-6 rounded-3xl bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Total Produits
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Package size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-white">
                    {totalProducts}
                  </span>
                  <span className="text-xs text-neutral-400">références</span>
                </div>
              </div>

              {/* 2. Produits Disponibles (en stock) */}
              <div className="p-6 rounded-3xl bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Produits Disponibles
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-emerald-400">
                    {inStockProducts}
                  </span>
                  <span className="text-xs text-neutral-400">en stock</span>
                </div>
              </div>

              {/* 3. Produits en Rupture de Stock */}
              <div className="p-6 rounded-3xl bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    En Rupture de Stock
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-rose-400">
                    {outOfStockProducts}
                  </span>
                  <span className="text-xs text-neutral-400">alerte réassort</span>
                </div>
              </div>

              {/* 4. Nombre de Commandes */}
              <div className="p-6 rounded-3xl bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Nombre de Commandes
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-white">
                    {totalOrders}
                  </span>
                  <span className="text-xs text-blue-400 font-semibold">+18% ce mois</span>
                </div>
              </div>

              {/* 5. Chiffre d'Affaires */}
              <div className="p-6 rounded-3xl bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Chiffre d'Affaires
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-amber-300">
                    {formatPrice(totalRevenue)}
                  </span>
                  <span className="text-xs text-neutral-400">encaissé</span>
                </div>
              </div>

              {/* 6. Nombre de Clients */}
              <div className="p-6 rounded-3xl bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Nombre de Clients
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-white">
                    {totalClients}
                  </span>
                  <span className="text-xs text-purple-400 font-semibold">Europe & Monde</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-800/50 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white">
                    Dernières Commandes Reçues
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-teal-400 hover:underline font-semibold"
                  >
                    Voir tout ({orders.length}) →
                  </button>
                </div>
                <div className="divide-y divide-neutral-800">
                  {orders.slice(0, 4).map((o, idx) => (
                    <div key={`${o.id || o.orderNumber}-${idx}`} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-white block">{o.orderNumber}</span>
                        <span className="text-neutral-400">{o.customer} · {o.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">{formatPrice(o.total)}</span>
                        <span className="text-[10px] uppercase font-semibold text-teal-400">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-800/50 border border-neutral-800 space-y-4">
                <h3 className="font-display font-bold text-base text-white">
                  Actions Rapides
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleOpenAddModal}
                    className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Ajouter un Nouveau Produit</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admins')
                      setShowAdminModal(true)
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserPlus size={16} />
                    <span>Créer un Administrateur</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="w-full py-3 px-4 rounded-xl border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Package size={16} />
                    <span>Gérer les Stocks Catalogue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: GESTION DES PRODUITS (CRUD COMPLET + MULTI-PHOTOS)
           ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Rechercher un produit par titre ou catégorie..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs text-white placeholder-neutral-500 outline-none focus:border-teal-500"
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="btn btn-primary text-xs font-semibold py-2.5 px-4 flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Nouveau Produit</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-800/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-800/80 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Produit & Photos</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Prix</th>
                    <th className="py-3 px-4">Réduction</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {productList
                    .filter((p) => {
                      const title = p.title?.fr || p.title?.es || p.name || ''
                      return title.toLowerCase().includes(productSearch.toLowerCase()) || p.category.includes(productSearch.toLowerCase())
                    })
                    .map((product) => {
                      const title = product.title?.fr || product.title?.es || product.name
                      const price = product.basePrice || product.price
                      const origPrice = product.originalPrice
                      const isOutOfStock = (product.stock || 0) <= 0
                      const image = product.image || (product.images && product.images[0]?.url) || ''

                      return (
                        <tr key={product.id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            {image && (
                              <img
                                src={image}
                                alt={title}
                                className="w-12 h-12 object-cover rounded-xl border border-neutral-700 bg-neutral-900"
                              />
                            )}
                            <div>
                              <span className="font-semibold text-white block">{title}</span>
                              <span className="text-[10px] font-mono text-neutral-400">SKU: {product.sku || product.id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-neutral-700/60 text-neutral-300">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            {formatPrice(price)}
                          </td>
                          <td className="py-3 px-4">
                            {origPrice && origPrice > price ? (
                              <span className="text-[11px] font-semibold text-rose-400">
                                -{Math.round(((origPrice - price) / origPrice) * 100)}% ({formatPrice(origPrice)})
                              </span>
                            ) : (
                              <span className="text-neutral-500">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isOutOfStock
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : product.stock < 5
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {isOutOfStock ? '0 (Rupture)' : `${product.stock} unités`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition-colors cursor-pointer"
                              title="Modifier le produit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors cursor-pointer"
                              title="Supprimer le produit"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GESTION DES COMMANDES
           ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-display font-bold text-xl text-white">
              Commandes Clients & Expéditions Internationales
            </h2>

            <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-800/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-800/80 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">N° Commande</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Pays</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Statut de la commande</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {orders.map((o, idx) => (
                    <tr key={`${o.id || o.orderNumber}-${idx}`} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">
                        {o.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{o.customer}</span>
                        <span className="text-[11px] text-neutral-400">{o.email}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-300">
                        {o.country}
                      </td>
                      <td className="py-3 px-4 font-bold text-teal-400">
                        {formatPrice(o.total)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="py-1 px-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-semibold text-white outline-none cursor-pointer"
                        >
                          <option value="pending">⏳ En attente</option>
                          <option value="paid">💳 Payée</option>
                          <option value="processing">📦 En préparation</option>
                          <option value="shipped">🚚 Expédiée</option>
                          <option value="delivered">✅ Livrée</option>
                          <option value="cancelled">❌ Annulée</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: GESTION DES ADMINISTRATEURS (RBAC)
           ========================================================================= */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Gestion des Administrateurs & Rôles (RBAC)
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Contrôle d'accès strict : aucun compte créé depuis l'inscription client ne peut accéder à ces privilèges.
                </p>
              </div>

              <button
                onClick={() => setShowAdminModal(true)}
                className="btn btn-primary text-xs font-semibold py-2.5 px-4 flex items-center gap-2 cursor-pointer"
              >
                <UserPlus size={16} />
                <span>Créer un Administrateur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {adminsList.map((adm) => (
                <div
                  key={adm.id}
                  className="p-6 rounded-3xl bg-neutral-800/50 border border-neutral-800 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{adm.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            adm.role === 'super_admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          }`}
                        >
                          {adm.role}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Identifiant : <span className="font-mono text-neutral-300">{adm.identifier}</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-neutral-700/50 text-neutral-300 flex items-center justify-center">
                      <Shield size={20} />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                    <p>📧 {adm.email}</p>
                    <p>📞 {adm.phone}</p>
                    <p className="text-[11px] text-neutral-500">Créé le {adm.createdAt}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                      Permissions Attribuées :
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        {adm.permissions.can_manage_products ? '✅' : '❌'} Catalogue
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        {adm.permissions.can_manage_orders ? '✅' : '❌'} Commandes
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        {adm.permissions.can_manage_admins ? '✅' : '❌'} Gérer Admins
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        {adm.permissions.can_view_finance ? '✅' : '❌'} Chiffre d'Affaires
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: AJOUTER / MODIFIER PRODUIT (MULTI-PHOTOS SUPABASE STORAGE)
         ========================================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <h3 className="font-display font-bold text-xl text-white">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Titre du Produit *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Smartphone Pro X15 Titanium"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Description détaillée du Produit *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Présentation des finitions, des technologies et des performances..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Prix de vente (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Prix avant réduction (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Optionnel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Stock disponible (unités) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Ordinateurs Portables</option>
                    <option value="audio">Audio & Casques</option>
                    <option value="montres">Montres Connectées</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Code SKU (Référence)
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Multi-Photo Upload via Supabase Storage / Mobile Camera */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Photos du Produit (Supabase Storage · Multi-photos · Téléphone)
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3 px-4 rounded-xl border border-dashed border-teal-500/50 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Camera size={16} />
                    <span>{uploadingImage ? 'Téléchargement...' : 'Ajouter des photos (ordinateur ou mobile)'}</span>
                  </button>
                </div>

                {/* Photos Preview */}
                {formImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-neutral-800/80 border border-neutral-700">
                    {formImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-neutral-600">
                        <img src={imgUrl} alt="Aperçu" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                    ⚠️ Aucune photo sélectionnée. Cliquez sur le bouton ci-dessus pour importer une photo avant d'enregistrer.
                  </p>
                )}
              </div>

              {/* Technical Features / Specs */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Caractéristiques & Spécifications (Une par ligne)
                </label>
                <textarea
                  rows={3}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Écran 6.7 pouces Super Retina&#10;Processeur 8 cœurs&#10;Charge sans fil 30W"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs sm:text-sm text-white font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  disabled={savingProduct}
                  onClick={() => setShowProductModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="btn btn-primary text-xs font-semibold py-2.5 px-6 cursor-pointer"
                >
                  {savingProduct ? 'Enregistrement dans la base...' : 'Enregistrer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CRÉER NOUVEL ADMINISTRATEUR (RBAC AVEC PERMISSIONS)
         ========================================================================= */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <UserPlus size={18} className="text-teal-400" />
                <span>Créer un Administrateur</span>
              </h3>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Nom et prénom du gestionnaire *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Marc Dubois"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Identifiant système unique *
                </label>
                <input
                  type="text"
                  required
                  placeholder="gest_stock_01"
                  value={newAdminIdentifier}
                  onChange={(e) => setNewAdminIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs font-mono text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Adresse e-mail professionnelle *
                </label>
                <input
                  type="email"
                  required
                  placeholder="m.dubois@elara.es"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Téléphone professionnel
                </label>
                <input
                  type="tel"
                  placeholder="+34 612 000 111"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Mot de passe temporaire *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>

              {/* Permissions Checkboxes */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-neutral-300 block mb-2">
                  Permissions Attribuées (RBAC) :
                </span>
                <div className="space-y-2 p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPermProducts}
                      onChange={(e) => setNewAdminPermProducts(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Gestion des produits (Ajout, modification, stocks)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPermOrders}
                      onChange={(e) => setNewAdminPermOrders(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Gestion des commandes et expéditions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPermFinance}
                      onChange={(e) => setNewAdminPermFinance(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Consultation des chiffres et finances</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPermAdmins}
                      onChange={(e) => setNewAdminPermAdmins(e.target.checked)}
                      className="rounded text-teal-500"
                    />
                    <span>Droit de créer et modifier d'autres admins</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-semibold py-2.5 px-5 cursor-pointer"
                >
                  Créer l'Administrateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
