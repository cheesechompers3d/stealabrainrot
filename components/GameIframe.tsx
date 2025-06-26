"use client"

import { useState, useRef, useEffect } from "react"
import { Game } from "@/lib/games"
import { cn } from "@/lib/utils"
import ShareBar from "./ShareBar"
import RandomGames from "./RandomGames"
import { getRandomGamesCount } from "@/lib/config"

interface GameIframeProps {
  game: Game
  onGameSelect: (slug: string) => void
  isDarkMode: boolean
  isMobile?: boolean
}

export default function GameIframe({ game, onGameSelect, isDarkMode, isMobile }: GameIframeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const gameFrameRef = useRef<HTMLDivElement>(null)
  const gameInfoRef = useRef<HTMLDivElement>(null)
  const shareBarRef = useRef<HTMLDivElement>(null)
  const gameInfoSectionRef = useRef<HTMLDivElement>(null)
  const randomGamesRef = useRef<HTMLDivElement>(null)
  
  // 随机生成点赞和不喜欢数量
  const [likesCount] = useState<number>(Math.floor(Math.random() * 500) * 1000 + 10000);
  const [dislikesCount] = useState<number>(Math.floor(Math.random() * 50) * 1000 + 1000);
  
  // 格式化数字函数
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 浏览器内全屏效果控制
  useEffect(() => {
    const body = document.body;
    const gameFrame = gameFrameRef.current;
    const gameInfo = gameInfoRef.current;
    const shareBar = shareBarRef.current;
    const gameInfoSection = gameInfoSectionRef.current;
    const randomGames = randomGamesRef.current;

    if (isBrowserFullscreen) {
      body.style.overflow = 'hidden';
      gameFrame?.classList.add('fixed', 'inset-0', 'z-50', 'w-screen', 'h-screen');
      gameFrame?.classList.remove('relative', 'aspect-video', 'rounded-lg', 'overflow-hidden', 'bg-gray-900');
      
      if (gameInfo) gameInfo.style.display = 'none';
      if (shareBar) shareBar.style.display = 'none';
      if (gameInfoSection) gameInfoSection.style.display = 'none';
      if (randomGames) randomGames.style.display = 'none';

    } else {
      body.style.overflow = '';
      gameFrame?.classList.remove('fixed', 'inset-0', 'z-50', 'w-screen', 'h-screen');
      gameFrame?.classList.add('relative', 'aspect-video', 'rounded-lg', 'overflow-hidden', 'bg-gray-900');

      if (gameInfo) gameInfo.style.display = '';
      if (shareBar) shareBar.style.display = '';
      if (gameInfoSection) gameInfoSection.style.display = '';
      if (randomGames) randomGames.style.display = '';
    }
  }, [isBrowserFullscreen]);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        iframeRef.current.requestFullscreen()
      }
    }
  }

  const handleBrowserFullscreen = () => {
    setIsBrowserFullscreen(!isBrowserFullscreen)
  }

  const handlePlayGame = () => {
    // 对于 steal-a-brainrot 游戏，直接在新窗口中打开
    if (game.slug === "steal-a-brainrot") {
      window.open(game.url, "_blank");
      return;
    }
    
    // 其他游戏继续使用原有的行为
    setIsPlaying(true)
    // Auto enter fullscreen on mobile
    if (isMobile && iframeRef.current) {
      setTimeout(() => {
        iframeRef.current?.requestFullscreen()
      }, 100)
    }
  }

  return (
    <div className="transition-all duration-300">
      <div ref={gameFrameRef} className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
        {isPlaying ? (
          <>
            <iframe
              ref={iframeRef}
              src={game.url}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={handleFullscreen}
              className={cn(
                "absolute p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-all duration-200 z-10",
                isMobile ? "top-2 right-2" : "top-4 right-4",
                isBrowserFullscreen && "hidden"
              )}
              title="真正全屏"
            >
              <svg
                className={cn(
                  "text-white",
                  isMobile ? "w-5 h-5" : "w-6 h-6"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-20h2a2 2 0 012 2v2m0 12v2a2 2 0 01-2 2h-2"
                />
              </svg>
            </button>
            {isBrowserFullscreen && (
              <button
                onClick={handleBrowserFullscreen}
                className={cn(
                  "absolute p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-all duration-200 z-10",
                  isMobile ? "top-2 right-2" : "top-4 right-4"
                )}
                title="退出浏览器内全屏"
              >
                <svg
                  className={cn(
                    "text-white",
                    isMobile ? "w-5 h-5" : "w-6 h-6"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0">
              <img
                src={game.previewImage || "/images/placeholder.jpg"}
                alt={game.title}
                className="object-cover blur-sm transform scale-105 w-full h-full absolute inset-0"
                style={{objectFit: 'cover'}}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-black/95" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="absolute top-0 left-0 w-full text-center py-4 hidden sm:block">
                <h1 className="text-4xl font-bold text-purple-300 mb-2">{game.title}</h1>
                <p className="text-lg text-white px-4">{game.description}</p>
              </div>
              
              <div className="text-center p-4 sm:p-8 max-w-md bg-black/30 rounded-2xl border border-white/10 shadow-2xl">
                <div className={cn(
                  "relative rounded-xl overflow-hidden shadow-lg mx-auto mb-6",
                  isMobile ? "w-20 h-20" : "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                )}>
                  <img
                    src={game.icon}
                    alt={game.title}
                    className="object-cover w-full h-full"
                    style={{objectFit: 'cover'}}
                    width={isMobile ? 80 : 96}
                    height={isMobile ? 80 : 128}
                    loading="lazy"
                  />
                </div>
                <button
                  onClick={handlePlayGame}
                  className={cn(
                    "flex items-center justify-center mx-auto mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
                    isMobile ? "px-4 py-2 text-sm" : "px-5 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg md:px-10 md:py-4 md:text-xl"
                  )}
                >
                  <span>{game.slug === "steal-a-brainrot" ? "Play in New Tab" : "Play Now"}</span>
                  <svg
                    className={cn("ml-2", isMobile ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6")}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 游戏标题栏 - 新的深色导航栏样式 */}
      <div ref={gameInfoRef} className={cn(
        "flex items-center gap-3 bg-gray-800 p-3 rounded-md",
        isMobile ? "p-2" : "p-3"
      )}>
        <div className="relative w-8 h-8 rounded-md overflow-hidden">
          <img
            src={game.icon}
            alt={game.title}
            className="object-cover"
          />
        </div>
        <h2 className={cn(
          "font-bold text-white",
          isMobile ? "text-sm" : "text-base"
        )}>{game.title}</h2>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1V9z" />
              </svg>
              <span className="ml-1 text-white text-sm">{formatNumber(likesCount)}</span>
            </button>
            <button className="flex items-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm0 12l-4.34 4.34L12 14H3v-2l3-7h9v10zm4-12h4v12h-4V3z" />
              </svg>
              <span className="ml-1 text-white text-sm">{formatNumber(dislikesCount)}</span>
            </button>
          </div>
          <button className="flex items-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button 
            onClick={isPlaying ? handleBrowserFullscreen : undefined} 
            className="flex items-center" 
            title="浏览器内全屏"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              {isBrowserFullscreen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div ref={shareBarRef} className="mt-8">
        <ShareBar title={game.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
      </div>

      <div ref={randomGamesRef} className="mt-2">
        <RandomGames 
          count={getRandomGamesCount()} 
          isMobile={isMobile} 
          currentGameSlug={game.slug}
        />
      </div>

      {game.info && (
        <div ref={gameInfoSectionRef} className={cn(
          "bg-gray-900 rounded-lg p-6 mt-8",
          isMobile && "p-4"
        )}>
          <h2 className={cn(
            "text-2xl font-bold mb-4 text-white",
            isMobile && "text-xl"
          )}>Game Information</h2>
          <p className="text-gray-300 leading-relaxed">
            {game.info}
          </p>
        </div>
      )}
    </div>
  )
}

