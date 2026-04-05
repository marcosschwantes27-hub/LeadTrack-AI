export interface Lead {
  id: string
  username: string
  nome: string
  instagramUrl: string
  foto: string
  seguidores: number
  seguindo: number
  totalPosts: number
  verificado: boolean
  taxaEngajamento: number
  nicho: string
  score: number
  tipoLead: string
  prioridade: string
  acao: string
  motivo: string
  abordagem: string
  resumoPerfil: string
  dorPrincipal: string
  possiveisDores: string
  mensagemDM: string
  reagirStory: boolean
  storyReacao: string
  storyContexto: string
  proximosPassos: string
  email: string
  linkBio: string
  hashtagOrigem: string
  captionExemplo: string
  indicadorNegocio: string
}

export interface ProspectionConfig {
  nicho: string
  seguidoresMin: number
  seguidoresMax: number
  quantidadeLeads: number
  scoreMin: number
}

export interface HistoryEntry {
  id: string
  data: string
  nicho: string
  totalEncontrado: number
  totalQualificado: number
  mediaScore: number
  leads: Lead[]
}

export type AppView = 'dashboard' | 'prospection' | 'leads' | 'history' | 'settings' | 'profile'
export type ProspectionState = 'idle' | 'loading' | 'complete'
