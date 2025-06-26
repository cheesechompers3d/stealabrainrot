import { SiteConfig } from './types'

// 由于无法直接导入MD文件，我们使用一个默认配置
export const defaultConfig: SiteConfig = {
  defaultGame: "steal-a-brainrot",
  siteName: "Steal a Brainrot",
  seo: {
    title: "Steal a Brainrot - Fast-Paced Action Game Online Free",
    description: "Play Steal a Brainrot! Compete to steal Brainrot from others and protect your own. Fast-paced, chaotic, and hilarious action for everyone.",
    ogImage: "/images/hot_game/steal-a-brainrot.png",
    keywords: ""
  },
  advertisement: {
    key: ""
  },
  gameSettings: {
    randomGamesCount: 20
  },
  siteInfo: {
    companyName: "Steal a Brainrot",
    siteUrl: "https://www.stealabrainrot.xyz",
    email: "HarryC199101@gmail.com"
  },
  footer: {
    columns: [],
    copyright: "© 2025 All rights reserved.",
    disclaimer: "This is an independent website."
  }
}

// 获取随机游戏数量配置
export function getRandomGamesCount(): number {
  return defaultConfig.gameSettings?.randomGamesCount || 20
}

// 获取站点配置
export function getSiteConfig(): SiteConfig {
  return defaultConfig
}

export default defaultConfig 