import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function getScoreColor(score: number) {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 6) return 'text-blue-400'
  if (score >= 4) return 'text-amber-400'
  return 'text-red-400'
}

export function getScoreBg(score: number) {
  if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/20'
  if (score >= 6) return 'bg-blue-500/10 border-blue-500/20'
  if (score >= 4) return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

export function getPriorityStyle(priority: string) {
  switch (priority.toLowerCase()) {
    case 'alta':
      return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    case 'média':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    case 'baixa':
      return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    default:
      return 'text-content-3 bg-surface-3 border-line'
  }
}

export function getLeadTypeStyle(type: string) {
  switch (type.toLowerCase()) {
    case 'quente':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    case 'morno':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    case 'frio':
      return 'text-sky-400 bg-sky-500/10 border-sky-500/20'
    default:
      return 'text-content-3 bg-surface-3 border-line'
  }
}
