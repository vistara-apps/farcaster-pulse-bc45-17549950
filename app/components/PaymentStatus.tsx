'use client'

import { useState, useEffect } from 'react'

export interface PaymentStatusProps {
  isProcessing: boolean
  error: string | null
  success: boolean
  amount?: string
  currency?: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function PaymentStatus({
  isProcessing,
  error,
  success,
  amount,
  currency = 'USDC',
  onRetry,
  onDismiss
}: PaymentStatusProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Auto-dismiss success messages after 5 seconds
  useEffect(() => {
    if (success && onDismiss) {
      const timer = setTimeout(onDismiss, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, onDismiss])

  if (!isProcessing && !error && !success) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Processing State */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Processing Payment
              </h4>
              <p className="text-xs text-blue-700 mt-1">
                {amount && `Paying ${amount} ${currency} for premium content...`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-900">
                  Payment Successful
                </h4>
                <p className="text-xs text-green-700 mt-1">
                  Premium content unlocked!
                </p>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-green-400 hover:text-green-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-900">
                  Payment Failed
                </h4>
                <p className="text-xs text-red-700 mt-1">
                  {error}
                </p>
                
                {/* Show more details button for complex errors */}
                {error.length > 50 && (
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
                  >
                    {showDetails ? 'Show less' : 'Show details'}
                  </button>
                )}

                {/* Detailed error message */}
                {showDetails && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 font-mono">
                    {error}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-2 mt-3">
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Retry Payment
                    </button>
                  )}
                  {onDismiss && (
                    <button
                      onClick={onDismiss}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Hook for managing payment status state
 */
export function usePaymentStatus() {
  const [status, setStatus] = useState<{
    isProcessing: boolean
    error: string | null
    success: boolean
    amount?: string
    currency?: string
  }>({
    isProcessing: false,
    error: null,
    success: false,
  })

  const startProcessing = (amount?: string, currency?: string) => {
    setStatus({
      isProcessing: true,
      error: null,
      success: false,
      amount,
      currency,
    })
  }

  const setSuccess = () => {
    setStatus(prev => ({
      ...prev,
      isProcessing: false,
      success: true,
      error: null,
    }))
  }

  const setError = (error: string) => {
    setStatus(prev => ({
      ...prev,
      isProcessing: false,
      error,
      success: false,
    }))
  }

  const reset = () => {
    setStatus({
      isProcessing: false,
      error: null,
      success: false,
    })
  }

  return {
    status,
    startProcessing,
    setSuccess,
    setError,
    reset,
  }
}

/**
 * Wallet connection status component
 */
export function WalletConnectionStatus({ 
  isConnected, 
  isConnecting, 
  onConnect 
}: { 
  isConnected: boolean
  isConnecting: boolean
  onConnect?: () => void 
}) {
  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Wallet Connected</span>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-yellow-800">
            {isConnecting ? 'Connecting wallet...' : 'Wallet not connected'}
          </span>
        </div>
        {onConnect && !isConnecting && (
          <button
            onClick={onConnect}
            className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
          >
            Connect
          </button>
        )}
      </div>
      <p className="text-xs text-yellow-700 mt-1">
        Connect your wallet to access premium content with x402 payments
      </p>
    </div>
  )
}
