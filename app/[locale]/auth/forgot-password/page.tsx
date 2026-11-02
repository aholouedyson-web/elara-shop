'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const t = {
    fr: {
      title: 'Mot de passe oublié ?',
      subtitle: 'Saisissez votre adresse email pour recevoir un lien de réinitialisation sécurisé.',
      email: 'Adresse e-mail',
      submitBtn: 'Envoyer le lien de réinitialisation',
      backToLogin: 'Retour à la page de connexion',
      successTitle: 'Lien envoyé avec succès !',
      successDesc: 'Veuillez vérifier votre boîte de réception. Si un compte existe avec cette adresse, un lien vous permettant de redéfinir votre mot de passe vous a été envoyé.',
    },
    es: {
      title: '¿Olvidaste tu contraseña?',
      subtitle: 'Introduce tu correo electrónico para recibir un enlace seguro de restablecimiento.',
      email: 'Correo electrónico',
      submitBtn: 'Enviar enlace de restablecimiento',
      backToLogin: 'Volver a iniciar sesión',
      successTitle: '¡Enlace enviado con éxito!',
      successDesc: 'Por favor, comprueba tu bandeja de entrada. Te hemos enviado las instrucciones para restablecer tu contraseña.',
    },
    en: {
      title: 'Forgot your password?',
      subtitle: 'Enter your registered email address to receive a secure password reset link.',
      email: 'Email address',
      submitBtn: 'Send password reset link',
      backToLogin: 'Back to login',
      successTitle: 'Reset link dispatched!',
      successDesc: 'Please check your inbox. If an account is registered with this email, you will receive password reset instructions.',
    },
  }

  const c = t[locale as keyof typeof t] || t.fr

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/reset-password`,
      })

      if (error && !error.message.includes('placeholder')) {
        setErrorMsg(error.message)
      } else {
        setSent(true)
      }
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 bg-neutral-50/70 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-10 bg-white rounded-3xl border border-neutral-200/90 shadow-lg">
        {sent ? (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900">
              {c.successTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              {c.successDesc}
            </p>
            <div className="pt-4">
              <Link
                href={`/${locale}/auth/login`}
                className="btn btn-primary w-full py-3 text-xs sm:text-sm font-semibold justify-center"
              >
                {c.backToLogin}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center mx-auto mb-3">
                <Mail size={22} />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                {c.title}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                {c.subtitle}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-xs sm:text-sm font-semibold justify-center shadow-sm cursor-pointer"
              >
                <span>{loading ? 'Envoi en cours...' : c.submitBtn}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-neutral-100">
              <Link
                href={`/${locale}/auth/login`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft size={14} />
                <span>{c.backToLogin}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
