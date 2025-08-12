'use client'

import { ZoraDrop } from '../types'

interface DropCardProps {
  drop: ZoraDrop
}

export function DropCard({ drop }: DropCardProps) {
  const formatPrice = (price: number) => {
    return `${price.toFixed(3)} ETH`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'k ETH'
    }
    return volume.toFixed(2) + ' ETH'
  }

  return (
    <article className="card-interactive animate-fade-in-up" role="article" aria-labelledby={`drop-${drop.collectionId}`}>
      <div className="flex space-x-5">
        <div className="flex-shrink-0">
          <img
            src={drop.imageUrl}
            alt={`${drop.name} collection preview`}
            className="w-24 h-24 rounded-xl bg-border-light object-cover shadow-sm group-hover:shadow-md transition-all duration-250 ring-2 ring-transparent group-hover:ring-border"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <header className="mb-4">
            <h3 
              id={`drop-${drop.collectionId}`}
              className="text-display-sm text-text-primary mb-1 truncate"
            >
              {drop.name}
            </h3>
          </header>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-text-muted text-xs font-medium uppercase tracking-wide">Floor Price</span>
              <div className="font-semibold text-text-primary text-base">
                {formatPrice(drop.currentPrice)}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-text-muted text-xs font-medium uppercase tracking-wide">Volume</span>
              <div className="font-semibold text-text-primary text-base">
                {formatVolume(drop.salesVolume)}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-text-muted text-xs font-medium uppercase tracking-wide">Collectors</span>
              <div className="font-semibold text-text-primary text-base">
                {drop.newCollectors.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-text-muted text-xs font-medium uppercase tracking-wide">Buzz Score</span>
              <div className="flex items-center space-x-2">
                <div className="font-semibold text-primary-500 text-base">
                  {drop.socialBuzzScore}/100
                </div>
                <div className="flex-1 bg-border-light rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${drop.socialBuzzScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
