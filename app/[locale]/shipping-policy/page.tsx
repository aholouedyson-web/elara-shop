import { Truck, MapPin, ShieldCheck, Clock, FileText } from 'lucide-react'

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="container-shop max-w-4xl space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-3 py-1 rounded-full inline-block mb-3">
            Commerce International & Logistique
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            Politique de Livraison & Expéditions Internationales
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Élara Shop est une entreprise immatriculée en Espagne (Union Européenne). Nous expédions quotidiennement vos commandes de matériel électronique vers la France, l'Espagne, l'ensemble de l'Union Européenne et les destinations internationales.
          </p>
        </div>

        {/* Tariffs Table Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-6">
          <h2 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Truck size={20} className="text-[var(--color-primary-700)]" />
            <span>Grille Tarifaire et Délais Indicatifs</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 pr-4">Zone de Destination</th>
                  <th className="py-3 px-4">Transporteurs Partenaires</th>
                  <th className="py-3 px-4">Délai Moyen</th>
                  <th className="py-3 px-4">Frais Standard</th>
                  <th className="py-3 pl-4">Livraison Gratuite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="py-4 pr-4 font-bold text-neutral-900">🇪🇸 Espagne (Péninsule & Baléares)</td>
                  <td className="py-4 px-4 text-neutral-600">Correos Express / SEUR</td>
                  <td className="py-4 px-4 text-neutral-600">2 à 4 jours ouvrés</td>
                  <td className="py-4 px-4 font-bold text-neutral-900">3,99 €</td>
                  <td className="py-4 pl-4 text-emerald-700 font-bold">Dès 50 € d'achats</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-bold text-neutral-900">🇪🇺 France & Union Européenne</td>
                  <td className="py-4 px-4 text-neutral-600">DHL Express / Chronopost / DPD</td>
                  <td className="py-4 px-4 text-neutral-600">3 à 6 jours ouvrés</td>
                  <td className="py-4 px-4 font-bold text-neutral-900">7,99 €</td>
                  <td className="py-4 pl-4 text-emerald-700 font-bold">Dès 120 € d'achats</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-bold text-neutral-900">🌍 Reste du Monde (USA, UK, Suisse...)</td>
                  <td className="py-4 px-4 text-neutral-600">DHL Global / FedEx International</td>
                  <td className="py-4 px-4 text-neutral-600">5 à 10 jours ouvrés</td>
                  <td className="py-4 px-4 font-bold text-neutral-900">18,99 €</td>
                  <td className="py-4 pl-4 text-neutral-500 font-medium">Selon barème poids</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 text-base">1. Préparation et Traitement des Commandes</h3>
            <p>
              Toute commande passée du lundi au vendredi avant 13h00 (CET) est préparée, protégée et expédiée le jour même depuis notre hub logistique situé à Madrid. Les commandes passées le week-end ou les jours fériés légaux espagnols sont expédiées le premier jour ouvré suivant.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 text-base">2. Suivi de Colis en Temps Réel</h3>
            <p>
              Dès la remise de votre colis au transporteur, vous recevez un email automatique contenant votre numéro de suivi unique (tracking number). Vous pouvez également suivre son acheminement à tout moment sur notre page dédiée <a href="/fr/track-order" className="text-[var(--color-primary-700)] underline font-medium">Suivi de commande</a>.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 text-base">3. Formalités Douanières & Taxes pour l'International</h3>
            <p>
              Pour toute livraison au sein de l'Union Européenne (dont la France, la Belgique, l'Italie, etc.), aucune taxe d'importation ni droit de douane n'est exigible. Les prix sont affichés toutes taxes comprises (TTC). Pour les destinations situées hors de l'Espace Économique Européen (Royaume-Uni, Suisse, États-Unis, etc.), les éventuels frais de douane ou taxes locales d'importation sont régis par la législation du pays de destination.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 text-base">4. Emballage Protecteur Haute Sécurité</h3>
            <p>
              Les produits électroniques (smartphones, ordinateurs portables, casques audio) font l'objet d'un sur-emballage renforcé avec calage en matériaux recyclables et scellé inviolable afin d'éliminer tout risque d'avarie lors de l'acheminement international.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
