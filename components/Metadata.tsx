"use client"

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { defaultConfig } from '@/lib/config'

export default function CanonicalUrl() {
  const pathname = usePathname()
  const { siteInfo } = defaultConfig
  const canonicalUrl = `${siteInfo.siteUrl}${pathname}`

  return (
    <>
      <Script id="canonical-url" strategy="afterInteractive">
        {`
          const link = document.createElement('link');
          link.rel = 'canonical';
          link.href = '${canonicalUrl}';
          document.head.appendChild(link);
        `}
      </Script>
    </>
  )
} 