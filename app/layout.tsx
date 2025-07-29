import "@/app/globals.css"

import { Suspense } from "react"
import { type Metadata, type Viewport } from "next"
import { GeistMono } from "geist/font/mono"

import { generateSEO } from "@/lib/seo"
import { cn } from "@/lib/utils"
import GoogleAnalytics from "@/components/analytics/google-analytics"
import UmamiAnalytics from "@/components/analytics/umami-analytics"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = generateSEO()

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <UmamiAnalytics />
          <Analytics />
          <SpeedInsights />
        </Suspense>
        <link rel="icon" href="/assets/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={cn(
          GeistMono.variable,
          "flex min-h-screen flex-col bg-background font-mono text-foreground text-sm antialiased pt-16  "
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
