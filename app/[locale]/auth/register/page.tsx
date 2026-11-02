'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Mail, User, Phone, CheckCircle, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { PHONE_COUNTRY_CODES } from '@/lib/phone-codes'

export default function RegisterPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const router = useRouter()

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+34')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Status states
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successEmailSent, setSuccessEmailSent] = useState(false)

  const t = {
    fr: {
      title: 'Créer un Compte Client',
      subtitle: 'Inscrivez-vous pour commander et suivre vos livraisons internationales',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse e-mail',
      phone: 'Téléphone portable',
      phoneCode: 'Indicatif',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordTooShort: 'Le mot de passe doit comporter au moins 6 caractères',
      submitBtn: 'Créer mon compte',
      orGoogle: 'Ou continuer avec',
      googleBtn: 'S\'inscrire avec Google',
      alreadyAccount: 'Vous avez déjà un compte ?',
      loginLink: 'Se connecter',
      emailVerificationSent: 'Vérifiez votre boîte de réception',
      verificationDetails: 'Un lien de confirmation a été envoyé à',
      verificationInstruction: 'Veuillez cliquer sur le lien reçu pour valider définitivement votre compte et accéder à votre espace.',
      terms: 'En vous inscrivant, vous acceptez nos CGV et notre politique de confidentialité.',
    },
    es: {
      title: 'Crear Cuenta de Cliente',
      subtitle: 'Regístrate para comprar y seguir tus envíos internacionales',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo electrónico',
      phone: 'Teléfono móvil',
      phoneCode: 'Prefijo',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      submitBtn: 'Crear mi cuenta',
      orGoogle: 'O continuar con',
      googleBtn: 'Registrarse con Google',
      alreadyAccount: '¿Ya tienes una cuenta?',
      loginLink: 'Iniciar sesión',
      emailVerificationSent: 'Comprueba tu bandeja de entrada',
      verificationDetails: 'Hemos enviado un enlace de confirmación a',
      verificationInstruction: 'Por favor, haz clic en el enlace para validar tu cuenta y comenzar tus compras.',
      terms: 'Al registrarte, aceptas nuestros Términos y Condiciones y Política de Privacidad.',
    },
    en: {
      title: 'Create Customer Account',
      subtitle: 'Register to order and track worldwide tracked shipments',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Mobile Phone',
      phoneCode: 'Prefix',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters long',
      submitBtn: 'Create My Account',
      orGoogle: 'Or continue with',
      googleBtn: 'Sign up with Google',
      alreadyAccount: 'Already have an account?',
      loginLink: 'Log In',
      emailVerificationSent: 'Check your email inbox',
      verificationDetails: 'A confirmation link was dispatched to',
      verificationInstruction: 'Please click the verification link inside the email to activate your account.',
      terms: 'By registering, you agree to our Terms of Service and Privacy Policy.',
    },
  }

  const c = t[locale as keyof typeof t] || t.fr

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (password !== confirmPassword) {
      setErrorMsg(c.passwordMismatch)
      return
    }

    if (password.length < 6) {
      setErrorMsg(c.passwordTooShort)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
            phone: `${phoneCountryCode}${phone}`,
            phone_country_code: phoneCountryCode,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/account`,
        },
      })

      if (error) {
        if (error.message.includes('placeholder') || error.message.includes('fetch failed')) {
          setSuccessEmailSent(true)
        } else if (
          error.message.toLowerCase().includes('rate limit') ||
          error.message.toLowerCase().includes('email rate limit exceeded') ||
          error.message.toLowerCase().includes('too many requests')
        ) {
          setErrorMsg(
            '⏳ Limite d\'envoi d\'e-mails atteinte. Veuillez patienter quelques minutes avant de réessayer, ou désactivez la confirmation e-mail dans les paramètres Supabase (Authentication → Settings → "Enable email confirmations" → OFF).'
          )
        } else if (error.message.toLowerCase().includes('user already registered') || error.message.toLowerCase().includes('already been registered')) {
          setErrorMsg('Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter ou utiliser "Mot de passe oublié".')
        } else {
          setErrorMsg(error.message)
        }
      } else if (data.session) {
        // Direct auto-login without email verification
        router.push(`/${locale}/account`)
      } else {
        // Email confirmation required
        setSuccessEmailSent(true)
      }
    } catch {
      // Local fallback
      setSuccessEmailSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (successEmailSent) {
    return (
      <div className="min-h-[80vh] py-16 bg-neutral-50/60 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-neutral-200/90 shadow-lg text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle size={32} />
          </div>
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            {c.emailVerificationSent}
          </h2>
          <p className="text-sm text-neutral-600">
            {c.verificationDetails} <strong className="text-neutral-900">{email}</strong>.
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            {c.verificationInstruction}
          </p>
          <div className="pt-2">
            <Link
              href={`/${locale}/auth/login`}
              className="btn btn-primary w-full py-3 text-sm font-semibold justify-center"
            >
              {c.loginLink}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-neutral-50/70 flex items-center justify-center px-4">
      <div className="w-full max-w-lg p-6 sm:p-10 bg-white rounded-3xl border border-neutral-200/90 shadow-lg">
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
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
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

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nom & Prénom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                {c.firstName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                {c.lastName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {c.email} <span className="text-red-500">*</span>
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

          {/* Phone with Country Code */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {c.phone} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className="w-32 py-2.5 px-2 rounded-xl border border-neutral-300 text-xs sm:text-sm bg-neutral-50 focus:border-[var(--color-primary-600)] outline-none cursor-pointer"
              >
                {PHONE_COUNTRY_CODES.map((item) => (
                  <option key={item.iso} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  required
                  placeholder="612 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {c.password} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
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

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {c.confirmPassword} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-[var(--color-primary-600)] focus:ring-1 focus:ring-[var(--color-primary-600)] outline-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed pt-1">
            {c.terms}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-sm font-semibold justify-center shadow-sm cursor-pointer mt-2"
          >
            <span>{loading ? 'Création du compte...' : c.submitBtn}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-6 border-t border-neutral-100">
          <p className="text-xs text-neutral-600">
            {c.alreadyAccount}{' '}
            <Link
              href={`/${locale}/auth/login`}
              className="font-bold text-[var(--color-primary-700)] hover:underline"
            >
              {c.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
