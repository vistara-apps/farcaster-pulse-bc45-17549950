'use client'

interface SkeletonCardProps {
  type?: 'cast' | 'drop' | 'insight'
  className?: string
}

export function SkeletonCard({ type = 'cast', className = '' }: SkeletonCardProps) {
  if (type === 'cast') {
    return (
      <div className={`card animate-pulse ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="skeleton w-10 h-10 rounded-full"></div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="skeleton h-4 w-24 rounded"></div>
              <div className="skeleton h-4 w-16 rounded"></div>
              <div className="skeleton h-4 w-12 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="skeleton h-4 w-12 rounded"></div>
              <div className="skeleton h-4 w-12 rounded"></div>
              <div className="skeleton h-4 w-12 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'drop') {
    return (
      <div className={`card animate-pulse ${className}`}>
        <div className="flex space-x-4">
          <div className="skeleton w-20 h-20 rounded-lg"></div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="skeleton h-6 w-32 rounded"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="skeleton h-3 w-12 rounded"></div>
                <div className="skeleton h-4 w-16 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="skeleton h-3 w-16 rounded"></div>
                <div className="skeleton h-4 w-20 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="skeleton h-3 w-20 rounded"></div>
                <div className="skeleton h-4 w-12 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="skeleton h-3 w-20 rounded"></div>
                <div className="skeleton h-4 w-16 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // insight type
  return (
    <div className={`card animate-pulse ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="skeleton h-5 w-32 rounded"></div>
        <div className="skeleton h-4 w-12 rounded"></div>
      </div>
      <div className="skeleton h-6 w-24 rounded mb-2"></div>
      <div className="space-y-1">
        <div className="skeleton h-3 w-full rounded"></div>
        <div className="skeleton h-3 w-2/3 rounded"></div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ 
  count = 3, 
  type = 'cast' as 'cast' | 'drop' | 'insight',
  className = '' 
}: { 
  count?: number
  type?: 'cast' | 'drop' | 'insight'
  className?: string 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard 
          key={index} 
          type={type}
          className={`stagger-${Math.min(index + 1, 4)}`}
        />
      ))}
    </div>
  )
}
