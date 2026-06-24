import { Edit3, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  year: number
  yearOptions: number[]
  onYearChange: (year: number) => void
  isEditing: boolean
  onToggleEdit: () => void
  saving?: boolean
}

export default function ProustToolbar({
  year,
  yearOptions,
  onYearChange,
  isEditing,
  onToggleEdit,
  saving,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-journal-600">Year:</span>
        <div className="flex gap-1">
          {yearOptions.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                year === y
                  ? 'bg-journal-300 text-white'
                  : 'text-journal-600 hover:bg-journal-100'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
      <Button
        onClick={onToggleEdit}
        size="sm"
        variant={isEditing ? 'default' : 'outline'}
        disabled={saving}
      >
        {isEditing ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Done
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </>
        )}
      </Button>
    </div>
  )
}
