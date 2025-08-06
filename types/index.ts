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