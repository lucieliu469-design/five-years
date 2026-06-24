import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuestionsWithAnswers } from '@/api/proust'
import { useUpsertProustAnswer } from '@/hooks'
import ProustCard from '@/components/Proust/ProustCard'
import ProustCompare from '@/components/Proust/ProustCompare'
import ProustToolbar from '@/components/Proust/ProustToolbar'
import { Button } from '@/components/ui/button'
import { Eye, Edit3 } from 'lucide-react'

const YEARS = [2026, 2027, 2028, 2029, 2030]

export default function ProustPage() {
  const [year, setYear] = useState(YEARS[0])
  const [mode, setMode] = useState<'edit' | 'compare'>('edit')
  const [isEditing, setIsEditing] = useState(false)
  const upsertAnswer = useUpsertProustAnswer()

  const { data: questions, isLoading } = useQuery({
    queryKey: ['proust', 'withAnswers', year],
    queryFn: () => getQuestionsWithAnswers(year),
  })

  const { data: allQuestions } = useQuery({
    queryKey: ['proust', 'withAnswers', 'all'],
    queryFn: () => getQuestionsWithAnswers(),
    enabled: mode === 'compare',
  })

  const handleSave = (questionId: number, answer: string) => {
    upsertAnswer.mutate({ question_id: questionId, year, answer })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-journal-800">Proust Questionnaire</h1>
          <p className="text-sm text-journal-500 mt-1">
            Reflect on the deeper questions of life
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setMode('edit'); setIsEditing(false) }}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant={mode === 'compare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('compare')}
          >
            <Eye className="w-4 h-4 mr-1" />
            Compare
          </Button>
        </div>
      </div>

      {mode === 'edit' && (
        <ProustToolbar
          year={year}
          yearOptions={YEARS}
          onYearChange={(y) => { setYear(y); setIsEditing(false) }}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          saving={upsertAnswer.isPending}
        />
      )}

      {isLoading ? (
        <div className="text-center py-12 text-journal-400">Loading questions...</div>
      ) : mode === 'edit' ? (
        <div className="space-y-4">
          {questions?.map((q) => (
            <ProustCard
              key={q.id}
              question={q}
              year={year}
              editing={isEditing}
              onSave={handleSave}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {allQuestions?.map((q) => (
            <ProustCompare
              key={q.id}
              questionEn={q.question_en}
              questionCn={q.question_cn}
              answers={q.answers}
              years={YEARS}
            />
          ))}
        </div>
      )}
    </div>
  )
}
