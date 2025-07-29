import { MetadataRoute } from "next"

import { siteConfig } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/.well-known/"],
      },
      {
        userAgent: "facebookexternalhit/*",
        allow: ["/api/og", "/"],
      },
      {
        userAgent: "Twitterbot",
        allow: ["/api/og", "/"],
      },
      {
        userAgent: "LinkedInBot",
        allow: ["/api/og", "/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
