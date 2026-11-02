export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="container-shop max-w-4xl space-y-8 text-neutral-700 text-sm leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1 rounded-full inline-block mb-3">
            Cadre Contractuel Légal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Conditions Générales de Vente (CGV)
          </h1>
          <p className="text-xs text-neutral-400">Édition en vigueur au 30 Octobre 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">1. Objet & Champ d'Application</h2>
          <p>
            Les présentes Conditions Générales de Vente régissent l'ensemble des transactions commerciales conclues sur le site internet <strong>Élara Shop</strong> entre la boutique, basée en Espagne, et tout acheteur particulier ou professionnel agissant à titre privé ou commercial dans le monde entier.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">2. Prix & Devise de Transaction</h2>
          <p>
            Les prix de nos produits sont exprimés en Euros (€) toutes taxes comprises (TTC) pour les pays de l'Union Européenne. Les frais de livraison sont calculés selon le barème officiel avant la validation finale de la commande. Aucun coût additionnel caché n'est facturé.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">3. Conclusion du Contrat & Paiement</h2>
          <p>
            Le contrat de vente est valablement formé dès lors que le client confirme sa commande et procède au règlement sécurisé via Stripe ou PayPal. Un accusé de réception automatique avec le récapitulatif détaillé et le numéro de commande est immédiatement transmis par voie électronique.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">4. Droit Applicable & Litiges</h2>
          <p>
            Les présentes CGV sont soumises au droit espagnol et aux directives protectrices du consommateur de l'Union Européenne. En cas de réclamation, une solution amiable est systématiquement privilégiée par notre service client. À défaut, la plateforme européenne de règlement en ligne des litiges (RLL) reste accessible.
          </p>
        </section>
      </div>
    </div>
  )
}
