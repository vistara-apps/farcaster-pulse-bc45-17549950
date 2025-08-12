import { NextRequest, NextResponse } from 'next/server'
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk'

// Initialize Neynar client for server-side usage
const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
})

const neynarClient = new NeynarAPIClient(config)

/**
 * Premium Farcaster Casts API - Requires x402 Payment
 * Returns advanced trending analytics and premium content
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'trending'
  const timeframe = searchParams.get('timeframe') || '24h'
  const limit = parseInt(searchParams.get('limit') || '20')

  // Check for payment header (x402 will add this after successful payment)
  const paymentHeader = request.headers.get('x-payment-response')
  
  if (!paymentHeader) {
    // Return 402 Payment Required with payment details
    return NextResponse.json(
      {
        error: 'Payment required for premium content',
        message: 'This endpoint provides advanced Farcaster analytics and premium trending content',
        features: [
          'Advanced engagement metrics',
          'Real-time trending analysis',
          'Premium content filtering',
          'Extended historical data',
          'Quality score rankings'
        ]
      },
      {
        status: 402,
        headers: {
          'x-payment-required': 'true',
          'x-payment-amount': '0.10', // $0.10 USDC
          'x-payment-currency': 'USDC',
          'x-payment-chain': 'base',
          'x-payment-description': 'Premium Farcaster trending analytics',
        },
      }
    )
  }

  try {
    // Fetch premium trending content with advanced analytics
    const feed = await neynarClient.fetchTrendingFeed({
      limit: limit * 2, // Fetch more to filter for quality
      timeWindow: '24h',
      provider: 'neynar',
    })

    if (!feed.casts) {
      return NextResponse.json({ casts: [], analytics: null })
    }

    // Convert and enhance casts with premium analytics
    const enhancedCasts = feed.casts.map((cast: any) => {
      const engagementScore = (cast.reactions?.likes_count || 0) + 
                             (cast.reactions?.recasts_count || 0) * 2 + 
                             (cast.replies?.count || 0) * 1.5

      const qualityScore = calculateQualityScore(cast)
      const viralityScore = calculateViralityScore(cast)
      
      return {
        castId: cast.hash,
        authorId: cast.author.fid.toString(),
        authorUsername: cast.author.username,
        authorDisplayName: cast.author.display_name || cast.author.username,
        authorAvatar: cast.author.pfp_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cast.author.username}`,
        text: cast.text,
        embedUrl: cast.embeds?.[0]?.url,
        likesCount: cast.reactions?.likes_count || 0,
        recastsCount: cast.reactions?.recasts_count || 0,
        repliesCount: cast.replies?.count || 0,
        timestamp: cast.timestamp,
        // Premium analytics
        engagementScore,
        qualityScore,
        viralityScore,
        trendingRank: 0, // Will be set after sorting
        authorVerified: cast.author.power_badge || false,
        authorFollowerCount: cast.author.follower_count || 0,
        contentCategory: categorizeContent(cast.text),
        sentimentScore: analyzeSentiment(cast.text),
      }
    })

    // Sort by composite trending score
    const sortedCasts = enhancedCasts
      .sort((a, b) => {
        const scoreA = a.engagementScore * 0.4 + a.qualityScore * 0.3 + a.viralityScore * 0.3
        const scoreB = b.engagementScore * 0.4 + b.qualityScore * 0.3 + b.viralityScore * 0.3
        return scoreB - scoreA
      })
      .slice(0, limit)
      .map((cast, index) => ({ ...cast, trendingRank: index + 1 }))

    // Generate analytics summary
    const analytics = {
      totalCasts: sortedCasts.length,
      averageEngagement: sortedCasts.reduce((sum, cast) => sum + cast.engagementScore, 0) / sortedCasts.length,
      topCategories: getTopCategories(sortedCasts),
      sentimentDistribution: getSentimentDistribution(sortedCasts),
      verifiedAuthorsRatio: sortedCasts.filter(cast => cast.authorVerified).length / sortedCasts.length,
      timeframe,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      casts: sortedCasts,
      analytics,
      premium: true,
      paymentConfirmed: true,
    })

  } catch (error) {
    console.error('Error fetching premium casts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch premium content' },
      { status: 500 }
    )
  }
}

/**
 * Calculate quality score based on various factors
 */
function calculateQualityScore(cast: any): number {
  let score = 50 // Base score

  // Text quality indicators
  const textLength = cast.text?.length || 0
  if (textLength > 50 && textLength < 280) score += 10
  if (textLength > 280) score -= 5

  // Has meaningful content (not just emoji/short phrases)
  const meaningfulWords = (cast.text?.match(/\b\w{4,}\b/g) || []).length
  score += Math.min(meaningfulWords * 2, 20)

  // Author credibility
  if (cast.author.power_badge) score += 15
  if (cast.author.follower_count > 1000) score += 10
  if (cast.author.follower_count > 10000) score += 5

  // Engagement quality
  const engagementRatio = (cast.reactions?.likes_count || 0) / Math.max(cast.author.follower_count || 1, 1)
  if (engagementRatio > 0.01) score += 10

  return Math.min(Math.max(score, 0), 100)
}

/**
 * Calculate virality score based on engagement velocity
 */
function calculateViralityScore(cast: any): number {
  const now = new Date()
  const castTime = new Date(cast.timestamp)
  const hoursOld = (now.getTime() - castTime.getTime()) / (1000 * 60 * 60)

  if (hoursOld === 0) return 0

  const totalEngagement = (cast.reactions?.likes_count || 0) + 
                         (cast.reactions?.recasts_count || 0) + 
                         (cast.replies?.count || 0)

  // Engagement per hour, with decay for older posts
  const engagementVelocity = totalEngagement / hoursOld
  const decayFactor = Math.exp(-hoursOld / 24) // Decay over 24 hours

  return Math.min(engagementVelocity * decayFactor * 10, 100)
}

/**
 * Categorize content based on keywords and patterns
 */
function categorizeContent(text: string): string {
  if (!text) return 'other'

  const lowerText = text.toLowerCase()
  
  if (lowerText.match(/\b(crypto|bitcoin|eth|defi|nft|token|blockchain|web3)\b/)) return 'crypto'
  if (lowerText.match(/\b(ai|artificial intelligence|ml|machine learning|gpt|llm)\b/)) return 'ai'
  if (lowerText.match(/\b(build|dev|code|programming|tech|startup)\b/)) return 'tech'
  if (lowerText.match(/\b(art|design|creative|music|culture)\b/)) return 'culture'
  if (lowerText.match(/\b(base|farcaster|frame|cast|social)\b/)) return 'social'
  
  return 'general'
}

/**
 * Simple sentiment analysis
 */
function analyzeSentiment(text: string): number {
  if (!text) return 0

  const positiveWords = ['great', 'amazing', 'awesome', 'love', 'excited', 'happy', 'good', 'best', 'fantastic']
  const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'worst', 'sad', 'angry', 'disappointed']

  const lowerText = text.toLowerCase()
  let score = 0

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 1
  })

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1
  })

  return Math.max(-5, Math.min(5, score))
}

/**
 * Get top content categories
 */
function getTopCategories(casts: any[]): { category: string; count: number }[] {
  const categories: { [key: string]: number } = {}
  
  casts.forEach(cast => {
    categories[cast.contentCategory] = (categories[cast.contentCategory] || 0) + 1
  })

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

/**
 * Get sentiment distribution
 */
function getSentimentDistribution(casts: any[]): { positive: number; neutral: number; negative: number } {
  const distribution = { positive: 0, neutral: 0, negative: 0 }
  
  casts.forEach(cast => {
    if (cast.sentimentScore > 0) distribution.positive++
    else if (cast.sentimentScore < 0) distribution.negative++
    else distribution.neutral++
  })

  return distribution
}
