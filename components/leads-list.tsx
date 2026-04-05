'use client'

import { useState } from 'react'
import type { Lead } from '@/lib/types'
import {
  cn,
  formatNumber,
  getScoreColor,
  getScoreBg,
  getPriorityStyle,
  getLeadTypeStyle,
} from '@/lib/utils'
import {
  Users,
  TrendingUp,
  Copy,
  Eye,
  ChevronDown,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react'

interface LeadsListProps {
  leads: Lead[]
  onSelectLead: (lead: Lead) => void
}

export default function LeadsList({ leads, onSelectLead }: LeadsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'seguidores' | 'engajamento'>('score')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredLeads = leads
    .filter(
      (l) =>
        l.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.nicho.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.score - a.score
        case 'seguidores': return b.seguidores - a.seguidores
        case 'engajamento': return b.taxaEngajamento - a.taxaEngajamento
        default: return 0
      }
    })

  const handleCopyDM = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!lead.mensagemDM) return
    navigator.clipboard.writeText(lead.mensagemDM)
    setCopiedId(lead.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const qualifiedCount = leads.filter((l) => l.score >= 6).length
  const taxaSucesso = leads.length > 0 ? Math.round((qualifiedCount / leads.length) * 100) : 0

  return (
    <section className="pt-[52px]">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-content-1">Leads</h2>
            <p className="text-[12px] text-content-3 mt-0.5">
              {leads.length} perfis · {qualifiedCount} qualificados ·{' '}
              <span className={cn(
                'font-semibold',
                taxaSucesso >= 70 ? 'text-emerald-400' : taxaSucesso >= 40 ? 'text-amber-400' : 'text-red-400'
              )}>
                {taxaSucesso}% taxa de sucesso
              </span>
            </p>
          </div>

          {/* Filters bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-3" />
              <input
                placeholder="Buscar lead..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 pr-4 w-[200px] rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-3" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-9 pl-8 pr-8 rounded-lg bg-surface-2 border border-line text-[13px] text-content-2 focus:outline-none focus:border-accent/40 transition-colors appearance-none cursor-pointer"
              >
                <option value="score">Score</option>
                <option value="seguidores">Seguidores</option>
                <option value="engajamento">Engajamento</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Leads grid */}
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-10 h-10 text-content-3 mb-4" />
            <p className="text-[15px] text-content-2 font-medium">Nenhum lead encontrado</p>
            <p className="text-[13px] text-content-3 mt-1">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[44px_1fr_80px_100px_90px_90px_120px_120px_100px_90px] gap-3 px-4 py-2 text-[11px] font-semibold text-content-3 uppercase tracking-wider">
              <span></span>
              <span>Perfil</span>
              <span className="text-right">Score</span>
              <span>Tipo</span>
              <span className="text-right">Seguidores</span>
              <span className="text-right">Engaj.</span>
              <span>Nicho</span>
              <span>Prioridade</span>
              <span>Ação</span>
              <span></span>
            </div>

            {/* Rows */}
            {filteredLeads.map((lead, idx) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="group grid grid-cols-1 lg:grid-cols-[44px_1fr_80px_100px_90px_90px_120px_120px_100px_90px] gap-3 items-center px-4 py-3 lg:py-2.5 bg-surface-1 hover:bg-surface-2 border border-line/50 rounded-lg cursor-pointer transition-colors"
              >
                {/* Avatar */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <img
                      src={lead.foto}
                      alt={lead.nome}
                      className="w-9 h-9 rounded-full object-cover border border-line"
                    />
                    {lead.verificado && (
                      <BadgeCheck className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-blue-400 fill-surface-1" />
                    )}
                  </div>
                </div>

                {/* Profile info */}
                <div className="flex items-center gap-3 lg:gap-0 lg:flex-col lg:items-start min-w-0">
                  <img
                    src={lead.foto}
                    alt={lead.nome}
                    className="w-10 h-10 rounded-full object-cover border border-line lg:hidden"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[13px] font-semibold text-content-1 truncate max-w-[160px] lg:max-w-[120px]">
                        {lead.nome}
                      </span>
                      {lead.verificado && (
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 lg:hidden" />
                      )}
                    </div>
                    <span className="text-[12px] text-content-3 truncate block">@{lead.username}</span>
                  </div>
                  {/* Mobile badges */}
                  <div className="flex items-center gap-2 ml-auto lg:hidden">
                    <span className={cn('text-[18px] font-bold', getScoreColor(lead.score))}>
                      {lead.score}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="hidden lg:flex justify-end">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-9 h-9 rounded-lg text-[13px] font-bold border',
                      getScoreBg(lead.score),
                      getScoreColor(lead.score)
                    )}
                  >
                    {lead.score}
                  </span>
                </div>

                {/* Tipo */}
                <div className="hidden lg:block">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border',
                      getLeadTypeStyle(lead.tipoLead)
                    )}
                  >
                    {lead.tipoLead}
                  </span>
                </div>

                {/* Seguidores */}
                <div className="hidden lg:flex items-center justify-end gap-1.5">
                  <Users className="w-3 h-3 text-content-3" />
                  <span className="text-[13px] text-content-2 font-medium tabular-nums">
                    {formatNumber(lead.seguidores)}
                  </span>
                </div>

                {/* Engajamento */}
                <div className="hidden lg:flex items-center justify-end gap-1.5">
                  <TrendingUp className="w-3 h-3 text-content-3" />
                  <span className="text-[13px] text-content-2 font-medium tabular-nums">
                    {lead.taxaEngajamento}%
                  </span>
                </div>

                {/* Nicho */}
                <div className="hidden lg:block">
                  <span className="text-[12px] text-content-2 truncate block">{lead.nicho}</span>
                </div>

                {/* Prioridade */}
                <div className="hidden lg:block">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border',
                      getPriorityStyle(lead.prioridade)
                    )}
                  >
                    {lead.prioridade}
                  </span>
                </div>

                {/* Mobile extra info */}
                <div className="flex flex-wrap gap-2 lg:hidden">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border', getLeadTypeStyle(lead.tipoLead))}>
                    {lead.tipoLead}
                  </span>
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border', getPriorityStyle(lead.prioridade))}>
                    {lead.prioridade}
                  </span>
                  <span className="text-[11px] text-content-3">
                    {formatNumber(lead.seguidores)} seg • {lead.taxaEngajamento}% eng
                  </span>
                </div>

                {/* Actions */}
                <div className="hidden lg:flex items-center gap-1.5 justify-end">
                  {lead.mensagemDM && (
                    <button
                      onClick={(e) => handleCopyDM(lead, e)}
                      className={cn(
                        'p-2 rounded-lg transition-all duration-150',
                        copiedId === lead.id
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-content-3 hover:text-content-1 hover:bg-surface-3'
                      )}
                      title="Copiar DM"
                    >
                      {copiedId === lead.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectLead(lead)
                    }}
                    className="p-2 rounded-lg text-content-3 hover:text-accent hover:bg-accent/5 transition-all duration-150"
                    title="Ver detalhes"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile actions */}
                <div className="flex items-center gap-2 lg:hidden">
                  {lead.mensagemDM && (
                    <button
                      onClick={(e) => handleCopyDM(lead, e)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all',
                        copiedId === lead.id
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-surface-3 text-content-2 hover:text-content-1'
                      )}
                    >
                      {copiedId === lead.id ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedId === lead.id ? 'Copiado' : 'Copiar DM'}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectLead(lead)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-[12px] font-medium hover:bg-accent/15 transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
