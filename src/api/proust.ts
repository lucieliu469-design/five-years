import { request } from './request'
import type { ProustQuestion, ProustQuestionWithAnswers, ProustAnswer } from '@/types'

export function getQuestions() {
  return request<ProustQuestion[]>('/proust/questions')
}

export function getQuestionsWithAnswers(year?: number) {
  const qs = year !== undefined ? `?year=${year}` : ''
  return request<ProustQuestionWithAnswers[]>(`/proust/questions/with-answers${qs}`)
}

export function getAnswersForQuestion(questionId: number) {
  return request<ProustAnswer[]>(`/proust/answers/${questionId}`)
}

export function upsertAnswer(data: { question_id: number; year: number; answer: string }) {
  return request<ProustAnswer>('/proust/answers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
