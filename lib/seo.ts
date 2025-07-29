import { type Metadata } from "next"

// Enhanced site configuration with comprehensive SEO settings
export const siteConfig = {
  name: "Jaydeep Solanki",
  title: "Student & Backend Enthusiast",
  description:
    "Final year ECE student from Nirma University passionate about backend engineering, developer tooling, and scalable systems. Building fast, reliable APIs and integrating AI into real-world applications.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://temppor-hazel.vercel.app",
  ogImage: "/assets/og-default.png",
  twitterHandle: "@JaydeepS14216",
  author: "Jaydeep Solanki",
  email: "contact@jaydeepsolanki.me",
  locale: "en_US",
  themeColor: "#000000",
  keywords: [
    "backend engineering",
    "backend developer",
    "API development",
    "scalable systems",
    "developer tooling",
    "microservices",
    "database design",
    "system architecture",
    "web development",
    "nodejs",
    "python",
    "typescript",
    "software engineering",
    "ECE student",
    "Nirma University",
    "full stack developer",
    "system design",
    "cloud computing",
    "DevOps",
    "software architecture",
  ],
  socialMedia: {
    twitter: "https://twitter.com/JaydeepS14216",
    github: "https://github.com/whoisjayd",
    linkedin: "https://linkedin.com/in/solanki-jaydeep",
    email: "mailto:contact@jaydeepsolanki.me",
  },
}

// Enhanced SEO interface with comprehensive options
interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article" | "profile" | "book"
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
  readingTime?: number
  category?: string
  section?: string
  locale?: string
  noIndex?: boolean
  noFollow?: boolean
  canonicalUrl?: string
  alternateUrls?: { href: string; hreflang: string }[]
  priority?: number
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
}

// DRY helper for image URL generation
function getImageUrl({
  image,
  title,
  description,
  type,
  author,
  category,
  readingTime,
  tags,
}: {
  image?: string
  title?: string
  description?: string
  type?: string
  author?: string
  category?: string
  readingTime?: number
  tags?: string[]
}) {
  if (image && image.startsWith("http")) return image
  if (image) return `${siteConfig.url}${image}`
  // Default OG image endpoint
  return `${siteConfig.url}/api/og?title=${encodeURIComponent(title || siteConfig.name)}&description=${encodeURIComponent(description || siteConfig.description)}&type=${type || "website"}&author=${encodeURIComponent(author || siteConfig.author)}&category=${encodeURIComponent(category || "")}&readingTime=${readingTime || ""}&tags=${encodeURIComponent(tags?.join(",") || "")}`
}

// Helper for social media sharing metadata (Twitter/X, LinkedIn, Instagram)
function getSocialMediaMeta({
  title,
  description,
  image,
  type = "website",
  url,
  author,
  category,
  readingTime,
  tags,
  locale,
  updatedTime,
}: {
  title: string
  description: string
  image?: string
  type?: string
  url?: string
  author?: string
  category?: string
  readingTime?: number
  tags?: string[]
  locale?: string
  updatedTime?: string
}) {
  const ogImageUrl = getImageUrl({
    image,
    title,
    description,
    type,
    author,
    category,
    readingTime,
    tags,
  })
  const metaTitle = title ? title : siteConfig.title
  const metaDescription = description || siteConfig.description
  const metaLocale = locale || siteConfig.locale
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const metaAlt = `${metaTitle} - ${metaDescription}`

  // Twitter/X meta
  const twitterMeta = {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: [ogImageUrl],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    image: ogImageUrl,
    "image:alt": metaAlt,
    url: metaUrl,
  }

  // LinkedIn meta (uses Open Graph)
  const linkedinMeta = {
    title: metaTitle,
    description: metaDescription,
    url: metaUrl,
    image: ogImageUrl,
    type: type,
    locale: metaLocale,
    updated_time: updatedTime,
    site_name: siteConfig.name,
  }

  // Instagram meta (Instagram uses OG tags, but you can add alt text for accessibility)
  const instagramMeta = {
    title: metaTitle,
    description: metaDescription,
    image: ogImageUrl,
    alt: metaAlt,
    url: metaUrl,
  }

  return {
    openGraph: {
      type: type,
      locale: metaLocale,
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: metaAlt,
          type: "image/png",
        },
      ],
      ...(type === "article" && {
        authors: [author || siteConfig.author],
        section: category,
        tags: tags,
        modifiedTime: updatedTime,
      }),
    },
    twitter: twitterMeta,
    linkedin: linkedinMeta,
    instagram: instagramMeta,
  }
}

// Advanced SEO generation with comprehensive metadata
export function generateSEO({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  author,
  readingTime,
  category,
  section,
  locale,
  noIndex = false,
  noFollow = false,
  canonicalUrl,
  alternateUrls,
  priority,
  changeFrequency,
}: SEOProps = {}): Metadata {
  const metaTitle = title ? title : siteConfig.title
  const metaDescription = description || siteConfig.description
  const metaLocale = locale || siteConfig.locale
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const canonical = canonicalUrl || metaUrl
  const updatedTime = modifiedTime || publishedTime

  // Generate comprehensive keywords
  const allKeywords = [
    ...siteConfig.keywords,
    ...(tags || []),
    ...(category ? [category] : []),
    ...(section ? [section] : []),
  ]

  // Use helper for social media sharing
  const socialMeta = getSocialMediaMeta({
    title: metaTitle,
    description: metaDescription,
    image,
    type,
    url,
    author,
    category,
    readingTime,
    tags,
    locale,
    updatedTime,
  })

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords.join(", "),
    authors: [{ name: author || siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    category: category,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical,
      ...(alternateUrls && {
        languages: alternateUrls.reduce(
          (acc, alt) => {
            acc[alt.hreflang] = alt.href
            return acc
          },
          {} as Record<string, string>
        ),
      }),
    },
    ...socialMeta,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteConfig.name,
    },
    formatDetection: {
      telephone: false,
    },
  }

  // Add article-specific metadata
  if (type === "article") {
    const otherMetadata: Record<string, string> = {
      "article:author": author || siteConfig.author,
      "article:section": section || "Technology",
      "og:type": "article",
    }

    if (publishedTime) otherMetadata["article:published_time"] = publishedTime
    if (modifiedTime) otherMetadata["article:modified_time"] = modifiedTime
    if (tags?.length) {
      tags.forEach((tag, index) => {
        otherMetadata[`article:tag:${index}`] = tag
      })
    }
    if (readingTime) otherMetadata["article:reading_time"] = readingTime.toString()

    metadata.other = { ...metadata.other, ...otherMetadata }
  }

  return metadata
}

// Helper for author structured data
function getAuthorObject(author?: string) {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}#person`,
    name: author || siteConfig.author,
    url: siteConfig.url,
    image: `${siteConfig.url}/assets/pfp.jpg`,
    sameAs: Object.values(siteConfig.socialMedia),
  }
}

// Helper for publisher structured data
function getPublisherObject() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}#logo`,
      url: `${siteConfig.url}/assets/initials.png`,
      width: 60,
      height: 60,
    },
  }
}

// Enhanced structured data for blog posts with more comprehensive schema
export function generateBlogPostStructuredData({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  readingTime,
  tags,
  category,
  wordCount,
}: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  readingTime?: number
  tags?: string[]
  category?: string
  wordCount?: number
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteConfig.url}${url}#blogpost`,
    headline: title,
    description,
    url: `${siteConfig.url}${url}`,
    image: {
      "@type": "ImageObject",
      url: getImageUrl({
        image,
        title,
        description,
        type: "article",
        author,
        category,
        readingTime,
      }),
      width: 1200,
      height: 630,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    author: getAuthorObject(author),
    publisher: getPublisherObject(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${url}#webpage`,
    },
    articleSection: category,
    keywords: tags?.join(", "),
    wordCount,
    timeRequired: readingTime ? `PT${readingTime}M` : undefined,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteConfig.url}/blog#blog`,
      name: `${siteConfig.name} Blog`,
      publisher: {
        "@id": `${siteConfig.url}#organization`,
      },
    },
  }

  return structuredData
}

// Enhanced project structured data
export function generateProjectStructuredData({
  title,
  description,
  url,
  image,
  datePublished,
  technologies,
  githubUrl,
  liveUrl,
  category,
}: {
  title: string
  description: string
  url: string
  image?: string
  datePublished?: string
  technologies?: string[]
  githubUrl?: string
  liveUrl?: string
  category?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}${url}#software`,
    name: title,
    description,
    url: liveUrl || `${siteConfig.url}${url}`,
    image: {
      "@type": "ImageObject",
      url: getImageUrl({ image, title, description, type: "website", category }),
      width: 1200,
      height: 630,
    },
    datePublished,
    author: getAuthorObject(),
    programmingLanguage: technologies,
    codeRepository: githubUrl,
    applicationCategory: category || "WebApplication",
    applicationSubCategory: "Developer Tools",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: technologies,
    downloadUrl: githubUrl,
    softwareVersion: "1.0.0",
    releaseNotes: description,
  }
}

// Enhanced breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteConfig.url}#breadcrumb`,
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}${breadcrumb.url}`,
        url: `${siteConfig.url}${breadcrumb.url}`,
        name: breadcrumb.name,
      },
    })),
  }
}

// Website/Organization structured data
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: getAuthorObject(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  }
}

// Person/Author structured data
export function generatePersonStructuredData() {
  return getAuthorObject()
}

// FAQ structured data generator
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Generate sitemap data
export function generateSitemapData(
  pages: {
    url: string
    lastModified?: Date
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
    priority?: number
  }[]
) {
  return pages.map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified: page.lastModified || new Date(),
    changeFrequency: page.changeFrequency || "monthly",
    priority: page.priority || 0.5,
  }))
}

// Generate robots.txt content
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Sitemap
Sitemap: ${siteConfig.url}/sitemap.xml

# Crawl-delay
Crawl-delay: 1`
}
