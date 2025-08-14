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
    <section className="space-y-6">
      <header className="text-center mb-8">
        <h2 className="text-display-sm text-text-primary mb-3">
          📊 Engagement Insights
        </h2>
        <p className="text-body-sm text-text-muted max-w-md mx-auto">
          Data-driven insights from Farcaster trending content
        </p>
      </header>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <article 
            key={index} 
            className="card animate-fade-in-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-text-primary text-base">{insight.title}</h3>
              <span className="text-sm text-primary-500 font-semibold bg-primary-50 px-2 py-1 rounded-md">
                {insight.change}
              </span>
            </div>
            <div className="text-xl font-bold text-text-primary mb-3">
              {insight.value}
            </div>
            <p className="text-body-sm text-text-secondary leading-relaxed">
              {insight.description}
            </p>
          </article>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-500/20 shadow-lg animate-fade-in-up stagger-4">
        <div className="text-center">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-semibold text-primary-700 mb-3 text-lg">Pro Tip</h3>
          <p className="text-body-sm text-text-primary leading-relaxed">
            Post tech content with visuals between 2-4 PM EST for maximum engagement!
          </p>
        </div>
      </div>
    </section>
  )
}
