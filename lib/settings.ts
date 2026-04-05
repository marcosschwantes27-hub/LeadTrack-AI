export interface SiteSettings {
  n8nWebhookUrl: string
}

const defaults: SiteSettings = {
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/leadtrack',
}

let memorySettings: Partial<SiteSettings> = {}

export function loadSettings(): SiteSettings {
  return { ...defaults, ...memorySettings }
}

export function saveSettings(settings: Partial<SiteSettings>): SiteSettings {
  memorySettings = { ...memorySettings, ...settings }
  return loadSettings()
}

export function getWebhookUrl(): string {
  return loadSettings().n8nWebhookUrl
}
