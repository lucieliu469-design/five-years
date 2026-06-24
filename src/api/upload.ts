import type { Attachment } from '@/types'

export async function uploadFile(entryId: string, file: File): Promise<Attachment> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`/api/attachments/upload/${entryId}`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }))
    throw new Error(err.detail || 'Upload failed')
  }
  return res.json()
}

export async function deleteAttachment(id: string): Promise<void> {
  await fetch(`/api/attachments/${id}`, { method: 'DELETE' })
}
