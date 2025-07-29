/**
 * Application-wide configuration constants
 */

/** Project-related constants */
export const PROJECT = {
  // UI Text
  UI: {
    FEATURED: 'Featured',
    PROJECT_DETAILS_PLACEHOLDER: 'Project details coming soon...',
    MORE_TECHNOLOGIES: (count: number) => `+${count}`,
  } as const,
  
  // Display limits
  LIMITS: {
    TECHNOLOGIES_DISPLAY: 3,
    TECHNOLOGIES_COMPACT_DISPLAY: 2,
    EXCERPT_LENGTH: 100,
  } as const,
  
  // Dimensions
  DIMENSIONS: {
    COVER_IMAGE: {
      HEIGHT: '13rem', // h-52
    },
    COMPACT: {
      IMAGE_SIZE: '3rem', // w-12 h-12
      ICON_SIZE: '1.5rem', // text-lg
    },
    ICONS: {
      SIZE: '1rem', // w-4 h-4
      BUTTON_SIZE: '2rem', // w-8 h-8
    },
  } as const,
  
  // Default values
  DEFAULTS: {
    COVER_IMAGE_ICON: '📁',
    FEATURED_ICON: '★',
  } as const,
} as const;


/** Default accent color for components */
export const DEFAULT_ACCENT_COLOR = 'orange' as const;

/** Default featured posts limit */
export const DEFAULT_FEATURED_POSTS_LIMIT = 3;

/** Default related posts limit */
export const DEFAULT_RELATED_POSTS_LIMIT = 3;

/** Default posts per page for pagination */
export const DEFAULT_POSTS_PER_PAGE = 10;

/** Default projects per page for pagination */
export const DEFAULT_PROJECTS_PER_PAGE = 6;

/** Reading time calculation settings */
export const READING_TIME = {
  /** Average words per minute for reading time calculation */
  WORDS_PER_MINUTE: 200,
  /** Words that indicate code content (for adjusting reading time) */
  CODE_INDICATORS: [
    'function',
    'const',
    'let',
    'var',
    'import',
    'export',
    'class'
  ]
} as const;

/** Copy functionality settings */
export const COPY_SETTINGS = {
  /** Duration to show "copied" feedback in milliseconds */
  FEEDBACK_DURATION: 2000,
  /** Text to remove when cleaning up copied content */
  EXCLUDED_TEXT: ['Copy', 'Copied!']
} as const;

/** Animation and transition durations (in milliseconds) */
export const ANIMATIONS = {
  /** Standard transition duration */
  TRANSITION: 200,
  /** Copy feedback duration */
  COPY_FEEDBACK: 2000,
  /** Hover transition duration */
  HOVER: 150
} as const;

/** CSS class patterns for reuse */
export const CSS_PATTERNS = {
  /** Standard input styles */
  INPUT:
    'w-full px-4 py-2 bg-background/80 border border-border/50 rounded-lg text-foreground/90 placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30 focus:bg-background/90 transition-all duration-200',

  /** Card container styles */
  CARD: 'bg-background/80 border border-border/50 rounded-lg p-6',

  /** Button base styles */
  BUTTON_BASE:
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none',

  /** Code block container */
  CODE_CONTAINER:
    'bg-background/90 border border-border/50 rounded-lg overflow-hidden',

  /** Prose content styling */
  PROSE:
    'prose prose-foreground/90 prose-sm max-w-none text-foreground/90 leading-relaxed'
} as const;

/** Error messages */
export const ERROR_MESSAGES = {
  POST_NOT_FOUND: 'Post not found',
  PROJECT_NOT_FOUND: 'Project not found',
  SLUG_REQUIRED: 'Slug is required',
  COPY_FAILED: 'Failed to copy to clipboard',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
} as const;

/** Success messages */
export const SUCCESS_MESSAGES = {
  COPIED: 'Copied!',
  CONTENT_COPIED: 'Content copied to clipboard'
} as const;

/** Date formatting options */
export const DATE_FORMAT = {
  /** Standard date format options for toLocaleDateString */
  STANDARD: {
    month: 'long' as const,
    day: 'numeric' as const,
    year: 'numeric' as const
  },
  /** Compact date format */
  COMPACT: {
    month: 'short' as const,
    day: 'numeric' as const,
    year: 'numeric' as const
  }
} as const;
