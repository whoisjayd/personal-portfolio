"use client"

import { useEffect, useRef } from "react"

import { trackEvent } from "@/components/analytics/google-analytics"

interface BlogAnalyticsProps {
  slug: string
  title: string
  readingTime?: number
}

export default function BlogAnalytics({ slug, title, readingTime }: BlogAnalyticsProps) {
  const hasTrackedView = useRef(false)
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    // Track page view
    if (!hasTrackedView.current) {
      trackEvent("page_view", "blog", slug)
      hasTrackedView.current = true
    }

    // Track reading progress
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
      )

      // Track reading milestones
      if (scrollPercent >= 25) {
        trackEvent("reading_progress", "blog", `${slug}_25%`)
      }
      if (scrollPercent >= 50) {
        trackEvent("reading_progress", "blog", `${slug}_50%`)
      }
      if (scrollPercent >= 75) {
        trackEvent("reading_progress", "blog", `${slug}_75%`)
      }
      if (scrollPercent >= 90) {
        trackEvent("reading_progress", "blog", `${slug}_100%`)
      }
    }

    // Track time spent reading
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000)
      trackEvent("time_on_page", "blog", slug, timeSpent)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [slug])

  return null // This component doesn't render anything
}
