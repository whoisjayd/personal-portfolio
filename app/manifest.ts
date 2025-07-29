import { MetadataRoute } from "next"

import { siteConfig } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    orientation: "portrait-primary",
    scope: "/",
    lang: siteConfig.locale.replace("_", "-"),
    categories: ["productivity", "developer", "portfolio", "technology", "engineering"],
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/assets/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
      {
        src: "/assets/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/assets/og-default.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Homepage of Jaydeep Solanki's portfolio",
      },
    ],
    related_applications: [
      {
        platform: "web",
        url: siteConfig.url,
      },
    ],
    shortcuts: [
      {
        name: "Blog",
        short_name: "Blog",
        description: "Read latest blog posts about backend engineering",
        url: "/blog",
        icons: [{ src: "/assets/android-chrome-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Projects",
        short_name: "Projects",
        description: "View my latest projects and work",
        url: "/projects",
        icons: [{ src: "/assets/android-chrome-192x192.png", sizes: "192x192" }],
      },
    ],
  }
}
