/**
 * 🚀 全体最適設定管理システム v2.0
 * - 単一責任原則: 設定管理の完全分離
 * - 型安全性: Compile time + Runtime検証
 * - 環境抽象化: 開発/本番の統一インターフェース
 */

import { z } from 'zod';

// 🎯 設定スキーマ定義（厳密な型安全性）
const EnvironmentSchema = z.object({
  // システム環境
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Supabase設定（必須）
  SUPABASE_URL: z.string().url('有効なSupabase URLが必要です').optional(),
  SUPABASE_ANON_KEY: z.string().min(50, 'Supabaseキーが短すぎます').optional(),
  
  // AI設定（オプション）
  GEMINI_API_KEY: z.string().optional(),
  
  // アプリケーション設定
  APP_URL: z.string().url().default('http://localhost:3000'),
  DEBUG_MODE: z.boolean().default(false),
});

// 🏗️ 設定型定義
export type Environment = z.infer<typeof EnvironmentSchema>;

// 🔧 機能設定の抽象化
export interface FeatureFlags {
  readonly ai: boolean;
  readonly debug: boolean;
  readonly analytics: boolean;
}

export interface DatabaseConfig {
  readonly url: string;
  readonly anonKey: string;
  readonly isReady: boolean;
}

export interface AppConfig {
  readonly environment: Environment['NODE_ENV'];
  readonly url: string;
  readonly features: FeatureFlags;
  readonly database: DatabaseConfig;
}

/**
 * 🎯 環境変数の正規化
 * process.env → 型安全な設定オブジェクト
 */
function normalizeEnvironment(): Environment {
  // 🔧 環境変数の正規化（NEXT_PUBLIC_プレフィックス除去）
  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  };

  // 🔍 デバッグ情報（ブラウザでのみ表示）
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔧 Browser environment variables:', {
      NODE_ENV: rawEnv.NODE_ENV,
      SUPABASE_URL: rawEnv.SUPABASE_URL ? `${rawEnv.SUPABASE_URL.substring(0, 30)}...` : 'undefined',
      SUPABASE_ANON_KEY: rawEnv.SUPABASE_ANON_KEY ? `${rawEnv.SUPABASE_ANON_KEY.substring(0, 20)}...` : 'undefined',
      GEMINI_API_KEY: rawEnv.GEMINI_API_KEY ? 'set' : 'undefined',
      APP_URL: rawEnv.APP_URL,
      DEBUG_MODE: rawEnv.DEBUG_MODE,
    });
  }

  // 🛡️ スキーマ検証を緩和（オプショナルフィールドを考慮）
  const result = EnvironmentSchema.safeParse(rawEnv);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join('\n');
    
    // ブラウザでエラーを表示
    if (typeof window !== 'undefined') {
      console.error('🚨 Browser config validation failed:', errors);
      console.warn('⚠️ アプリはデモモードで動作します');
    }
    
    // サーバーサイドではエラーを投げずに、デフォルト値で継続
    return {
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      DEBUG_MODE: process.env.DEBUG_MODE === 'true',
    };
  }

  return result.data;
}

/**
 * 🚀 アプリケーション設定の構築
 * 環境変数 → 機能別設定オブジェクト
 */
function createAppConfig(): AppConfig {
  const env = normalizeEnvironment();
  
  // 🎯 データベース設定
  const database: DatabaseConfig = {
    url: env.SUPABASE_URL || '',
    anonKey: env.SUPABASE_ANON_KEY || '',
    isReady: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY && 
                !env.SUPABASE_URL.includes('placeholder') && 
                !env.SUPABASE_ANON_KEY.includes('placeholder')),
  };

  // 🔧 機能フラグ
  const features: FeatureFlags = {
    ai: !!env.GEMINI_API_KEY && env.GEMINI_API_KEY.length > 0,
    debug: env.DEBUG_MODE,
    analytics: env.NODE_ENV === 'production', // 本番環境のみ
  };

  return {
    environment: env.NODE_ENV,
    url: env.APP_URL,
    features,
    database,
  };
}

// 🏭 シングルトンパターン（設定の一意性保証）
let configInstance: AppConfig | null = null;

/**
 * 📦 設定の取得（メイン API）
 */
export function getAppConfig(): AppConfig {
  if (!configInstance) {
    configInstance = createAppConfig();
    
    // 🔍 開発環境での設定状況表示（一時的に常に表示）
    if (configInstance.environment === 'development') {
      console.log('🔧 App Config Loaded:', {
        environment: configInstance.environment,
        databaseReady: configInstance.database.isReady,
        features: configInstance.features,
        hasUrl: !!configInstance.database.url,
        hasKey: !!configInstance.database.anonKey,
        urlPrefix: configInstance.database.url.substring(0, 30),
        keyLength: configInstance.database.anonKey.length
      });
    }
  }
  
  return configInstance;
}

/**
 * 🔍 設定診断（トラブルシューティング用）
 */
export function diagnoseConfig(): {
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
} {
  try {
    const config = getAppConfig();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // データベース接続チェック
    if (!config.database.isReady) {
      issues.push('Supabase設定が未完了またはプレースホルダー値');
      recommendations.push('環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY に実際の値を設定');
    }

    // 本番環境でのAI機能チェック
    if (config.environment === 'production' && !config.features.ai) {
      recommendations.push('AI機能を有効にするには GEMINI_API_KEY を設定');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
    };
  } catch (error) {
    return {
      isHealthy: false,
      issues: [error instanceof Error ? error.message : '設定読み込みエラー'],
      recommendations: ['npm run verify-config で詳細確認'],
    };
  }
}

/**
 * 🔧 設定の部分取得（後方互換性）
 */
export function getSupabaseConfig() {
  const config = getAppConfig();
  return config.database;
}

export function getAiConfig() {
  const config = getAppConfig();
  if (!config.features.ai) {
    throw new Error('AI機能が無効です。GEMINI_API_KEY を設定してください。');
  }
  return {
    apiKey: process.env.GEMINI_API_KEY!,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash-exp',
    // 🚀 API URL生成ヘルパー
    getApiUrl: (model?: string) => {
      const actualModel = model || 'gemini-2.0-flash-exp';
      return `https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    }
  };
}

export function isDebugMode() {
  return getAppConfig().features.debug;
}

export function isDevelopment() {
  return getAppConfig().environment === 'development';
}

export function isProduction() {
  return getAppConfig().environment === 'production';
}