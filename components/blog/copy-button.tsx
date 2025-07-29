"use client"

import { useEffect, useRef, useState } from "react"

import { COPY_SETTINGS, DEFAULT_ACCENT_COLOR, SUCCESS_MESSAGES } from "@/lib/constants"
import { cleanTextContent, copyToClipboard, getColorTheme, type AccentColor } from "@/lib/utils"

interface CopyButtonProps {
  accentColor?: AccentColor
}

export function CopyButton({ accentColor = DEFAULT_ACCENT_COLOR }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [textContent, setTextContent] = useState("")
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Find the parent code block and extract text from it
    if (buttonRef.current) {
      const codeBlock = buttonRef.current.closest(".group")
      if (codeBlock) {
        // Try to find the pre element or code element within this block
        const preElement = codeBlock.querySelector("pre")
        const codeElement = codeBlock.querySelector("code")

        let text = ""

        if (preElement) {
          text = preElement.textContent || preElement.innerText || ""
        } else if (codeElement) {
          text = codeElement.textContent || codeElement.innerText || ""
        }

        // Clean up the text
        text = cleanTextContent(text)
        setTextContent(text)
      }
    }
  }, [])

  const handleCopy = async () => {
    let textToCopy = textContent

    // If no text is available, try to extract it again as a fallback
    if (!textToCopy || textToCopy.trim() === "") {
      if (buttonRef.current) {
        const codeBlock = buttonRef.current.closest(".group")
        if (codeBlock) {
          const allText = codeBlock.textContent || (codeBlock as HTMLElement).innerText || ""
          textToCopy = cleanTextContent(allText)
        }
      }
    }

    if (!textToCopy || textToCopy.trim() === "") {
      return
    }

    const success = await copyToClipboard(textToCopy)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_SETTINGS.FEEDBACK_DURATION)
    }
  }

  const colors = getColorTheme(accentColor)

  return (
    <button
      ref={buttonRef}
      onClick={handleCopy}
      className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/90 hover:bg-accent/10 text-foreground/80 hover:text-foreground px-2 py-1 rounded text-xs font-medium border border-border/50 focus:outline-none ${colors.focus}`}
      type="button"
    >
      {copied ? SUCCESS_MESSAGES.COPIED : "Copy"}
    </button>
  )
}
