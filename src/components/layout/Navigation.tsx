'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  PlusIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Ajouter', href: '/add-revenue', icon: PlusIcon },
  { name: 'Mensuel', href: '/monthly', icon: CalendarIcon },
  { name: 'Calculs', href: '/calculations', icon: ChartBarIcon },
  { name: 'Aide', href: '/explanations', icon: InformationCircleIcon },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3">
                <ChartBarIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Simulateur Impôts
              </h1>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-card-bg-hover'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-card-bg-hover'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}