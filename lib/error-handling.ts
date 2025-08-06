// エラーハンドリングユーティリティ（占いアプリ用簡易版）

export enum ErrorType {
  AUTH_FAILED = 'AUTH_FAILED',
  DB_QUERY_FAILED = 'DB_QUERY_FAILED',
  GENERAL = 'GENERAL'
}

export const createError = (type: ErrorType, message: string, userMessage?: string) => {
  return new Error(userMessage || message)
}

export const handleError = (error: any) => {
  console.error(error)
}

export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    console.error(`Error in ${context}:`, error)
    throw error
  }
}