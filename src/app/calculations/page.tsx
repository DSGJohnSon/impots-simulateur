"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import {
  calculateTax,
  formatEuros,
  formatPercentage,
  type Revenu,
  type Don,
} from "@/lib/tax-calculator";
import {
  ChartBarIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function CalculationsPage() {
  const [revenus, setRevenus] = useState<Revenu[]>([]);
  const [dons, setDons] = useState<Don[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const currentYear = new Date().getFullYear();

      const { data: revenusData, error: revenusError } = await supabase
        .from("revenus")
        .select("*")
        .gte("date", `${currentYear}-01-01`)
        .lte("date", `${currentYear}-12-31`)
        .order("date", { ascending: false });

      if (revenusError) throw revenusError;

      const { data: donsData, error: donsError } = await supabase
        .from("dons")
        .select("*")
        .gte("date", `${currentYear}-01-01`)
        .lte("date", `${currentYear}-12-31`)
        .order("date", { ascending: false });

      if (donsError) throw donsError;

      setRevenus(revenusData || []);
      setDons(donsData || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const taxCalculation = calculateTax(revenus, dons);
  const currentYear = new Date().getFullYear();

  // Calcul des montants mensuels à mettre de côté
  const monthsRemaining = 12 - new Date().getMonth();
  const montantMensuelRestant =
    monthsRemaining > 0 ? taxCalculation.impotNet / monthsRemaining : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Calculs détaillés - {currentYear}
        </h1>
        <p className="mt-2 text-gray-600">
          Analyse complète de votre situation fiscale et recommandations
        </p>
      </div>

      {/* Résumé principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <CurrencyEuroIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">
                Impôt total estimé
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatEuros(taxCalculation.impotNet)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">
                À mettre de côté/mois
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatEuros(taxCalculation.montantMensuelAMettreDeCote)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">
                Taux moyen d&apos;imposition
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(taxCalculation.tauxMoyenImposition)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détail du calcul */}
      <Card>
        <CardHeader>
          <CardTitle>Détail du calcul de l&apos;impôt</CardTitle>
          <CardDescription>
            Étapes du calcul selon le barème progressif 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Revenus bruts */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                1. Revenus bruts
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {revenus.length > 0 ? (
                  <>
                    {[
                      "salaire",
                      "auto_entrepreneur_bic",
                      "auto_entrepreneur_bnc",
                      "chomage",
                    ].map((type) => {
                      const typeRevenus = revenus.filter(
                        (r) => r.type_revenu === type
                      );
                      const total = typeRevenus.reduce(
                        (sum, r) => sum + r.montant,
                        0
                      );
                      if (total === 0) return null;

                      const labels = {
                        salaire: "Salaires",
                        auto_entrepreneur_bic: "Auto-entrepreneur BIC",
                        auto_entrepreneur_bnc: "Auto-entrepreneur BNC",
                        chomage: "Indemnités chômage",
                      };

                      return (
                        <div key={type} className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {labels[type as keyof typeof labels]}
                          </span>
                          <span className="text-sm font-medium">
                            {formatEuros(total)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total revenus bruts</span>
                        <span>
                          {formatEuros(
                            revenus.reduce((sum, r) => sum + r.montant, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucun revenu enregistré
                  </p>
                )}
              </div>
            </div>

            {/* Abattements */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                2. Application des abattements
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Auto-entrepreneur BIC (abattement 50%)
                  </span>
                  <span className="text-sm font-medium">
                    -
                    {formatEuros(
                      revenus
                        .filter(
                          (r) => r.type_revenu === "auto_entrepreneur_bic"
                        )
                        .reduce((sum, r) => sum + r.montant * 0.5, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Auto-entrepreneur BNC (abattement 34%)
                  </span>
                  <span className="text-sm font-medium">
                    -
                    {formatEuros(
                      revenus
                        .filter(
                          (r) => r.type_revenu === "auto_entrepreneur_bnc"
                        )
                        .reduce((sum, r) => sum + r.montant * 0.34, 0)
                    )}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Revenu imposable</span>
                    <span>{formatEuros(taxCalculation.revenuImposable)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calcul de l'impôt */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                3. Calcul de l&apos;impôt (barème progressif)
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-semibold mb-2">Barème 2024 :</div>
                <ul className="text-xs text-gray-600 space-y-1 mb-3">
                  <li>• Jusqu&apos;à 11 294 € : 0%</li>
                  <li>• De 11 294 € à 28 797 € : 11%</li>
                  <li>• De 28 797 € à 82 341 € : 30%</li>
                  <li>• De 82 341 € à 177 106 € : 41%</li>
                  <li>• Au-delà de 177 106 € : 45%</li>
                </ul>
                <div className="flex justify-between font-semibold">
                  <span>Impôt brut calculé</span>
                  <span>{formatEuros(taxCalculation.impotBrut)}</span>
                </div>
              </div>
            </div>

            {/* Réductions */}
            {dons.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  4. Réductions d&apos;impôt
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Dons (66% dans la limite de 20% du revenu imposable)
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      -{formatEuros(taxCalculation.reductionDons)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Total des dons :{" "}
                    {formatEuros(dons.reduce((sum, d) => sum + d.montant, 0))}
                  </div>
                </div>
              </div>
            )}

            {/* Résultat final */}
            <div className="border-t pt-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Impôt net à payer
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatEuros(taxCalculation.impotNet)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
          <CardDescription>
            Conseils pour optimiser votre situation fiscale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">
                💰 Épargne mensuelle recommandée
              </h5>
              <p className="text-sm text-green-700">
                Mettez de côté{" "}
                <strong>
                  {formatEuros(taxCalculation.montantMensuelAMettreDeCote)}
                </strong>{" "}
                par mois pour couvrir vos impôts de {currentYear}.
              </p>
              {monthsRemaining > 0 && monthsRemaining < 12 && (
                <p className="text-sm text-green-700 mt-2">
                  Il reste {monthsRemaining} mois dans l&apos;année. Vous devriez
                  mettre de côté{" "}
                  <strong>{formatEuros(montantMensuelRestant)}</strong> par mois
                  pour rattraper le retard.
                </p>
              )}
            </div>

            {taxCalculation.reductionDons <
              taxCalculation.revenuImposable * 0.2 * 0.66 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">
                  🎁 Optimisation par les dons
                </h5>
                <p className="text-sm text-blue-700">
                  Vous pourriez donner jusqu&apos;à{" "}
                  <strong>
                    {formatEuros(taxCalculation.revenuImposable * 0.2)}
                  </strong>
                  et bénéficier d&apos;une réduction d&apos;impôt maximale de{" "}
                  <strong>
                    {formatEuros(taxCalculation.revenuImposable * 0.2 * 0.66)}
                  </strong>
                  .
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Réduction actuelle :{" "}
                  {formatEuros(taxCalculation.reductionDons)}
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Important
              </h5>
              <p className="text-sm text-yellow-700">
                Ces calculs sont basés sur les barèmes 2024 et constituent une
                estimation. Les barèmes définitifs pour 2025 peuvent différer
                légèrement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
