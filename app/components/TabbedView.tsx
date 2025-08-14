'use client'

import { TabType } from '../types'
import { useEffect, useRef } from 'react'

interface TabbedViewProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabbedView({ activeTab, onTabChange }: TabbedViewProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  
  const tabs = [
    { id: 'farcaster' as TabType, label: 'Trending Casts', shortLabel: 'Casts', icon: '🔥' },
    { id: 'zora' as TabType, label: 'Viral Drops', shortLabel: 'Drops', icon: '🎨' },
    { id: 'insights' as TabType, label: 'Insights', shortLabel: 'Insights', icon: '📊' },
  ]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!tabsRef.current?.contains(document.activeElement)) return
      
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
          break
        case 'ArrowRight':
          event.preventDefault()
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = tabs.length - 1
          break
        default:
          return
      }

      onTabChange(tabs[newIndex].id)
      
      // Focus the new tab
      const newTab = tabsRef.current?.children[newIndex] as HTMLButtonElement
      newTab?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, onTabChange, tabs])

  return (
    <div 
      ref={tabsRef}
      className="flex space-x-1 p-1 bg-border-light rounded-xl mb-6 shadow-inner"
      role="tablist"
      aria-label="Content navigation"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 min-h-[44px] ${
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          }`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          id={`tab-${tab.id}`}
        >
          <span className="text-lg" role="img" aria-label={tab.label}>
            {tab.icon}
          </span>
          <span className="hidden xs:inline sm:hidden">
            {tab.shortLabel}
          </span>
          <span className="hidden sm:inline">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
