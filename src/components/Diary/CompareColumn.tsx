import { useNavigate } from 'react-router-dom'
import type { DiaryEntry } from '@/types'
import DiaryCard from './DiaryCard'

interface Props {
  year: number
  entry: DiaryEntry | null
}

export default function CompareColumn({ year, entry }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex-1 min-w-0">
      <div className="text-center mb-2">
        <span className="inline-block px-3 py-0.5 bg-journal-200 rounded-full text-xs font-medium text-journal-700">
          {year}
        </span>
      </div>
      {entry ? (
        <button
          className="w-full text-left cursor-pointer group"
          onClick={() => navigate(`/entry/${entry.id}/view`)}
        >
          <div className="group-hover:ring-2 group-hover:ring-journal-300 rounded-xl transition-all">
            <DiaryCard entry={entry} />
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-journal-200 p-6 text-center text-journal-400 font-serif italic">
          No Entry Yet
        </div>
      )}
    </div>
  )
}
