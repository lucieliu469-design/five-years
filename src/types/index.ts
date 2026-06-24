export interface DiaryEntry {
  id: string
  date: string
  year: number
  month: number
  day: number
  title: string
  weather: string
  mood: string
  content: string
  created_at: string | null
  updated_at: string | null
  attachments: Attachment[]
}

export interface Attachment {
  id: string
  entry_id: string
  file_name: string
  file_type: string
  file_path: string
  file_size: string
  created_at: string | null
}

export interface CalendarDay {
  date: string
  year: number
  month: number
  day: number
  has_entry: boolean
  entry_id: string | null
}

export interface ProustQuestion {
  id: number
  question_cn: string
  question_en: string
  order_index: number
}

export interface ProustAnswer {
  id: number
  question_id: number
  year: number
  answer: string
  updated_at: string | null
}

export interface ProustQuestionWithAnswers {
  id: number
  question_cn: string
  question_en: string
  order_index: number
  answers: ProustAnswer[]
}

export interface CompareYearEntry {
  year: number
  entry: DiaryEntry | null
}

export interface CompareResult {
  month: number
  day: number
  years: CompareYearEntry[]
}

export interface CreateEntryData {
  date: string
  title: string
  weather: string
  mood: string
  content: string
}

export interface UpdateEntryData {
  title?: string
  weather?: string
  mood?: string
  content?: string
}
