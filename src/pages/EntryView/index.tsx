import { useParams, useNavigate } from 'react-router-dom'
import { useEntry } from '@/hooks'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Cloud, Smile, FileImage, FileVideo, FileAudio, FileText } from 'lucide-react'
import dayjs from 'dayjs'

function getMediaUrl(path: string) {
  return `/${path}`
}

export default function EntryView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: entry, isLoading } = useEntry(id ?? null)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-journal-100 rounded" />
          <div className="h-64 bg-journal-50 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-journal-400 font-serif italic">Entry not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="bg-white rounded-xl border border-journal-200 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-journal-800">
            {entry.title || dayjs(entry.date).format('MMMM D, YYYY')}
          </h1>
          <div className="flex items-center gap-1 text-sm text-journal-400 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {entry.weather && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-journal-50 text-sm text-journal-600">
              <Cloud className="w-4 h-4 text-journal-400" />
              {entry.weather}
            </div>
          )}
          {entry.mood && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-journal-50 text-sm text-journal-600">
              <Smile className="w-4 h-4 text-journal-400" />
              {entry.mood}
            </div>
          )}
        </div>

        <div className="border-t border-journal-100 pt-6">
          <div
            className="writing-body text-journal-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>

        {entry.attachments.length > 0 && (
          <div className="border-t border-journal-100 pt-6">
            <h2 className="text-sm font-medium text-journal-600 mb-4">Attachments</h2>
            <div className="grid grid-cols-2 gap-3">
              {entry.attachments.map((att) => (
                <div key={att.id}>
                  {att.file_type === 'image' ? (
                    <a href={getMediaUrl(att.file_path)} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={getMediaUrl(att.file_path)}
                        alt={att.file_name}
                        className="w-full h-40 object-cover rounded-lg border border-journal-100 hover:opacity-90 transition-opacity"
                      />
                      <p className="text-xs text-journal-500 mt-1 truncate">{att.file_name}</p>
                    </a>
                  ) : att.file_type === 'video' ? (
                    <div>
                      <video
                        src={getMediaUrl(att.file_path)}
                        controls
                        className="w-full h-40 object-cover rounded-lg border border-journal-100"
                      />
                      <p className="text-xs text-journal-500 mt-1 truncate">{att.file_name}</p>
                    </div>
                  ) : att.file_type === 'audio' ? (
                    <div className="p-3 rounded-lg border border-journal-100 bg-journal-50">
                      <audio src={getMediaUrl(att.file_path)} controls className="w-full" />
                      <p className="text-xs text-journal-500 mt-1 truncate">{att.file_name}</p>
                    </div>
                  ) : (
                    <a
                      href={getMediaUrl(att.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-journal-100 bg-journal-50 hover:bg-journal-100 transition-colors"
                    >
                      <FileText className="w-8 h-8 text-journal-400" />
                      <div>
                        <p className="text-sm text-journal-700 truncate">{att.file_name}</p>
                        <p className="text-xs text-journal-500">Click to open</p>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
