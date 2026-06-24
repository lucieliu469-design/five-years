import { useParams } from 'react-router-dom'
import YearCalendar from '@/components/Calendar/YearCalendar'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const YEARS = [2026, 2027, 2028, 2029, 2030]

export default function YearView() {
  const { year: yearParam } = useParams<{ year: string }>()
  const navigate = useNavigate()
  const [year, setYear] = useState(Number(yearParam) || YEARS[0])

  const handleDayClick = (y: number, m: number, d: number) => {
    navigate(`/compare/${m}/${d}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-serif font-bold text-journal-800">Year View</h1>
      </div>
      <YearCalendar year={year} onYearChange={setYear} onDayClick={handleDayClick} />
    </div>
  )
}
