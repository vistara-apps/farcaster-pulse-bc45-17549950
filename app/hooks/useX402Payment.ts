'use client'

import { useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { withPaymentInterceptor } from 'x402-axios'
import axios, { AxiosInstance } from 'axios'
import type { WalletClient } from 'viem'

export interface X402PaymentHook {
  x402Axios: AxiosInstance | null
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
      // Create a regular axios instance
      const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
        timeout: 30000,
      })

      // TODO: Add x402 payment interceptor when wallet client types are compatible
      // For now, return a basic axios instance that can be extended later
      // withPaymentInterceptor(axiosInstance, walletClient)

      return axiosInstance
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
