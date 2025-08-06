import { create } from 'zustand'
import { subscribeWithSelector, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User, JournalEntry, GrowthStage, AnalysisReport, WillItem, CustomCategory, DefaultCategory, WillPriority } from '@/types'
import { AuthUser } from '@/lib/auth'
import { journalData, willData, categoryData, JournalEntry as DataJournalEntry, WillItem as DataWillItem, CustomCategory as DataCustomCategory } from '@/lib/data'
import { AuthService, getAuthService, AuthResult } from '@/lib/auth'
import { handleError, ErrorType, withErrorHandling, createError } from '@/lib/error-handling'
import { isDebugMode } from '@/lib/config'

interface AppState {
  // 認証状態
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  // アプリデータ
  user: User | null
  entries: JournalEntry[]
  reports: AnalysisReport[]
  previousStage: GrowthStage | null
  showGrowthNotification: boolean
  willItems: WillItem[]
  customCategories: CustomCategory[]
  // 認証アクション
  setSupabaseUser: (user: SupabaseUser | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
  // データアクション
  setUser: (user: User | null) => void
  addEntry: (entry: Partial<JournalEntry>) => Promise<void>
  deleteEntry: (entryId: string) => Promise<void>
  removeEntry: (entryId: string) => Promise<void>
  updateGrowthStage: (stage: GrowthStage) => void
  updateUserProfile: (profile: Partial<User['profile']>) => void
  addReport: (report: AnalysisReport) => void
  getEntriesByDateRange: (start: Date, end: Date) => JournalEntry[]
  getLatestReport: () => AnalysisReport | null
  clearGrowthNotification: () => void
  // Will管理機能（growthStage統一済み）
  addWillItem: (will: Partial<WillItem>) => Promise<void>
  updateWillItem: (willId: string, updates: Partial<WillItem>) => Promise<void>
  deleteWillItem: (willId: string) => Promise<void>
  advanceGrowthStage: (willId: string) => void
  getWillsByCategory: (category: string) => WillItem[]
  getWillsByGrowthStage: (stage: GrowthStage) => WillItem[]
  addCustomCategory: (category: Partial<CustomCategory>) => Promise<void>
  deleteCustomCategory: (categoryId: string) => Promise<void>
  // データ一括設定アクション（AuthProvider用）
  setEntries: (entries: JournalEntry[]) => void
  setWillItems: (willItems: WillItem[]) => void
  setCustomCategories: (categories: CustomCategory[]) => void
}

export const useStore = create<AppState>()((set, get) => ({
      // 認証状態の初期値
      supabaseUser: null,
      isLoading: true,
      // アプリデータの初期値
      user: null,
      entries: [],
      reports: [],
      previousStage: null,
      showGrowthNotification: false,
      willItems: [],
      customCategories: [],
      
      // 認証アクション
      setSupabaseUser: (supabaseUser) => set({ supabaseUser }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: () => {
        console.log('🔍 DEBUG: Store signOut called');
        set({ 
          supabaseUser: null, 
          user: null, 
          entries: [], 
          reports: [], 
          willItems: [], 
          customCategories: [],
          previousStage: null,
          showGrowthNotification: false
        });
        console.log('🔍 DEBUG: Store state cleared');
      },
      
      // データアクション
      setUser: (user) => set({ user }),
      
      addEntry: async (entry) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          // 🔍 常にデバッグログを出力（フィード投稿問題の調査のため）
          console.log('📝 Store: Creating journal entry', { 
            userId: state.supabaseUser.id, 
            contentLength: entry.content?.length || 0,
            mode: entry.mode,
            hasContext: !!entry.context,
            contextType: entry.context?.type,
            attachmentCount: entry.context?.attachments?.length || 0
          });

          // 新しいデータアクセス層を使用してSupabaseに保存
          const entryData: Omit<DataJournalEntry, 'id' | 'created_at' | 'updated_at'> = {
            user_id: state.supabaseUser.id,
            content: entry.content || '',
            mode: entry.mode || 'text',
            emotion: entry.emotion || null,
            emotions: entry.emotions || null,
            nutrients: entry.nutrients || null,
            keywords: entry.keywords || null,
            weather: entry.weather || null,
            ai_insights: entry.aiInsights || null,
            context: entry.context || null,
          };

          // 🔧 デバッグ: データアクセス層接続確認
          console.log('🔍 DEBUG: About to call journalData.create', { 
            hasJournalData: !!journalData,
            entryData 
          });

          const result = await journalData.create(entryData);
          
          console.log('🔍 DEBUG: journalData.create result', {
            success: result.success,
            hasData: !!result.data,
            error: result.error,
            dataId: result.data?.id
          });
          
          if (!result.success || !result.data) {
            console.error('❌ Store: Journal creation failed', {
              success: result.success,
              error: result.error,
              entryData
            });
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to create journal entry',
              result.error || 'ジャーナルエントリーの作成に失敗しました'
            );
          }

          // Zustand状態を更新（immerで安全に）
          set((state) => {
            const newEntry: JournalEntry = {
              id: result.data!.id!,
              userId: result.data!.user_id,
              createdAt: new Date(result.data!.created_at!),
              content: result.data!.content,
              mode: result.data!.mode,
              emotions: result.data!.emotions || [],
              nutrients: result.data!.nutrients || { type: 'light', amount: 10 },
              emotion: result.data!.emotion as any,
              keywords: result.data!.keywords || [],
              aiInsights: result.data!.ai_insights || undefined,
              weather: result.data!.weather || 'sunny',
              context: result.data!.context,
            };

            const newEntries = [...state.entries, newEntry];
            
            // 成長ステージ計算
            if (!state.user) {
              return { entries: newEntries };
            }
            
            const updatedUser = { ...state.user };
            const entryCount = newEntries.length;
            const now = Date.now();
            const daysUsed = Math.ceil((now - new Date(updatedUser.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            let newStage = updatedUser.currentStage;
            
            // 成長条件判定
            if ((entryCount >= 10 || daysUsed >= 30) && newStage !== 'flower') {
              newStage = 'flower';
            } else if ((entryCount >= 5 || daysUsed >= 14) && (newStage === 'seed' || newStage === 'sprout')) {
              newStage = 'bud';
            } else if ((entryCount >= 2 || daysUsed >= 3) && newStage === 'seed') {
              newStage = 'sprout';
            }
            
            const stageChanged = newStage !== updatedUser.currentStage;
            if (stageChanged) {
              updatedUser.currentStage = newStage;
            }
            
            return {
              ...state,
              entries: newEntries,
              user: updatedUser,
              previousStage: stageChanged ? state.user.currentStage : state.previousStage,
              showGrowthNotification: stageChanged || state.showGrowthNotification
            };
          });

          if (isDebugMode()) {
            console.log('✅ Store: Journal entry created successfully', { entryId: result.data.id });
          }
        }, 'Create journal entry');
      },
      
      updateGrowthStage: async (stage) => {
        const state = get();
        
        // Supabaseに保存
        if (state.supabaseUser?.id) {
          try {
            const { userAPI } = await import('./database');
            await userAPI.updateGrowthStage(state.supabaseUser.id, stage);
            console.log('✅ STORE: Growth stage saved to Supabase:', stage);
          } catch (error) {
            console.error('❌ STORE: Failed to save growth stage to Supabase:', error);
          }
        }
        
        // ローカル状態を更新
        set((state) => ({
          user: state.user ? { ...state.user, currentStage: stage } : null
        }));
      },
      
      updateUserProfile: (profile) => set((state) => ({
        user: state.user ? {
          ...state.user,
          profile: {
            ...state.user.profile,
            ...profile
          }
        } : null
      })),
      
      deleteEntry: async (entryId) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          if (isDebugMode()) {
            console.log('🗑️ Store: Deleting journal entry', { entryId, userId: state.supabaseUser.id });
          }

          const result = await journalData.delete(entryId, state.supabaseUser.id);
          
          if (!result.success) {
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to delete journal entry',
              result.error || 'ジャーナルエントリーの削除に失敗しました'
            );
          }

          set((state) => ({
            entries: state.entries.filter(entry => entry.id !== entryId)
          }));

          if (isDebugMode()) {
            console.log('✅ Store: Journal entry deleted successfully', { entryId });
          }
        }, 'Delete journal entry');
      },
      
      // removeEntryエイリアス（一貫性のため）
      removeEntry: async (entryId) => {
        const state = get();
        return state.deleteEntry(entryId);
      },
      
      addReport: (report) => set((state) => ({
        reports: [...state.reports, report]
      })),
      
      getEntriesByDateRange: (start, end) => {
        const state = get()
        return state.entries.filter(entry => {
          const entryDate = new Date(entry.createdAt)
          return entryDate >= start && entryDate <= end
        })
      },
      
      getLatestReport: () => {
        const state = get()
        if (state.reports.length === 0) return null
        return state.reports.sort((a, b) => 
          new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        )[0]
      },
      
      clearGrowthNotification: () => set({ 
        showGrowthNotification: false,
        previousStage: null 
      }),

      // 🌟 Will管理機能 - 人生を変える力をここに！
      addWillItem: async (will) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          if (isDebugMode()) {
            console.log('🎯 Store: Creating will item', { 
              userId: state.supabaseUser.id, 
              title: will.title 
            });
          }

          const willItemData: Omit<DataWillItem, 'id' | 'created_at' | 'updated_at'> = {
            user_id: state.supabaseUser.id,
            title: will.title || '',
            description: will.description || null,
            category: will.category || 'growth',
            priority: will.priority || 'medium',
            growth_stage: will.growthStage || 'seed', // DB column name
            source_entry_id: will.sourceEntryId || null,
            bloomed_at: null,
          };

          const result = await willData.create(willItemData);
          
          if (!result.success || !result.data) {
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to create will item',
              result.error || 'Willアイテムの作成に失敗しました'
            );
          }

          set((state) => {
            const newWill: WillItem = {
              id: result.data!.id!,
              title: result.data!.title,
              description: result.data!.description || undefined,
              category: result.data!.category,
              priority: result.data!.priority,
              growthStage: result.data!.growth_stage, // Use DB column name
              createdAt: new Date(result.data!.created_at!),
              sourceEntryId: result.data!.source_entry_id || undefined,
              userId: result.data!.user_id,
              bloomedAt: result.data!.bloomed_at ? new Date(result.data!.bloomed_at) : undefined,
            };
            
            return { willItems: [...state.willItems, newWill] };
          });

          if (isDebugMode()) {
            console.log('✅ Store: Will item created successfully', { willId: result.data.id });
          }
        }, 'Create will item');
      },

      updateWillItem: async (willId, updates) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          if (isDebugMode()) {
            console.log('🔄 Store: Updating will item', { willId, updates });
          }

          // データベース更新の実装
          const result = await willData.updateGrowthStage(willId, state.supabaseUser.id, updates.growthStage || 'seed');
          
          if (!result.success) {
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to update will item',
              result.error || 'Willアイテムの更新に失敗しました'
            );
          }

          // 成功した場合のみローカル状態を更新
          set((state) => ({
            willItems: state.willItems.map(will => 
              will.id === willId ? {
                ...will,
                ...updates,
                bloomedAt: updates.growthStage === 'flower' ? new Date() : will.bloomedAt
              } : will
            )
          }));

          if (isDebugMode()) {
            console.log('✅ Store: Will item updated successfully', { willId });
          }
        }, 'Update will item');
      },

      deleteWillItem: async (willId) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          if (isDebugMode()) {
            console.log('🗑️ Store: Deleting will item', { willId, userId: state.supabaseUser.id });
          }

          const result = await willData.delete(willId, state.supabaseUser.id);
          
          if (!result.success) {
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to delete will item',
              result.error || 'Willアイテムの削除に失敗しました'
            );
          }

          set((state) => ({
            willItems: state.willItems.filter(will => will.id !== willId)
          }));

          if (isDebugMode()) {
            console.log('✅ Store: Will item deleted successfully', { willId });
          }
        }, 'Delete will item');
      },

      advanceGrowthStage: (willId: string) => set((state) => ({
        willItems: state.willItems.map(will => {
          if (will.id === willId) {
            const stages: GrowthStage[] = ['seed', 'sprout', 'bud', 'flower'];
            const currentIndex = stages.indexOf(will.growthStage);
            const nextIndex = (currentIndex + 1) % stages.length; // Loop back to seed from flower
            const newStage = stages[nextIndex];
            
            return {
              ...will,
              growthStage: newStage,
              bloomedAt: newStage === 'flower' ? new Date() : undefined
            };
          }
          return will;
        })
      })),

      getWillsByCategory: (category) => {
        const state = get()
        return state.willItems.filter(will => will.category === category)
      },

      getWillsByGrowthStage: (stage) => {
        const state = get()
        return state.willItems.filter(will => will.growthStage === stage)
      },

      addCustomCategory: async (category) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          if (isDebugMode()) {
            console.log('🏷️ Store: Creating custom category', { 
              userId: state.supabaseUser.id, 
              name: category.name 
            });
          }

          const categoryItemData: Omit<DataCustomCategory, 'id' | 'created_at'> = {
            user_id: state.supabaseUser.id,
            name: category.name || '',
            emoji: category.emoji || '✨',
          };

          const result = await categoryData.create(categoryItemData);
          
          if (!result.success || !result.data) {
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to create custom category',
              result.error || 'カスタムカテゴリーの作成に失敗しました'
            );
          }

          set((state) => {
            const newCategory: CustomCategory = {
              id: result.data!.id!,
              name: result.data!.name,
              emoji: result.data!.emoji,
              userId: result.data!.user_id,
              createdAt: new Date(result.data!.created_at!),
            };
            
            return { customCategories: [...state.customCategories, newCategory] };
          });

          if (isDebugMode()) {
            console.log('✅ Store: Custom category created successfully', { categoryId: result.data.id });
          }
        }, 'Create custom category');
      },

      deleteCustomCategory: async (categoryId) => {
        return withErrorHandling(async () => {
          const state = get();
          
          if (!state.supabaseUser?.id) {
            throw createError(
              ErrorType.AUTH_FAILED,
              'No authenticated user',
              'ログインが必要です'
            );
          }

          if (isDebugMode()) {
            console.log('🗑️ Store: Deleting custom category', { categoryId, userId: state.supabaseUser.id });
          }

          const result = await categoryData.delete(categoryId, state.supabaseUser.id);
          
          if (!result.success) {
            throw createError(
              ErrorType.DB_QUERY_FAILED,
              'Failed to delete custom category',
              result.error || 'カスタムカテゴリーの削除に失敗しました'
            );
          }

          set((state) => ({
            customCategories: state.customCategories.filter(cat => cat.id !== categoryId),
            // カスタムカテゴリに属するWillアイテムを「growth」に移動
            willItems: state.willItems.map(will => 
              will.category === categoryId ? { ...will, category: 'growth' } : will
            )
          }));

          if (isDebugMode()) {
            console.log('✅ Store: Custom category deleted successfully', { categoryId });
          }
        }, 'Delete custom category');
      },

      // 🔧 データ一括設定アクション（AuthProvider用・State Mutation回避）
      setEntries: (entries) => set({ entries }),
      setWillItems: (willItems) => set({ willItems }),
      setCustomCategories: (customCategories) => set({ customCategories })
}))