'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { AppView, ProspectionState, ProspectionConfig, Lead, HistoryEntry } from '@/lib/types'
import { loadHistory, saveExecution, deleteExecution } from '@/lib/history'
import { runProspection, type N8NLead } from '@/lib/n8n'
import Navbar from '@/components/navbar'
import ProspectionForm from '@/components/prospection-form'
import LoadingScreen from '@/components/loading-screen'
import LeadsList from '@/components/leads-list'
import LeadDetailDrawer from '@/components/lead-detail-drawer'
import HistorySection from '@/components/history-section'
import AdminSettings from '@/components/admin-settings'

function n8nLeadToLead(l: N8NLead, idx: number): Lead {
  return {
    id: `lead-${idx}`,
    username: l.username,
    nome: l.nome,
    foto: l.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(l.nome || l.username)}&background=1e2035&color=eaebf2&size=80`,
    instagramUrl: l.instagramUrl || `https://instagram.com/${l.username}`,
    seguidores: l.seguidores,
    seguindo: l.seguindo || 0,
    totalPosts: l.totalPosts || 0,
    taxaEngajamento: l.taxaEngajamento,
    verificado: l.verificado || false,
    nicho: l.nicho,
    score: l.score,
    tipoLead: l.tipoLead,
    prioridade: l.prioridade,
    acao: l.acao,
    motivo: l.motivo,
    abordagem: l.abordagem,
    resumoPerfil: l.resumoPerfil,
    dorPrincipal: l.dorPrincipal,
    possiveisDores: l.possiveisDores,
    mensagemDM: l.mensagemDM,
    reagirStory: l.reagirStory,
    storyReacao: l.reagirStory ? '🔥' : '',
    storyContexto: '',
    proximosPassos: '',
    email: l.email || '',
    linkBio: l.linkBio || '',
    hashtagOrigem: l.hashtagOrigem || '',
    captionExemplo: l.captionExemplo || '',
    indicadorNegocio: l.temIndicadorNegocio ? 'Sim' : '',
  }
}

export default function Home() {
  const [view, setView] = useState<AppView>('dashboard')
  const [prospectionState, setProspectionState] = useState<ProspectionState>('idle')
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const prospectionRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const handleViewChange = useCallback((newView: AppView) => {
    setView(newView)
    if (newView !== 'leads') {
      setProspectionState('idle')
    }
  }, [])

  const handleProspect = useCallback((config: ProspectionConfig) => {
    setProspectionState('loading')
    setError(null)

    const promise = runProspection({
      nichos: [config.nicho],
      perfisParaProspectar: config.quantidadeLeads,
      resultadosPorBusca: config.quantidadeLeads,
      minSeguidores: config.seguidoresMin,
      maxSeguidores: config.seguidoresMax,
      scoreMinimo: config.scoreMin,
    })
      .then((res) => {
        console.log('[page] Got response:', res.totalLeads, 'leads')
        const mapped = (res.leads || []).map((l, i) => n8nLeadToLead(l, i))
        setLeads(mapped)
        setProspectionState('complete')
        setView('leads')
        const entry = saveExecution(config.nicho, mapped)
        setHistory((prev) => [entry, ...prev])
      })
      .catch((err) => {
        console.error('[page] Prospection failed:', err)
        const msg = err.message || 'Erro na prospecção'
        setError(msg)
        setProspectionState('idle')
        alert('Erro na prospecção: ' + msg)
      })

    prospectionRef.current = promise
  }, [])

  const handleLoadingComplete = useCallback(() => {
    // Loading screen animation finished, but n8n may still be running
    // The actual state change happens when the fetch resolves
  }, [])

  const handleSelectLead = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setDrawerOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedLead(null), 300)
  }, [])

  const handleViewExecution = useCallback((entry: HistoryEntry) => {
    setLeads(entry.leads)
    setProspectionState('complete')
    setView('leads')
  }, [])

  const handleDeleteExecution = useCallback((id: string) => {
    deleteExecution(id)
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }, [])

  if (prospectionState === 'loading') {
    return (
      <div className="min-h-screen bg-surface-0">
        <Navbar activeView={view} onViewChange={handleViewChange} />
        <LoadingScreen onComplete={handleLoadingComplete} />
        {error && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-[13px] text-red-400">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <Navbar activeView={view} onViewChange={handleViewChange} />

      <main className="pt-[52px]">
        {/* Prospectar */}
        {(view === 'dashboard' || view === 'prospection') && prospectionState === 'idle' && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-52px)] px-4">
            <h1 className="text-[24px] font-semibold text-content-1 mb-2">Nova prospecção</h1>
            <p className="text-[14px] text-content-3 mb-8">Configure os parâmetros e inicie a busca</p>
            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[13px] text-red-400">
                {error}
              </div>
            )}
            <ProspectionForm onSubmit={handleProspect} />
          </div>
        )}

        {/* Leads */}
        {(view === 'leads' || prospectionState === 'complete') && (
          <LeadsList
            leads={leads}
            onSelectLead={handleSelectLead}
          />
        )}

        {/* Histórico */}
        {view === 'history' && (
          <HistorySection history={history} onViewExecution={handleViewExecution} onDelete={handleDeleteExecution} />
        )}

        {/* Admin Settings */}
        {view === 'settings' && (
          <AdminSettings />
        )}
      </main>

      <LeadDetailDrawer lead={selectedLead} open={drawerOpen} onClose={handleCloseDrawer} />
    </div>
  )
}
