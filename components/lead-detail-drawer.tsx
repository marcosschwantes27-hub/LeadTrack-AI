'use client'

import { useState } from 'react'
import type { Lead } from '@/lib/types'
import { cn, formatNumber, getScoreColor, getScoreBg, getPriorityStyle } from '@/lib/utils'
import {
  X,
  Copy,
  CheckCircle2,
  ExternalLink,
  Mail,
  Link2,
  Hash,
  Users,
  UserCheck,
  Image,
  TrendingUp,
  BadgeCheck,
  Target,
  AlertTriangle,
  MessageSquare,
  Heart,
  Footprints,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface LeadDetailDrawerProps {
  lead: Lead | null
  open: boolean
  onClose: () => void
}

type Tab = 'overview' | 'diagnosis' | 'social' | 'contact'

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'diagnosis', label: 'Diagnóstico' },
  { id: 'social', label: 'Social Selling' },
  { id: 'contact', label: 'Contato' },
]

export default function LeadDetailDrawer({ lead, open, onClose }: LeadDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [copiedDM, setCopiedDM] = useState(false)
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set())

  if (!lead) return null

  const copyDM = () => {
    if (!lead.mensagemDM) return
    navigator.clipboard.writeText(lead.mensagemDM)
    setCopiedDM(true)
    setTimeout(() => setCopiedDM(false), 2000)
  }

  const toggleExpand = (field: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev)
      if (next.has(field)) next.delete(field)
      else next.add(field)
      return next
    })
  }

  const FieldBlock = ({
    label,
    value,
    expandable = false,
    id,
  }: {
    label: string
    value: string
    expandable?: boolean
    id?: string
  }) => {
    if (!value) return null
    const isExpanded = id ? expandedFields.has(id) : true
    const isLong = value.length > 120

    return (
      <div className="mb-4">
        <span className="text-[11px] font-semibold text-content-3 uppercase tracking-wider block mb-1.5">
          {label}
        </span>
        <div className="relative">
          <p
            className={cn(
              'text-[13px] text-content-2 leading-relaxed',
              expandable && isLong && !isExpanded && 'line-clamp-3'
            )}
          >
            {value}
          </p>
          {expandable && isLong && id && (
            <button
              onClick={() => toggleExpand(id)}
              className="flex items-center gap-1 mt-1 text-[11px] text-accent font-medium hover:text-accent-hover transition-colors"
            >
              {isExpanded ? (
                <>
                  Menos <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Mais <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    )
  }

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    accent = false,
  }: {
    icon: typeof Users
    label: string
    value: string | number | boolean
    accent?: boolean
  }) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-line/40 last:border-0">
        <div className="flex items-center gap-2.5">
          <Icon className="w-3.5 h-3.5 text-content-3" />
          <span className="text-[12px] text-content-3 font-medium">{label}</span>
        </div>
        <span className={cn('text-[13px] font-medium', accent ? 'text-accent' : 'text-content-1')}>
          {displayValue}
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] bg-surface-1 border-l border-line shadow-2xl transition-transform duration-300 ease-out overflow-hidden flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-line/60">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={lead.foto}
                  alt={lead.nome}
                  className="w-12 h-12 rounded-full object-cover border-2 border-line"
                />
                {lead.verificado && (
                  <BadgeCheck className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-blue-400 fill-surface-1" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-bold text-content-1 truncate">{lead.nome}</h3>
                <a
                  href={lead.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
                >
                  @{lead.username}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-3 transition-colors text-content-3 hover:text-content-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Score + Priority row */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center justify-center w-11 h-11 rounded-xl text-[16px] font-bold border',
                getScoreBg(lead.score),
                getScoreColor(lead.score)
              )}
            >
              {lead.score}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-content-3 font-medium uppercase tracking-wider mb-1">
                Score de qualificação
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border',
                    getPriorityStyle(lead.prioridade)
                  )}
                >
                  {lead.prioridade}
                </span>
                <span className="text-[12px] text-content-2">{lead.acao}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 mt-5 bg-surface-2 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-2 rounded-md text-[12px] font-medium transition-all duration-150',
                  activeTab === tab.id
                    ? 'bg-surface-0 text-content-1 shadow-sm'
                    : 'text-content-3 hover:text-content-2'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <InfoRow icon={Users} label="Seguidores" value={formatNumber(lead.seguidores)} />
              <InfoRow icon={UserCheck} label="Seguindo" value={formatNumber(lead.seguindo)} />
              <InfoRow icon={Image} label="Posts" value={lead.totalPosts} />
              <InfoRow icon={BadgeCheck} label="Verificado" value={lead.verificado} />
              <InfoRow icon={TrendingUp} label="Taxa de engajamento" value={`${lead.taxaEngajamento}%`} accent />
              <InfoRow icon={Target} label="Nicho" value={lead.nicho} />
              <InfoRow icon={Hash} label="Tipo de lead" value={lead.tipoLead} />
            </div>
          )}

          {activeTab === 'diagnosis' && (
            <div className="animate-fade-in">
              <FieldBlock label="Resumo do perfil" value={lead.resumoPerfil} expandable id="resumo" />
              <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                    Dor principal
                  </span>
                </div>
                <p className="text-[13px] text-content-1 leading-relaxed">{lead.dorPrincipal}</p>
              </div>
              <FieldBlock label="Possíveis dores" value={lead.possiveisDores} expandable id="dores" />
              <FieldBlock label="Motivo da qualificação" value={lead.motivo} expandable id="motivo" />
            </div>
          )}

          {activeTab === 'social' && (
            <div className="animate-fade-in">
              {/* DM Block */}
              {lead.mensagemDM && (
                <div className="mb-5">
                  <span className="text-[11px] font-semibold text-content-3 uppercase tracking-wider block mb-2">
                    Mensagem DM
                  </span>
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <p className="text-[13px] text-content-1 leading-relaxed mb-3">{lead.mensagemDM}</p>
                    <button
                      onClick={copyDM}
                      className={cn(
                        'flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all',
                        copiedDM
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-accent text-white hover:bg-accent-hover'
                      )}
                    >
                      {copiedDM ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Copiada!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copiar mensagem
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {lead.reagirStory && (
                <div className="p-3.5 rounded-xl bg-surface-2 border border-line mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[11px] font-semibold text-content-3 uppercase tracking-wider">
                      Reagir ao Story
                    </span>
                  </div>
                  <p className="text-[13px] text-content-2">
                    Reação: <span className="text-[16px]">{lead.storyReacao}</span>
                  </p>
                  {lead.storyContexto && (
                    <p className="text-[12px] text-content-3 mt-1">{lead.storyContexto}</p>
                  )}
                </div>
              )}

              <FieldBlock label="Abordagem" value={lead.abordagem} expandable id="abordagem" />
              <FieldBlock label="Próximos passos" value={lead.proximosPassos} expandable id="passos" />
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-fade-in">
              {lead.email && <InfoRow icon={Mail} label="Email" value={lead.email} accent />}
              {lead.linkBio && <InfoRow icon={Link2} label="Link da bio" value={lead.linkBio} />}
              <InfoRow icon={Hash} label="Hashtag origem" value={lead.hashtagOrigem} />
              <FieldBlock label="Caption exemplo" value={lead.captionExemplo} expandable id="caption" />
              <FieldBlock label="Indicador de negócio" value={lead.indicadorNegocio} expandable id="indicador" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
