'use client'

import { cn } from '@/lib/utils'
import type { AppView } from '@/lib/types'
import { Search, Users, Clock, Zap, Menu, X, Sun, Moon, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const navItems: { id: AppView; label: string; icon: typeof Search }[] = [
  { id: 'dashboard', label: 'Prospectar', icon: Search },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'history', label: 'Histórico', icon: Clock },
  { id: 'settings', label: 'Admin', icon: Settings },
]

interface NavbarProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
}

export default function Navbar({ activeView, onViewChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-surface-1/90 backdrop-blur-xl border-b border-line/50">
      <div className="max-w-[1200px] mx-auto h-full px-4 flex items-center gap-6">
        {/* Logo */}
        <button
          onClick={() => onViewChange('dashboard')}
          className="flex items-center gap-2 shrink-0"
        >
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-[14px] font-semibold text-content-1">LeadTrack</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-surface-3 text-content-1'
                    : 'text-content-3 hover:text-content-2'
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Theme toggle + Mobile hamburger */}
        <div className="flex items-center gap-2 ml-auto">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg text-content-3 hover:text-content-1 hover:bg-surface-3 transition-colors"
              title={isDark ? 'Tema claro' : 'Tema escuro'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5"
          >
            {mobileOpen ? <X className="w-5 h-5 text-content-2" /> : <Menu className="w-5 h-5 text-content-2" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[52px] left-0 right-0 bg-surface-1/95 backdrop-blur-xl border-b border-line/50 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onViewChange(item.id); setMobileOpen(false) }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors',
                activeView === item.id ? 'bg-surface-3 text-content-1' : 'text-content-3'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
