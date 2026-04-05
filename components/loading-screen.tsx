'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Brain, Target, BarChart3, MessageSquare, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { icon: Search, label: 'Buscando perfis', duration: 3000 },
  { icon: Filter, label: 'Deduplicando resultados', duration: 2000 },
  { icon: Brain, label: 'Analisando sinais do perfil', duration: 3500 },
  { icon: Target, label: 'Detectando dores operacionais', duration: 3000 },
  { icon: BarChart3, label: 'Gerando score', duration: 2500 },
  { icon: MessageSquare, label: 'Preparando abordagem', duration: 2000 },
]

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    // Don't auto-complete the last step — it stays "in progress" until n8n responds
    if (currentStep >= steps.length - 1) {
      if (!completedSteps.includes(steps.length - 1)) {
        // Mark all but last as complete, keep last as current
        return
      }
      return
    }

    const timeout = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep])
      setCurrentStep((prev) => prev + 1)
    }, steps[currentStep].duration)

    return () => clearTimeout(timeout)
  }, [currentStep, onComplete])

  const progress = Math.min(((currentStep) / steps.length) * 100, 100)

  return (
    <div className="fixed inset-0 z-40 bg-surface-0 flex flex-col items-center justify-center pt-[52px]">
      <div className="w-full max-w-[440px] mx-auto px-5 flex flex-col items-center">
        <h2 className="text-[18px] font-semibold text-content-1 text-center mb-1">
          Analisando perfis...
        </h2>
        <p className="text-[13px] text-content-3 text-center mb-8">
          Buscando e qualificando leads
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-surface-3 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="w-full space-y-2">
          {steps.map((step, idx) => {
            const isComplete = completedSteps.includes(idx)
            const isCurrent = currentStep === idx && !isComplete
            const isPending = !isComplete && !isCurrent

            return (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300',
                  isComplete && 'bg-emerald-500/5',
                  isCurrent && 'bg-accent/5 border border-accent/10',
                  isPending && 'opacity-35'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300',
                    isComplete && 'bg-emerald-500/10',
                    isCurrent && 'bg-accent/10',
                    isPending && 'bg-surface-3',
                  )}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4 text-emerald-400 animate-step-complete" />
                  ) : (
                    <step.icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isCurrent ? 'text-accent' : 'text-content-3'
                      )}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[13px] font-medium transition-colors',
                    isComplete && 'text-emerald-400',
                    isCurrent && 'text-content-1',
                    isPending && 'text-content-3'
                  )}
                >
                  {step.label}
                </span>

                {/* Current indicator */}
                {isCurrent && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '300ms' }} />
                    <div className="w-1 h-1 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: '600ms' }} />
                  </div>
                )}

                {isComplete && (
                  <span className="ml-auto text-[11px] text-emerald-400/60 font-medium">
                    Concluído
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
