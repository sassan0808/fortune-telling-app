import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '占い機能 - 花占い & 369数秘術',
  description: '生年月日から運命を読み解く占いアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}