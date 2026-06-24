import type { Attachment } from '@/types'
import { FileImage, FileVideo, FileAudio, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return <FileImage className="w-5 h-5 text-journal-500" />
    case 'video':
      return <FileVideo className="w-5 h-5 text-journal-500" />
    case 'audio':
      return <FileAudio className="w-5 h-5 text-journal-500" />
    case 'pdf':
      return <FileText className="w-5 h-5 text-journal-500" />
    default:
      return <FileText className="w-5 h-5 text-journal-500" />
  }
}

function getMediaUrl(path: string) {
  return `/${path}`
}

interface Props {
  attachments: Attachment[]
  onDelete?: (id: string) => void
  showDelete?: boolean
}

export default function AttachmentList({ attachments, onDelete, showDelete = false }: Props) {
  if (!attachments.length) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-journal-500 uppercase tracking-wide">Attachments</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {attachments.map((att) => (
          <div key={att.id} className="relative group">
            {att.file_type === 'image' ? (
              <img
                src={getMediaUrl(att.file_path)}
                alt={att.file_name}
                className="w-full h-32 object-cover rounded-lg border border-journal-100"
              />
            ) : att.file_type === 'video' ? (
              <video
                src={getMediaUrl(att.file_path)}
                controls
                className="w-full h-32 object-cover rounded-lg border border-journal-100"
              />
            ) : att.file_type === 'audio' ? (
              <div className="w-full h-16 flex items-center justify-center rounded-lg border border-journal-100 bg-journal-50">
                <audio src={getMediaUrl(att.file_path)} controls className="w-full max-w-[180px]" />
              </div>
            ) : (
              <a
                href={getMediaUrl(att.file_path)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-journal-100 bg-journal-50 hover:bg-journal-100 transition-colors"
              >
                {getFileIcon(att.file_type)}
                <span className="text-xs text-journal-600 truncate">{att.file_name}</span>
              </a>
            )}
            {showDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 w-6 h-6 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(att.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
