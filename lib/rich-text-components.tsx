import React from 'react';
import Image from 'next/image';
import { CodeBlock } from '@/components/blog/code-block';
import { getColorTheme, type AccentColor } from '@/lib/utils';
import { DEFAULT_ACCENT_COLOR } from '@/lib/constants';

interface RichTextComponentsProps {
  accentColor?: AccentColor;
}

/**
 * Reusable RichText components configuration for consistent styling
 * across different content types (blog posts, projects, etc.)
 */
export function createRichTextComponents({
  accentColor = DEFAULT_ACCENT_COLOR
}: RichTextComponentsProps = {}) {
  const colors = getColorTheme(accentColor);

  return {
    // Typography
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-foreground/90 last:mb-0">
        {children}
      </p>
    ),

    // Headings with proper hierarchy
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-xl font-semibold text-foreground mt-8 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-lg font-semibold text-foreground mt-7 mb-3 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-base font-semibold text-foreground mt-6 mb-3 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-sm font-semibold text-foreground/90 mt-5 mb-2 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }: { children: React.ReactNode }) => (
      <h5 className="text-sm font-medium text-foreground/90 mt-4 mb-2 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }: { children: React.ReactNode }) => (
      <h6 className="text-sm font-medium text-foreground/80 mt-4 mb-2 first:mt-0">
        {children}
      </h6>
    ),

    // Links with dynamic accent color
    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        className={`${colors.text} underline ${colors.decoration} transition-colors duration-200`}
        target="_blank"
        rel="noopener noreferrer"
        {...props}>
        {children}
      </a>
    ),

    // Code styling with dynamic accent
    code: ({ children, className, ...props }: any) => {
      const isInlineCode = !className?.includes('language-');

      if (isInlineCode) {
        return (
          <code
            className={`bg-muted/50 ${colors.text.split(' ')[0]} px-1.5 py-0.5 rounded text-sm font-mono border border-border/50`}>
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    pre: ({ children, className, ...props }: any) => {
      // Get language from className if available
      let codeClassName = className;
      if (React.isValidElement(children) && children.type === 'code') {
        const codeElement = children as React.ReactElement<{
          className?: string;
        }>;
        codeClassName = codeElement.props.className || className;
      }

      return (
        <CodeBlock
          accentColor={accentColor}
          className={codeClassName}
          {...props}>
          {children}
        </CodeBlock>
      );
    },

    // Text formatting
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-foreground/90">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-foreground/80">{children}</em>
    ),

    // Lists with better spacing
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="space-y-2 my-4 pl-4">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="space-y-2 my-4 pl-4 list-decimal">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="text-foreground/80 leading-relaxed marker:text-muted-foreground/70">
        {children}
      </li>
    ),

    // Blockquotes with dynamic accent
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote
        className={`border-l-4 ${colors.border} pl-4 my-6 italic text-muted-foreground/90 bg-muted/30 py-3 rounded-r`}>
        {children}
      </blockquote>
    ),

    // Images with Next.js optimization
    img: ({ src, alt, ...props }: any) => (
      <div className="my-6">
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={600}
          className="rounded-lg border border-border/50 shadow-lg"
          style={{ width: 'auto', height: 'auto' }}
          {...props}
        />
      </div>
    ),

    // Tables
    table: ({ children }: { children: React.ReactNode }) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-border/50">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: { children: React.ReactNode }) => (
      <thead className="bg-muted/50 text-foreground/90">{children}</thead>
    ),
    tbody: ({ children }: { children: React.ReactNode }) => (
      <tbody className="divide-y divide-border/50">{children}</tbody>
    ),
    tr: ({ children }: { children: React.ReactNode }) => (
      <tr className="hover:bg-muted/20 transition-colors duration-150">
        {children}
      </tr>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className="px-4 py-3 text-left font-semibold border-r border-border/50 last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className="px-4 py-3 text-foreground/80 border-r border-border/50 last:border-r-0">
        {children}
      </td>
    ),

    // Horizontal rule
    hr: () => <hr className="border-border/50 my-8 border-t-2" />,

    // Fallback components
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>
  };
}
