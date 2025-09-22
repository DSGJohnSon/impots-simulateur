import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'metric' | 'chart'
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseClasses = 'overflow-hidden transition-all duration-300'

  const variantClasses = {
    default: 'glass-card',
    metric: 'metric-card',
    chart: 'chart-container'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-border/50 ${className}`}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'gradient'
}

export function CardTitle({ children, className = '', variant = 'default' }: CardTitleProps) {
  const textClasses = variant === 'gradient'
    ? 'text-xl font-bold text-gradient'
    : 'text-xl font-bold text-white'

  return (
    <h3 className={`${textClasses} ${className}`}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`mt-2 text-sm text-gray-400 ${className}`}>
      {children}
    </p>
  )
}

// Nouveau composant pour les métriques
interface MetricProps {
  icon?: ReactNode
  label: string
  value: string
  trend?: string
  className?: string
}

export function Metric({ icon, label, value, trend, className = '' }: MetricProps) {
  return (
    <div className={`flex items-center space-x-4 p-6 rounded-xl glass-card ${className}`}>
      {icon && (
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/10">
            {icon}
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="metric-label">{label}</p>
        <p className="metric-value text-white">{value}</p>
        {trend && (
          <p className="text-sm text-accent font-medium mt-1">{trend}</p>
        )}
      </div>
    </div>
  )
}