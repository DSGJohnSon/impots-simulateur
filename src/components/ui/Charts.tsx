'use client'

import React from 'react'

// Composant pour les barres de progression
interface ProgressBarProps {
  value: number
  max: number
  label: string
  color?: 'primary' | 'accent' | 'secondary'
  className?: string
}

export function ProgressBar({ value, max, label, color = 'primary', className = '' }: ProgressBarProps) {
  const percentage = (value / max) * 100
  const colorClasses = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    secondary: 'bg-accent-secondary'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-card-bg rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Composant pour les graphiques circulaires
interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  label,
  className = ''
}: CircularProgressProps) {
  const percentage = (value / max) * 100
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(59, 130, 246, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</div>
        {label && <div className="text-xs text-gray-400 mt-1">{label}</div>}
      </div>
    </div>
  )
}

// Composant pour les graphiques en ligne simple
interface LineChartProps {
  data: number[]
  labels: string[]
  height?: number
  className?: string
}

export function LineChart({ data, labels, height = 200, className = '' }: LineChartProps) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = ((maxValue - value) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((line) => (
          <line
            key={line}
            x1="0%"
            y1={`${line}%`}
            x2="100%"
            y2={`${line}%`}
            stroke="rgba(59, 130, 246, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Line */}
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          points={points}
          className="drop-shadow-sm"
        />

        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = ((maxValue - value) / range) * 100
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill="#3b82f6"
              className="drop-shadow-lg transition-all duration-300 hover:r-6"
            />
          )
        })}
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  )
}

// Composant pour les barres horizontales
interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  className?: string
}

export function BarChart({ data, className = '' }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className={`space-y-4 ${className}`}>
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{item.label}</span>
              <span className="text-white font-medium">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-card-bg rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.color || 'bg-gradient-to-r from-primary to-accent'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}