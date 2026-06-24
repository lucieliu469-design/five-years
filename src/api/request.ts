const BASE_URL = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...rest } = options || {}
  const hasBody = !!rest.body
  const res = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(extraHeaders as Record<string, string>),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export { request }
