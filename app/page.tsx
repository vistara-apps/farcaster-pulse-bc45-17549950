'use client'

import { useMiniKit, useAddFrame, useOpenUrl, usePrimaryButton } from '@coinbase/onchainkit/minikit'
import { useEffect, useState } from 'react'
import { TabbedView } from './components/TabbedView'
import { CastCard } from './components/CastCard'
import { DropCard } from './components/DropCard'
import { InsightsView } from './components/InsightsView'
import { LoadingSpinner } from './components/LoadingSpinner'
import { PaymentStatus, usePaymentStatus, WalletConnectionStatus } from './components/PaymentStatus'
import { useFarcasterData, usePremiumFarcasterData } from './hooks/useFarcasterData'
import { usePaymentProtectedAPI } from './hooks/useX402Payment'
import { useMockData } from './hooks/useMockData'
import { TabType } from './types'

export default function FarcasterPulse() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const [activeTab, setActiveTab] = useState<TabType>('farcaster')
  const [refreshing, setRefreshing] = useState(false)
  const [showPremium, setShowPremium] = useState(false)
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  
  // Data hooks
  const { casts: freeCasts, loading: freeLoading, error: freeError, refreshCasts } = useFarcasterData()
  const { premiumCasts, loading: premiumLoading, error: premiumError, fetchPremiumContent } = usePremiumFarcasterData()
  const { drops, loading: dropsLoading } = useMockData() // Keep using mock data for Zora drops for now
  
  // Payment hooks
  const { makePaymentCall, isWalletConnected, isLoading: paymentLoading, error: paymentError } = usePaymentProtectedAPI()
  const { status: paymentStatus, startProcessing, setSuccess, setError, reset: resetPaymentStatus } = usePaymentStatus()
  
  // Determine which casts to show
  const casts = showPremium ? premiumCasts : freeCasts
  const loading = showPremium ? premiumLoading : freeLoading

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      if (showPremium && isWalletConnected) {
        await fetchPremiumContent({ makePaymentCall })
      } else {
        await refreshCasts()
      }
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleUpgradeToPremium = async () => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first')
      return
    }

    try {
      startProcessing('0.10', 'USDC')
      await fetchPremiumContent({ makePaymentCall })
      setSuccess()
      setShowPremium(true)
    } catch (error: any) {
      setError(error.message || 'Failed to access premium content')
    }
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

  if (loading && !casts.length) {
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
        {/* Payment Status */}
        <PaymentStatus
          isProcessing={paymentStatus.isProcessing}
          error={paymentStatus.error}
          success={paymentStatus.success}
          amount={paymentStatus.amount}
          currency={paymentStatus.currency}
          onRetry={handleUpgradeToPremium}
          onDismiss={resetPaymentStatus}
        />

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

        {/* Wallet Connection Status */}
        <div className="mb-4">
          <WalletConnectionStatus
            isConnected={isWalletConnected}
            isConnecting={paymentLoading}
          />
        </div>

        {/* Tabs */}
        <TabbedView activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'farcaster' && (
            <div className="space-y-4">
              <div className="text-center mb-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-display text-text mb-2">
                      {showPremium ? '💎 Premium Trending' : '🔥 Trending on Farcaster'}
                    </h2>
                    <p className="text-sm text-muted">
                      {showPremium 
                        ? 'Advanced analytics and premium content'
                        : 'Most engaged content in the last 24 hours'
                      }
                    </p>
                  </div>
                  
                  {/* Premium Toggle */}
                  {!showPremium && isWalletConnected && (
                    <button
                      onClick={handleUpgradeToPremium}
                      disabled={paymentStatus.isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                    >
                      {paymentStatus.isProcessing ? 'Processing...' : 'Upgrade to Premium'}
                    </button>
                  )}
                  
                  {showPremium && (
                    <button
                      onClick={() => setShowPremium(false)}
                      className="text-xs text-muted hover:text-text transition-colors"
                    >
                      View Free Content
                    </button>
                  )}
                </div>
              </div>
              
              {/* Error handling */}
              {(freeError || premiumError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800">
                    {freeError || premiumError}
                  </p>
                </div>
              )}
              
              {/* Loading state */}
              {loading && casts.length === 0 && (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              )}
              
              {/* Casts */}
              {casts.map((cast) => (
                <CastCard key={cast.castId} cast={cast} />
              ))}
              
              {/* Empty state */}
              {!loading && casts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted">No trending casts available</p>
                </div>
              )}
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
