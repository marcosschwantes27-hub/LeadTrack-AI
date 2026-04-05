'use client'

import type { HistoryEntry } from '@/lib/types'
import { cn, getScoreColor } from '@/lib/utils'
import { Clock, Eye, Calendar, Target, Users, TrendingUp, BarChart3, Trash2 } from 'lucide-react'

interface HistorySectionProps {
  history: HistoryEntry[]
  onViewExecution: (entry: HistoryEntry) => void
  onDelete?: (id: string) => void
}

export default function HistorySection({ history, onViewExecution, onDelete }: HistorySectionProps) {
  if (history.length === 0) {
    return (
      <section className="pt-[52px]">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center py-20">
            <Clock className="w-8 h-8 text-content-3 mb-3" />
            <p className="text-[14px] text-content-2">Nenhuma execução ainda</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-[52px]">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-[18px] font-semibold text-content-1">Histórico</h2>
          <p className="text-[12px] text-content-3 mt-0.5">{history.length} execuções</p>
        </div>

        {/* Table */}
        <div className="space-y-2">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[140px_1fr_100px_100px_80px_100px] gap-4 px-5 py-2.5 text-[11px] font-semibold text-content-3 uppercase tracking-wider">
            <span>Data</span>
            <span>Nicho</span>
            <span className="text-right">Encontrados</span>
            <span className="text-right">Qualificados</span>
            <span className="text-right">Score médio</span>
            <span></span>
          </div>

          {/* Rows */}
          {history.map((entry, idx) => (
            <div
              key={entry.id}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr_100px_100px_80px_100px] gap-3 md:gap-4 items-center px-5 py-4 md:py-3.5 bg-surface-1 border border-line/60 hover:border-line-hover rounded-xl transition-all duration-150 animate-slide-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Date */}
              <div className="flex items-center gap-2.5">
                <Calendar className="w-3.5 h-3.5 text-content-3 hidden md:block" />
                <span className="text-[13px] text-content-2 font-medium tabular-nums">
                  {entry.data}
                </span>
              </div>

              {/* Nicho */}
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-content-3 hidden md:block" />
                <span className="text-[13px] text-content-1 font-semibold">{entry.nicho}</span>
              </div>

              {/* Encontrados */}
              <div className="flex items-center md:justify-end gap-2">
                <Users className="w-3 h-3 text-content-3 md:hidden" />
                <span className="text-[12px] text-content-3 md:hidden">Encontrados:</span>
                <span className="text-[13px] text-content-2 font-medium tabular-nums">
                  {entry.totalEncontrado}
                </span>
              </div>

              {/* Qualificados */}
              <div className="flex items-center md:justify-end gap-2">
                <TrendingUp className="w-3 h-3 text-content-3 md:hidden" />
                <span className="text-[12px] text-content-3 md:hidden">Qualificados:</span>
                <span className="text-[13px] text-emerald-400 font-semibold tabular-nums">
                  {entry.totalQualificado}
                </span>
              </div>

              {/* Score médio */}
              <div className="flex items-center md:justify-end gap-2">
                <BarChart3 className="w-3 h-3 text-content-3 md:hidden" />
                <span className="text-[12px] text-content-3 md:hidden">Score médio:</span>
                <span
                  className={cn(
                    'text-[13px] font-bold tabular-nums',
                    getScoreColor(entry.mediaScore)
                  )}
                >
                  {entry.mediaScore.toFixed(1)}
                </span>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => onViewExecution(entry)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-content-2 hover:text-accent bg-surface-2 hover:bg-accent/5 border border-line hover:border-accent/20 transition-all duration-150"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden md:inline">Ver</span>
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-content-3 hover:text-red-400 bg-surface-2 hover:bg-red-500/5 border border-line hover:border-red-500/20 transition-all duration-150"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
