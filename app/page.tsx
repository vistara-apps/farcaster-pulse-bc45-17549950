
'use client'

import { useMiniKit, useAddFrame, useOpenUrl, usePrimaryButton } from '@coinbase/onchainkit/minikit'
import { useEffect, useState } from 'react'
import { TabbedView } from './components/TabbedView'
import { CastCard } from './components/CastCard'
import { DropCard } from './components/DropCard'
import { InsightsView } from './components/InsightsView'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useMockData } from './hooks/useMockData'
import { TabType } from './types'

export default function FarcasterPulse() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const [activeTab, setActiveTab] = useState<TabType>('farcaster')
  const [refreshing, setRefreshing] = useState(false)
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  const { casts, drops, loading } = useMockData()

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleAddFrame = async () => {
    const result = await addFrame()
    if (result) {
      console.log('Frame added:', result.url, result.token)
    }
  }

  usePrimaryButton(
    { text: refreshing ? 'REFRESHING...' : 'REFRESH FEED' },
    handleRefresh
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="container mx-auto px-4 py-8 max-w-xl">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-6 max-w-xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-lg">
          <div>
            <h1 className="text-display text-text mb-1">
              🔮 Farcaster Pulse
            </h1>
            <p className="text-sm text-muted">
              Trending content, effortlessly
            </p>
          </div>
          
          <div className="flex space-x-2">
            {context && !context.client.added && (
              <button
                onClick={handleAddFrame}
                className="btn-secondary text-xs px-3 py-1"
              >
                SAVE
              </button>
            )}
            <button
              onClick={() => openUrl('https://base.org')}
              className="text-primary text-xs font-semibold hover:text-primary/80"
            >
              BASE
            </button>
          </div>
        </header>

        {/* Tabs */}
        <TabbedView activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'farcaster' && (
            <div className="space-y-4">
              <div className="text-center mb-lg">
                <h2 className="text-display text-text mb-2">
                  🔥 Trending on Farcaster
                </h2>
                <p className="text-sm text-muted">
                  Most engaged content in the last 24 hours
                </p>
              </div>
              {casts.map((cast) => (
                <CastCard key={cast.castId} cast={cast} />
              ))}
            </div>
          )}

          {activeTab === 'zora' && (
            <div className="space-y-4">
              <div className="text-center mb-lg">
                <h2 className="text-display text-text mb-2">
                  🎨 Viral Zora Drops
                </h2>
                <p className="text-sm text-muted">
                  NFT collections gaining momentum
                </p>
              </div>
              {drops.map((drop) => (
                <DropCard key={drop.collectionId} drop={drop} />
              ))}
            </div>
          )}

          {activeTab === 'insights' && <InsightsView />}
        </div>

        {/* Footer */}
        <footer className="mt-xl pt-lg border-t border-border">
          <button
            onClick={() => openUrl('https://docs.base.org/building-with-base/miniapps')}
            className="w-full text-center text-xs text-muted hover:text-primary transition-colors"
          >
            BUILT WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  )
}
