const N8N_WEBHOOK_URL = '/api/prospect'

export interface ProspectionPayload {
  nichos: string[]
  perfisParaProspectar: number
  resultadosPorBusca: number
  minSeguidores: number
  maxSeguidores: number
  scoreMinimo: number
}

export interface N8NLead {
  username: string
  nome: string
  instagramUrl: string
  seguidores: number
  seguindo: number
  totalPosts: number
  verificado: boolean
  profilePic: string
  taxaEngajamento: number
  score: number
  tipoLead: string
  prioridade: string
  acao: string
  resumoPerfil: string
  possiveisDores: string
  dorPrincipal: string
  motivo: string
  abordagem: string
  mensagemDM: string
  reagirStory: boolean
  email: string | null
  linkBio: string | null
  nicho: string
  hashtagOrigem: string
  captionExemplo: string
  temIndicadorNegocio: boolean
}

export interface N8NResponse {
  resumo: string
  dataExecucao: string
  totalLeads: number
  hotLeads: number
  estrategia: { story_dm: number; dm_direta: number }
  distribuicaoTipo: Record<string, number>
  leads: N8NLead[]
}

export async function runProspection(payload: ProspectionPayload): Promise<N8NResponse> {
  console.log('[n8n] Calling /api/prospect with:', payload)

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  console.log('[n8n] Response status:', res.status, 'leads:', data.leads?.length ?? 0)

  if (!res.ok) {
    throw new Error(data.error || `n8n error: ${res.status}`)
  }

  // Ensure leads array exists
  if (!data.leads) data.leads = []

  return data as N8NResponse
}
