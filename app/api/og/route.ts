import { NextRequest } from "next/server"

export const runtime = "edge"

function wrapText(text: string, maxLength: number, maxLines: number = 3): string[] {
  if (text.length <= maxLength) return [text]

  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word

    if (testLine.length <= maxLength) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
        if (lines.length >= maxLines) break
      }
      // Handle very long words that exceed maxLength
      if (word.length > maxLength) {
        currentLine = word.substring(0, maxLength - 3) + "..."
      } else {
        currentLine = word
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }

  // Add ellipsis if text was truncated
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    const lastLine = lines[lines.length - 1]
    if (lastLine.length > 3) {
      lines[lines.length - 1] = lastLine.substring(0, lastLine.length - 3) + "..."
    }
  }

  return lines
}

function wrapTextNoTrim(text: string, maxLength: number, maxLines: number = 3): string[] {
  // This version never trims or adds ellipsis, just breaks into lines
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxLength) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
        if (lines.length >= maxLines) break
      }
      currentLine = word
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }
  return lines
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function calculateTitleFontSize(text: string): {
  fontSize: number
  maxLines: number
  maxCharsPerLine: number
} {
  const length = text.length
  if (length <= 20) return { fontSize: 88, maxLines: 2, maxCharsPerLine: 18 }
  if (length <= 35) return { fontSize: 76, maxLines: 2, maxCharsPerLine: 20 }
  if (length <= 55) return { fontSize: 64, maxLines: 3, maxCharsPerLine: 25 }
  if (length <= 80) return { fontSize: 52, maxLines: 3, maxCharsPerLine: 30 }
  return { fontSize: 44, maxLines: 4, maxCharsPerLine: 35 }
}

function calculateDescriptionFontSize(text: string): { fontSize: number; maxCharsPerLine: number } {
  const length = text.length
  if (length <= 40) return { fontSize: 34, maxCharsPerLine: 50 }
  if (length <= 80) return { fontSize: 30, maxCharsPerLine: 55 }
  if (length <= 120) return { fontSize: 26, maxCharsPerLine: 60 }
  return { fontSize: 24, maxCharsPerLine: 65 }
}

function parseTags(tagsString: string): string[] {
  if (!tagsString) return []
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3) // Limit to 3 tags for better visual balance
}

function getDynamicFontSize(
  text: string,
  maxWidth: number,
  maxLines: number,
  minFontSize: number,
  maxFontSize: number
): { fontSize: number; lines: string[] } {
  let fontSize = maxFontSize
  let lines: string[] = []
  while (fontSize >= minFontSize) {
    // Estimate max chars per line based on font size and width
    const approxCharWidth = fontSize * 0.6 // Empirical value for sans-serif
    const maxCharsPerLine = Math.floor(maxWidth / approxCharWidth)
    lines = wrapText(text, maxCharsPerLine, maxLines)
    if (lines.length <= maxLines && lines.join("").length >= text.length) {
      break
    }
    fontSize -= 2
  }
  if (fontSize < minFontSize) fontSize = minFontSize
  return { fontSize, lines }
}

function getDynamicFontSizeNoTrim(
  text: string,
  maxWidth: number,
  maxLines: number,
  minFontSize: number,
  maxFontSize: number
): { fontSize: number; lines: string[] } {
  let fontSize = maxFontSize
  let lines: string[] = []
  while (fontSize >= minFontSize) {
    const approxCharWidth = fontSize * 0.6 // Empirical value for sans-serif
    const maxCharsPerLine = Math.floor(maxWidth / approxCharWidth)
    lines = wrapTextNoTrim(text, maxCharsPerLine, maxLines)
    // If all words are included and lines fit, break
    if (
      lines.length <= maxLines &&
      lines.join(" ").replace(/\s+/g, " ").trim() === text.replace(/\s+/g, " ").trim()
    ) {
      break
    }
    fontSize -= 2
  }
  if (fontSize < minFontSize) fontSize = minFontSize
  return { fontSize, lines }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title") || "Jaydeep Solanki"
    const description = searchParams.get("description") || "Backend Engineer & Developer"
    const type = searchParams.get("type") || "website"
    const author = searchParams.get("author") || "Jaydeep Solanki"
    const category = searchParams.get("category") || ""
    const readingTime = searchParams.get("readingTime") || ""
    const tagsParam = searchParams.get("tags") || ""

    const tags = parseTags(tagsParam)
    // Dynamic font size for title
    const titleMaxWidth = 1040 // 1200 - 2*80
    const titleMaxLines = 4
    const titleMinFontSize = 32
    const titleMaxFontSize = 88
    const { fontSize: titleFontSize, lines: titleLines } = getDynamicFontSize(
      title,
      titleMaxWidth,
      titleMaxLines,
      titleMinFontSize,
      titleMaxFontSize
    )
    const titleLineHeight = titleFontSize * 1.1
    const titleSectionHeight = titleLines.length * titleLineHeight

    // Dynamic font size for description (never trims)
    const descMaxWidth = 1040
    const descMaxLines = 2
    const descMinFontSize = 12 // allow smaller font if needed
    const descMaxFontSize = 34
    const { fontSize: descFontSize, lines: descLines } = getDynamicFontSizeNoTrim(
      description,
      descMaxWidth,
      descMaxLines,
      descMinFontSize,
      descMaxFontSize
    )
    const descLineHeight = descFontSize * 1.3

    // Build clean metadata
    const metadata = []
    // Always show type, including 'website'
    if (type) metadata.push(type.charAt(0).toUpperCase() + type.slice(1))
    if (category) metadata.push(category)
    if (readingTime) metadata.push(`${readingTime} min`)
    const headerMetadata = metadata.join(" • ")

    const titleStartY = 200
    const descriptionY = titleStartY + titleSectionHeight + 40
    const tagsY = descriptionY + descLines.length * descLineHeight + 50
    const footerY = 550

    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Ultra-modern gradient background -->
          <radialGradient id="bgGradient" cx="20%" cy="20%" r="100%" gradientUnits="objectBoundingBox">
            <stop offset="0%" style="stop-color:#0a0a0a"/>
            <stop offset="50%" style="stop-color:#020202"/>
            <stop offset="100%" style="stop-color:#000000"/>
          </radialGradient>
          
          <!-- Subtle accent gradient -->
          <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:transparent"/>
            <stop offset="20%" style="stop-color:#ffffff" stop-opacity="0.1"/>
            <stop offset="80%" style="stop-color:#ffffff" stop-opacity="0.3"/>
            <stop offset="100%" style="stop-color:transparent"/>
          </linearGradient>

          <!-- Title text gradient -->
          <linearGradient id="titleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff"/>
            <stop offset="100%" style="stop-color:#e8e8e8"/>
          </linearGradient>

          <!-- Tag background -->
          <linearGradient id="tagBackground" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a1a"/>
            <stop offset="100%" style="stop-color:#0f0f0f"/>
          </linearGradient>

          <!-- Subtle glow effect -->
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Geometric pattern -->
          <pattern id="geometricPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="transparent"/>
            <circle cx="50" cy="50" r="1" fill="#ffffff" opacity="0.02"/>
            <circle cx="0" cy="0" r="1" fill="#ffffff" opacity="0.02"/>
            <circle cx="100" cy="100" r="1" fill="#ffffff" opacity="0.02"/>
          </pattern>
        </defs>
        
        <!-- Main background -->
        <rect width="1200" height="630" fill="url(#bgGradient)"/>
        
        <!-- Subtle pattern overlay -->
        <rect width="1200" height="630" fill="url(#geometricPattern)" opacity="0.3"/>
        
        <!-- Modern geometric accent - top right -->
        <g transform="translate(900, 50)" opacity="0.08">
          <rect x="0" y="0" width="200" height="2" fill="#ffffff"/>
          <rect x="0" y="20" width="120" height="1" fill="#ffffff"/>
          <rect x="0" y="35" width="80" height="1" fill="#ffffff"/>
          <circle cx="250" cy="1" r="1" fill="#ffffff"/>
        </g>

        <!-- Content container -->
        <g transform="translate(80, 0)">
          
          <!-- Header metadata -->
          ${
            headerMetadata
              ? `
            <g transform="translate(0, 80)">
              <rect x="0" y="0" width="4" height="20" rx="2" fill="#ffffff" opacity="0.6"/>
              <text x="20" y="15" 
                    font-size="14" 
                    fill="#888888" 
                    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" 
                    font-weight="500" 
                    letter-spacing="0.05em">
                ${escapeHtml(headerMetadata)}
              </text>
            </g>
          `
              : ""
          }
          
          <!-- Main title with enhanced typography -->
          <g transform="translate(0, ${titleStartY})">
            ${titleLines
              .map(
                (line, index) => `
              <text x="0" y="${index * titleLineHeight}" 
                    font-size="${titleFontSize}" 
                    fill="url(#titleGradient)" 
                    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" 
                    font-weight="700" 
                    letter-spacing="-0.02em"
                    filter="url(#textGlow)">
                ${escapeHtml(line)}
              </text>
            `
              )
              .join("")}
          </g>
          
          <!-- Description with perfect spacing -->
          ${
            description && description !== "Backend Engineer & Developer"
              ? `
            <g transform="translate(0, ${descriptionY})">
              ${descLines
                .map(
                  (line, index) => `
                <text x="0" y="${index * descLineHeight}" 
                      font-size="${descFontSize}" 
                      fill="#a0a0a0" 
                      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" 
                      font-weight="400" 
                      letter-spacing="0.005em"
                      opacity="0.9">
                  ${escapeHtml(line)}
                </text>
              `
                )
                .join("")}
            </g>
          `
              : ""
          }
          
          <!-- Clean tags design -->
          ${
            tags.length > 0
              ? `
            <g transform="translate(0, ${tagsY})">
              ${tags
                .map((tag, index) => {
                  const tagWidth = Math.max(tag.length * 9 + 32, 70)
                  const xOffset = index * (tagWidth + 16)
                  return `
                  <g transform="translate(${xOffset}, 0)">
                    <rect x="0" y="0" width="${tagWidth}" height="32" rx="16" 
                          fill="url(#tagBackground)" 
                          stroke="#333333" 
                          stroke-width="0.5"
                          opacity="0.8"/>
                    <text x="${tagWidth / 2}" y="21" 
                          text-anchor="middle" 
                          font-size="13" 
                          fill="#ffffff" 
                          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" 
                          font-weight="500"
                          opacity="0.9"
                          letter-spacing="0.01em">
                      ${escapeHtml(tag)}
                    </text>
                  </g>
                `
                })
                .join("")}
            </g>
          `
              : ""
          }
          
          <!-- Elegant separator line -->
          <line x1="0" 
                y1="${footerY - 40}" 
                x2="300" 
                y2="${footerY - 40}" 
                stroke="url(#accentLine)" 
                stroke-width="1"/>
          
          <!-- Clean footer -->
          <g transform="translate(0, ${footerY})">
            <!-- Modern status indicator -->
            <circle cx="6" cy="6" r="3" fill="#ffffff" opacity="0.8"/>
            <circle cx="6" cy="6" r="1.5" fill="#000000"/>
            
            <!-- Author name -->
            <text x="24" y="11" 
                  font-size="18" 
                  fill="#ffffff" 
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" 
                  font-weight="600"
                  opacity="0.9"
                  letter-spacing="-0.005em">
              ${escapeHtml(author)}
            </text>
          </g>
          
        </g>
        
        <!-- Minimalist corner accent -->
        <g transform="translate(1050, 100)" opacity="0.1">
          <circle cx="0" cy="0" r="40" fill="none" stroke="#ffffff" stroke-width="0.5"/>
          <circle cx="0" cy="0" r="2" fill="#ffffff"/>
        </g>
        
        <!-- Bottom accent -->
        <rect x="0" y="625" width="1200" height="5" fill="url(#accentLine)" opacity="0.3"/>
        
      </svg>
    `

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Error generating OG image:", error)

    // Clean fallback design
    const fallbackSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fallbackBg" cx="30%" cy="30%" r="100%">
            <stop offset="0%" style="stop-color:#0a0a0a"/>
            <stop offset="100%" style="stop-color:#000000"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#fallbackBg)"/>
        <g transform="translate(80, 0)">
          <text x="0" y="280" font-size="72" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-weight="700" letter-spacing="-0.02em">
            Jaydeep Solanki
          </text>
          <text x="0" y="340" font-size="28" fill="#a0a0a0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-weight="400">
            Backend Engineer &amp; Developer
          </text>
          <circle cx="6" cy="420" r="2" fill="#ffffff" opacity="0.8"/>
          <text x="24" y="425" font-size="16" fill="#888888" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-weight="500">
            Professional Portfolio
          </text>
        </g>
        <rect x="0" y="625" width="1200" height="5" fill="#333333" opacity="0.2"/>
      </svg>`

    return new Response(fallbackSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    })
  }
}
