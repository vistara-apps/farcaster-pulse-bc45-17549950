
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
    <div className="card animate-fade-in">
      <div className="flex space-x-4">
        <img
          src={drop.imageUrl}
          alt={drop.name}
          className="w-20 h-20 rounded-lg bg-border object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-display text-text mb-2 truncate">
            {drop.name}
          </h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted">Floor:</span>
              <div className="font-semibold text-text">
                {formatPrice(drop.currentPrice)}
              </div>
            </div>
            <div>
              <span className="text-muted">Volume:</span>
              <div className="font-semibold text-text">
                {formatVolume(drop.salesVolume)}
              </div>
            </div>
            <div>
              <span className="text-muted">Collectors:</span>
              <div className="font-semibold text-text">
                {drop.newCollectors}
              </div>
            </div>
            <div>
              <span className="text-muted">Buzz Score:</span>
              <div className="font-semibold text-primary">
                {drop.socialBuzzScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
