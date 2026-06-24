import { request } from './request'
import type { CalendarDay } from '@/types'

export function getMonthCalendar(year: number, month: number) {
  return request<CalendarDay[]>(`/calendar/month/${year}/${month}`)
}

export function getYearCalendar(year: number) {
  return request<CalendarDay[]>(`/calendar/year/${year}`)
}
