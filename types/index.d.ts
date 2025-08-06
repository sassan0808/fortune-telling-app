// 占いアプリケーション用の型定義

export interface FlowerFortuneResult {
  flower: string
  personality: string
  love: string
  money: string
  work: string
  advice: string
}

export interface NumerologyResult {
  lifePathNumber: number
  destinyNumber: number
  soulNumber: number
  personalityNumber: number
  maturityNumber: number
  birthNumber: number
  analysis?: string
}

// 元プロジェクトとの互換性のためのダミー型定義
export type User = any
export type JournalEntry = any
export type GrowthStage = 'seed' | 'sprout' | 'bud' | 'flower'
export type AnalysisReport = any
export type WillItem = any
export type CustomCategory = any
export type DefaultCategory = any
export type WillPriority = any
export type AuthUser = any