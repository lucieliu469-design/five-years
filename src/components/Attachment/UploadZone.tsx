import { useCallback, useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUploadFile } from '@/hooks'

interface Props {
  entryId: string
}

export default function UploadZone({ entryId }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const { mutate: upload, isPending } = useUploadFile()

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      Array.from(files).forEach((file) => {
        upload({ entryId, file })
      })
    },
    [entryId, upload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-journal-200 rounded-lg p-6 text-center hover:border-journal-400 transition-colors"
    >
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload className="w-8 h-8 text-journal-400 mx-auto mb-2" />
      <p className="text-sm text-journal-500 mb-2">
        Drag & drop files here, or click to browse
      </p>
      <p className="text-xs text-journal-400 mb-3">
        Images, videos, audio, and PDFs (max 50MB)
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInput.current?.click()}
        disabled={isPending}
      >
        {isPending ? 'Uploading...' : 'Choose Files'}
      </Button>
    </div>
  )
}
