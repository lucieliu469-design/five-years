import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MonthCalendar from '@/components/Calendar/MonthCalendar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function MonthView() {
  const { year: yearParam, month: monthParam } = useParams<{ year: string; month: string }>()
  const navigate = useNavigate()
  const [year, setYear] = useState(Number(yearParam) || new Date().getFullYear())
  const [month, setMonth] = useState(Number(monthParam) || new Date().getMonth() + 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-serif font-bold text-journal-800">Month View</h1>
      </div>
      <div className="max-w-md">
        <MonthCalendar year={year} month={month} onMonthChange={(y, m) => { setYear(y); setMonth(m) }} />
      </div>
    </div>
  )
}
