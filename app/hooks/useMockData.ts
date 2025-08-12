
'use client'

import { useState, useEffect } from 'react'
import { FarcasterCast, ZoraDrop } from '../types'

// Mock data generator for demo purposes
const generateMockCasts = (): FarcasterCast[] => {
  const mockData = [
    {
      castId: '1',
      authorId: 'vitalik',
      authorUsername: 'vitalik.eth',
      authorDisplayName: 'Vitalik Buterin',
      authorAvatar: 'https://i.imgur.com/dummy1.jpg',
      text: 'Excited about the future of onchain social! Base is making it so easy for developers to build amazing experiences. 🚀',
      likesCount: 247,
      recastsCount: 89,
      repliesCount: 42,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      castId: '2',
      authorId: 'dwr',
      authorUsername: 'dwr.eth',
      authorDisplayName: 'Dan Romero',
      text: 'Frames on Farcaster are getting crazy good. Just tried a new Base mini app that lets you trade NFTs without leaving your feed!',
      embedUrl: 'https://i.imgur.com/dummy2.jpg',
      likesCount: 189,
      recastsCount: 156,
      repliesCount: 67,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      castId: '3',
      authorId: 'jessepollak',
      authorUsername: 'jessepollak',
      authorDisplayName: 'Jesse Pollak',
      text: 'Base hit 1M+ daily transactions! The onchain summer continues 🌞\n\nSo proud of what builders are creating every day.',
      likesCount: 334,
      recastsCount: 201,
      repliesCount: 88,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return mockData.map(cast => ({
    ...cast,
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cast.authorUsername}`,
  }))
}

const generateMockDrops = (): ZoraDrop[] => {
  return [
    {
      collectionId: 'zora-1',
      name: 'Onchain Vibes',
      imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=zora1',
      currentPrice: 0.08,
      salesVolume: 12.4,
      newCollectors: 156,
      socialBuzzScore: 85,
      timestamp: new Date().toISOString(),
    },
    {
      collectionId: 'zora-2',
      name: 'Base Builders',
      imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=zora2',
      currentPrice: 0.05,
      salesVolume: 8.7,
      newCollectors: 89,
      socialBuzzScore: 72,
      timestamp: new Date().toISOString(),
    },
    {
      collectionId: 'zora-3',
      name: 'Farcaster Frames Art',
      imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=zora3',
      currentPrice: 0.12,
      salesVolume: 15.2,
      newCollectors: 234,
      socialBuzzScore: 91,
      timestamp: new Date().toISOString(),
    },
  ]
}

export function useMockData() {
  const [casts, setCasts] = useState<FarcasterCast[]>([])
  const [drops, setDrops] = useState<ZoraDrop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setCasts(generateMockCasts())
      setDrops(generateMockDrops())
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return { casts, drops, loading }
}
