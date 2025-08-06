/**
 * 🚀 統一設定管理システム - 新アーキテクチャ
 * 
 * Single Source of Truth:
 * - 全ての設定は environment.ts から取得
 * - ハードコーディング完全排除
 * - 型安全性・整合性保証
 */

// 新設定システムへの完全移行
export { 
  getAppConfig,
  getSupabaseConfig, 
  getAiConfig,
  diagnoseConfig,
  isDevelopment,
  isProduction,
  isDebugMode,
  type AppConfig,
  type DatabaseConfig,
  type FeatureFlags
} from './environment';

// 後方互換性のための警告付きエクスポート
export function getConfig() {
  console.warn('⚠️ getConfig() は非推奨です。getAppConfig() を使用してください。');
  const { getAppConfig } = require('./environment');
  return getAppConfig();
}

export function validateConfig() {
  console.warn('⚠️ validateConfig() は非推奨です。diagnoseConfig() を使用してください。');
  const { diagnoseConfig } = require('./environment');
  return diagnoseConfig();
}