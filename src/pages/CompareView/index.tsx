import { useParams, useNavigate } from 'react-router-dom'
import { useCompare } from '@/hooks'
import CompareColumn from '@/components/Diary/CompareColumn'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import dayjs from 'dayjs'

const YEARS = [2026, 2027, 2028, 2029, 2030]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CompareView() {
  const { month, day } = useParams<{ month: string; day: string }>()
  const navigate = useNavigate()
  const m = Number(month)
  const d = Number(day)

  const { data, isLoading } = useCompare(m, d)

  const handlePrevDay = () => {
    const dt = dayjs(`2026-${m}-${d}`).subtract(1, 'day')
    navigate(`/compare/${dt.month() + 1}/${dt.date()}`)
  }

  const handleNextDay = () => {
    const dt = dayjs(`2026-${m}-${d}`).add(1, 'day')
    navigate(`/compare/${dt.month() + 1}/${dt.date()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handlePrevDay}>&larr; Prev</Button>
          <h1 className="text-xl font-serif font-bold text-journal-800 text-center">
            {MONTH_NAMES[m - 1]} {d}
          </h1>
          <Button variant="ghost" size="sm" onClick={handleNextDay}>Next &rarr;</Button>
        </div>
        <div className="w-[100px]" /> {/* spacer */}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-journal-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {data?.years.map((y) => (
            <CompareColumn
              key={y.year}
              year={y.year}
              entry={y.entry}
            />
          ))}
        </div>
      )}
    </div>
  )
}
