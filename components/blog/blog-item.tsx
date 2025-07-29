import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import ViewCounter from "@/components/blog/view-counter"

interface Props {
  title: string
  slug: string
  date: string
  excerpt?: string
  coverImage?: { url: string } | null
  readingTime?: number
  tags?: { items?: { _title: string; _slug: string }[] }
  compact?: boolean
  featured?: boolean
  initialViews?: number
}

export default function BlogItem({
  title,
  slug,
  date,
  excerpt,
  coverImage,
  readingTime,
  tags,
  compact = false,
  featured = false,
  initialViews = 0,
}: Props) {
  if (compact) {
    return (
      <Link
        href={`/blog/${slug}`}
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
              <div className="text-muted-foreground/60 text-lg">📝</div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title with featured indicator */}
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground/90 group-hover:text-foreground transition-colors text-sm line-clamp-1">
              {title.toLocaleLowerCase()}
            </h3>
            {featured && (
              <span className="text-xs bg-accent/10 border border-border/50 text-foreground/80 px-1.5 py-0.5 rounded font-medium">
                ★
              </span>
            )}
          </div>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-xs text-muted-foreground/90 group-hover:text-foreground/80 transition-colors line-clamp-1 mt-1">
              {excerpt.toLowerCase().slice(0, 100)}...
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mt-1">
            <ViewCounter slug={slug} initialViews={initialViews} />
            {readingTime && (
              <>
                <span>•</span>
                <span>{readingTime}m</span>
              </>
            )}{" "}
            •
            <span>
              {date &&
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <li
      className="py-3 xs:py-4 sm:py-5 text-foreground/80 border-b border-border/50 last:border-b-0"
      key={slug}
    >
      <Link
        href={`/blog/${slug}`}
        className={cn(
          "group grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 xs:gap-4 sm:gap-5 items-start",
          "hover:bg-accent/10 -mx-2 px-2 py-3 xs:py-4 rounded-lg transition-all duration-200",
          "relative"
        )}
      >
        {/* Cover Image */}
        {coverImage?.url && (
          <div className="flex-shrink-0 w-full sm:w-36 md:w-40 lg:w-48 h-40 xs:h-48 sm:h-24 md:h-28 lg:h-32 relative overflow-hidden rounded-md bg-muted/80">
            <Image
              src={coverImage.url}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 144px, (max-width: 1024px) 160px, 192px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Title with featured badge */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-1 xs:mb-1.5 sm:mb-2">
            <h3 className="font-medium text-foreground/90 group-hover:text-foreground transition-colors text-sm xs:text-base sm:text-lg md:text-xl line-clamp-2">
              {title}
            </h3>
            {featured && (
              <span className="text-[0.65rem] xs:text-xs sm:text-sm bg-accent/10 border border-border/50 text-foreground/80 px-1.5 xs:px-2 py-0.5 rounded font-medium">
                ★
              </span>
            )}
          </div>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground/90 group-hover:text-foreground/80 transition-colors mb-1.5 xs:mb-2 sm:mb-2.5 line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {tags?.items && tags.items.length > 0 && (
            <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-2.5">
              {tags.items.slice(0, 3).map((tag) => (
                <span
                  key={tag._slug}
                  className="px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-1 text-[0.65rem] xs:text-xs sm:text-sm bg-accent/50 text-foreground/80 rounded-md"
                >
                  {tag._title}
                </span>
              ))}
            </div>
          )}

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 text-[0.65rem] xs:text-xs sm:text-sm md:text-base text-muted-foreground/70">
            <ViewCounter slug={slug} initialViews={initialViews} />
            <span className="hidden xs:inline">•</span>
            {readingTime && (
              <>
                <span>{readingTime} min read</span>
                <span className="hidden xs:inline">•</span>
              </>
            )}
            <span>
              {date &&
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}
