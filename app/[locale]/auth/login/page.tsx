'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const t = {
    fr: {
      title: 'Connexion Client',
      subtitle: 'Accédez à vos commandes, adresses et liste de favoris',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      submitBtn: 'Se connecter',
      orGoogle: 'Ou continuer avec',
      googleBtn: 'Se connecter avec Google',
      noAccount: 'Pas encore de compte ?',
      registerLink: 'Créer un compte',
      invalidCredentials: 'Email ou mot de passe incorrect.',
    },
    es: {
      title: 'Iniciar Sesión',
      subtitle: 'Accede a tus pedidos, direcciones y lista de favoritos',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      submitBtn: 'Iniciar Sesión',
      orGoogle: 'O continuar con',
      googleBtn: 'Continuar con Google',
      noAccount: '¿No tienes una cuenta todavía?',
      registerLink: 'Registrarse',
      invalidCredentials: 'Email o contraseña incorrectos.',
    },
    en: {
      title: 'Customer Login',
      subtitle: 'Access your orders, saved addresses and wishlist',
      email: 'Email address',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      submitBtn: 'Log In',
      orGoogle: 'Or continue with',
      googleBtn: 'Continue with Google',
      noAccount: 'Do not have an account yet?',
      registerLink: 'Sign Up',
      invalidCredentials: 'Invalid email or password.',
    },
  }

  const c = t[locale as keyof typeof t] || t.fr

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setErrorMsg('Veuillez confirmer votre adresse e-mail avant de vous connecter. Vérifiez votre boîte de réception.')
        } else if (
          error.message.toLowerCase().includes('rate limit') ||
          error.message.toLowerCase().includes('too many requests')
        ) {
          setErrorMsg('⏳ Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.')
        } else if (error.message.includes('placeholder') || error.message.includes('fetch failed')) {
          router.push(`/${locale}/account`)
        } else {
          setErrorMsg(c.invalidCredentials)
        }
      } else if (data.user) {
        // Check if admin to redirect appropriately
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
          router.push(`/${locale}/admin`)
        } else {
          router.push(`/${locale}/account`)
        }
      }
    } catch {
      // Local demo fallback
      router.push(`/${locale}/account`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-neutral-50/70 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-10 bg-white rounded-3xl border border-neutral-200/90 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-3">
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-white font-display font-bold text-xl shadow-xs">
              É
            </div>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
            {c.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {c.subtitle}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {c.email}
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="client@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-700">
                {c.password}
              </label>
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-[11px] text-[var(--color-primary-700)] hover:underline font-medium"
              >
                {c.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-sm font-semibold justify-center shadow-sm cursor-pointer mt-2"
          >
            <span>{loading ? 'Connexion en cours...' : c.submitBtn}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-6 border-t border-neutral-100">
          <p className="text-xs text-neutral-600">
            {c.noAccount}{' '}
            <Link
              href={`/${locale}/auth/register`}
              className="font-bold text-[var(--color-primary-700)] hover:underline"
            >
              {c.registerLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
