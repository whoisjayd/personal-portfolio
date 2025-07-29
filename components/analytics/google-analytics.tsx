"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-L21LLRLZHF"

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) return

  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    ;(window as any).dataLayer.push(arguments)
  }

  window.gtag("js", new Date())
  window.gtag("config", GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

// Track page views
export const trackPageView = (url: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// Google Analytics component
export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_TRACKING_ID) return

    const url = pathname + searchParams.toString()
    trackPageView(url)
  }, [pathname, searchParams])

  if (!GA_TRACKING_ID) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
