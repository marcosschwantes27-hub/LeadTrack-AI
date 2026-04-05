import type { HistoryEntry, Lead } from './types'

const STORAGE_KEY = 'leadtrack-history'

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveExecution(nicho: string, leads: Lead[]): HistoryEntry {
  const history = loadHistory()
  const qualificados = leads.filter((l) => l.score >= 6).length
  const mediaScore = leads.length > 0
    ? leads.reduce((sum, l) => sum + l.score, 0) / leads.length
    : 0

  const entry: HistoryEntry = {
    id: `exec-${Date.now()}`,
    data: new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    nicho,
    totalEncontrado: leads.length,
    totalQualificado: qualificados,
    mediaScore: Math.round(mediaScore * 10) / 10,
    leads,
  }

  history.unshift(entry)
  // Keep max 50 entries
  if (history.length > 50) history.length = 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return entry
}

export function deleteExecution(id: string): void {
  const history = loadHistory().filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
