"use client"

import { useEffect } from "react"
import Script from "next/script"

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void
    }
  }
}

const UMATAMI_WEBSITE_ID = "0dbe2d95-7170-497d-8b64-3c049e6df378"

export function trackUmamiEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData)
  }
}

export default function UmamiAnalytics() {
  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={UMATAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  )
}
