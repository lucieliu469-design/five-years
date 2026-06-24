import { useNavigate } from 'react-router-dom'
import { useMonthCalendar } from '@/hooks'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'

interface Props {
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
  compact?: boolean
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function MonthCalendar({ year, month, onMonthChange, compact = false }: Props) {
  const { data: days } = useMonthCalendar(year, month)
  const navigate = useNavigate()

  const prevMonth = () => {
    if (month === 1) onMonthChange(year - 1, 12)
    else onMonthChange(year, month - 1)
  }

  const nextMonth = () => {
    if (month === 12) onMonthChange(year + 1, 1)
    else onMonthChange(year, month + 1)
  }

  const startOfMonth = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
  const startDay = (startOfMonth.day() + 6) % 7 // Mon=0
  const daysInMonth = startOfMonth.daysInMonth()

  const dayMap = new Map<number, { has_entry: boolean; entry_id: string | null }>()
  if (days) {
    days.forEach((d) => dayMap.set(d.day, { has_entry: d.has_entry, entry_id: d.entry_id }))
  }

  const handleDayClick = (d: number) => {
    if (compact) return // handled by parent
    const info = dayMap.get(d)
    if (info?.entry_id) {
      navigate(`/entry/${info.entry_id}`)
    } else {
      navigate(`/entry/new?year=${year}&month=${month}&day=${d}`)
    }
  }

  const cells: React.ReactNode[] = []
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const info = dayMap.get(d)
    const today = dayjs()
    const isToday = today.year() === year && today.month() + 1 === month && today.date() === d

    cells.push(
      <button
        key={d}
        onClick={() => handleDayClick(d)}
        className={cn(
          'relative w-full aspect-square flex flex-col items-center justify-center rounded-md text-sm transition-colors hover:bg-journal-100',
          isToday && 'ring-2 ring-journal-400',
          compact && 'cursor-default'
        )}
      >
        <span className={cn(isToday && 'font-bold text-journal-700')}>{d}</span>
        {info?.has_entry && (
          <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-journal-400" />
        )}
      </button>
    )
  }

  const displayMonth = startOfMonth.format('MMMM YYYY')

  return (
    <div className="bg-white rounded-xl border border-journal-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-serif font-medium text-journal-800">{displayMonth}</span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs text-journal-400 font-medium py-1">
            {compact ? w.charAt(0) : w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">{cells}</div>
    </div>
  )
}
