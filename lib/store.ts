import { create } from 'zustand'

interface FortuneStore {
  // 占い結果の保存
  flowerFortuneResult: any | null
  numerologyResult: any | null
  
  // アクション
  setFlowerFortuneResult: (result: any) => void
  setNumerologyResult: (result: any) => void
  clearResults: () => void
}

export const useStore = create<FortuneStore>((set) => ({
  // 初期状態
  flowerFortuneResult: null,
  numerologyResult: null,
  
  // アクション
  setFlowerFortuneResult: (result) => set({ flowerFortuneResult: result }),
  setNumerologyResult: (result) => set({ numerologyResult: result }),
  clearResults: () => set({ 
    flowerFortuneResult: null, 
    numerologyResult: null 
  }),
}))