import { notFound } from 'next/navigation'
import GameFeatures from '@/components/GameFeatures'
import GameplayGuide from '@/components/GameplayGuide'
import FAQ from '@/components/FAQ'
import Advertisement from '@/components/Advertisement'
import { getGameBySlug } from '@/lib/games'

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGameBySlug(params.slug)
  
  if (!game) {
    notFound()
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
        <p className="text-xl text-gray-600">{game.description}</p>
      </div>

      {game.videoUrls?.[0] && (
        <div className="aspect-video">
          <iframe
            src={game.videoUrls[0]}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      <Advertisement position="content" />

      {game.howToPlayIntro && game.howToPlaySteps && (
        <GameplayGuide
          intro={game.howToPlayIntro}
          steps={game.howToPlaySteps}
          videoUrls={game.videoUrls}
        />
      )}

      <GameFeatures
        features={game.features}
        characteristics={game.characteristics}
      />

      {game.whyPlay && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Why Play {game.title}?</h2>
          <ul className="space-y-4">
            {game.whyPlay.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {game.faq && <FAQ faq={game.faq} />}
    </div>
  )
} 