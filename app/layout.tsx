import type { Metadata } from 'next'
import ThemeProvider from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadTrack AI — Prospecção Inteligente no Instagram',
  description: 'A IA busca, analisa, qualifica e sugere a abordagem ideal para cada perfil.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-0 text-content-1 antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
