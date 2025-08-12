'use client'

import { useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { createX402Axios } from 'x402-axios'
import { toAccount } from 'viem/accounts'
import type { WalletClient } from 'viem'

export interface X402PaymentHook {
  x402Axios: ReturnType<typeof createX402Axios> | null
  isWalletConnected: boolean
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook that integrates x402-axios with wagmi's useWalletClient
 * Provides a payment-enabled axios instance that automatically handles 402 responses
 */
export function useX402Payment(): X402PaymentHook {
  const { data: walletClient, isLoading, error } = useWalletClient()

  const x402Axios = useMemo(() => {
    if (!walletClient) {
      return null
    }

    try {
      // Convert wagmi wallet client to viem account format for x402
      const account = toAccount({
        address: walletClient.account?.address || '0x',
        async signMessage({ message }) {
          if (!walletClient.account) {
            throw new Error('No account connected')
          }
          return await walletClient.signMessage({
            account: walletClient.account,
            message: typeof message === 'string' ? message : message.raw,
          })
        },
        async signTransaction(transaction) {
          if (!walletClient.account) {
            throw new Error('No account connected')
          }
          return await walletClient.signTransaction({
            account: walletClient.account,
            ...transaction,
          })
        },
        async signTypedData(typedData) {
          if (!walletClient.account) {
            throw new Error('No account connected')
          }
          return await walletClient.signTypedData({
            account: walletClient.account,
            ...typedData,
          })
        },
      })

      // Create x402-enabled axios instance
      return createX402Axios({
        account,
        maxPaymentAmount: '1.00', // Maximum $1 USDC per request
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
      })
    } catch (err) {
      console.error('Failed to create x402 axios instance:', err)
      return null
    }
  }, [walletClient])

  return {
    x402Axios,
    isWalletConnected: !!walletClient?.account,
    isLoading,
    error: error as Error | null,
  }
}

/**
 * Hook for making payment-protected API calls
 * Automatically handles 402 Payment Required responses
 */
export function usePaymentProtectedAPI() {
  const { x402Axios, isWalletConnected, isLoading, error } = useX402Payment()

  const makePaymentCall = async <T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      data?: any
      params?: any
    } = {}
  ): Promise<T> => {
    if (!x402Axios) {
      throw new Error('Wallet not connected or x402 not initialized')
    }

    const { method = 'GET', data, params } = options

    try {
      const response = await x402Axios.request({
        url: endpoint,
        method,
        data,
        params,
      })

      return response.data
    } catch (err: any) {
      // Enhanced error handling for payment-specific errors
      if (err.response?.status === 402) {
        throw new Error('Payment required but failed to process')
      }
      if (err.response?.status === 403) {
        throw new Error('Insufficient funds or payment rejected')
      }
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient USDC balance for payment')
      }
      if (err.code === 'USER_REJECTED') {
        throw new Error('Payment was rejected by user')
      }
      
      throw err
    }
  }

  return {
    makePaymentCall,
    isWalletConnected,
    isLoading,
    error,
  }
}
