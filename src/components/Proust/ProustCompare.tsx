import type { ProustAnswer } from '@/types'

interface Props {
  questionEn: string
  questionCn: string
  answers: ProustAnswer[]
  years: number[]
}

export default function ProustCompare({ questionEn, questionCn, answers, years }: Props) {
  const answerMap = new Map<number, string>()
  answers.forEach((a) => answerMap.set(a.year, a.answer))

  return (
    <div className="bg-white rounded-xl border border-journal-200 p-5">
      <p className="text-sm font-medium text-journal-800 mb-1">{questionEn}</p>
      <p className="text-xs text-journal-500 italic mb-4">{questionCn}</p>
      <div className="grid grid-cols-5 gap-2">
        {years.map((year) => (
          <div key={year} className="text-center">
            <span className="inline-block px-2 py-0.5 bg-journal-200 rounded-full text-[10px] font-medium text-journal-700 mb-2">
              {year}
            </span>
            <div className="text-xs text-journal-600 writing-body min-h-[60px] p-1">
              {answerMap.has(year) ? (
                <p className="whitespace-pre-wrap">{answerMap.get(year)}</p>
              ) : (
                <p className="text-journal-400 italic">-</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
