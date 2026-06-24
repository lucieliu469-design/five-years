import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CalendarDays, BookOpen, FileText, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const todayLink = useMemo(() => {
    const now = dayjs()
    return `/entry/new?year=${now.year()}&month=${now.month() + 1}&day=${now.date()}`
  }, [])

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: todayLink, label: 'Write', icon: BookOpen },
    { path: '/proust', label: 'Proust', icon: FileText },
  ]

  const isActive = (label: string) => {
    if (label === 'Dashboard') return location.pathname === '/'
    if (label === 'Write') return location.pathname.startsWith('/entry')
    if (label === 'Proust') return location.pathname.startsWith('/proust')
    return false
  }

  return (
    <div className="min-h-screen bg-journal-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-journal-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-journal-500" />
            <span className="font-serif font-bold text-lg text-journal-800">Five Years Journal</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                  isActive(item.label)
                    ? 'bg-journal-100 text-journal-700 font-medium'
                    : 'text-journal-600 hover:bg-journal-50'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
