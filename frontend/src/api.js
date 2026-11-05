async function post(path, body) {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Serverfehler')
  return data
}

export async function health() {
  const res = await fetch('/api/health')
  if (!res.ok) throw new Error('Backend nicht erreichbar')
  return res.json()
}

export async function uploadPdf(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Upload fehlgeschlagen')
  return data
}

export const getQuestion = (level) => post('/question', { level })
export const sendAnswer = (question, reference, answer) => post('/answer', { question, reference, answer })
export const getHint = (question, reference) => post('/hint', { question, reference })
