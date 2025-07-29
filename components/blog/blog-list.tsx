import { getPosts } from "@/lib/get-posts"
import { getPostsViews } from "@/lib/get-posts-views"
import BlogItem from "@/components/blog/blog-item"
import BlogSearch from "@/components/blog/blog-search"

interface Props {
  length?: number
  showSearch?: boolean
  compact?: boolean
}

export default async function BlogList({ length, showSearch = false, compact = false }: Props) {
  const posts = await getPosts({
    length,
    prioritizeFeatured: length ? true : false,
  })

  // Sort to ensure featured posts appear first
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  // Get views for all posts
  const postSlugs = sortedPosts.map((post) => post._slug)
  const postsViews = await getPostsViews(postSlugs)

  if (showSearch) {
    return <BlogSearch posts={sortedPosts} postsViews={postsViews} />
  }

  const containerClass = compact ? "space-y-1" : "flex flex-col"

  return (
    <ul className={containerClass}>
      {sortedPosts.map((post) => (
        <BlogItem
          key={post._slug}
          title={post._title}
          date={post.date!}
          slug={post._slug}
          excerpt={post.excerpt}
          coverImage={post.coverImage}
          readingTime={post.content?.readingTime}
          tags={post.tags}
          compact={compact}
          featured={post.featured}
          initialViews={postsViews[post._slug] || 0}
        />
      ))}
    </ul>
  )
}
