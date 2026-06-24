import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEntries, getEntry, createEntry, updateEntry, deleteEntry } from '@/api/diary'
import { getMonthCalendar, getYearCalendar } from '@/api/calendar'
import { compareEntries } from '@/api/compare'
import { getQuestions, getQuestionsWithAnswers, upsertAnswer } from '@/api/proust'
import { uploadFile, deleteAttachment } from '@/api/upload'
import type { CreateEntryData, UpdateEntryData } from '@/types'

export function useMonthCalendar(year: number, month: number) {
  return useQuery({
    queryKey: ['calendar', 'month', year, month],
    queryFn: () => getMonthCalendar(year, month),
  })
}

export function useYearCalendar(year: number) {
  return useQuery({
    queryKey: ['calendar', 'year', year],
    queryFn: () => getYearCalendar(year),
  })
}

export function useEntry(id: string | null) {
  return useQuery({
    queryKey: ['entry', id],
    queryFn: () => getEntry(id!),
    enabled: id !== null,
  })
}

export function useEntries(params?: { year?: number; month?: number; day?: number }) {
  return useQuery({
    queryKey: ['entries', params],
    queryFn: () => getEntries(params),
  })
}

export function useCreateEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEntryData) => createEntry(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      qc.invalidateQueries({ queryKey: ['calendar'] })
    },
  })
}

export function useUpdateEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntryData }) => updateEntry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      qc.invalidateQueries({ queryKey: ['calendar'] })
      qc.invalidateQueries({ queryKey: ['comparison'] })
    },
  })
}

export function useDeleteEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      qc.invalidateQueries({ queryKey: ['calendar'] })
    },
  })
}

export function useCompare(month: number, day: number) {
  return useQuery({
    queryKey: ['comparison', month, day],
    queryFn: () => compareEntries(month, day),
  })
}

export function useProustQuestions() {
  return useQuery({
    queryKey: ['proust', 'questions'],
    queryFn: getQuestions,
  })
}

export function useProustWithAnswers(year?: number) {
  return useQuery({
    queryKey: ['proust', 'withAnswers', year],
    queryFn: () => getQuestionsWithAnswers(year),
  })
}

export function useUpsertProustAnswer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { question_id: number; year: number; answer: string }) => upsertAnswer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proust'] })
    },
  })
}

export function useUploadFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, file }: { entryId: string; file: File }) => uploadFile(entryId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entry'] })
      qc.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useDeleteAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAttachment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entry'] })
      qc.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}
