"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { cn } from "@/lib/utils"

interface NavbarProps {
  onGameSelect?: (gameName: string) => void
  onToggleTheme: () => void
  isDarkMode: boolean
  currentGameTitle?: string
  isMobile?: boolean
  onShowGameList?: () => void
  onNavigateHome?: () => void
}

const navItems = [
  { name: "Home", id: "home" },
  { name: "Features", id: "features" },
  { name: "Characteristics", id: "characteristics" },
  { name: "How to Play", id: "how-to-play" },
  { name: "Why Play", id: "why-play" },
  { name: "Scripts", id: "scripts" },
  { name: "FAQ", id: "faq" }
]

export default function Navbar({ 
  onGameSelect, 
  onToggleTheme, 
  isDarkMode, 
  currentGameTitle,
  isMobile,
  onShowGameList,
  onNavigateHome
}: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [siteName, setSiteName] = useState("Steal a Brainrot")

  useEffect(() => {
    // Load config from API
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setSiteName(data.siteName)
      })
      .catch(error => {
        console.error('Error loading site config:', error)
      })
  }, [])

  const handleScroll = (id: string) => {
    // If on More Games page, redirect to home first
    if (pathname === '/more-games') {
      router.push('/')
      return
    }
    
    const element = document.getElementById(id)
    if (element) {
      const offset = element.offsetTop - 80 // Account for navbar height
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      })
    }
    setIsMenuOpen(false)
  }

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome()
    } else {
      router.push('/')
    }
  }

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center space-x-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Game Logo"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="text-2xl font-bold text-white">
              {siteName}
            </span>
          </button>

          {/* Right side navigation and buttons */}
          <div className="flex items-center space-x-6">
            {/* Navigation links - desktop only */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className="text-white hover:text-purple-400 transition-colors text-sm"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* More Games button - desktop only */}
            <Link
              href="/more-games"
              className="hidden md:block bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 text-white text-sm"
            >
              More Games
            </Link>

            {/* Theme toggle button - desktop only */}
            <button
              onClick={onToggleTheme}
              className="hidden md:block bg-gray-700 p-2 rounded-lg text-white"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>

            {/* Mobile menu button - always visible on mobile */}
            <button
              className="block md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-0 right-0 w-64 h-screen bg-gray-900 shadow-lg z-50">
            <div className="flex justify-end p-2 border-b border-gray-800">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Menu items */}
            <div className="p-4 space-y-2">
              {/* Show navigation items */}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className="block w-full text-left text-white hover:text-purple-400 transition-colors py-2"
                >
                  {item.name}
                </button>
              ))}
              
              {/* More Games button - always visible */}
              <Link
                href="/more-games"
                className="block w-full text-center text-white bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg py-3 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                More Games
              </Link>
              
              {/* Theme toggle button - always visible */}
              <button
                onClick={() => {
                  onToggleTheme()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-center text-white bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg py-3 mt-2"
              >
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

