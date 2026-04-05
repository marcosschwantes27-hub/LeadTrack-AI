'use client'

import { useState } from 'react'
import type { ProspectionConfig } from '@/lib/types'
import { Search } from 'lucide-react'

interface ProspectionFormProps {
  onSubmit: (config: ProspectionConfig) => void
}

export default function ProspectionForm({ onSubmit }: ProspectionFormProps) {
  const [config, setConfig] = useState<ProspectionConfig>({
    nicho: '',
    seguidoresMin: 0,
    seguidoresMax: 100000,
    quantidadeLeads: 10,
    scoreMin: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(config)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[480px]">
      <div className="space-y-4">
        {/* Nicho */}
        <div>
          <label htmlFor="nicho" className="block text-[12px] font-medium text-content-3 mb-1.5">
            Nicho
          </label>
          <input
            id="nicho"
            type="text"
            placeholder="Ex: Nutricionista, Dentista, Personal..."
            value={config.nicho}
            onChange={(e) => setConfig({ ...config, nicho: e.target.value })}
            className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>

        {/* Row: seguidores */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="segMin" className="block text-[12px] font-medium text-content-3 mb-1.5">
              Seguidores mín.
            </label>
            <input
              id="segMin"
              type="number"
              placeholder="1.000"
              value={config.seguidoresMin || ''}
              onChange={(e) => setConfig({ ...config, seguidoresMin: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="segMax" className="block text-[12px] font-medium text-content-3 mb-1.5">
              Seguidores máx.
            </label>
            <input
              id="segMax"
              type="number"
              placeholder="100.000"
              value={config.seguidoresMax || ''}
              onChange={(e) => setConfig({ ...config, seguidoresMax: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        {/* Row: qtd + score */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="qtd" className="block text-[12px] font-medium text-content-3 mb-1.5">
              Qtd. de leads
            </label>
            <input
              id="qtd"
              type="number"
              placeholder="20"
              value={config.quantidadeLeads || ''}
              onChange={(e) => setConfig({ ...config, quantidadeLeads: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="score" className="block text-[12px] font-medium text-content-3 mb-1.5">
              Score mínimo
            </label>
            <input
              id="score"
              type="number"
              placeholder="6"
              value={config.scoreMin || ''}
              onChange={(e) => setConfig({ ...config, scoreMin: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-[13px] font-medium transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          Prospectar
        </button>
      </div>
    </form>
  )
}
