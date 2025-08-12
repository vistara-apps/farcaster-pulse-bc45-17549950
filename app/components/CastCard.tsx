
'use client'

import { FarcasterCast } from '../types'

interface CastCardProps {
  cast: FarcasterCast
}

export function CastCard({ cast }: CastCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m`
    }
    if (hours < 24) {
      return `${hours}h`
    }
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex items-start space-x-3">
        <img
          src={cast.authorAvatar}
          alt={cast.authorDisplayName}
          className="w-10 h-10 rounded-full bg-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-text truncate">
              {cast.authorDisplayName}
            </span>
            <span className="text-muted text-sm">
              @{cast.authorUsername}
            </span>
            <span className="text-muted text-sm">
              {formatTime(cast.timestamp)}
            </span>
          </div>
          
          <p className="text-body text-text mb-3 whitespace-pre-wrap">
            {cast.text}
          </p>
          
          {cast.embedUrl && (
            <div className="mb-3">
              <img
                src={cast.embedUrl}
                alt="Cast embed"
                className="rounded-md max-w-full h-auto"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-muted">
            <div className="flex items-center space-x-1">
              <span>💬</span>
              <span>{formatNumber(cast.repliesCount)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🔄</span>
              <span>{formatNumber(cast.recastsCount)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{formatNumber(cast.likesCount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
