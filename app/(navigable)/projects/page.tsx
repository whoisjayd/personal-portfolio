import { type Metadata } from "next"

import { generateSEO } from "@/lib/seo"
import ProjectList from "@/components/projects/project-list"

export const revalidate = 60

export const metadata: Metadata = generateSEO({
  title: "Projects",
  description:
    "A collection of things I've built, from web applications to creative experiments. Explore my portfolio of development projects and technical achievements.",
  url: "/projects",
  type: "website",
})

export default function Projects() {
  return (
    <main className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
        <p className="text-muted-foreground/90">
          A collection of things I&apos;ve built, from web applications to creative experiments.
        </p>
      </div>

      <section>
        <ProjectList />
      </section>
    </main>
  )
}
