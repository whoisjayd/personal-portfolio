import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { RichText } from "basehub/react-rich-text"

import { getProject } from "@/lib/get-project"
import { getProjects } from "@/lib/get-projects"
import { createRichTextComponents } from "@/lib/rich-text-components"
import {
  generateBreadcrumbStructuredData,
  generateProjectStructuredData,
  generateSEO,
} from "@/lib/seo"
import { Breadcrumb, StructuredData } from "@/components/seo/advanced-seo"

const richTextComponents = createRichTextComponents({ accentColor: "blue" })

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project._slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return notFound()
  }

  const technologies = project.technologies?.items?.map((tech) => tech._title) || []

  return generateSEO({
    title: project._title,
    description: project.content?.plainText
      ? project.content.plainText.slice(0, 160) + "..."
      : `Check out ${project._title} - a project showcasing modern web development.`,
    url: `/projects/${slug}`,
    type: "website",
    image: project.coverImage?.url || undefined,
    tags: technologies,
  })
}

export default async function Project({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  const technologies = project.technologies?.items?.map((tech) => tech._title) || []
  const structuredData = generateProjectStructuredData({
    title: project._title,
    description: project.content?.plainText
      ? project.content.plainText.slice(0, 300)
      : `${project._title}`,
    url: `/projects/${slug}`,
    image: project.coverImage?.url,
    technologies,
    githubUrl: project.githubUrl || undefined,
    liveUrl: project.liveUrl || undefined,
  })

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Projects", url: "/projects" },
    { name: project._title, url: `/projects/${slug}` },
  ])

  const breadcrumbItems = [
    { name: "Projects", url: "/projects" },
    { name: project._title, url: `/projects/${slug}` },
  ]

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData data={breadcrumbData} />

      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          {/* Demo Video or Cover Image */}
          {project.demoVideo?.url ? (
            <div className="mb-6 -mx-4 sm:mx-0">
              <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-background/90">
                <video
                  src={project.demoVideo.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ) : (
            project.coverImage?.url && (
              <div className="mb-6 -mx-4 sm:mx-0">
                <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg bg-background/90">
                  <Image
                    src={project.coverImage.url}
                    alt={project._title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, (max-width: 1024px) 768px, 1024px"
                    priority
                  />
                </div>
              </div>
            )
          )}

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground/90 mb-4 leading-tight">
            {project._title}
          </h1>

          {/* Technologies */}
          {project.technologies?.items && project.technologies.items.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.items.map((tech) => (
                <span
                  key={tech._slug}
                  className="px-2 py-1 text-xs sm:text-sm bg-accent/10 text-foreground/90 rounded-full border border-border/50"
                >
                  {tech._title}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-6">
            <div className="flex gap-2 sm:gap-4 ml-auto">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/80 hover:text-foreground transition-colors"
                >
                  GitHub →
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="prose prose-foreground/90 max-w-none text-foreground/90 text-sm sm:text-base">
          <RichText components={richTextComponents}>{project.content?.json.content}</RichText>

          {project.content?.readingTime && (
            <div className="mt-8 text-xs sm:text-sm text-muted-foreground/80">
              Estimated reading time: {project.content.readingTime} minutes
            </div>
          )}
        </div>
      </article>
    </>
  )
}
