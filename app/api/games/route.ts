import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Game, GameFeature } from '@/lib/types'

export async function GET() {
  try {
    // Read games.json
    const gamesJsonPath = path.join(process.cwd(), 'content', 'games.json')
    const gamesJsonContent = await fs.readFile(gamesJsonPath, 'utf8')
    const { games: basicGames } = JSON.parse(gamesJsonContent)
    console.log('Basic games loaded:', basicGames.map((g: Partial<Game>) => g.slug))

    // Read game markdown files
    const gamesDir = path.join(process.cwd(), 'content', 'games')
    const gameFiles = await fs.readdir(gamesDir)
    const markdownFiles = gameFiles.filter((file) => file.endsWith('.md'))
    console.log('Found markdown files:', markdownFiles)

    // Process each markdown file
    const gameDetails = await Promise.all(
      markdownFiles.map(async (file) => {
        try {
          const filePath = path.join(gamesDir, file)
          const fileContent = await fs.readFile(filePath, 'utf8')
          const { data } = matter(fileContent)
          
          // 确保 features, characteristics 和 whyPlay 的 items 是数组
          const processFeature = (feature: any): GameFeature => {
            if (!feature) {
              return { title: '', items: [], image: '' }
            }

            // 检查并处理 items 数组
            let processedItems: string[] = []
            if (Array.isArray(feature.items)) {
              processedItems = feature.items.map((item: string) => {
                // 移除前导破折号和空格
                let processedItem = item.replace(/^[-\s]+/, '').trim()
                
                // 如果字符串为空，返回空字符串
                if (!processedItem) {
                  return ''
                }
                
                return processedItem
              }).filter(Boolean) // 过滤掉空字符串
            }

            // 确保返回所有必要的属性
            return {
              title: feature.title || '',
              items: processedItems,
              image: feature.image || '' // 确保包含图片属性
            }
          }

          // 处理游戏数据
          const processedData = {
            ...data,
            slug: data.slug,
            features: processFeature(data.features),
            characteristics: processFeature(data.characteristics),
            whyPlay: processFeature(data.whyPlay),
            faq: data.faq || { title: '', items: [] }
          }

          // 添加调试日志
          console.log(`Processed ${file}, slug:`, processedData.slug)
          console.log('Raw features data:', data.features)
          console.log('Processed features:', JSON.stringify(processedData.features, null, 2))
          console.log('Raw characteristics data:', data.characteristics)
          console.log('Processed characteristics:', JSON.stringify(processedData.characteristics, null, 2))
          console.log('Raw whyPlay data:', data.whyPlay)
          console.log('Processed whyPlay:', JSON.stringify(processedData.whyPlay, null, 2))
          
          return processedData as Game
        } catch (error) {
          console.error(`Error processing ${file}:`, error)
          return null
        }
      })
    ).then(results => results.filter((result): result is Game => result !== null))

    console.log('Processed game details:', gameDetails.map((g: Game) => g.slug))

    // Merge basic game info with detailed info
    const games = basicGames.map((basicGame: Partial<Game>) => {
      const details = gameDetails.find((game) => game?.slug === basicGame.slug)
      console.log(`Merging ${basicGame.slug}, found details:`, details ? 'yes' : 'no')
      
      if (details) {
        // Merge details with basic game info, keeping all fields from details
        const mergedGame = {
          ...details,
          // Only override these specific fields from basicGame if they exist
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
      
      // If no details found, ensure the basic game has all required fields
      const emptyFeature: GameFeature = {
        title: '',
        items: [],
        image: '' // 移除默认图片
      }
      
      const basicGameWithDefaults: Game = {
        slug: basicGame.slug!,
        title: basicGame.title!,
        description: basicGame.description!,
        icon: basicGame.icon!,
        url: basicGame.url!,
        previewImage: basicGame.previewImage!,
        type: basicGame.type!,
        info: '',
        videoUrls: [],
        howToPlayIntro: '',
        howToPlaySteps: [],
        features: emptyFeature,
        characteristics: emptyFeature,
        whyPlay: emptyFeature,
        faq: {
          title: '',
          items: []
        }
      }
      
      console.log(`No details found for ${basicGame.slug}, using basic info with defaults`)
      return basicGameWithDefaults
    })

    // 添加更多的调试日志
    games.forEach((game: Game) => {
      console.log(`\nGame ${game.slug} final details:`)
      console.log('Features:', JSON.stringify(game.features, null, 2))
      console.log('Characteristics:', JSON.stringify(game.characteristics, null, 2))
      console.log('Why Play:', JSON.stringify(game.whyPlay, null, 2))
    })
    
    return NextResponse.json(games)
  } catch (error) {
    console.error('Error loading games:', error)
    return NextResponse.json({ error: 'Failed to load games' }, { status: 500 })
  }
} 