import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MonthCalendar from '@/components/Calendar/MonthCalendar'
import YearCalendar from '@/components/Calendar/YearCalendar'
import { BookOpen, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'

const YEARS = [2026, 2027, 2028, 2029, 2030]

export default function Dashboard() {
  const now = dayjs()
  const [year, setYear] = useState(now.year())
  const [month, setMonth] = useState(now.month() + 1)
  const navigate = useNavigate()

  const handleDayClick = (y: number, m: number, d: number) => {
    navigate(`/compare/${m}/${d}`)
  }

  const goToToday = () => {
    navigate(`/entry/new?year=${now.year()}&month=${now.month() + 1}&day=${now.date()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-journal-800">Journal</h1>
          <p className="text-sm text-journal-500 mt-1">
            A personal diary for the five years of 2026-2030
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={goToToday}>
            <BookOpen className="w-4 h-4 mr-2" />
            Write Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MonthCalendar
            year={year}
            month={month}
            onMonthChange={(y, m) => {
              setYear(y)
              setMonth(m)
            }}
          />
        </div>
        <div className="lg:col-span-2">
          <YearCalendar
            year={year}
            onYearChange={setYear}
            onDayClick={handleDayClick}
          />
        </div>
      </div>
    </div>
  )
}
