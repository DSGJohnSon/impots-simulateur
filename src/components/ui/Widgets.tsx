'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Metric } from './Card'
import { ProgressBar, LineChart, BarChart } from './Charts'
import {
  CurrencyEuroIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

// Widget de métriques principales
interface MainMetricsProps {
  totalRevenus: number
  impotEstime: number
  mensualite: number
  totalDons: number
}

export function MainMetrics({ totalRevenus, impotEstime, mensualite, totalDons }: MainMetricsProps) {
  const formatEuros = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Metric
        icon={<CurrencyEuroIcon className="w-6 h-6 text-primary" />}
        label="Revenus totaux"
        value={formatEuros(totalRevenus)}
        trend="+12%"
        className="animate-fade-in-up"
      />
      <Metric
        icon={<ChartBarIcon className="w-6 h-6 text-accent" />}
        label="Impôt estimé"
        value={formatEuros(impotEstime)}
        trend="-5%"
        className="animate-fade-in-up"
      />
      <Metric
        icon={<CalendarDaysIcon className="w-6 h-6 text-accent-secondary" />}
        label="À mettre de côté/mois"
        value={formatEuros(mensualite)}
        className="animate-fade-in-up"
      />
      <Metric
        icon={<GiftIcon className="w-6 h-6 text-primary" />}
        label="Dons effectués"
        value={formatEuros(totalDons)}
        trend="+8%"
        className="animate-fade-in-up"
      />
    </div>
  )
}

// Widget de répartition des revenus
interface RevenueBreakdownProps {
  salaires: number
  autoEntrepreneurBIC: number
  autoEntrepreneurBNC: number
  chomage: number
}

export function RevenueBreakdown({
  salaires,
  autoEntrepreneurBIC,
  autoEntrepreneurBNC,
  chomage
}: RevenueBreakdownProps) {
  const data = [
    { label: 'Salaires', value: salaires, color: 'bg-primary' },
    { label: 'Auto-entrepreneur BIC', value: autoEntrepreneurBIC, color: 'bg-accent' },
    { label: 'Auto-entrepreneur BNC', value: autoEntrepreneurBNC, color: 'bg-accent-secondary' },
    { label: 'Chômage', value: chomage, color: 'bg-gray-500' },
  ].filter(item => item.value > 0)

  return (
    <Card variant="chart">
      <CardHeader>
        <CardTitle variant="gradient">Revenus par type</CardTitle>
        <CardDescription>Répartition de vos revenus par source</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart data={data} />
      </CardContent>
    </Card>
  )
}

// Widget de calcul des impôts
interface TaxCalculationProps {
  revenuImposable: number
  impotBrut: number
  reductionDons: number
  impotNet: number
  tauxMoyen: number
}

export function TaxCalculation({
  revenuImposable,
  impotBrut,
  reductionDons,
  impotNet,
  tauxMoyen
}: TaxCalculationProps) {
  const formatEuros = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card variant="chart">
      <CardHeader>
        <CardTitle variant="gradient">Calcul des impôts</CardTitle>
        <CardDescription>Estimation basée sur les barèmes 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-gray-300">Revenu imposable</span>
            <span className="text-white font-semibold">{formatEuros(revenuImposable)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-gray-300">Impôt brut</span>
            <span className="text-white font-semibold">{formatEuros(impotBrut)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-gray-300">Réduction dons</span>
            <span className="text-green-400 font-semibold">-{formatEuros(reductionDons)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-primary/30">
            <span className="text-white font-bold">Impôt net</span>
            <span className="text-2xl font-bold text-gradient">{formatEuros(impotNet)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Taux moyen</span>
            <span className="text-accent font-semibold">{tauxMoyen.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Widget de statut du projet (inspiré des screenshots)
interface ProjectStatusProps {
  projectName: string
  totalBudget: number
  budgetUsed: number
  scheduleProgress: number
  riskLevel: 'low' | 'medium' | 'high'
}

export function ProjectStatus({
  projectName,
  totalBudget,
  budgetUsed,
  scheduleProgress,
  riskLevel
}: ProjectStatusProps) {
  const formatEuros = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const riskColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  }

  const riskIcons = {
    low: CheckCircleIcon,
    medium: ExclamationTriangleIcon,
    high: ExclamationTriangleIcon
  }

  const RiskIcon = riskIcons[riskLevel]

  return (
    <Card variant="metric">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{projectName}</h3>
          <RiskIcon className={`w-6 h-6 ${riskColors[riskLevel]}`} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">Budget total</p>
            <p className="text-xl font-bold text-white">{formatEuros(totalBudget)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Budget utilisé</p>
            <p className="text-xl font-bold text-accent">{formatEuros(budgetUsed)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Progression planning</span>
            <span className="text-white">{scheduleProgress}%</span>
          </div>
          <ProgressBar
            value={scheduleProgress}
            max={100}
            label=""
            color="primary"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Widget de sources de financement
interface FundingSourcesProps {
  cashEquity: number
  bankLoan: number
  personalLoan: number
}

export function FundingSources({ cashEquity, bankLoan, personalLoan }: FundingSourcesProps) {
  const data = [
    { label: 'Cash Equity', value: cashEquity },
    { label: 'Bank Loan', value: bankLoan },
    { label: 'Personal Loan', value: personalLoan },
  ]

  return (
    <Card variant="chart">
      <CardHeader>
        <CardTitle variant="gradient">Sources de financement</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={data} />
      </CardContent>
    </Card>
  )
}

// Widget de tendance des revenus
interface RevenueTrendProps {
  monthlyData: number[]
  months: string[]
}

export function RevenueTrend({ monthlyData, months }: RevenueTrendProps) {
  return (
    <Card variant="chart">
      <CardHeader>
        <CardTitle variant="gradient">Évolution des revenus</CardTitle>
        <CardDescription>Tendances mensuelles</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart data={monthlyData} labels={months} height={200} />
      </CardContent>
    </Card>
  )
}