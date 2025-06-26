import GameListWrapper from '@/components/GameListWrapper'
import Advertisement from '@/components/Advertisement'
import { getGames } from '@/lib/games'

export default async function GameLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const games = await getGames()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {children}
        </div>
        <div className="space-y-8">
          <GameListWrapper games={games} currentGame={params.slug} />
          <Advertisement position="sidebar" />
        </div>
      </div>
    </div>
  )
} 