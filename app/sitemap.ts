import { MetadataRoute } from "next"

import { getPosts } from "@/lib/get-posts"
import { getProjects } from "@/lib/get-projects"
import { siteConfig } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [posts, projects] = await Promise.all([getPosts(), getProjects()])

    const staticRoutes = [
      {
        url: siteConfig.url,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 1.0,
      },
      {
        url: `${siteConfig.url}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${siteConfig.url}/projects`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]

    const blogRoutes = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post._slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    const projectRoutes = projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project._slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...blogRoutes, ...projectRoutes]
  } catch (error) {
    console.error("Error generating sitemap:", error)

    // Fallback sitemap with just static routes
    return [
      {
        url: siteConfig.url,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 1.0,
      },
      {
        url: `${siteConfig.url}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${siteConfig.url}/projects`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]
  }
}
