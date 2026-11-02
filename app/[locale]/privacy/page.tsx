export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="container-shop max-w-4xl space-y-8 text-neutral-700 text-sm leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1 rounded-full inline-block mb-3">
            Protection des Données Personnelles
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Politique de Confidentialité (RGPD)
          </h1>
          <p className="text-xs text-neutral-400">Dernière mise à jour : 30 Octobre 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">1. Responsable du Traitement</h2>
          <p>
            La boutique en ligne Élara Shop, domiciliée à Madrid (Espagne), s'engage à respecter scrupuleusement la confidentialité de vos données conformément au Règlement Général sur la Protection des Données (RGPD 2016/679 de l'Union Européenne) et à la législation espagnole LOPD-GDD.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">2. Données Collectées & Finalités</h2>
          <p>
            Nous collectons uniquement les informations nécessaires au traitement et à l'acheminement de vos commandes : nom, prénom, adresse email, adresse de livraison, numéro de téléphone (pour les notifications transporteurs) et historique d'achats.
          </p>
          <p className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs">
            <strong>Sécurité des cartes bancaires :</strong> Vos coordonnées bancaires ne sont jamais stockées sur nos serveurs. Elles sont traitées de manière chiffrée et sécurisée directement par nos prestataires agréés de paiement certifiés PCI-DSS (Stripe et PayPal).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-base text-neutral-900">3. Vos Droits d'Accès, de Rectification et d'Oubli</h2>
          <p>
            Conformément aux lois européennes en vigueur, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment par simple email adressé à <a href="mailto:privacy@elareshop.com" className="text-[var(--color-primary-700)] underline font-medium">privacy@elareshop.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
