'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Package, CreditCard, ShieldCheck, RefreshCw } from 'lucide-react'

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      category: 'Expéditions & Délais',
      q: 'D\'où sont expédiées les commandes et vers quels pays livrez-vous ?',
      a: 'Toutes les commandes d\'Élara Shop sont préparées et expédiées depuis nos entrepôts situés à Madrid et Barcelone en Espagne. Nous livrons en Espagne (péninsule et îles), dans tous les pays de l\'Union Européenne (France, Belgique, Allemagne, Italie, Portugal, etc.) ainsi qu\'à l\'international (Royaume-Uni, États-Unis, Canada, Suisse, Maroc...).',
    },
    {
      category: 'Expéditions & Délais',
      q: 'Quels sont les frais et les délais de livraison ?',
      a: 'Pour l\'Espagne, la livraison standard (2-4 jours ouvrés) est de 3,99 € et devient totalement GRATUITE dès 50 € d\'achat. Pour l\'Union Européenne, la livraison standard suivie (3-6 jours ouvrés) est de 7,99 € et offerte dès 120 €. Pour le reste du monde, l\'expédition express suivie est à 18,99 € (5-10 jours ouvrés).',
    },
    {
      category: 'Douanes & Taxes',
      q: 'Y a-t-il des frais de douane pour les livraisons en France et dans l\'UE ?',
      a: 'Non, absolument aucun frais de douane ne s\'applique pour les livraisons au sein de l\'Union Européenne (l\'Espagne faisant partie de l\'espace unique de l\'UE). Le montant réglé lors de votre commande comprend l\'intégralité des taxes. Pour les livraisons hors UE (Suisse, UK, USA...), les formalités douanières et bordereaux CN22/CN23 sont édités en conformité.',
    },
    {
      category: 'Paiements Sécurisés',
      q: 'Quels sont les moyens de paiement acceptés sur Élara Shop ?',
      a: 'Nous acceptons les paiements sécurisés par Cartes Bancaires (Visa, Mastercard, American Express via Stripe) ainsi que PayPal. Toutes les transactions sont chiffrées selon les protocoles SSL 256 bits les plus stricts. Vos coordonnées bancaires ne sont jamais enregistrées sur nos serveurs.',
    },
    {
      category: 'Garantie & Produits',
      q: 'Les produits sont-ils authentiques et bénéficient-ils d\'une garantie ?',
      a: 'Oui, à 100%. Tous nos appareils sont strictement neufs, vendus dans leur emballage d\'origine scellé constructeur. Ils bénéficient de la garantie légale européenne de conformité de 2 ans. Notre service après-vente basé en Espagne assure un accompagnement direct en cas de besoin.',
    },
    {
      category: 'Retours & Remboursements',
      q: 'Puis-je retourner un article si je change d\'avis ?',
      a: 'Tout à fait. Conformément à la législation européenne, vous disposez d\'un délai légal de rétractation de 14 jours francs à compter de la réception de votre colis. L\'article doit être retourné dans son état neuf et son emballage d\'origine pour un remboursement intégral.',
    },
  ]

  return (
    <div className="py-12 sm:py-20 bg-neutral-50/50 min-h-screen">
      <div className="container-shop max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center mx-auto mb-3">
            <HelpCircle size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
            Foire Aux Questions (FAQ)
          </h1>
          <p className="text-sm text-neutral-500">
            Retrouvez les réponses aux questions les plus fréquemment posées par nos clients en Europe et à l'international.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/60"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-700)] block mb-1">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900">
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-neutral-800' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
