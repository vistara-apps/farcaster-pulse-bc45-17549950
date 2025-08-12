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
    <article className="card-interactive animate-fade-in-up" role="article" aria-labelledby={`cast-${cast.castId}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={cast.authorAvatar}
            alt={`${cast.authorDisplayName}'s avatar`}
            className="w-12 h-12 rounded-full bg-border-light ring-2 ring-transparent group-hover:ring-border transition-all duration-250"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <header className="flex items-center space-x-2 mb-2">
            <h3 
              id={`cast-${cast.castId}`}
              className="font-semibold text-text-primary truncate text-base"
            >
              {cast.authorDisplayName}
            </h3>
            <span className="text-text-muted text-sm font-medium">
              @{cast.authorUsername}
            </span>
            <span className="text-text-muted text-sm">
              •
            </span>
            <time 
              dateTime={cast.timestamp}
              className="text-text-muted text-sm"
              title={new Date(cast.timestamp).toLocaleString()}
            >
              {formatTime(cast.timestamp)}
            </time>
          </header>
          
          <div className="mb-4">
            <p className="text-body text-text-primary whitespace-pre-wrap leading-relaxed">
              {cast.text}
            </p>
          </div>
          
          {cast.embedUrl && (
            <div className="mb-4">
              <img
                src={cast.embedUrl}
                alt="Cast media content"
                className="rounded-lg max-w-full h-auto border border-border-light shadow-sm hover:shadow-md transition-shadow duration-250"
                loading="lazy"
              />
            </div>
          )}
          
          <footer className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1.5 text-text-muted hover:text-text-secondary transition-colors duration-200 group">
              <span className="text-base group-hover:scale-110 transition-transform duration-200" role="img" aria-label="Replies">💬</span>
              <span className="font-medium">{formatNumber(cast.repliesCount)}</span>
              <span className="sr-only">replies</span>
            </div>
            <div className="flex items-center space-x-1.5 text-text-muted hover:text-text-secondary transition-colors duration-200 group">
              <span className="text-base group-hover:scale-110 transition-transform duration-200" role="img" aria-label="Recasts">🔄</span>
              <span className="font-medium">{formatNumber(cast.recastsCount)}</span>
              <span className="sr-only">recasts</span>
            </div>
            <div className="flex items-center space-x-1.5 text-text-muted hover:text-text-secondary transition-colors duration-200 group">
              <span className="text-base group-hover:scale-110 transition-transform duration-200" role="img" aria-label="Likes">❤️</span>
              <span className="font-medium">{formatNumber(cast.likesCount)}</span>
              <span className="sr-only">likes</span>
            </div>
          </footer>
        </div>
      </div>
    </article>
  )
}
