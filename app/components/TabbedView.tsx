
'use client'

import { TabType } from '../types'

interface TabbedViewProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabbedView({ activeTab, onTabChange }: TabbedViewProps) {
  const tabs = [
    { id: 'farcaster' as TabType, label: 'Trending Casts', icon: '🔥' },
    { id: 'zora' as TabType, label: 'Viral Drops', icon: '🎨' },
    { id: 'insights' as TabType, label: 'Insights', icon: '📊' },
  ]

  return (
    <div className="flex space-x-1 p-1 bg-border rounded-lg mb-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <span>{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
