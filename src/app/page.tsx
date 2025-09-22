'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { MainMetrics, RevenueBreakdown, TaxCalculation, ProjectStatus, FundingSources, RevenueTrend } from '@/components/ui/Widgets'
import { supabase } from '@/lib/supabase'
import {
  calculateTax,
  formatEuros,
  calculateRevenusByType,
  type Revenu,
  type Don
} from '@/lib/tax-calculator'

export default function Dashboard() {
  const [revenus, setRevenus] = useState<Revenu[]>([])
  const [dons, setDons] = useState<Don[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const currentYear = new Date().getFullYear()

      // Récupérer les revenus de l'année en cours
      const { data: revenusData, error: revenusError } = await supabase
        .from('revenus')
        .select('*')
        .gte('date', `${currentYear}-01-01`)
        .lte('date', `${currentYear}-12-31`)
        .order('date', { ascending: false })

      if (revenusError) throw revenusError

      // Récupérer les dons de l'année en cours
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    )
  }

  const taxCalculation = calculateTax(revenus, dons)
  const revenusByType = calculateRevenusByType(revenus)
  const totalRevenus = revenus.reduce((sum, r) => sum + r.montant, 0)
  const totalDons = dons.reduce((sum, d) => sum + d.montant, 0)

  const currentYear = new Date().getFullYear()

  // Données simulées pour les widgets inspirés des screenshots
  const monthlyData = [45000, 52000, 48000, 61000, 55000, 67000, 58000, 63000, 59000, 65000, 61000, 68000]
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-6 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-white">Dashboard</span>{' '}
            <span className="text-gradient">Année {currentYear}</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>
        <p className="text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
          Récapitulatif de vos revenus et simulation d&apos;impôts avec analyse avancée
        </p>
      </div>

      {/* Métriques principales */}
      <MainMetrics
        totalRevenus={totalRevenus}
        impotEstime={taxCalculation.impotNet}
        mensualite={taxCalculation.montantMensuelAMettreDeCote}
        totalDons={totalDons}
      />

      {/* Grille de widgets principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in-up">
          <RevenueBreakdown
            salaires={revenusByType.salaire}
            autoEntrepreneurBIC={revenusByType.auto_entrepreneur_bic}
            autoEntrepreneurBNC={revenusByType.auto_entrepreneur_bnc}
            chomage={revenusByType.chomage}
          />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <TaxCalculation
            revenuImposable={taxCalculation.revenuImposable}
            impotBrut={taxCalculation.impotBrut}
            reductionDons={taxCalculation.reductionDons}
            impotNet={taxCalculation.impotNet}
            tauxMoyen={taxCalculation.tauxMoyenImposition}
          />
        </div>
      </div>

      {/* Widgets additionnels inspirés des screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="animate-fade-in-up">
          <ProjectStatus
            projectName="Projet Fiscal 2025"
            totalBudget={totalRevenus}
            budgetUsed={totalRevenus * 0.7}
            scheduleProgress={75}
            riskLevel="low"
          />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <FundingSources
            cashEquity={totalRevenus * 0.4}
            bankLoan={totalRevenus * 0.35}
            personalLoan={totalRevenus * 0.25}
          />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <RevenueTrend
            monthlyData={monthlyData}
            months={months}
          />
        </div>
      </div>

      {/* Derniers revenus ajoutés */}
      {revenus.length > 0 && (
        <Card variant="default" className="animate-fade-in-up">
          <CardHeader>
            <CardTitle variant="gradient">Derniers revenus ajoutés</CardTitle>
            <CardDescription>Les 5 derniers revenus enregistrés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Organisme</th>
                    <th>Type</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {revenus.slice(0, 5).map((revenu, index) => (
                    <tr key={revenu.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-in-right">
                      <td className="text-white">
                        {new Date(revenu.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="text-white">{revenu.organisme}</td>
                      <td className="text-foreground-secondary">
                        {revenu.type_revenu.replace('_', ' ')}
                      </td>
                      <td className="font-semibold text-accent">
                        {formatEuros(revenu.montant)}
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
