'use client'

import { useState } from 'react'
import { GraduationCap, BookOpen, Layers, Menu, X, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Уроки', href: '/lessons', icon: BookOpen },
  { label: 'Повторение', href: '/review', icon: Layers },
  { label: 'Мясорубка', href: '/drill', icon: Flame },
]

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-3xl mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo + name */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <GraduationCap className="h-4.5 w-4.5 text-emerald-600" />
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight">
            ЕГЭ Русский
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="sm:hidden border-t bg-white px-4 pb-4 pt-2 space-y-1">
          {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
          ))}
        </nav>
      )}
    </header>
  )
}
