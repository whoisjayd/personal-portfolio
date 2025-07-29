import Image from "next/image";
import Link from "next/link";



import { PROJECT } from "@/lib/constants";
import { cn } from "@/lib/utils";





interface Props {
  title: string
  slug: string
  excerpt?: string
  coverImage?: { url: string } | null
  technologies?: { items?: { _title: string; _slug: string }[] }
  githubUrl?: string | null
  liveUrl?: string | null
  status?: string
  readingTime?: number
  compact?: boolean
  featured?: boolean
}

export default function ProjectItem({
  title,
  slug,
  excerpt,
  coverImage,
  technologies,
  githubUrl,
  liveUrl,
  status,
  readingTime,
  compact = false,
  featured = false,
}: Props) {
  if (compact) {
    return (
      <Link
        href={`/projects/${slug}`}
        className="group flex gap-3 p-3 rounded-lg hover:bg-accent/10 transition-all duration-200 border border-transparent hover:border-border/50"
      >
        {/* Small cover image or icon with featured indicator */}
        <div className="flex-shrink-0 relative">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
            {coverImage?.url ? (
              <Image
                src={coverImage.url}
                alt={title}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-muted-foreground text-lg">
                {PROJECT.DEFAULTS.COVER_IMAGE_ICON}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title with featured indicator */}
            <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground/90 group-hover:text-foreground transition-colors text-sm line-clamp-1">
              {title.toLowerCase()}
            </h3>
            {featured && (
              <span className="text-xs bg-accent/10 border border-border/50 text-foreground/80 px-1.5 py-0.5 rounded font-medium">
              {PROJECT.DEFAULTS.FEATURED_ICON}
              </span>
            )}
            </div>

          {/* Excerpt or technologies */}
          {excerpt ? (
            <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-1 mt-1">
              {excerpt.toLowerCase().slice(0, PROJECT.LIMITS.EXCERPT_LENGTH)}...
            </p>
          ) : technologies?.items && technologies.items.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {technologies.items
                .slice(0, PROJECT.LIMITS.TECHNOLOGIES_COMPACT_DISPLAY)
                .map((tech) => (
                  <span
                    key={tech._slug}
                    className="px-1.5 py-0.5 text-xs bg-accent/10 text-muted-foreground rounded"
                  >
                    {tech._title}
                  </span>
                ))}
            </div>
          ) : null}

          {/* Links
          <div className="flex items-center gap-3 mt-2">
            {githubUrl && (
              <span className="text-xs text-muted-foreground/80">GitHub</span>
            )}
            {liveUrl && <span className="text-xs text-muted-foreground/80">Live</span>}
          </div> */}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative bg-gradient-to-br from-background/80 to-background/90 rounded-xl overflow-hidden border border-border/60 hover:border-border/80 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-foreground/5 block"
    >
      {/* Cover Image with Overlay */}
      <div
        className="relative w-full"
        style={{ height: PROJECT.DIMENSIONS.COVER_IMAGE.HEIGHT, overflow: "hidden" }}
      >
        {coverImage?.url ? (
          <>
            <Image
              src={coverImage.url}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center relative">
            <div className="text-5xl text-muted-foreground/50">
              {PROJECT.DEFAULTS.COVER_IMAGE_ICON}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 text-xs font-medium bg-background/90 backdrop-blur-sm border border-border/60 text-foreground/90 rounded-lg flex items-center gap-1">
              <span>{PROJECT.DEFAULTS.FEATURED_ICON}</span>
              <span>{PROJECT.UI.FEATURED}</span>
            </span>
          </div>
        )}

        {/* Quick Action Links */}
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {githubUrl && (
            <div
              className="bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50 hover:bg-accent/50 transition-colors"
              style={{
                width: PROJECT.DIMENSIONS.ICONS.BUTTON_SIZE,
                height: PROJECT.DIMENSIONS.ICONS.BUTTON_SIZE,
              }}
            >
              <svg
                className="text-foreground/80"
                style={{
                  width: PROJECT.DIMENSIONS.ICONS.SIZE,
                  height: PROJECT.DIMENSIONS.ICONS.SIZE,
                }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {liveUrl && (
            <div
              className="bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50 hover:bg-accent/50 transition-colors"
              style={{
                width: PROJECT.DIMENSIONS.ICONS.BUTTON_SIZE,
                height: PROJECT.DIMENSIONS.ICONS.BUTTON_SIZE,
              }}
            >
              <svg
                className="text-primary"
                style={{
                  width: PROJECT.DIMENSIONS.ICONS.SIZE,
                  height: PROJECT.DIMENSIONS.ICONS.SIZE,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground/90 group-hover:text-foreground transition-colors mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt ? (
          <p className="text-sm text-muted-foreground/90 group-hover:text-foreground/80 transition-colors mb-4 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors mb-4 italic">
            {PROJECT.UI.PROJECT_DETAILS_PLACEHOLDER}
          </p>
        )}

        {/* Technologies */}
        {technologies?.items && technologies.items.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {technologies.items.slice(0, PROJECT.LIMITS.TECHNOLOGIES_DISPLAY).map((tech) => (
              <span
                key={tech._slug}
                className="px-2.5 py-1 text-xs font-medium bg-accent/10 text-foreground/90 rounded-lg border border-border/50 group-hover:bg-accent/20 group-hover:border-border/70 transition-all"
              >
                {tech._title}
              </span>
            ))}
            {technologies.items.length > 3 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-accent/5 text-muted-foreground/80 rounded-lg border border-border/30">
                {PROJECT.UI.MORE_TECHNOLOGIES(
                  technologies.items.length - PROJECT.LIMITS.TECHNOLOGIES_DISPLAY
                )}
              </span>
            )}
          </div>
        )}

        {/* Bottom Section
        <div className="flex items-center justify-between pt-3 border-t border-border/50 group-hover:border-border/70 transition-colors">
          <div className="flex items-center gap-3 text-xs">
            {liveUrl && (
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Live Demo
              </span>
            )}
            {githubUrl && <span className="text-muted-foreground/80">GitHub</span>}
          </div>
        </div> */}
      </div>
    </Link>
  )
}