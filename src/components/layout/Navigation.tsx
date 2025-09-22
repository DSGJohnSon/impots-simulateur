'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  PlusIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Ajouter un revenu', href: '/add-revenue', icon: PlusIcon },
  { name: 'Vue mensuelle', href: '/monthly', icon: CalendarIcon },
  { name: 'Calculs détaillés', href: '/calculations', icon: ChartBarIcon },
  { name: 'Explications', href: '/explanations', icon: InformationCircleIcon },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="nav-modern sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-105">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                Simulateur <span className="text-gradient">Impôts 2025</span>
              </h1>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 animate-slide-in-right ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-foreground-secondary hover:text-white hover:bg-white/5'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-foreground-secondary">
              <UserIcon className="w-4 h-4" />
              <span>Utilisateur</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center transition-all duration-300 hover:scale-105">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-border">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground-secondary hover:text-white hover:bg-white/5'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}