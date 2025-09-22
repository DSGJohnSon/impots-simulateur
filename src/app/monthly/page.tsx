'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { 
  groupRevenusByMonth, 
  formatEuros, 
  type Revenu 
} from '@/lib/tax-calculator'
import { CalendarDaysIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function MonthlyView() {
  const [revenus, setRevenus] = useState<Revenu[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRevenus()
  }, [])

  const fetchRevenus = async () => {
    try {
      const currentYear = new Date().getFullYear()
      
      const { data, error } = await supabase
        .from('revenus')
        .select('*')
        .gte('date', `${currentYear}-01-01`)
        .lte('date', `${currentYear}-12-31`)
        .order('date', { ascending: false })

      if (error) throw error

      setRevenus(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des revenus:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths)
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey)
    } else {
      newExpanded.add(monthKey)
    }
    setExpandedMonths(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const revenusByMonth = groupRevenusByMonth(revenus)
  const currentYear = new Date().getFullYear()

  // Créer un tableau de tous les mois de l'année
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const monthNumber = (i + 1).toString().padStart(2, '0')
    const monthKey = `${currentYear}-${monthNumber}`
    return {
      key: monthKey,
      name: MONTHS[i],
      revenus: revenusByMonth[monthKey] || []
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Vue mensuelle - {currentYear}
        </h1>
        <p className="mt-2 text-gray-600">
          Détail de vos revenus mois par mois
        </p>
      </div>

      <div className="grid gap-4">
        {allMonths.map((month) => {
          const totalMonth = month.revenus.reduce((sum, r) => sum + r.montant, 0)
          const isExpanded = expandedMonths.has(month.key)
          const hasRevenus = month.revenus.length > 0

          return (
            <Card key={month.key} className={hasRevenus ? '' : 'opacity-60'}>
              <div
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => hasRevenus && toggleMonth(month.key)}
              >
                <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-600" />
                    <CardTitle className="text-lg">{month.name}</CardTitle>
                    {hasRevenus && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({month.revenus.length} revenu{month.revenus.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900 mr-2">
                      {formatEuros(totalMonth)}
                    </span>
                    {hasRevenus && (
                      isExpanded ? 
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" /> :
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {!hasRevenus && (
                  <CardDescription>
                    Aucun revenu enregistré pour ce mois
                  </CardDescription>
                )}
                </CardHeader>
              </div>

              {isExpanded && hasRevenus && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {month.revenus.map((revenu) => (
                      <div 
                        key={revenu.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {revenu.organisme}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(revenu.date).toLocaleDateString('fr-FR')} • {' '}
                                {revenu.type_revenu.replace('_', ' ')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatEuros(revenu.montant)}
                              </p>
                              <TypeBadge type={revenu.type_revenu} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Total du mois
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {formatEuros(totalMonth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Résumé annuel */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé annuel {currentYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {revenus.length}
              </p>
              <p className="text-sm text-gray-600">Revenus enregistrés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatEuros(revenus.reduce((sum, r) => sum + r.montant, 0))}
              </p>
              <p className="text-sm text-gray-600">Total annuel</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatEuros(revenus.reduce((sum, r) => sum + r.montant, 0) / 12)}
              </p>
              <p className="text-sm text-gray-600">Moyenne mensuelle</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(revenusByMonth).length}
              </p>
              <p className="text-sm text-gray-600">Mois avec revenus</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TypeBadge({ type }: { type: string }) {
  const colors = {
    salaire: 'bg-blue-100 text-blue-800',
    auto_entrepreneur_bic: 'bg-green-100 text-green-800',
    auto_entrepreneur_bnc: 'bg-purple-100 text-purple-800',
    chomage: 'bg-orange-100 text-orange-800'
  }

  const labels = {
    salaire: 'Salaire',
    auto_entrepreneur_bic: 'AE BIC',
    auto_entrepreneur_bnc: 'AE BNC',
    chomage: 'Chômage'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {labels[type as keyof typeof labels] || type}
    </span>
  )
}