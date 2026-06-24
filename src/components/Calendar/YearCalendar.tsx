import { useNavigate } from 'react-router-dom'
import { useYearCalendar } from '@/hooks'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const YEARS_RANGE = [2026, 2027, 2028, 2029, 2030]

interface Props {
  year: number
  onYearChange: (year: number) => void
  onDayClick: (year: number, month: number, day: number) => void
}

function MonthMiniGrid({ year, month, days, onDayClick }: {
  year: number
  month: number
  days: Map<string, { has_entry: boolean; entry_id: string | null }>
  onDayClick: (year: number, month: number, day: number) => void
}) {
  const navigate = useNavigate()
  const startOfMonth = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
  const startDay = (startOfMonth.day() + 6) % 7
  const daysInMonth = startOfMonth.daysInMonth()

  const cells: React.ReactNode[] = []
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`e-${i}`} className="w-3 h-3" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${month}-${d}`
    const info = days.get(key)
    cells.push(
      <button
        key={d}
        onClick={() => onDayClick(year, month, d)}
        className={cn(
          'w-3 h-3 rounded-sm text-[7px] leading-none flex items-center justify-center transition-colors',
          info?.has_entry
            ? 'bg-journal-400 text-white'
            : 'text-journal-300 hover:bg-journal-100'
        )}
        title={info?.has_entry ? `Entry for ${month}/${d}` : `${month}/${d}`}
      >
        {d}
      </button>
    )
  }

  return (
    <div className="p-2 rounded-lg hover:bg-journal-50/50 transition-colors">
      <p className="text-[11px] font-medium text-journal-600 mb-1.5 text-center">{MONTHS[month - 1]}</p>
      <div className="grid grid-cols-7 gap-[1px] justify-items-center">
        {cells}
      </div>
    </div>
  )
}

export default function YearCalendar({ year, onYearChange, onDayClick }: Props) {
  const { data: days } = useYearCalendar(year)

  const prevYear = () => {
    const idx = YEARS_RANGE.indexOf(year)
    if (idx > 0) onYearChange(YEARS_RANGE[idx - 1])
  }

  const nextYear = () => {
    const idx = YEARS_RANGE.indexOf(year)
    if (idx < YEARS_RANGE.length - 1) onYearChange(YEARS_RANGE[idx + 1])
  }

  const dayMap = new Map<string, { has_entry: boolean; entry_id: string | null }>()
  if (days) {
    days.forEach((d) => {
      dayMap.set(`${d.month}-${d.day}`, { has_entry: d.has_entry, entry_id: d.entry_id })
    })
  }

  return (
    <div className="bg-white rounded-xl border border-journal-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" onClick={prevYear} disabled={year === YEARS_RANGE[0]}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex gap-2">
          {YEARS_RANGE.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                year === y
                  ? 'bg-journal-300 text-white'
                  : 'text-journal-600 hover:bg-journal-100'
              )}
            >
              {y}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={nextYear} disabled={year === YEARS_RANGE[YEARS_RANGE.length - 1]}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((_, mIdx) => (
          <MonthMiniGrid
            key={mIdx}
            year={year}
            month={mIdx + 1}
            days={dayMap}
            onDayClick={onDayClick}
          />
        ))}
      </div>
    </div>
  )
}
