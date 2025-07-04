"use client"

import { useEffect, useState } from "react"
import { smoothScrollTo } from "@/lib/utils"

interface FooterConfig {
  columns: Array<{
    title: string
    description?: string
    links?: Array<{
      text: string
      url: string
      isAnchor?: boolean
    }>
  }>
  copyright: string
  disclaimer: string
}

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig | null>(null)

  useEffect(() => {
    // 从 API 加载配置
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data.footer)
      })
      .catch(error => {
        console.error('Error loading footer config:', error)
      })
  }, [])

  const handleLinkClick = (link: { text: string; url: string; isAnchor?: boolean }, event: React.MouseEvent) => {
    if (link.isAnchor) {
      event.preventDefault()
      const elementId = link.url.replace('#', '')
      smoothScrollTo(elementId, 80) // 添加80px偏移量以避免被导航栏遮挡
    }
  }

  if (!config) return null

  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.columns.map((column, index) => (
            <div key={index} className="text-left">
              <h3 className="text-2xl font-bold text-white mb-4">{column.title}</h3>
              {column.description && (
                <p className="text-gray-400">{column.description}</p>
              )}
              {column.links && (
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                        target={link.isAnchor ? undefined : "_blank"}
                        rel={link.isAnchor ? undefined : "noopener noreferrer"}
                        onClick={(e) => handleLinkClick(link, e)}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">{config.copyright}</p>
          <p className="text-gray-500 mt-2">
            Disclaimer: {config.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}

