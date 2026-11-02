import { RefreshCw, CheckCircle2, ShieldCheck, Mail } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="container-shop max-w-4xl space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1 rounded-full inline-block mb-3">
            Garantie & Rétractation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            Politique de Retours et Remboursements
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Votre satisfaction est notre priorité absolue. Si un article ne correspond pas pleinement à vos attentes, découvrez ci-dessous nos conditions de retour simples, rapides et conformes au droit de la consommation de l'Union Européenne.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary-700)] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-neutral-900">Délai de 14 Jours</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Vous disposez de 14 jours calendaires dès réception de votre colis pour nous notifier votre souhait de retour.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary-700)] text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm text-neutral-900">État du Produit</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              L'article doit être dans son état d'origine, complet avec tous ses accessoires, notices et emballages intacts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary-700)] text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm text-neutral-900">Remboursement Intégral</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Remboursement sous 3 à 5 jours ouvrés sur le moyen de paiement utilisé lors de l'achat (Stripe ou PayPal).
            </p>
          </div>
        </div>

        {/* Details section */}
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 text-base">Procédure de Demande de Retour</h3>
            <p>
              Pour initier un retour, contactez notre équipe par email à <a href="mailto:contact@elareshop.com" className="text-[var(--color-primary-700)] underline font-medium">contact@elareshop.com</a> en mentionnant votre numéro de commande (ex: EL2410...). Notre équipe vous délivrera sous 24h un numéro d'autorisation de retour (RMA) ainsi que l'adresse de notre centre de réception situé en Espagne.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 text-base">Garantie Légale de Conformité de 2 Ans</h3>
            <p>
              Tous les produits électroniques commercialisés sur Élara Shop bénéficient de la garantie européenne légale de 2 ans contre les vices cachés et défauts de conformité. En cas de panne matérielle couverte par la garantie, le produit sera réparé ou remplacé à nos frais.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
