import { NextRequest, NextResponse } from 'next/server'
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk'

// Initialize Neynar client for server-side usage
const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
})

const neynarClient = new NeynarAPIClient(config)

/**
 * Premium Farcaster Insights API - Requires x402 Payment
 * Returns advanced analytics and insights about Farcaster ecosystem
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get('timeframe') || '24h'
  const includeChannels = searchParams.get('channels') === 'true'

  // Check for payment header (x402 will add this after successful payment)
  const paymentHeader = request.headers.get('x-payment-response')
  
  if (!paymentHeader) {
    // Return 402 Payment Required with payment details
    return NextResponse.json(
      {
        error: 'Payment required for premium insights',
        message: 'This endpoint provides advanced Farcaster ecosystem analytics and insights',
        features: [
          'Network growth metrics',
          'Top creator analytics',
          'Channel performance data',
          'Engagement trend analysis',
          'Content category insights',
          'Viral content patterns'
        ]
      },
      {
        status: 402,
        headers: {
          'x-payment-required': 'true',
          'x-payment-amount': '0.25', // $0.25 USDC for comprehensive insights
          'x-payment-currency': 'USDC',
          'x-payment-chain': 'base',
          'x-payment-description': 'Premium Farcaster ecosystem insights',
        },
      }
    )
  }

  try {
    // Generate comprehensive insights
    const insights = await generatePremiumInsights(timeframe, includeChannels)

    return NextResponse.json({
      insights,
      timeframe,
      premium: true,
      paymentConfirmed: true,
      generatedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error generating premium insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate premium insights' },
      { status: 500 }
    )
  }
}

/**
 * Generate comprehensive premium insights
 */
async function generatePremiumInsights(timeframe: string, includeChannels: boolean) {
  // Fetch data from multiple high-value accounts for analysis
  const topCreatorFids = [
    3, 5650, 1, 2, 99, // Core team
    602, 1689, 3621, 8152, // Tech leaders
    239, 457, 1048, 2433, // Crypto leaders
    6546, 7078, 8493, 9234, // Rising stars
    1234, 5678, 9012, 3456, // Community leaders
  ]

  // Fetch recent activity from top creators
  const feedPromises = topCreatorFids.map(fid => 
    neynarClient.fetchFeed({
      fid,
      feedType: 'following' as any,
      limit: 10,
    }).catch(err => {
      console.warn(`Failed to fetch feed for FID ${fid}:`, err)
      return { casts: [] }
    })
  )

  const feeds = await Promise.all(feedPromises)
  const allCasts = feeds.flatMap(feed => feed.casts || [])

  // Analyze the data
  const networkMetrics = analyzeNetworkMetrics(allCasts)
  const contentInsights = analyzeContentInsights(allCasts)
  const creatorAnalytics = analyzeCreatorPerformance(allCasts)
  const engagementTrends = analyzeEngagementTrends(allCasts)
  const viralPatterns = analyzeViralPatterns(allCasts)

  return {
    networkMetrics,
    contentInsights,
    creatorAnalytics,
    engagementTrends,
    viralPatterns,
    summary: generateInsightsSummary(networkMetrics, contentInsights, creatorAnalytics),
  }
}

/**
 * Analyze network-level metrics
 */
function analyzeNetworkMetrics(casts: any[]) {
  const totalCasts = casts.length
  const uniqueAuthors = new Set(casts.map(cast => cast.author.fid)).size
  const totalEngagement = casts.reduce((sum, cast) => 
    sum + (cast.reactions?.likes_count || 0) + 
    (cast.reactions?.recasts_count || 0) + 
    (cast.replies?.count || 0), 0
  )

  const averageEngagementPerCast = totalEngagement / Math.max(totalCasts, 1)
  const averageEngagementPerAuthor = totalEngagement / Math.max(uniqueAuthors, 1)

  // Calculate engagement distribution
  const engagementScores = casts.map(cast => 
    (cast.reactions?.likes_count || 0) + 
    (cast.reactions?.recasts_count || 0) + 
    (cast.replies?.count || 0)
  ).sort((a, b) => b - a)

  const medianEngagement = engagementScores[Math.floor(engagementScores.length / 2)] || 0
  const top10PercentEngagement = engagementScores.slice(0, Math.ceil(engagementScores.length * 0.1))
  const averageTop10Engagement = top10PercentEngagement.reduce((sum, score) => sum + score, 0) / Math.max(top10PercentEngagement.length, 1)

  return {
    totalCasts,
    uniqueAuthors,
    totalEngagement,
    averageEngagementPerCast: Math.round(averageEngagementPerCast * 100) / 100,
    averageEngagementPerAuthor: Math.round(averageEngagementPerAuthor * 100) / 100,
    medianEngagement,
    averageTop10Engagement: Math.round(averageTop10Engagement * 100) / 100,
    engagementDistribution: {
      high: engagementScores.filter(score => score > averageEngagementPerCast * 2).length,
      medium: engagementScores.filter(score => score > averageEngagementPerCast && score <= averageEngagementPerCast * 2).length,
      low: engagementScores.filter(score => score <= averageEngagementPerCast).length,
    }
  }
}

/**
 * Analyze content insights
 */
function analyzeContentInsights(casts: any[]) {
  const categories: { [key: string]: number } = {}
  const sentiments: { positive: number; neutral: number; negative: number } = { positive: 0, neutral: 0, negative: 0 }
  const contentLengths: number[] = []
  const embedTypes: { [key: string]: number } = {}

  casts.forEach(cast => {
    // Categorize content
    const category = categorizeContent(cast.text || '')
    categories[category] = (categories[category] || 0) + 1

    // Analyze sentiment
    const sentiment = analyzeSentiment(cast.text || '')
    if (sentiment > 0) sentiments.positive++
    else if (sentiment < 0) sentiments.negative++
    else sentiments.neutral++

    // Track content length
    contentLengths.push((cast.text || '').length)

    // Track embed types
    if (cast.embeds && cast.embeds.length > 0) {
      cast.embeds.forEach((embed: any) => {
        if (embed.url) {
          const domain = extractDomain(embed.url)
          embedTypes[domain] = (embedTypes[domain] || 0) + 1
        }
      })
    }
  })

  const averageContentLength = contentLengths.reduce((sum, len) => sum + len, 0) / Math.max(contentLengths.length, 1)

  return {
    topCategories: Object.entries(categories)
      .map(([category, count]) => ({ category, count, percentage: (count / casts.length * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    sentimentDistribution: {
      ...sentiments,
      positivePercentage: (sentiments.positive / casts.length * 100).toFixed(1),
      neutralPercentage: (sentiments.neutral / casts.length * 100).toFixed(1),
      negativePercentage: (sentiments.negative / casts.length * 100).toFixed(1),
    },
    contentMetrics: {
      averageLength: Math.round(averageContentLength),
      shortPosts: contentLengths.filter(len => len < 50).length,
      mediumPosts: contentLengths.filter(len => len >= 50 && len <= 200).length,
      longPosts: contentLengths.filter(len => len > 200).length,
    },
    topEmbedDomains: Object.entries(embedTypes)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  }
}

/**
 * Analyze creator performance
 */
function analyzeCreatorPerformance(casts: any[]) {
  const creatorStats: { [fid: string]: any } = {}

  casts.forEach(cast => {
    const fid = cast.author.fid.toString()
    if (!creatorStats[fid]) {
      creatorStats[fid] = {
        fid,
        username: cast.author.username,
        displayName: cast.author.display_name || cast.author.username,
        followerCount: cast.author.follower_count || 0,
        verified: cast.author.power_badge || false,
        castCount: 0,
        totalEngagement: 0,
        totalLikes: 0,
        totalRecasts: 0,
        totalReplies: 0,
      }
    }

    const stats = creatorStats[fid]
    stats.castCount++
    stats.totalLikes += cast.reactions?.likes_count || 0
    stats.totalRecasts += cast.reactions?.recasts_count || 0
    stats.totalReplies += cast.replies?.count || 0
    stats.totalEngagement += (cast.reactions?.likes_count || 0) + 
                            (cast.reactions?.recasts_count || 0) + 
                            (cast.replies?.count || 0)
  })

  // Calculate performance metrics
  const creators = Object.values(creatorStats).map((creator: any) => ({
    ...creator,
    averageEngagementPerCast: creator.totalEngagement / Math.max(creator.castCount, 1),
    engagementRate: creator.totalEngagement / Math.max(creator.followerCount, 1),
    performanceScore: calculateCreatorPerformanceScore(creator),
  }))

  return {
    topPerformers: creators
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 10),
    mostEngaged: creators
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10),
    bestEngagementRate: creators
      .filter(c => c.followerCount > 100) // Filter out accounts with very few followers
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 10),
    totalCreators: creators.length,
    verifiedCreators: creators.filter(c => c.verified).length,
  }
}

/**
 * Analyze engagement trends
 */
function analyzeEngagementTrends(casts: any[]) {
  // Group casts by hour for trend analysis
  const hourlyEngagement: { [hour: string]: number } = {}
  const hourlyPosts: { [hour: string]: number } = {}

  casts.forEach(cast => {
    const hour = new Date(cast.timestamp).getHours()
    const hourKey = hour.toString().padStart(2, '0')
    
    const engagement = (cast.reactions?.likes_count || 0) + 
                      (cast.reactions?.recasts_count || 0) + 
                      (cast.replies?.count || 0)
    
    hourlyEngagement[hourKey] = (hourlyEngagement[hourKey] || 0) + engagement
    hourlyPosts[hourKey] = (hourlyPosts[hourKey] || 0) + 1
  })

  // Find peak hours
  const peakHours = Object.entries(hourlyEngagement)
    .map(([hour, engagement]) => ({ 
      hour: parseInt(hour), 
      engagement, 
      posts: hourlyPosts[hour] || 0,
      averageEngagementPerPost: engagement / Math.max(hourlyPosts[hour] || 1, 1)
    }))
    .sort((a, b) => b.averageEngagementPerPost - a.averageEngagementPerPost)

  return {
    peakHours: peakHours.slice(0, 5),
    hourlyDistribution: peakHours.sort((a, b) => a.hour - b.hour),
    bestPostingTimes: peakHours
      .filter(h => h.posts >= 3) // Only include hours with meaningful data
      .slice(0, 3)
      .map(h => ({ hour: h.hour, score: h.averageEngagementPerPost })),
  }
}

/**
 * Analyze viral patterns
 */
function analyzeViralPatterns(casts: any[]) {
  // Define viral threshold (top 5% of engagement)
  const engagementScores = casts.map(cast => 
    (cast.reactions?.likes_count || 0) + 
    (cast.reactions?.recasts_count || 0) + 
    (cast.replies?.count || 0)
  ).sort((a, b) => b - a)

  const viralThreshold = engagementScores[Math.floor(engagementScores.length * 0.05)] || 0
  const viralCasts = casts.filter(cast => {
    const engagement = (cast.reactions?.likes_count || 0) + 
                      (cast.reactions?.recasts_count || 0) + 
                      (cast.replies?.count || 0)
    return engagement >= viralThreshold
  })

  // Analyze viral content patterns
  const viralCategories: { [key: string]: number } = {}
  const viralContentLengths: number[] = []
  const viralAuthors: { [fid: string]: number } = {}

  viralCasts.forEach(cast => {
    const category = categorizeContent(cast.text || '')
    viralCategories[category] = (viralCategories[category] || 0) + 1
    viralContentLengths.push((cast.text || '').length)
    viralAuthors[cast.author.fid] = (viralAuthors[cast.author.fid] || 0) + 1
  })

  return {
    viralThreshold,
    totalViralCasts: viralCasts.length,
    viralRate: (viralCasts.length / casts.length * 100).toFixed(2),
    topViralCategories: Object.entries(viralCategories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    averageViralContentLength: Math.round(
      viralContentLengths.reduce((sum, len) => sum + len, 0) / Math.max(viralContentLengths.length, 1)
    ),
    topViralCreators: Object.entries(viralAuthors)
      .map(([fid, count]) => ({ fid, viralCasts: count }))
      .sort((a, b) => b.viralCasts - a.viralCasts)
      .slice(0, 5),
  }
}

/**
 * Generate insights summary
 */
function generateInsightsSummary(networkMetrics: any, contentInsights: any, creatorAnalytics: any) {
  const insights = []

  // Network insights
  if (networkMetrics.averageEngagementPerCast > 10) {
    insights.push("High engagement network with strong community interaction")
  }
  
  if (networkMetrics.engagementDistribution.high > networkMetrics.engagementDistribution.low) {
    insights.push("Content quality is driving above-average engagement")
  }

  // Content insights
  const topCategory = contentInsights.topCategories[0]
  if (topCategory) {
    insights.push(`${topCategory.category} content dominates with ${topCategory.percentage}% of posts`)
  }

  if (parseFloat(contentInsights.sentimentDistribution.positivePercentage) > 60) {
    insights.push("Overwhelmingly positive sentiment in the community")
  }

  // Creator insights
  if (creatorAnalytics.verifiedCreators / creatorAnalytics.totalCreators > 0.3) {
    insights.push("High concentration of verified creators driving quality content")
  }

  return insights.slice(0, 5) // Top 5 insights
}

// Helper functions (reuse from casts route)
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

function analyzeSentiment(text: string): number {
  if (!text) return 0
  const positiveWords = ['great', 'amazing', 'awesome', 'love', 'excited', 'happy', 'good', 'best', 'fantastic']
  const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'worst', 'sad', 'angry', 'disappointed']
  const lowerText = text.toLowerCase()
  let score = 0
  positiveWords.forEach(word => { if (lowerText.includes(word)) score += 1 })
  negativeWords.forEach(word => { if (lowerText.includes(word)) score -= 1 })
  return Math.max(-5, Math.min(5, score))
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'unknown'
  }
}

function calculateCreatorPerformanceScore(creator: any): number {
  const engagementWeight = 0.4
  const consistencyWeight = 0.3
  const reachWeight = 0.3

  const engagementScore = Math.min(creator.averageEngagementPerCast / 10, 100)
  const consistencyScore = Math.min(creator.castCount * 5, 100)
  const reachScore = Math.min(creator.followerCount / 1000, 100)

  return engagementScore * engagementWeight + 
         consistencyScore * consistencyWeight + 
         reachScore * reachWeight
}
