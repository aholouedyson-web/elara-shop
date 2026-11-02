'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="py-12 sm:py-20 bg-neutral-50/50 min-h-screen">
      <div className="container-shop max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1 rounded-full inline-block mb-3">
            Service Client Élara Shop
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            Contactez Notre Équipe
          </h1>
          <p className="text-sm text-neutral-500">
            Une question sur un produit, votre commande ou nos conditions de livraison internationale ? Nous vous répondons sous 24h ouvrées.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-6">
              <h2 className="font-bold text-lg text-neutral-900">Coordonnées</h2>

              <div className="space-y-4 text-xs text-neutral-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Siège & Entrepôt Logistique :</span>
                    <p>Calle Gran Vía 28, 28013 Madrid, España</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Email direct :</span>
                    <a href="mailto:contact@elareshop.com" className="text-[var(--color-primary-700)] hover:underline font-medium">
                      contact@elareshop.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Assistance Téléphonique :</span>
                    <p className="font-medium">+34 900 123 456 (Appel gratuit depuis l'Espagne / UE)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Heures d'ouverture :</span>
                    <p>Du Lundi au Vendredi : 9h00 – 19h00 (CET)</p>
                    <p>Samedi : 10h00 – 14h00 (CET)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-neutral-900">Message Envoyé avec Succès !</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Merci {name}. Un conseiller client d'Élara Shop vous répondra à l'adresse {email} dans les meilleurs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary btn-sm mt-4"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alexandre Martin"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Adresse email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alexandre@example.com"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Objet de votre demande *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Question sur un smartphone, délai de livraison..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Votre message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Bonjour, je souhaiterais des informations complémentaires concernant..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[var(--color-primary-600)] outline-none bg-neutral-50/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-md w-full flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send size={15} />
                    <span>Transmettre mon message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
