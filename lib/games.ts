import path from 'path'
import matter from 'gray-matter'
import { Game as GameType, GameFeature, HowToPlayStep, FAQSection, ScriptSection } from './types'

export type Game = GameType

export async function getGames(): Promise<Game[]> {
  try {
    // Read games list
    const gamesJsonContent = await import('../content/games.json')
    const basicGames = gamesJsonContent.games
    console.log('Loaded basic games:', basicGames.map((g: Partial<Game>) => g.slug))
    
    // Read game details (if they exist)
    let gameDetails: Game[] = []
    
    // Get all markdown files
    const mdFiles = [
      'brainrotclicker.md',
      'cheese-chompers-3d.md',
      'animal-rampage-3d.md',
      'crazy-sheep-3d.md',
      'bridge-race.md',
      'capybara-clicker.md',
      'count-masters-stickman-games.md',
      'steal-a-brainrot.md'
    ]
    console.log('Found markdown files:', mdFiles)
    
    gameDetails = await Promise.all(
      mdFiles.map(async (file) => {
        try {
          const { default: fileContents } = await import(`../content/games/${file}`)
          const { data } = matter(fileContents)
          console.log(`Processing ${file}, slug:`, data.slug)
          
          return {
            slug: data.slug,
            title: data.title,
            description: data.description,
            icon: data.icon,
            url: data.url,
            previewImage: data.previewImage,
            type: data.type,
            info: data.info,
            videoUrls: data.videoUrls,
            howToPlayIntro: data.howToPlayIntro,
            howToPlaySteps: data.howToPlaySteps,
            features: data.features,
            characteristics: data.characteristics,
            whyPlay: data.whyPlay,
            scripts: data.scripts,
            faq: data.faq
          } as Game
        } catch (error) {
          console.error(`Error processing ${file}:`, error)
          return null
        }
      })
    ).then(results => results.filter((result): result is Game => result !== null))
    
    console.log('Processed game details:', gameDetails.map(g => g.slug))

    // Merge games list with details
    const games = basicGames.map((basicGame: Partial<Game>) => {
      const details = gameDetails.find(detail => detail.slug === basicGame.slug)
      console.log(`Merging ${basicGame.slug}, found details:`, details ? 'yes' : 'no')
      
      if (details) {
        const mergedGame = {
          ...details,
          title: basicGame.title || details.title,
          description: basicGame.description || details.description,
          icon: basicGame.icon || details.icon,
          url: basicGame.url || details.url,
          previewImage: basicGame.previewImage || details.previewImage,
          type: basicGame.type || details.type
        }
        console.log(`Successfully merged ${basicGame.slug}`)
        return mergedGame
      }
      console.log(`No details found for ${basicGame.slug}, using basic info only`)
      return basicGame as Game
    })

    console.log('Final games:', games.map((g: Game) => ({ slug: g.slug, hasDetails: !!g.info })))
    return games
  } catch (error) {
    console.error('Error in getGames:', error)
    return []
  }
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const games = await getGames()
  return games.find(game => game.slug === slug) || null
} 