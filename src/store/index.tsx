import React, { createContext, useContext, useState, useCallback } from 'react'

interface AppState {
  selectedYear: number
  selectedMonth: number
  selectedDay: number | null
  setSelectedYear: (year: number) => void
  setSelectedMonth: (month: number) => void
  setSelectedDay: (day: number | null) => void
  selectDate: (year: number, month: number, day: number | null) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const selectDate = useCallback((year: number, month: number, day: number | null) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setSelectedDay(day)
  }, [])

  return (
    <AppContext.Provider
      value={{
        selectedYear,
        selectedMonth,
        selectedDay,
        setSelectedYear,
        setSelectedMonth,
        setSelectedDay,
        selectDate,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
