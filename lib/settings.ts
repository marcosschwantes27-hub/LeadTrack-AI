import fs from 'fs'
import path from 'path'

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

export interface SiteSettings {
  n8nWebhookUrl: string
}

const defaults: SiteSettings = {
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/leadtrack',
}

export function loadSettings(): SiteSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
      return { ...defaults, ...JSON.parse(raw) }
    }
  } catch {
    // fall through to defaults
  }
  return { ...defaults }
}

export function saveSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = loadSettings()
  const updated = { ...current, ...settings }

  const dir = path.dirname(SETTINGS_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  return updated
}

export function getWebhookUrl(): string {
  return loadSettings().n8nWebhookUrl
}
