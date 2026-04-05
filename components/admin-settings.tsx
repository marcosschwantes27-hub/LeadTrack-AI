'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Lock,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Settings,
  Link,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface SiteSettings {
  n8nWebhookUrl: string
}

export default function AdminSettings() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [settings, setSettings] = useState<SiteSettings>({ n8nWebhookUrl: '' })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle')

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/login')
      const data = await res.json()
      setAuthenticated(data.authenticated)
      if (data.authenticated) loadSettings()
    } catch {
      setAuthenticated(false)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  async function loadSettings() {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch { /* ignore */ }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.success) {
        setAuthenticated(true)
        setPassword('')
        loadSettings()
      } else {
        setLoginError(data.error || 'Senha incorreta')
      }
    } catch {
      setLoginError('Erro de conexão')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthenticated(false)
    setSettings({ n8nWebhookUrl: '' })
  }

  async function handleSave() {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  async function handleTestWebhook() {
    setTestStatus('testing')
    try {
      const res = await fetch(settings.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
        signal: AbortSignal.timeout(10000),
      })
      setTestStatus(res.ok || res.status === 200 ? 'ok' : 'fail')
    } catch {
      setTestStatus('fail')
    }
    setTimeout(() => setTestStatus('idle'), 4000)
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)]">
        <Loader2 className="w-6 h-6 text-content-3 animate-spin" />
      </div>
    )
  }

  // Login form
  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] px-4">
        <div className="w-full max-w-[360px]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-[18px] font-semibold text-content-1">Acesso Admin</h2>
            <p className="text-[13px] text-content-3 mt-1">Insira a senha para acessar as configurações</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha do admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-11 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-3 hover:text-content-2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-400">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loginLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Settings panel
  return (
    <div className="max-w-[600px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-content-1">Configurações</h2>
            <p className="text-[12px] text-content-3">Painel do administrador</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-content-3 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </div>

      {/* Webhook n8n */}
      <div className="bg-surface-1 border border-line/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-accent" />
          <h3 className="text-[14px] font-semibold text-content-1">Webhook n8n</h3>
        </div>
        <p className="text-[12px] text-content-3 -mt-2">
          URL do webhook que recebe as requisições de prospecção
        </p>

        <div className="space-y-3">
          <input
            type="url"
            placeholder="http://localhost:5678/webhook/leadtrack"
            value={settings.n8nWebhookUrl}
            onChange={(e) => setSettings((s) => ({ ...s, n8nWebhookUrl: e.target.value }))}
            className="w-full h-10 px-4 rounded-lg bg-surface-2 border border-line text-[13px] text-content-1 placeholder:text-content-3/50 focus:outline-none focus:border-accent/50 transition-colors font-mono"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors',
                saveStatus === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : saveStatus === 'error'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-accent text-white hover:bg-accent-hover'
              )}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : saveStatus === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saveStatus === 'success' ? 'Salvo!' : saveStatus === 'error' ? 'Erro ao salvar' : 'Salvar'}
            </button>

            <button
              onClick={handleTestWebhook}
              disabled={testStatus === 'testing' || !settings.n8nWebhookUrl}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border transition-colors',
                testStatus === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : testStatus === 'fail'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-surface-2 text-content-2 border-line hover:text-content-1 hover:bg-surface-3'
              )}
            >
              {testStatus === 'testing' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : testStatus === 'ok' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : testStatus === 'fail' ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <Link className="w-3.5 h-3.5" />
              )}
              {testStatus === 'ok' ? 'Conectado!' : testStatus === 'fail' ? 'Falha' : 'Testar conexão'}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 px-4 py-3 rounded-lg bg-surface-2/50 border border-line/30 text-[11px] text-content-3 space-y-1">
        <p>A senha admin é armazenada como hash bcrypt na variável de ambiente.</p>
        <p>Para alterar a senha, gere um novo hash e atualize <code className="text-content-2">ADMIN_PASSWORD_HASH</code> no <code className="text-content-2">.env.local</code>.</p>
      </div>
    </div>
  )
}
