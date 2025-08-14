'use client'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="text-6xl mb-4 animate-scale-in">
        {icon}
      </div>
      <h3 className="text-display-sm text-text-primary mb-2 animate-fade-in-up stagger-1">
        {title}
      </h3>
      <p className="text-body-sm text-text-muted max-w-md mb-6 animate-fade-in-up stagger-2">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary animate-fade-in-up stagger-3"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Specific empty states for different content types
export function EmptyFarcasterState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No trending casts found"
      description="We couldn't find any trending content right now. This might be due to network issues or low activity."
      action={onRefresh ? {
        label: "Try Again",
        onClick: onRefresh
      } : undefined}
    />
  )
}

export function EmptyZoraState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon="🎨"
      title="No viral drops found"
      description="There are no trending NFT collections at the moment. Check back later for the latest drops!"
      action={onRefresh ? {
        label: "Refresh",
        onClick: onRefresh
      } : undefined}
    />
  )
}

export function ErrorState({ 
  onRetry, 
  message = "Something went wrong while loading content." 
}: { 
  onRetry?: () => void
  message?: string 
}) {
  return (
    <EmptyState
      icon="⚠️"
      title="Oops! Something went wrong"
      description={message}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
    />
  )
}
