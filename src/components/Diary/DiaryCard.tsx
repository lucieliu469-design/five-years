import { useEntry } from '@/hooks'
import type { DiaryEntry as DiaryEntryType } from '@/types'
import { Calendar, Cloud, Smile } from 'lucide-react'
import dayjs from 'dayjs'
import AttachmentList from '@/components/Attachment/AttachmentList'

interface Props {
  entryId?: string | null
  entry?: DiaryEntryType | null
}

export default function DiaryCard({ entryId, entry: entryProp }: Props) {
  const { data: fetchedEntry, isLoading } = useEntry(entryId ?? null)
  const entry = entryProp ?? fetchedEntry

  if (!entryId && !entryProp) {
    return (
      <div className="bg-white rounded-xl border border-journal-200 p-6 text-center text-journal-400 font-serif italic">
        No Entry Yet
      </div>
    )
  }

  if (isLoading && !entryProp) {
    return (
      <div className="bg-white rounded-xl border border-journal-200 p-6 animate-pulse">
        <div className="h-4 w-24 bg-journal-100 rounded mb-3" />
        <div className="h-3 w-32 bg-journal-50 rounded mb-2" />
        <div className="space-y-2">
          <div className="h-3 bg-journal-50 rounded" />
          <div className="h-3 bg-journal-50 rounded" />
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="bg-white rounded-xl border border-journal-200 p-6 text-center text-journal-400 font-serif italic">
        No Entry Yet
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-journal-200 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-bold text-lg text-journal-800">
          {entry.title || dayjs(entry.date).format('MMMM D, YYYY')}
        </h3>
        <div className="flex items-center gap-3 text-sm text-journal-500">
          {entry.weather && (
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" />
              {entry.weather}
            </span>
          )}
          {entry.mood && (
            <span className="flex items-center gap-1">
              <Smile className="w-3.5 h-3.5" />
              {entry.mood}
            </span>
          )}
        </div>
      </div>
      <div className="text-xs text-journal-400 mb-3 flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
      </div>
      <div
        className="writing-body text-journal-700 text-sm"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />
      {entry.attachments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-journal-100">
          <AttachmentList attachments={entry.attachments} />
        </div>
      )}
    </div>
  )
}
