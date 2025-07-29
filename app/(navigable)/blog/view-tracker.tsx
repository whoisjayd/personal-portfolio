"use client"

import { useEffect, useRef } from "react"

export default function ViewTracker({ slug }: { slug: string }) {
  const trackedSlugs = useRef(new Set<string>())

  useEffect(() => {
    if (!trackedSlugs.current.has(slug)) {
      const trackView = async () => {
        try {
          const response = await fetch(`/api/views/${slug}`, {
            method: "POST",
          })

          if (response.ok) {
            const data = await response.json()
            // Mark as tracked AFTER successful request
            trackedSlugs.current.add(slug)
            // Dispatch a custom event to notify view counters
            window.dispatchEvent(
              new CustomEvent("viewUpdated", {
                detail: { slug },
              })
            )
          }
        } catch (error) {
          console.error("Failed to track view:", error)
        }
      }

      // Small delay to ensure page is loaded
      const timer = setTimeout(trackView, 500)

      return () => clearTimeout(timer)
    }
  }, [slug])

  return null
}
