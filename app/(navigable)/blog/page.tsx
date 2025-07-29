import { type Metadata } from "next"

import { generateSEO } from "@/lib/seo"
import BlogList from "@/components/blog/blog-list"

export const revalidate = 60

export const metadata: Metadata = generateSEO({
  title: "Blog",
  description:
    "Thoughts, tutorials, and insights on development, design, and technology. Explore articles about web development, programming, and software engineering.",
  url: "/blog",
  type: "website",
})

export default function Blog() {
  return (
    <main className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground/90">
          Thoughts, tutorials, and insights on development, design, and technology.
        </p>
      </div>

      <section>
        <BlogList showSearch={true} />
      </section>
    </main>
  )
}
