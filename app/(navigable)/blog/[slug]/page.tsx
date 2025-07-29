import Image from "next/image"
import { notFound } from "next/navigation"
import { RichText } from "basehub/react-rich-text"

import { getPost } from "@/lib/get-post"
import { getPostViews } from "@/lib/get-post-views"
import { getPosts } from "@/lib/get-posts"
import { createRichTextComponents } from "@/lib/rich-text-components"
import {
  generateBlogPostStructuredData,
  generateBreadcrumbStructuredData,
  generateSEO,
} from "@/lib/seo"
import { formatDate, getAccentColor } from "@/lib/utils"
import BlogAnalytics from "@/components/analytics/blog-analytics"
import RelatedPosts from "@/components/blog/related-posts"
import ViewCounter from "@/components/blog/view-counter"
import { Breadcrumb, StructuredData } from "@/components/seo/advanced-seo"
import ViewTracker from "@/app/(navigable)/blog/view-tracker"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post._slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return notFound()
  }

  const tags = post.tags?.items?.map((tag) => tag._title) || []

  return generateSEO({
    title: post._title,
    description: post.excerpt || `Read ${post._title} on our blog.`,
    url: `/blog/${slug}`,
    type: "article",
    image: post.coverImage?.url || undefined,
    publishedTime: post.date,
    modifiedTime: post.date,
    tags,
    readingTime: post.content?.readingTime,
  })
}

export default async function Post({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const initialViews = await getPostViews(slug)
  const date = formatDate(post.date)
  const accentColor = getAccentColor(post)
  const richTextComponents = createRichTextComponents({ accentColor })

  const tags = post.tags?.items?.map((tag) => tag._title) || []
  const structuredData = generateBlogPostStructuredData({
    title: post._title,
    description: post.excerpt || `Read ${post._title} on our blog.`,
    url: `/blog/${slug}`,
    image: post.coverImage?.url,
    datePublished: post.date,
    dateModified: post.date,
    readingTime: post.content?.readingTime,
    tags,
  })

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Blog", url: "/blog" },
    { name: post._title, url: `/blog/${slug}` },
  ])

  const breadcrumbItems = [
    { name: "Blog", url: "/blog" },
    { name: post._title, url: `/blog/${slug}` },
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData data={breadcrumbData} />

      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <article className="prose prose-neutral max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          {/* Cover Image */}
          {post.coverImage?.url && (
            <div className="mb-6 -mx-4 sm:mx-0">
              <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg bg-muted/50">
                <Image
                  src={post.coverImage.url}
                  alt={post._title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, (max-width: 1024px) 768px, 1024px"
                  priority
                />
              </div>
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-muted-foreground/90 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground/80">
            <time>{date}</time>
            {post.content?.readingTime && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{post.content.readingTime} min read</span>
              </>
            )}
            <span className="hidden sm:inline">•</span>
            <ViewCounter slug={slug} initialViews={initialViews} />
          </div>
        </header>

        <div className="text-foreground/90 leading-relaxed text-sm sm:text-base">
          <RichText components={richTextComponents}>{post.content?.json.content}</RichText>
        </div>

        <ViewTracker slug={slug} />
        <BlogAnalytics slug={slug} title={post._title} readingTime={post.content?.readingTime} />

        <RelatedPosts currentSlug={slug} />
      </article>
    </>
  )
}
