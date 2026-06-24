import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEntry, useEntries, useCreateEntry, useUpdateEntry, useDeleteEntry, useDeleteAttachment } from '@/hooks'
import RichTextEditor from '@/components/Editor/RichTextEditor'
import UploadZone from '@/components/Attachment/UploadZone'
import AttachmentList from '@/components/Attachment/AttachmentList'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2, Save, Loader2, AlertTriangle } from 'lucide-react'
import dayjs from 'dayjs'

const WEATHER_OPTIONS = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Foggy']
const MOOD_OPTIONS = ['Happy', 'Calm', 'Sad', 'Anxious', 'Excited', 'Grateful', 'Reflective', 'Tired']

export default function DiaryEditor() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'
  const entryId = isNew ? null : id

  const { data: existingEntry, isLoading: entryLoading } = useEntry(entryId)
  const createEntry = useCreateEntry()
  const updateEntry = useUpdateEntry()
  const deleteEntry = useDeleteEntry()
  const deleteAttachment = useDeleteAttachment()

  const [title, setTitle] = useState('')
  const [weather, setWeather] = useState('')
  const [mood, setMood] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [showExitDialog, setShowExitDialog] = useState(false)
  const pendingNavigation = useRef<(() => void) | null>(null)

  const targetDate = useMemo(() => {
    if (!isNew) return null
    const y = searchParams.get('year') || String(dayjs().year())
    const m = searchParams.get('month') || String(dayjs().month() + 1)
    const d = searchParams.get('day') || String(dayjs().date())
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }, [isNew, searchParams])

  const targetYear = targetDate ? parseInt(targetDate.split('-')[0]) : 0
  const targetMonth = targetDate ? parseInt(targetDate.split('-')[1]) : 0
  const targetDay = targetDate ? parseInt(targetDate.split('-')[2]) : 0

  const { data: existingForDate } = useEntries(
    isNew && targetDate ? { year: targetYear, month: targetMonth, day: targetDay } : undefined
  )

  useEffect(() => {
    if (isNew && targetDate && existingForDate && existingForDate.length > 0) {
      navigate(`/entry/${existingForDate[0].id}`, { replace: true })
    }
  }, [isNew, targetDate, existingForDate, navigate])

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title)
      setWeather(existingEntry.weather)
      setMood(existingEntry.mood)
      setContent(existingEntry.content)
      setDate(existingEntry.date)
    } else if (isNew && targetDate) {
      setTitle('')
      setWeather('')
      setMood('')
      setContent('')
      setDate(targetDate)
    }
  }, [existingEntry, targetDate, isNew])

  const isDirty = useMemo(() => {
    if (isNew) {
      const hasTitle = title !== ''
      const hasWeather = weather !== ''
      const hasMood = mood !== ''
      const hasContent = content !== '' && content !== '<p></p>'
      return hasTitle || hasWeather || hasMood || hasContent
    }
    if (!existingEntry) return false
    return (
      title !== existingEntry.title ||
      weather !== existingEntry.weather ||
      mood !== existingEntry.mood ||
      content !== existingEntry.content ||
      date !== existingEntry.date
    )
  }, [isNew, existingEntry, title, weather, mood, content, date])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const navigateAway = useCallback((action: () => void) => {
    if (isDirty) {
      pendingNavigation.current = action
      setShowExitDialog(true)
    } else {
      action()
    }
  }, [isDirty])

  const handleSaveAndExit = async () => {
    setShowExitDialog(false)
    if (isNew) {
      createEntry.mutate(
        { date, title, weather, mood, content },
        {
          onSuccess: () => {
            if (pendingNavigation.current) pendingNavigation.current()
            pendingNavigation.current = null
          },
        }
      )
    } else if (entryId) {
      updateEntry.mutate(
        { id: entryId, data: { title, weather, mood, content } },
        {
          onSuccess: () => {
            if (pendingNavigation.current) pendingNavigation.current()
            pendingNavigation.current = null
          },
        }
      )
    }
  }

  const handleExitWithoutSaving = () => {
    setShowExitDialog(false)
    if (pendingNavigation.current) pendingNavigation.current()
    pendingNavigation.current = null
  }

  const handleCancelExit = () => {
    setShowExitDialog(false)
    pendingNavigation.current = null
  }

  const handleSave = () => {
    if (isNew) {
      createEntry.mutate(
        { date, title, weather, mood, content },
        { onSuccess: (entry) => navigate(`/entry/${entry.id}`, { replace: true }) }
      )
    } else if (entryId) {
      updateEntry.mutate({ id: entryId, data: { title, weather, mood, content } })
    }
  }

  const handleBack = useCallback(() => {
    navigateAway(() => navigate(-1))
  }, [navigateAway, navigate])

  const handleDateChange = useCallback((newDate: string) => {
    const [y, m, d] = newDate.split('-')
    navigateAway(() => navigate(`/entry/new?year=${y}&month=${m}&day=${d}`, { replace: true }))
  }, [navigateAway, navigate])

  const handleDelete = () => {
    if (!entryId) return
    if (!confirm('Delete this diary entry? This cannot be undone.')) return
    deleteEntry.mutate(entryId, {
      onSuccess: () => navigate('/'),
    })
  }

  const isSaving = createEntry.isPending || updateEntry.isPending

  if (entryLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-journal-400" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-journal-200 p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-journal-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            min="2026-01-01"
            max="2030-12-31"
            className="w-full px-3 py-2 rounded-lg border border-journal-200 text-journal-800 outline-none focus:ring-2 focus:ring-journal-300"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-journal-500 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="w-full px-3 py-2 rounded-lg border border-journal-200 text-journal-800 outline-none focus:ring-2 focus:ring-journal-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-journal-500 mb-1">Weather</label>
            <div className="flex flex-wrap gap-1.5">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeather(w === weather ? '' : w)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    weather === w
                      ? 'bg-journal-300 text-white'
                      : 'bg-journal-50 text-journal-600 hover:bg-journal-100'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-journal-500 mb-1">Mood</label>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m === mood ? '' : m)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    mood === m
                      ? 'bg-journal-300 text-white'
                      : 'bg-journal-50 text-journal-600 hover:bg-journal-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-journal-500 mb-1">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {!isNew && entryId && existingEntry && (
          <>
            <div className="border-t border-journal-100 pt-4">
              <AttachmentList
                attachments={existingEntry.attachments}
                onDelete={(attId) => deleteAttachment.mutate(attId)}
                showDelete
              />
            </div>
            <UploadZone entryId={entryId} />
          </>
        )}
      </div>

      {showExitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-journal-400 shrink-0 mt-0.5" />
              <p className="text-sm text-journal-700">
                You have unsaved changes. Would you like to save before leaving?
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleExitWithoutSaving}>
                Exit Anyway
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelExit}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveAndExit} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
