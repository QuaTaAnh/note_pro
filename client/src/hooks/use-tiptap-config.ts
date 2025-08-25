import { useState, useEffect, useCallback } from 'react'
import { isConfigValid, fetchCollabToken, fetchAiToken } from '@/lib/tiptap-collab-utils'

interface TiptapConfig {
  isReady: boolean
  hasCollab: boolean
  hasAi: boolean
  collabToken: string | null
  aiToken: string | null
  error: string | null
  isLoading: boolean
}

interface UseTiptapConfigOptions {
  autoFetch?: boolean
  retryCount?: number
  retryDelay?: number
}

export function useTiptapConfig(options: UseTiptapConfigOptions = {}) {
  const {
    autoFetch = true,
    retryCount = 3,
    retryDelay = 1000
  } = options

  const [config, setConfig] = useState<TiptapConfig>({
    isReady: false,
    hasCollab: false,
    hasAi: false,
    collabToken: null,
    aiToken: null,
    error: null,
    isLoading: true
  })

  const [retryAttempts, setRetryAttempts] = useState(0)

  const validateConfig = useCallback(() => {
    const { hasCollabConfig, hasAiConfig } = isConfigValid()
    
    setConfig(prev => ({
      ...prev,
      hasCollab: Boolean(hasCollabConfig),
      hasAi: Boolean(hasAiConfig),
      isReady: Boolean(hasCollabConfig || hasAiConfig)
    }))

    return { hasCollabConfig, hasAiConfig }
  }, [])

  const fetchTokens = useCallback(async () => {
    setConfig(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const [collabToken, aiToken] = await Promise.all([
        fetchCollabToken(),
        fetchAiToken()
      ])

      setConfig(prev => ({
        ...prev,
        collabToken,
        aiToken,
        isLoading: false,
        isReady: Boolean(collabToken || aiToken)
      }))

      return { collabToken, aiToken }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tokens'
      
      setConfig(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))

      // Retry logic
      if (retryAttempts < retryCount) {
        setTimeout(() => {
          setRetryAttempts(prev => prev + 1)
          fetchTokens()
        }, retryDelay)
      }

      throw error
    }
  }, [retryAttempts, retryCount, retryDelay])

  const retry = useCallback(() => {
    setRetryAttempts(0)
    setConfig(prev => ({ ...prev, error: null }))
    fetchTokens()
  }, [fetchTokens])

  useEffect(() => {
    validateConfig()
  }, [validateConfig])

  useEffect(() => {
    if (autoFetch && config.isReady) {
      fetchTokens()
    }
  }, [autoFetch, config.isReady, fetchTokens])

  return {
    ...config,
    validateConfig,
    fetchTokens,
    retry,
    retryAttempts
  }
} 