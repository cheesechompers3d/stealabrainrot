"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { games, GameData, getGameSlug } from "@/data/games"

type GameType = "New Mods" | "Popular Mods"

export default function MoreGames() {
  const router = useRouter();
  const [currentGame, setCurrentGame] = useState<string>("")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<GameType>("New Mods")
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 30
  
  // Filter games by type
  const filteredGames = games.filter((game: GameData) => game.type === activeTab)
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage)
  
  // Get games for current page
  const getCurrentPageGames = (): GameData[] => {
    const startIndex = (currentPage - 1) * gamesPerPage
    const endIndex = startIndex + gamesPerPage
    return filteredGames.slice(startIndex, endIndex)
  }

  // Handle tab change
  const handleTabChange = (tab: GameType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Handle game click
  const handleGameClick = (game: GameData) => {
    // Get game slug
    const gameSlug = getGameSlug(game.name);
    
    // Navigate to game page
    router.push(`/game/${gameSlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar onGameSelect={setCurrentGame} onToggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
      <main className="container mx-auto py-8 px-4">
        <section className="mb-10">
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                className={`px-5 py-2 rounded-md ${
                  activeTab === "New Mods"
                    ? "bg-purple-600 text-white"
                    : "bg-transparent text-gray-400 hover:text-white"
                } transition-colors`}
                onClick={() => handleTabChange("New Mods")}
              >
                New Mods
              </button>
              <button
                className={`px-5 py-2 rounded-md ${
                  activeTab === "Popular Mods"
                    ? "bg-purple-600 text-white"
                    : "bg-transparent text-gray-400 hover:text-white"
                } transition-colors`}
                onClick={() => handleTabChange("Popular Mods")}
              >
                Popular Mods
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {getCurrentPageGames().length > 0 ? (
                // Game list
                getCurrentPageGames().map((game: GameData, index: number) => (
                  <div
                    key={index}
                    className="block bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <div className="relative h-36">
                      <Image
                        src={game.icon}
                        alt={game.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 line-clamp-1">{game.name}</h3>
                      <p className="text-gray-300 mb-3 text-sm line-clamp-2">{game.description}</p>
                      <button 
                        onClick={() => handleGameClick(game)}
                        className="inline-block bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors text-sm w-full text-center"
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // No games found
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-400">No matching games found</p>
                </div>
              )}
            </div>

            {/* Pagination Controls - only show when there are games and not loading */}
            {filteredGames.length > 0 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Previous
                </button>
                
                {(() => {
                  const pageNumbers = [];
                  const showPageCount = 2; // 当前页前后各显示的页数
                  
                  // 始终显示第一页
                  if (totalPages > 0) {
                    pageNumbers.push(1);
                  }
                  
                  // 添加省略号（如果需要）
                  if (currentPage > showPageCount + 2) {
                    pageNumbers.push('ellipsis1');
                  }
                  
                  // 当前页前后的页码
                  for (let i = Math.max(2, currentPage - showPageCount); i <= Math.min(totalPages - 1, currentPage + showPageCount); i++) {
                    pageNumbers.push(i);
                  }
                  
                  // 添加省略号（如果需要）
                  if (currentPage < totalPages - showPageCount - 1) {
                    pageNumbers.push('ellipsis2');
                  }
                  
                  // 始终显示最后一页（如果总页数大于1）
                  if (totalPages > 1) {
                    pageNumbers.push(totalPages);
                  }
                  
                  return pageNumbers.map((number, i) => {
                    if (number === 'ellipsis1' || number === 'ellipsis2') {
                      return (
                        <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => typeof number === 'number' ? setCurrentPage(number) : null}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === number
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                      >
                        {number}
                      </button>
                    );
                  });
                })()}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}