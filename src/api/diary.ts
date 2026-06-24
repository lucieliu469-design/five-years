import { request } from './request'
import type { DiaryEntry, CreateEntryData, UpdateEntryData } from '@/types'

export function getEntries(params?: { year?: number; month?: number; day?: number }) {
  const search = new URLSearchParams()
  if (params?.year !== undefined) search.set('year', String(params.year))
  if (params?.month !== undefined) search.set('month', String(params.month))
  if (params?.day !== undefined) search.set('day', String(params.day))
  const qs = search.toString()
  return request<DiaryEntry[]>(`/entries${qs ? `?${qs}` : ''}`)
}

export function getEntry(id: string) {
  return request<DiaryEntry>(`/entries/${id}`)
}

export function createEntry(data: CreateEntryData) {
  return request<DiaryEntry>('/entries', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateEntry(id: string, data: UpdateEntryData) {
  return request<DiaryEntry>(`/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteEntry(id: string) {
  return request<void>(`/entries/${id}`, { method: 'DELETE' })
}
