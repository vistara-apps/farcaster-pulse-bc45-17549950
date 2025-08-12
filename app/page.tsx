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
      <div className="container mx-auto px-4 py-6 max-w-2xl lg:max-w-3xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-display-md text-text-primary mb-2 animate-fade-in-up">
              🔮 Farcaster Pulse
            </h1>
            <p className="text-body-sm text-text-muted animate-fade-in-up stagger-1">
              Trending content, effortlessly
            </p>
          </div>
          
          <div className="flex justify-center sm:justify-end space-x-3 animate-fade-in-up stagger-2">
            {context && !context.client.added && (
              <button
                onClick={handleAddFrame}
                className="btn-secondary text-sm px-4 py-2"
                aria-label="Save this frame to your collection"
              >
                💾 SAVE
              </button>
            )}
            <button
              onClick={() => openUrl('https://base.org')}
              className="btn-ghost text-sm font-semibold"
              aria-label="Learn more about Base"
            >
              🔵 BASE
            </button>
          </div>
        </header>

        {/* Tabs */}
        <TabbedView activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <main className="space-y-6">
          <div 
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="animate-fade-in-up"
          >
            {activeTab === 'farcaster' && (
              <section className="space-y-6">
                <header className="text-center mb-8">
                  <h2 className="text-display-sm text-text-primary mb-3">
                    🔥 Trending on Farcaster
                  </h2>
                  <p className="text-body-sm text-text-muted max-w-md mx-auto">
                    Most engaged content in the last 24 hours
                  </p>
                </header>
                <div className="space-y-4">
                  {casts.map((cast, index) => (
                    <div key={cast.castId} className={`stagger-${Math.min(index + 1, 4)}`}>
                      <CastCard cast={cast} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'zora' && (
              <section className="space-y-6">
                <header className="text-center mb-8">
                  <h2 className="text-display-sm text-text-primary mb-3">
                    🎨 Viral Zora Drops
                  </h2>
                  <p className="text-body-sm text-text-muted max-w-md mx-auto">
                    NFT collections gaining momentum
                  </p>
                </header>
                <div className="space-y-4">
                  {drops.map((drop, index) => (
                    <div key={drop.collectionId} className={`stagger-${Math.min(index + 1, 4)}`}>
                      <DropCard drop={drop} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'insights' && <InsightsView />}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border-light">
          <div className="text-center">
            <button
              onClick={() => openUrl('https://docs.base.org/building-with-base/miniapps')}
              className="btn-ghost text-xs font-medium text-text-muted hover:text-primary-500 transition-colors duration-250"
              aria-label="Learn about building with MiniKit"
            >
              ⚡ BUILT WITH MINIKIT
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
