
'use client'

export function InsightsView() {
  const insights = [
    {
      title: 'Top Engagement Type',
      value: 'Tech & AI Content',
      change: '+12%',
      description: 'Posts about AI and blockchain tech are getting 40% more engagement this week.'
    },
    {
      title: 'Peak Activity Time',
      value: '2-4 PM EST',
      change: '+8%',
      description: 'Afternoon posts receive the highest engagement rates.'
    },
    {
      title: 'Trending Topics',
      value: 'Base, Frames, AI',
      change: '+25%',
      description: 'These topics are dominating conversations on Farcaster.'
    },
    {
      title: 'Content Performance',
      value: 'Visual Posts',
      change: '+15%',
      description: 'Posts with images or videos get 3x more recasts.'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="text-center mb-lg">
        <h2 className="text-display text-text mb-2">
          📊 Engagement Insights
        </h2>
        <p className="text-body text-muted">
          Data-driven insights from Farcaster trending content
        </p>
      </div>

      {insights.map((insight, index) => (
        <div key={index} className="card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-text">{insight.title}</h3>
            <span className="text-sm text-primary font-medium">{insight.change}</span>
          </div>
          <div className="text-lg font-semibold text-text mb-2">
            {insight.value}
          </div>
          <p className="text-sm text-muted">
            {insight.description}
          </p>
        </div>
      ))}

      <div className="card bg-primary/5 border-primary/20">
        <div className="text-center">
          <h3 className="font-semibold text-primary mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-text">
            Post tech content with visuals between 2-4 PM EST for maximum engagement!
          </p>
        </div>
      </div>
    </div>
  )
}
