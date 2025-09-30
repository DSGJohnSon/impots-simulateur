'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import {
  calculateTax,
  formatEuros,
  calculateRevenusByType,
  type Revenu,
  type Don
} from '@/lib/tax-calculator'
import {
  CurrencyEuroIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  GiftIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [revenus, setRevenus] = useState<Revenu[]>([])
  const [dons, setDons] = useState<Don[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const currentYear = new Date().getFullYear()

      const { data: revenusData, error: revenusError } = await supabase
        .from('revenus')
        .select('*')
        .gte('date', `${currentYear}-01-01`)
        .lte('date', `${currentYear}-12-31`)
        .order('date', { ascending: false })

      if (revenusError) throw revenusError

      const { data: donsData, error: donsError } = await supabase
        .from('dons')
        .select('*')
        .gte('date', `${currentYear}-01-01`)
        .lte('date', `${currentYear}-12-31`)
        .order('date', { ascending: false })

      if (donsError) throw donsError

      setRevenus(revenusData || [])
      setDons(donsData || [])
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRevenu = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce revenu ?')) {
      return
    }

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('revenus')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Mettre à jour la liste locale
      setRevenus(revenus.filter(r => r.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du revenu')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const taxCalculation = calculateTax(revenus, dons)
  const revenusByType = calculateRevenusByType(revenus)
  const totalRevenus = revenus.reduce((sum, r) => sum + r.montant, 0)
  const totalDons = dons.reduce((sum, d) => sum + d.montant, 0)
  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-8">
      {/* En-tête simplifié */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Dashboard {currentYear}
        </h1>
        <p className="text-lg text-foreground-secondary">
          Récapitulatif de vos revenus et simulation d&apos;impôts
        </p>
      </div>

      {/* Métriques principales simplifiées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyEuroIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">Revenus totaux</p>
              <p className="text-2xl font-bold text-foreground">{formatEuros(totalRevenus)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">Impôt estimé</p>
              <p className="text-2xl font-bold text-foreground">{formatEuros(taxCalculation.impotNet)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">À mettre de côté/mois</p>
              <p className="text-2xl font-bold text-foreground">{formatEuros(taxCalculation.montantMensuelAMettreDeCote)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GiftIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">Dons effectués</p>
              <p className="text-2xl font-bold text-foreground">{formatEuros(totalDons)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Répartition des revenus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenusByType).map(([type, amount]) => {
                if (amount === 0) return null
                const percentage = totalRevenus > 0 ? (amount / totalRevenus) * 100 : 0
                const typeLabels = {
                  salaire: 'Salaires',
                  auto_entrepreneur_bic: 'Auto-entrepreneur BIC',
                  auto_entrepreneur_bnc: 'Auto-entrepreneur BNC',
                  chomage: 'Chômage'
                }
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground-secondary">{typeLabels[type as keyof typeof typeLabels]}</span>
                      <span className="text-foreground font-medium">{formatEuros(amount)}</span>
                    </div>
                    <div className="w-full bg-background-secondary rounded-full h-2">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Calcul des impôts avec abattements détaillés */}
        <Card>
          <CardHeader>
            <CardTitle>Calcul des impôts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground-secondary">Revenus bruts</span>
                <span className="text-foreground font-semibold">{formatEuros(totalRevenus)}</span>
              </div>
              
              {taxCalculation.abattementSalaires > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-foreground-secondary">Abattement salaires (10%)</span>
                  <span className="text-success font-semibold">-{formatEuros(taxCalculation.abattementSalaires)}</span>
                </div>
              )}
              
              {taxCalculation.abattementAutoEntrepreneur > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-foreground-secondary">Abattement auto-entrepreneur</span>
                  <span className="text-success font-semibold">-{formatEuros(taxCalculation.abattementAutoEntrepreneur)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground-secondary">Revenu imposable</span>
                <span className="text-foreground font-semibold">{formatEuros(taxCalculation.revenuImposable)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground-secondary">Impôt brut</span>
                <span className="text-foreground font-semibold">{formatEuros(taxCalculation.impotBrut)}</span>
              </div>
              
              {taxCalculation.reductionDons > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-foreground-secondary">Réduction dons (66%)</span>
                  <span className="text-success font-semibold">-{formatEuros(taxCalculation.reductionDons)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-3 border-t border-primary/30">
                <span className="text-foreground font-bold">Impôt net</span>
                <span className="text-xl font-bold text-primary">{formatEuros(taxCalculation.impotNet)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Taux moyen</span>
                <span className="text-primary font-semibold">{taxCalculation.tauxMoyenImposition.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Derniers revenus ajoutés avec possibilité de suppression */}
      {revenus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Derniers revenus ajoutés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Organisme</th>
                    <th>Type</th>
                    <th className="text-right">Montant</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenus.slice(0, 10).map((revenu) => (
                    <tr key={revenu.id}>
                      <td className="text-foreground">
                        {new Date(revenu.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="text-foreground">{revenu.organisme}</td>
                      <td className="text-foreground-secondary">
                        {revenu.type_revenu.replace('_', ' ')}
                      </td>
                      <td className="text-right font-semibold text-primary">
                        {formatEuros(revenu.montant)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteRevenu(revenu.id)}
                          disabled={deletingId === revenu.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer ce revenu"
                        >
                          {deletingId === revenu.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
