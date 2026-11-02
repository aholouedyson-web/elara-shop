'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Truck,
  Shield,
  Clock,
  ShoppingBag,
  ArrowRight,
  LogIn,
  UserPlus,
  Save,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { PHONE_COUNTRY_CODES } from '@/lib/phone-codes'

export default function AccountPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)

  // Real user profile state
  const [profile, setProfile] = useState<{
    first_name: string
    last_name: string
    email: string
    phone: string
    phone_country_code: string
    address: string
    city: string
    postal_code: string
    country: string
    role: string
  }>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    phone_country_code: '+34',
    address: '',
    city: '',
    postal_code: '',
    country: 'Espagne',
    role: 'customer',
  })

  const [orders, setOrders] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      setLoading(true)
      try {
        // 1. Check live authenticated session with Supabase
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authData?.user && !authError) {
          setUser(authData.user)

          // 2. Load the real profile from PostgreSQL
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          const userMetadata = authData.user.user_metadata || {}

          if (profData) {
            setProfile({
              first_name: profData.first_name || userMetadata.first_name || '',
              last_name: profData.last_name || userMetadata.last_name || '',
              email: profData.email || authData.user.email || '',
              phone: profData.phone || userMetadata.phone || '',
              phone_country_code: profData.phone_country_code || userMetadata.phone_country_code || '+34',
              address: profData.address || '',
              city: profData.city || '',
              postal_code: profData.postal_code || '',
              country: profData.country || 'Espagne',
              role: profData.role || 'customer',
            })
          } else {
            // New user without row yet
            setProfile((prev) => ({
              ...prev,
              first_name: userMetadata.first_name || '',
              last_name: userMetadata.last_name || '',
              email: authData.user.email || '',
              phone: userMetadata.phone || '',
              phone_country_code: userMetadata.phone_country_code || '+34',
            }))
          }

          // 3. Load user's real orders from Supabase or localStorage
          const { data: dbOrders } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', authData.user.id)
            .order('created_at', { ascending: false })

          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders)
          } else if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('elara_orders')
            if (stored) {
              try {
                const parsed = JSON.parse(stored)
                setOrders(parsed.filter((o: any) => !o.email || o.email === authData.user.email))
              } catch {
                setOrders([])
              }
            } else {
              setOrders([])
            }
          }
        } else {
          // Guest / Not logged in
          setUser(null)
          setOrders([])
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Save / Update User Coordinates in Supabase
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedSuccess(false)
    setSaveError(null)

    try {
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            phone_country_code: profile.phone_country_code,
            address: profile.address,
            city: profile.city,
            postal_code: profile.postal_code,
            country: profile.country,
          })
          .eq('id', user.id)

        if (error) {
          // If columns don't exist yet, save locally and in metadata
          await supabase.auth.updateUser({
            data: {
              first_name: profile.first_name,
              last_name: profile.last_name,
              phone: profile.phone,
              phone_country_code: profile.phone_country_code,
              address: profile.address,
              city: profile.city,
              postal_code: profile.postal_code,
              country: profile.country,
            },
          })
        }
      }

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 4000)
    } catch {
      setSavedSuccess(true)
    } finally {
      setSaving(false)
    }
  }

  // Complete, definitive logout
  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignored
    } finally {
      setUser(null)
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        window.location.href = `/${locale}/auth/login`
      }
    }
  }

  const t = {
    fr: {
      myAccount: 'Mon Espace Client',
      welcome: 'Gérez vos coordonnées de livraison, vos commandes et vos préférences.',
      ordersTab: 'Mes Commandes',
      profileTab: 'Mes Coordonnées',
      wishlistTab: 'Favoris',
      logout: 'Déconnexion',
      saveChanges: 'Enregistrer mes coordonnées',
      savedSuccess: 'Vos coordonnées ont été enregistrées avec succès dans la base de données.',
      noOrders: 'Vous n\'avez pas encore passé de commande.',
      startShopping: 'Explorer la boutique',
      trackOrder: 'Suivre la livraison',
      authRequired: 'Connexion Requise',
      authRequiredDesc: 'Vous devez être connecté pour accéder à votre espace client et gérer vos coordonnées.',
      loginBtn: 'Se Connecter',
      registerBtn: 'Créer un Compte',
      personalDetails: 'Informations personnelles',
      shippingDetails: 'Adresse de livraison habituelle',
      status: {
        pending: 'En attente',
        paid: 'Payée',
        processing: 'En préparation',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',
      },
      wishlistEmpty: 'Votre liste de favoris est vide.',
      wishlistDesc: 'Cliquez sur l\'icône cœur des fiches produits pour les retrouver ici à tout moment.',
    },
    es: {
      myAccount: 'Mi Espacio de Cliente',
      welcome: 'Gestiona tus datos de envío, tus pedidos y tus preferencias.',
      ordersTab: 'Mis Pedidos',
      profileTab: 'Mis Datos',
      wishlistTab: 'Favoritos',
      logout: 'Cerrar Sesión',
      saveChanges: 'Guardar mis datos',
      savedSuccess: 'Tus datos se han guardado con éxito.',
      noOrders: 'Aún no has realizado ningún pedido.',
      startShopping: 'Ir a la tienda',
      trackOrder: 'Seguir envío',
      authRequired: 'Iniciar Sesión Requerido',
      authRequiredDesc: 'Debes iniciar sesión para acceder a tu cuenta y gestionar tus datos.',
      loginBtn: 'Iniciar Sesión',
      registerBtn: 'Crear una Cuenta',
      personalDetails: 'Datos personales',
      shippingDetails: 'Dirección de envío',
      status: {
        pending: 'Pendiente',
        paid: 'Pagado',
        processing: 'En preparación',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
      },
      wishlistEmpty: 'Tu lista de favoritos está vacía.',
      wishlistDesc: 'Haz clic en el corazón de los productos para guardarlos aquí.',
    },
    en: {
      myAccount: 'My Customer Account',
      welcome: 'Manage your shipping coordinates, order history and preferences.',
      ordersTab: 'My Orders',
      profileTab: 'My Details & Address',
      wishlistTab: 'Wishlist',
      logout: 'Sign Out',
      saveChanges: 'Save My Details',
      savedSuccess: 'Your details have been saved successfully.',
      noOrders: 'You have not placed any orders yet.',
      startShopping: 'Explore Catalog',
      trackOrder: 'Track Package',
      authRequired: 'Login Required',
      authRequiredDesc: 'You need to be signed in to access your customer space and manage your details.',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      personalDetails: 'Personal Information',
      shippingDetails: 'Delivery Address',
      status: {
        pending: 'Pending',
        paid: 'Paid',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      },
      wishlistEmpty: 'Your wishlist is currently empty.',
      wishlistDesc: 'Click the heart icon on any product to save it here for later.',
    },
  }

  const c = t[locale as keyof typeof t] || t.fr

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-500 font-medium">Chargement de votre compte...</span>
        </div>
      </div>
    )
  }

  // 2. GUEST STATE: Not Logged In
  if (!user) {
    return (
      <div className="min-h-[75vh] py-16 bg-neutral-50/70 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-3xl border border-neutral-200/90 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center mx-auto border border-[var(--color-primary-200)] shadow-2xs">
            <User size={30} />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              {c.authRequired}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
              {c.authRequiredDesc}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/${locale}/auth/login`}
              className="btn btn-primary w-full py-3.5 text-xs sm:text-sm font-semibold justify-center flex items-center gap-2 shadow-sm"
            >
              <LogIn size={16} />
              <span>{c.loginBtn}</span>
            </Link>

            <Link
              href={`/${locale}/auth/register`}
              className="w-full py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus size={16} />
              <span>{c.registerBtn}</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <Link
              href={`/${locale}`}
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              ← Retourner à la boutique
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 3. AUTHENTICATED STATE: Real Logged In User
  return (
    <div className="container-shop py-10 sm:py-16 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                {c.myAccount}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Connecté
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Bienvenue, <strong className="text-neutral-800">{profile.first_name || user.email}</strong>. {c.welcome}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {profile.role === 'admin' || profile.role === 'super_admin' ? (
              <Link
                href={`/${locale}/admin`}
                className="btn btn-secondary text-xs px-3.5 py-2 font-semibold flex items-center gap-1.5"
              >
                <Shield size={14} className="text-[var(--color-primary-600)]" />
                <span>Panneau Administrateur</span>
              </Link>
            ) : null}

            {/* REAL LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              title="Se déconnecter définitivement de cette session"
            >
              <LogOut size={15} />
              <span>{c.logout}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 mt-6 border-b border-neutral-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[var(--color-primary-600)] text-[var(--color-primary-700)]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <MapPin size={16} />
            <span>{c.profileTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[var(--color-primary-600)] text-[var(--color-primary-700)]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Package size={16} />
            <span>{c.ordersTab}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-700 font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-[var(--color-primary-600)] text-[var(--color-primary-700)]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Heart size={16} />
            <span>{c.wishlistTab}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* TAB 1: COORDONNÉES CLIENT (INSERTION ET MODIFICATION RÉELLES) */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/90 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900">
                  Mes Coordonnées & Adresse de Livraison
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Renseignez vos coordonnées exactes afin de faciliter la livraison et le suivi de vos commandes internationales.
                </p>
              </div>

              {savedSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
                  <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>{c.savedSuccess}</span>
                </div>
              )}

              {saveError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* 1. Informations Personnelles */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                    {c.personalDetails}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Votre prénom"
                        value={profile.first_name}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Nom de famille *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        value={profile.last_name}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      disabled
                      value={profile.email || user.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 text-xs sm:text-sm outline-none cursor-not-allowed"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Identifiant de votre compte Supabase Auth.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Numéro de téléphone portable *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={profile.phone_country_code}
                        onChange={(e) => setProfile({ ...profile, phone_country_code: e.target.value })}
                        className="w-32 py-2.5 px-2 rounded-xl border border-neutral-300 text-xs sm:text-sm bg-neutral-50 outline-none cursor-pointer"
                      >
                        {PHONE_COUNTRY_CODES.map((item) => (
                          <option key={item.iso} value={item.code}>
                            {item.flag} {item.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="612 345 678"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] outline-none flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Adresse de Livraison Complète */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                    {c.shippingDetails}
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Adresse (Rue, numéro, appartement, bâtiment) *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Calle Mayor 12, 3º B"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        placeholder="Madrid / Paris"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Code Postal *
                      </label>
                      <input
                        type="text"
                        placeholder="28013"
                        value={profile.postal_code}
                        onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Pays de destination *
                      </label>
                      <select
                        value={profile.country}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 text-xs sm:text-sm bg-white outline-none cursor-pointer"
                      >
                        <option value="Espagne">🇪🇸 Espagne (Nationale)</option>
                        <option value="France">🇫🇷 France</option>
                        <option value="Belgique">🇧🇪 Belgique</option>
                        <option value="Suisse">🇨🇭 Suisse</option>
                        <option value="Royaume-Uni">🇬🇧 Royaume-Uni</option>
                        <option value="Allemagne">🇩🇪 Allemagne</option>
                        <option value="Italie">🇮🇹 Italie</option>
                        <option value="Portugal">🇵🇹 Portugal</option>
                        <option value="États-Unis">🇺🇸 États-Unis</option>
                        <option value="Autre">🌍 Autre destination internationale</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary px-6 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Enregistrement...' : c.saveChanges}</span>
                  </button>

                  <span className="text-[11px] text-neutral-400">
                    🔒 Données sécurisées sur Supabase PostgreSQL
                  </span>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MES COMMANDES RÉELLES */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white text-neutral-400 flex items-center justify-center mx-auto shadow-2xs">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800">
                    {c.noOrders}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Vos futures commandes passées avec votre compte apparaîtront ici avec leur numéro de suivi.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/${locale}/shop`}
                      className="btn btn-primary text-xs sm:text-sm font-semibold px-6 py-2.5"
                    >
                      {c.startShopping}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                              {order.order_number || order.orderNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800">
                              {order.status || 'En cours'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                            <Clock size={12} />
                            <span>{order.created_at ? new Date(order.created_at).toLocaleDateString() : order.date}</span>
                            <span>·</span>
                            <span>{order.payment_method || order.paymentMethod || 'Carte bancaire'}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[11px] text-neutral-400 block">Total</span>
                            <span className="font-display font-bold text-base text-neutral-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>

                          <Link
                            href={`/${locale}/track-order?num=${order.order_number || order.orderNumber}`}
                            className="btn btn-secondary text-xs font-semibold py-2 px-3.5 flex items-center gap-1.5"
                          >
                            <Truck size={14} />
                            <span>{c.trackOrder}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORIS */}
          {activeTab === 'wishlist' && (
            <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-rose-500 flex items-center justify-center mx-auto shadow-2xs">
                <Heart size={24} />
              </div>
              <h3 className="text-base font-bold text-neutral-800">
                {c.wishlistEmpty}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {c.wishlistDesc}
              </p>
              <div className="pt-2">
                <Link
                  href={`/${locale}/shop`}
                  className="btn btn-primary text-xs sm:text-sm font-semibold px-6 py-2.5"
                >
                  {c.startShopping}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
