"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import GameIframe from "./GameIframe"
import GameList from "./GameList"
import GameplayGuide from "./GameplayGuide"
import GameFeatures from "./GameFeatures"
import WhyPlayGame from "./WhyPlayGame"
import FAQ from "./FAQ"
import ScriptsSection from "./ScriptsSection"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useGames } from "@/hooks/useGames"
import { useRouter, usePathname } from "next/navigation"
import { Game } from "@/lib/games"
import { cn } from "@/lib/utils"

interface HomeProps {
  defaultGame: Game | null
  onGameSelect?: (slug: string) => void
}

export default function Home({ defaultGame, onGameSelect }: HomeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const { games, loading } = useGames()
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [showGameList, setShowGameList] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (defaultGame && !currentGame) {
      setCurrentGame(defaultGame.slug)
    }
  }, [defaultGame, currentGame])

  const handleGameSelect = (slug: string) => {
    if (slug === currentGame) return
    setCurrentGame(slug)
    setShowGameList(false)
    
    // 如果提供了外部的onGameSelect处理函数，则调用它
    if (onGameSelect) {
      onGameSelect(slug)
    } else {
      // 否则使用默认的路由导航
      router.push(`/game/${slug}`, { scroll: true })
    }
  }

  const handleToggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const selectedGame = currentGame ? games?.find(game => game.slug === currentGame) : defaultGame

  return (
    <div>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar 
          isDarkMode={isDarkMode} 
          onToggleTheme={handleToggleTheme} 
          currentGameTitle={selectedGame?.title}
          onShowGameList={() => setShowGameList(true)}
          isMobile={isMobile}
        />
        <main>
          <div className="flex">
            {/* 左侧固定宽度空白区域 */}
            <div className="hidden lg:block w-[100px] flex-shrink-0">
              {/* 这里可以放置一些固定内容或保持空白 */}
            </div>

            {/* 中间内容区域 */}
            <div className="flex-1 p-8 md:p-8 px-4 py-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : selectedGame ? (
                <>
                  {/* Title Section */}
                  

                  <div>
                    <GameIframe
                      game={selectedGame}
                      onGameSelect={handleGameSelect}
                      isDarkMode={isDarkMode}
                      isMobile={isMobile}
                    />
                  </div>

                  {/* Features Section */}
                  {selectedGame.features?.items && selectedGame.features.items.length > 0 && (
                    <div id="features" className="mt-8">
                      <GameFeatures
                        features={selectedGame.features}
                        characteristics={null}
                      />
                    </div>
                  )}

                  {/* Characteristics Section */}
                  {selectedGame.characteristics?.items && selectedGame.characteristics.items.length > 0 && (
                    <div id="characteristics" className="mt-8">
                      <GameFeatures
                        features={null}
                        characteristics={selectedGame.characteristics}
                      />
                    </div>
                  )}

                  {/* How to Play Section */}
                  {selectedGame.howToPlayIntro && selectedGame.howToPlaySteps && selectedGame.howToPlaySteps.length > 0 && (
                    <div id="how-to-play" className="mt-8">
                      <GameplayGuide
                        intro={selectedGame.howToPlayIntro}
                        steps={selectedGame.howToPlaySteps}
                        videoUrls={selectedGame.videoUrls}
                      />
                    </div>
                  )}

                  {/* Why Play Section */}
                  {selectedGame.whyPlay?.items && selectedGame.whyPlay.items.length > 0 && (
                    <div id="why-play" className="mt-8">
                      <WhyPlayGame reasons={selectedGame.whyPlay} />
                    </div>
                  )}
                  
                  {/* Scripts Section */}
                  {selectedGame.scripts?.items && selectedGame.scripts.items.length > 0 && (
                    <div id="scripts" className="mt-8">
                      <ScriptsSection
                        title={selectedGame.scripts.title}
                        description={selectedGame.scripts.description}
                        items={selectedGame.scripts.items}
                      />
                    </div>
                  )}

                  {/* FAQ Section */}
                  {selectedGame.faq?.items && selectedGame.faq.items.length > 0 && (
                    <div id="faq" className="mt-8">
                      <FAQ faq={selectedGame.faq} />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h1 className="text-3xl font-bold mb-4">Welcome to Game Portal</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Select a game from the list to start playing
                  </p>
                </div>
              )}
            </div>

            {/* 右侧游戏列表 - 仅在非移动端显示 */}
            {!isMobile && (
              <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Hot Games</h2>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : (
                  <GameList
                    games={games}
                    currentGame={currentGame}
                    onGameSelect={handleGameSelect}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />

        {/* 移动端游戏列表 */}
        {isMobile && showGameList && (
          <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-4 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Hot Games</h2>
              <button
                onClick={() => setShowGameList(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                aria-label="Close game list"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <GameList
                games={games}
                currentGame={currentGame}
                onGameSelect={handleGameSelect}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* 移动端游戏列表切换按钮 */}
        {isMobile && !showGameList && (
          <button
            onClick={() => setShowGameList(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            aria-label="Show game list"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
} 