import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Globe, Truck, Sparkles, Award, Heart } from 'lucide-react'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const content = {
    es: {
      badge: 'Nuestra Historia',
      title: 'Pasión por la tecnología de élite, nacida en España para el mundo entero',
      intro: 'Élara Shop nació en Madrid con una meta clara: redefinir la experiencia de compra de dispositivos electrónicos de alta gama ofreciendo autenticidad, rapidez y atención al cliente impecable.',
      block1Title: 'Selección Rigurosa & Calidad Sin Compromiso',
      block1Text: 'No vendemos miles de referencias genéricas. Nuestro equipo de ingenieros prueba y analiza cada smartphone, ultrabook y accesorio para garantizar una fiabilidad técnica y un diseño de primer nivel.',
      block2Title: 'Logística Europea Eficiente',
      block2Text: 'Ubicados estratégically en España, nuestros almacenes gestionan el envío diario con empaquetado reforzado hacia toda Europa y destinos internacionales.',
      valuesTitle: 'Los Valores que nos Guían',
      values: [
        { icon: ShieldCheck, title: 'Transparencia Total', desc: 'Precios en euros claros con todos los impuestos y opciones de envío sin costes ocultos.' },
        { icon: Globe, title: 'Vocación Internacional', desc: 'Soporte multilingüe en español, francés e inglés, facilitando tus pedidos desde cualquier país.' },
        { icon: Award, title: '2 Años de Garantía', desc: 'Tranquilidad asegurada con soporte directo y servicio técnico cualificado.' },
      ],
      cta: 'Explorar el catálogo',
    },
    fr: {
      badge: 'Notre Histoire',
      title: 'La passion de la haute technologie, née en Espagne pour les passionnés du monde entier',
      intro: 'Élara Shop a vu le jour avec une ambition claire : sublimer l\'expérience d\'achat d\'équipements électroniques haut de gamme en alliant excellence esthétique, authenticité certifiée et rapidité d\'expédition.',
      block1Title: 'Une Sélection Exigeante & Sans Compromis',
      block1Text: 'Nous refusons l\'abondance de produits sans saveur. Chaque smartphone, ordinateur ou casque audio présent dans notre catalogue a été rigoureusement testé pour ses performances brutes et sa longévité.',
      block2Title: 'Logistique & Expéditions depuis l\'Espagne',
      block2Text: 'Implanté à Madrid et Barcelone, notre centre de préparation conditionne vos commandes avec un soin méticuleux pour garantir une remise en main propre sécurisée partout en France, en Europe et à l\'international.',
      valuesTitle: 'Nos Engagements au Quotidien',
      values: [
        { icon: ShieldCheck, title: 'Transparence & Rigueur', desc: 'Prix nets en euros, taxes incluses et frais de transport clairement détaillés sans mauvaise surprise.' },
        { icon: Globe, title: 'Service International', desc: 'Équipe multilingue dédiée prête à vous accompagner en français, espagnol et anglais.' },
        { icon: Award, title: 'Garantie Européenne 2 Ans', desc: 'Tous nos articles neufs bénéficient de la garantie légale de conformité de deux années.' },
      ],
      cta: 'Découvrir la boutique',
    },
    en: {
      badge: 'Our Story',
      title: 'A passion for refined technology, crafted in Spain for discerning customers worldwide',
      intro: 'Élara Shop was founded in Madrid with a simple vision: to elevate e-commerce standards for cutting-edge electronics through curated quality, lightning-fast fulfillment, and genuine customer care.',
      block1Title: 'Uncompromising Curation & Quality',
      block1Text: 'We do not sell endless catalog filler. Every phone, laptop, and acoustic set is handpicked and verified by our tech team for performance, aesthetic integrity, and longevity.',
      block2Title: 'Strategic European Logistics',
      block2Text: 'Positioned in Spain, our modern fulfillment hub prepares each parcel with shock-resistant packaging for safe transit across Europe and worldwide.',
      valuesTitle: 'Our Guiding Principles',
      values: [
        { icon: ShieldCheck, title: 'Total Transparency', desc: 'Fair, transparent pricing in Euros with explicitly stated shipping tariffs and no hidden fees.' },
        { icon: Globe, title: 'Global Outlook', desc: 'Full multilingual platform and support staff fluent in Spanish, French, and English.' },
        { icon: Award, title: '2-Year Full EU Warranty', desc: 'Direct manufacturer-grade coverage for complete peace of mind.' },
      ],
      cta: 'Explore our catalog',
    },
  }

  const c = content[locale as keyof typeof content] || content.es

  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="container-shop max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1.5 rounded-full inline-block">
            {c.badge}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
            {c.title}
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {c.intro}
          </p>
        </div>

        {/* Highlight Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80"
            alt="Élara Shop Headquarters and Tech Studio"
            fill
            className="object-cover"
          />
        </div>

        {/* Narrative Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <h3 className="font-display font-bold text-xl text-neutral-900">{c.block1Title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{c.block1Text}</p>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <h3 className="font-display font-bold text-xl text-neutral-900">{c.block2Title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{c.block2Text}</p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-8 pt-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 text-center">
            {c.valuesTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {c.values.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={i} className="p-6 rounded-2xl border border-neutral-200/90 bg-white space-y-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center mx-auto sm:mx-0">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-bold text-base text-neutral-900">{v.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href={`/${locale}/shop`} className="btn btn-primary btn-lg shadow-md inline-flex">
            {c.cta}
          </Link>
        </div>
      </div>
    </div>
  )
}
