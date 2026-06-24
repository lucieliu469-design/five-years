import { request } from './request'
import type { CompareResult } from '@/types'

export function compareEntries(month: number, day: number) {
  return request<CompareResult>(`/comparison/${month}/${day}`)
}
