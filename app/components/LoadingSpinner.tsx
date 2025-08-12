
'use client'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-lg">
      <div className="loading-spinner w-8 h-8">
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            className="animate-spin-slow"
          />
        </svg>
      </div>
    </div>
  )
}
