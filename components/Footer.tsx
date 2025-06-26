"use client"

import { useEffect, useState } from "react"

interface FooterConfig {
  columns: Array<{
    title: string
    description?: string
    links?: Array<{
      text: string
      url: string
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

  if (!config) return null

  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.columns.map((column, index) => (
            <div key={index} className="text-center">
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
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
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

