import { useState, useEffect, useRef } from 'react'
import type { ProustQuestionWithAnswers } from '@/types'

interface Props {
  question: ProustQuestionWithAnswers
  year: number
  editing: boolean
  onSave: (questionId: number, answer: string) => void
}

export default function ProustCard({ question, year, editing, onSave }: Props) {
  const currentAnswer = question.answers.find((a) => a.year === year)?.answer || ''
  const [value, setValue] = useState(currentAnswer)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSaved = useRef(currentAnswer)

  useEffect(() => {
    setValue(currentAnswer)
    lastSaved.current = currentAnswer
  }, [currentAnswer])

  useEffect(() => {
    if (!editing) return
    if (value === lastSaved.current) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      onSave(question.id, value)
      lastSaved.current = value
    }, 800)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [value, editing, question.id, onSave])

  const handleBlur = () => {
    if (editing && value !== lastSaved.current) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      onSave(question.id, value)
      lastSaved.current = value
    }
  }

  return (
    <div className="bg-white rounded-xl border border-journal-200 p-5 hover:shadow-sm transition-shadow">
      <div className="mb-3">
        <span className="text-xs text-journal-400 font-mono">#{question.order_index}</span>
        <p className="text-sm font-medium text-journal-800 mt-0.5">{question.question_en}</p>
        <p className="text-xs text-journal-500 mt-1 italic">{question.question_cn}</p>
      </div>

      {editing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          className="w-full min-h-[80px] text-sm p-3 rounded-lg border border-journal-200 focus:ring-2 focus:ring-journal-300 focus:border-transparent resize-y outline-none writing-body"
          placeholder={`Write your answer for ${year}...`}
        />
      ) : (
        <div className="writing-body text-sm text-journal-600">
          {currentAnswer ? (
            <p className="whitespace-pre-wrap">{currentAnswer}</p>
          ) : (
            <p className="text-journal-400 italic">No answer yet for {year}</p>
          )}
        </div>
      )}
    </div>
  )
}
