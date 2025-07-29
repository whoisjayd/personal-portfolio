"use client"

import { useMemo, useState } from "react"

import BlogItem from "./blog-item"

interface Post {
  _id: string
  _slug: string
  _title: string
  excerpt?: string
  date: string
  coverImage?: { url: string } | null
  content?: { readingTime?: number }
  tags?: { items?: { _title: string; _slug: string }[] }
  featured?: boolean
}

interface Props {
  posts: Post[]
  postsViews?: Record<string, number>
}

export default function BlogSearch({ posts, postsViews = {} }: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts

    const term = searchTerm.toLowerCase()
    return posts.filter(
      (post) =>
        post._title.toLowerCase().includes(term) ||
        post.excerpt?.toLowerCase().includes(term) ||
        (post.tags?.items &&
          post.tags.items.some(
            (tag) =>
              tag._title.toLowerCase().includes(term) || tag._slug.toLowerCase().includes(term)
          ))
    )
  }, [posts, searchTerm])

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-foreground/90 placeholder-muted-foreground/60 focus:outline-none focus:border-border/70 focus:bg-background/70 transition-all duration-200"
        />
      </div>

      {searchTerm && (
        <div className="mb-4 text-sm text-muted-foreground/90">
          {filteredPosts.length === 0
            ? `No posts found for "${searchTerm}"`
            : `${filteredPosts.length} post${filteredPosts.length === 1 ? "" : "s"} found for "${searchTerm}"`}
        </div>
      )}

      <ul className="flex flex-col">
        {filteredPosts.map((post) => (
          <BlogItem
            key={post._slug}
            title={post._title}
            date={post.date}
            slug={post._slug}
            excerpt={post.excerpt}
            coverImage={post.coverImage}
            readingTime={post.content?.readingTime}
            tags={post.tags}
            featured={post.featured}
            initialViews={postsViews[post._slug] || 0}
          />
        ))}
      </ul>
    </div>
  )
}
