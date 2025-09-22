'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { 
  InformationCircleIcon, 
  CalculatorIcon, 
  CurrencyEuroIcon,
  GiftIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

export default function ExplanationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Explications des calculs
        </h1>
        <p className="mt-2 text-gray-600">
          Comprendre comment sont calculés vos impôts sur le revenu
        </p>
      </div>

      {/* Vue d'ensemble */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InformationCircleIcon className="w-5 h-5 mr-2" />
            Vue d&apos;ensemble
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Cette application calcule votre impôt sur le revenu en suivant les règles fiscales françaises. 
              Le calcul se déroule en plusieurs étapes pour tenir compte de vos différents types de revenus 
              et des abattements applicables.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Important :</strong> Les calculs sont basés sur les barèmes 2024 comme estimation pour 2025. 
                Les barèmes définitifs pour 2025 seront publiés par l&apos;administration fiscale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Étapes du calcul */}
      <div className="grid gap-6">
        {/* Étape 1 : Revenus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CurrencyEuroIcon className="w-5 h-5 mr-2 text-green-600" />
              Étape 1 : Collecte des revenus
            </CardTitle>
            <CardDescription>
              Tous vos revenus de l&apos;année sont pris en compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Types de revenus supportés :</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Salaires :</strong> Revenus de vos emplois salariés (Entreprise 1, Entreprise 2)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Auto-entrepreneur BIC :</strong> Revenus de prestations de services commerciales
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Auto-entrepreneur BNC :</strong> Revenus de prestations de services libérales
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Indemnités chômage :</strong> Allocations versées par France Travail
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étape 2 : Abattements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalculatorIcon className="w-5 h-5 mr-2 text-blue-600" />
              Étape 2 : Application des abattements
            </CardTitle>
            <CardDescription>
              Réduction du revenu imposable selon le type d&apos;activité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Abattements auto-entrepreneur :</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <h5 className="font-medium text-green-800">BIC (Bénéfices Industriels et Commerciaux)</h5>
                    <p className="text-sm text-green-700 mt-1">
                      <strong>Abattement : 50%</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Pour les prestations de services commerciales, vente de marchandises, etc.
                    </p>
                  </div>
                  <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                    <h5 className="font-medium text-purple-800">BNC (Bénéfices Non Commerciaux)</h5>
                    <p className="text-sm text-purple-700 mt-1">
                      <strong>Abattement : 34%</strong>
                    </p>
                    <p className="text-xs text-purple-600 mt-2">
                      Pour les prestations de services libérales, conseil, formation, etc.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Exemple :</strong> Si vous avez 10 000 € de revenus BIC, seuls 5 000 € (10 000 € - 50%) 
                  seront soumis à l&apos;impôt sur le revenu.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étape 3 : Barème progressif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-purple-600" />
              Étape 3 : Application du barème progressif
            </CardTitle>
            <CardDescription>
              Calcul de l&apos;impôt selon les tranches d&apos;imposition 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Barème progressif 2024 (célibataire) :</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Tranche de revenus
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Taux d&apos;imposition
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">Jusqu&apos;à 11 294 €</td>
                        <td className="px-4 py-2 text-sm font-medium text-green-600">0%</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">De 11 294 € à 28 797 €</td>
                        <td className="px-4 py-2 text-sm font-medium text-blue-600">11%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">De 28 797 € à 82 341 €</td>
                        <td className="px-4 py-2 text-sm font-medium text-orange-600">30%</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">De 82 341 € à 177 106 €</td>
                        <td className="px-4 py-2 text-sm font-medium text-red-600">41%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">Au-delà de 177 106 €</td>
                        <td className="px-4 py-2 text-sm font-medium text-red-800">45%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 mb-2">Comment ça marche ?</h5>
                <p className="text-sm text-yellow-700 mb-2">
                  L&apos;impôt est calculé par tranches. Chaque euro est imposé au taux de sa tranche.
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>Exemple :</strong> Avec 30 000 € de revenu imposable :
                </p>
                <ul className="text-xs text-yellow-600 mt-2 ml-4 space-y-1">
                  <li>• 11 294 € × 0% = 0 €</li>
                  <li>• (28 797 - 11 294) € × 11% = 1 925 €</li>
                  <li>• (30 000 - 28 797) € × 30% = 361 €</li>
                  <li>• <strong>Total : 2 286 €</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étape 4 : Réductions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GiftIcon className="w-5 h-5 mr-2 text-red-600" />
              Étape 4 : Réductions d&apos;impôt
            </CardTitle>
            <CardDescription>
              Les dons permettent de réduire directement l&apos;impôt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Réduction pour dons :</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-red-800">Taux de réduction</h5>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>66%</strong> du montant des dons
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-800">Plafond</h5>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>20%</strong> du revenu imposable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">Exemple concret :</h5>
                <p className="text-sm text-green-700 mb-2">
                  Avec un revenu imposable de 50 000 € :
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Plafond des dons : 50 000 € × 20% = 10 000 €</li>
                  <li>• Don de 1 000 € → Réduction : 1 000 € × 66% = 660 €</li>
                  <li>• Votre don ne vous coûte réellement que 340 €</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conseils pratiques */}
        <Card>
          <CardHeader>
            <CardTitle>Conseils pratiques</CardTitle>
            <CardDescription>
              Optimisez votre situation fiscale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">💰 Épargne préventive</h5>
                  <p className="text-sm text-blue-700">
                    Mettez de côté chaque mois 1/12ème de votre impôt estimé pour éviter 
                    les mauvaises surprises au moment de la déclaration.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 mb-2">🎁 Optimisation par les dons</h5>
                  <p className="text-sm text-green-700">
                    Les dons sont un excellent moyen de réduire vos impôts tout en soutenant 
                    des causes qui vous tiennent à cœur.
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="font-medium text-purple-800 mb-2">📊 Suivi régulier</h5>
                  <p className="text-sm text-purple-700">
                    Mettez à jour vos revenus régulièrement pour avoir une estimation 
                    précise de vos impôts tout au long de l&apos;année.
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="font-medium text-orange-800 mb-2">⚖️ Conseil professionnel</h5>
                  <p className="text-sm text-orange-700">
                    Pour des situations complexes, n&apos;hésitez pas à consulter un expert-comptable
                    ou un conseiller fiscal.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avertissements */}
        <Card>
          <CardHeader>
            <CardTitle>Avertissements importants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Estimation uniquement :</strong> Cette application fournit une estimation 
                  basée sur les barèmes 2024. Les calculs réels peuvent différer selon votre situation 
                  personnelle complète.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>📋 Déclaration officielle :</strong> Cette estimation ne remplace pas 
                  votre déclaration d&apos;impôts officielle sur impots.gouv.fr.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>🔄 Barèmes 2025 :</strong> Les barèmes définitifs pour 2025 seront 
                  publiés par l&apos;administration fiscale. Cette application sera mise à jour
                  en conséquence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}