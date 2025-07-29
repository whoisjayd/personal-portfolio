"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

import { type AccentColor } from "@/lib/utils"

import { CopyButton } from "./copy-button"

interface CodeBlockProps {
  children: string
  language?: string
  accentColor?: AccentColor
  className?: string
}

export function CodeBlock({
  children,
  language,
  accentColor = "orange",
  className,
  ...props
}: CodeBlockProps) {
  // Extract language from className if provided (e.g., "language-javascript")
  const detectedLanguage = language || className?.replace("language-", "") || "text"

  // Custom theme with dynamic colors
  const customTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "0.5rem",
      margin: "1.5rem 0",
      padding: "1rem",
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "transparent",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      color: "hsl(var(--foreground))",
    },
  }

  return (
    <div className="relative group my-6">
      <SyntaxHighlighter
        language={detectedLanguage}
        style={customTheme}
        customStyle={{
          margin: 0,
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          color: "hsl(var(--foreground))",
        }}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
      <CopyButton accentColor={accentColor} />
    </div>
  )
}
