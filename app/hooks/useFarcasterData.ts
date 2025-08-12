'use client'

import { useState, useEffect, useCallback } from 'react'
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk'
import { FeedType } from '@neynar/nodejs-sdk/build/api'
import { FarcasterCast } from '../types'

// Initialize Neynar client
const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
})

const neynarClient = new NeynarAPIClient(config)

/**
 * Convert Neynar cast format to our internal FarcasterCast format
 */
function convertNeynarCast(neynarCast: any): FarcasterCast {
  return {
    castId: neynarCast.hash,
    authorId: neynarCast.author.fid.toString(),
    authorUsername: neynarCast.author.username,
    authorDisplayName: neynarCast.author.display_name || neynarCast.author.username,
    authorAvatar: neynarCast.author.pfp_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${neynarCast.author.username}`,
    text: neynarCast.text,
    embedUrl: neynarCast.embeds?.[0]?.url,
    likesCount: neynarCast.reactions?.likes_count || 0,
    recastsCount: neynarCast.reactions?.recasts_count || 0,
    repliesCount: neynarCast.replies?.count || 0,
    timestamp: neynarCast.timestamp,
  }
}

export interface FarcasterDataHook {
  casts: FarcasterCast[]
  loading: boolean
  error: string | null
  refreshCasts: () => Promise<void>
}

/**
 * Hook to fetch trending Farcaster casts using Neynar API
 * This provides free access to basic trending content
 */
export function useFarcasterData(): FarcasterDataHook {
  const [casts, setCasts] = useState<FarcasterCast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrendingCasts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch trending feed using popular FIDs (this is a free endpoint)
      // Using well-known Farcaster accounts for trending content
      const popularFids = [3, 5650, 1, 2, 99] // dwr, vitalik, farcaster, etc.
      
      const feed = await neynarClient.fetchFeed({
        fids: popularFids,
        feedType: FeedType.Filter,
        filterType: 'fids' as any,
        limit: 20,
      })

      if (feed.casts) {
        const convertedCasts = feed.casts.map(convertNeynarCast)
        // Sort by engagement (likes + recasts + replies)
        const sortedCasts = convertedCasts.sort((a, b) => {
          const engagementA = a.likesCount + a.recastsCount + a.repliesCount
          const engagementB = b.likesCount + b.recastsCount + b.repliesCount
          return engagementB - engagementA
        })
        setCasts(sortedCasts.slice(0, 10)) // Top 10 most engaging
      }
    } catch (err) {
      console.error('Error fetching Farcaster data:', err)
      setError('Failed to fetch trending casts')
      // Fallback to empty array on error
      setCasts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshCasts = useCallback(async () => {
    await fetchTrendingCasts()
  }, [fetchTrendingCasts])

  useEffect(() => {
    fetchTrendingCasts()
  }, [fetchTrendingCasts])

  return {
    casts,
    loading,
    error,
    refreshCasts,
  }
}

/**
 * Hook for premium Farcaster content that requires payment
 * This will use x402 payments for advanced analytics and premium feeds
 */
export function usePremiumFarcasterData() {
  const [premiumCasts, setPremiumCasts] = useState<FarcasterCast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPremiumContent = useCallback(async (paymentClient: any) => {
    try {
      setLoading(true)
      setError(null)

      // This will be a payment-protected endpoint
      const response = await paymentClient.makePaymentCall('/api/premium/casts', {
        method: 'GET',
        params: {
          type: 'trending',
          timeframe: '24h',
          limit: 20,
        },
      })

      if (response.casts) {
        setPremiumCasts(response.casts)
      }
    } catch (err: any) {
      console.error('Error fetching premium content:', err)
      setError(err.message || 'Failed to fetch premium content')
      setPremiumCasts([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    premiumCasts,
    loading,
    error,
    fetchPremiumContent,
  }
}

/**
 * Hook for channel-specific trending content
 */
export function useChannelTrending(channelId?: string) {
  const [channelCasts, setChannelCasts] = useState<FarcasterCast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChannelTrending = useCallback(async () => {
    if (!channelId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch channel feed using parent_url
      const feed = await neynarClient.fetchFeed({
        feedType: FeedType.Filter,
        filterType: 'parent_url' as any,
        parentUrl: `https://warpcast.com/~/channel/${channelId}`,
        limit: 15,
      })

      if (feed.casts) {
        const convertedCasts = feed.casts.map(convertNeynarCast)
        setChannelCasts(convertedCasts)
      }
    } catch (err) {
      console.error('Error fetching channel trending:', err)
      setError('Failed to fetch channel content')
      setChannelCasts([])
    } finally {
      setLoading(false)
    }
  }, [channelId])

  useEffect(() => {
    if (channelId) {
      fetchChannelTrending()
    }
  }, [channelId, fetchChannelTrending])

  return {
    channelCasts,
    loading,
    error,
    refreshChannel: fetchChannelTrending,
  }
}
