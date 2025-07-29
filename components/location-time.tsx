"use client"

import { useCallback, useEffect, useState } from "react"

interface LocationTime {
  location: string
  timezone: string
  time: string
  isLoading: boolean
}

export default function LocationTime() {
  const [locationTime, setLocationTime] = useState<LocationTime>({
    location: "Ahmedabad, India",
    timezone: "Asia/Kolkata",
    time: "",
    isLoading: true,
  })

  const updateTime = useCallback(() => {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      timeZone: locationTime.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    const dateString = now.toLocaleDateString("en-US", {
      timeZone: locationTime.timezone,
      weekday: "short",
    })

    setLocationTime((prev) => ({
      ...prev,
      time: `${timeString} • ${dateString}`,
      isLoading: false,
    }))
  }, [locationTime.timezone])

  useEffect(() => {
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [updateTime])

  if (locationTime.isLoading) {
    return <p className="text-muted-foreground/70">loading...</p>
  }

  return (
    <p className="text-muted-foreground/70">
      {locationTime.location.toLowerCase()} • {locationTime.time}
    </p>
  )
}
