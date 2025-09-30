// Barèmes d'imposition 2024 (estimation pour 2025)
export const TAX_BRACKETS_2024 = [
  { min: 0, max: 11294, rate: 0 },
  { min: 11294, max: 28797, rate: 0.11 },
  { min: 28797, max: 82341, rate: 0.30 },
  { min: 82341, max: 177106, rate: 0.41 },
  { min: 177106, max: Infinity, rate: 0.45 }
]

// Abattements auto-entrepreneur
export const AUTO_ENTREPRENEUR_ABATEMENTS = {
  BIC: 0.50, // 50% d'abattement
  BNC: 0.34  // 34% d'abattement
}

// Abattement forfaitaire pour salaires et traitements (2024)
export const ABATTEMENT_FORFAITAIRE_SALAIRES = {
  TAUX: 0.10, // 10%
  MINIMUM: 448, // Minimum 448€
  MAXIMUM: 13522 // Maximum 13 522€
}

// Types de revenus
export type TypeRevenu = 'salaire' | 'auto_entrepreneur_bic' | 'auto_entrepreneur_bnc' | 'chomage'

export interface Revenu {
  id: string
  date: string
  organisme: string
  type_revenu: TypeRevenu
  montant: number
}

export interface Don {
  id: string
  date: string
  organisme: string
  montant: number
}

export interface TaxCalculationResult {
  revenuImposable: number
  impotBrut: number
  reductionDons: number
  impotNet: number
  tauxMoyenImposition: number
  montantMensuelAMettreDeCote: number
  abattementSalaires: number
  abattementAutoEntrepreneur: number
}

/**
 * Calcule l'abattement forfaitaire pour les salaires et traitements
 */
export function calculateAbattementSalaires(montantBrut: number): number {
  const abattement = montantBrut * ABATTEMENT_FORFAITAIRE_SALAIRES.TAUX
  return Math.min(
    Math.max(abattement, ABATTEMENT_FORFAITAIRE_SALAIRES.MINIMUM),
    ABATTEMENT_FORFAITAIRE_SALAIRES.MAXIMUM
  )
}

/**
 * Calcule le revenu imposable en appliquant les abattements
 */
export function calculateRevenuImposable(revenus: Revenu[]): { 
  revenuImposable: number, 
  abattementSalaires: number, 
  abattementAutoEntrepreneur: number 
} {
  let totalAbattementSalaires = 0
  let totalAbattementAutoEntrepreneur = 0
  
  const revenuImposable = revenus.reduce((total, revenu) => {
    let montantImposable = revenu.montant

    // Application des abattements selon le type de revenu
    if (revenu.type_revenu === 'salaire' || revenu.type_revenu === 'chomage') {
      // Abattement forfaitaire de 10% pour salaires et indemnités chômage
      const abattement = calculateAbattementSalaires(revenu.montant)
      montantImposable = revenu.montant - abattement
      totalAbattementSalaires += abattement
    } else if (revenu.type_revenu === 'auto_entrepreneur_bic') {
      // Abattement de 50% pour BIC
      const abattement = revenu.montant * AUTO_ENTREPRENEUR_ABATEMENTS.BIC
      montantImposable = revenu.montant - abattement
      totalAbattementAutoEntrepreneur += abattement
    } else if (revenu.type_revenu === 'auto_entrepreneur_bnc') {
      // Abattement de 34% pour BNC
      const abattement = revenu.montant * AUTO_ENTREPRENEUR_ABATEMENTS.BNC
      montantImposable = revenu.montant - abattement
      totalAbattementAutoEntrepreneur += abattement
    }

    return total + Math.max(0, montantImposable)
  }, 0)

  return {
    revenuImposable,
    abattementSalaires: totalAbattementSalaires,
    abattementAutoEntrepreneur: totalAbattementAutoEntrepreneur
  }
}

/**
 * Calcule l'impôt brut selon le barème progressif
 */
export function calculateImpotBrut(revenuImposable: number): number {
  let impot = 0

  for (const bracket of TAX_BRACKETS_2024) {
    if (revenuImposable <= bracket.min) break

    const taxableInBracket = Math.min(revenuImposable, bracket.max) - bracket.min
    impot += taxableInBracket * bracket.rate
  }

  return Math.max(0, impot)
}

/**
 * Calcule la réduction d'impôt pour les dons
 * 66% du montant des dons dans la limite de 20% du revenu imposable
 */
export function calculateReductionDons(dons: Don[], revenuImposable: number): number {
  const totalDons = dons.reduce((sum, don) => sum + don.montant, 0)
  const limiteDons = revenuImposable * 0.20 // 20% du revenu imposable
  const donsEligibles = Math.min(totalDons, limiteDons)
  
  return donsEligibles * 0.66 // 66% de réduction
}

/**
 * Calcul complet de l'impôt sur le revenu
 */
export function calculateTax(revenus: Revenu[], dons: Don[]): TaxCalculationResult {
  const { revenuImposable, abattementSalaires, abattementAutoEntrepreneur } = calculateRevenuImposable(revenus)
  const impotBrut = calculateImpotBrut(revenuImposable)
  const reductionDons = calculateReductionDons(dons, revenuImposable)
  const impotNet = Math.max(0, impotBrut - reductionDons)
  
  const tauxMoyenImposition = revenuImposable > 0 ? (impotNet / revenuImposable) * 100 : 0
  const montantMensuelAMettreDeCote = impotNet / 12

  return {
    revenuImposable,
    impotBrut,
    reductionDons,
    impotNet,
    tauxMoyenImposition,
    montantMensuelAMettreDeCote,
    abattementSalaires,
    abattementAutoEntrepreneur
  }
}

/**
 * Groupe les revenus par mois
 */
export function groupRevenusByMonth(revenus: Revenu[]): Record<string, Revenu[]> {
  return revenus.reduce((groups, revenu) => {
    const monthKey = revenu.date.substring(0, 7) // YYYY-MM
    if (!groups[monthKey]) {
      groups[monthKey] = []
    }
    groups[monthKey].push(revenu)
    return groups
  }, {} as Record<string, Revenu[]>)
}

/**
 * Calcule le total des revenus par type
 */
export function calculateRevenusByType(revenus: Revenu[]): Record<TypeRevenu, number> {
  const totals: Record<TypeRevenu, number> = {
    salaire: 0,
    auto_entrepreneur_bic: 0,
    auto_entrepreneur_bnc: 0,
    chomage: 0
  }

  revenus.forEach(revenu => {
    totals[revenu.type_revenu] += revenu.montant
  })

  return totals
}

/**
 * Formate un montant en euros
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(rate: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate / 100)
}