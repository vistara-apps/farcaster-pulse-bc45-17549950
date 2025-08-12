
export interface FarcasterCast {
  castId: string
  authorId: string
  authorUsername: string
  authorDisplayName: string
  authorAvatar: string
  text: string
  embedUrl?: string
  likesCount: number
  recastsCount: number
  repliesCount: number
  timestamp: string
}

export interface ZoraDrop {
  collectionId: string
  name: string
  imageUrl: string
  currentPrice: number
  salesVolume: number
  newCollectors: number
  socialBuzzScore: number
  timestamp: string
}

export interface UserPreferences {
  userId: string
  preferredChains: string[]
  mutedTopics: string[]
}

export type TabType = 'farcaster' | 'zora' | 'insights'
