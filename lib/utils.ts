import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_ACCENT_COLOR, DATE_FORMAT, COPY_SETTINGS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Supported accent colors for the application
 */
export type AccentColor =
  | 'orange'
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'pink'
  | 'yellow'
  | 'indigo'
  | 'teal';

/**
 * Color theme definitions for consistent styling across components
 */
export interface ColorTheme {
  text: string;
  decoration: string;
  border: string;
  bg: string;
  focus: string;
}

/**
 * Predefined color themes for accent colors
 */
export const COLOR_THEMES: Record<AccentColor, ColorTheme> = {
  orange: {
    text: 'text-orange-400 hover:text-orange-300',
    decoration: 'decoration-orange-400/50 hover:decoration-orange-300',
    border: 'border-orange-400/50',
    bg: 'bg-orange-400/50',
    focus: 'focus:ring-orange-400/50'
  },
  blue: {
    text: 'text-blue-400 hover:text-blue-300',
    decoration: 'decoration-blue-400/50 hover:decoration-blue-300',
    border: 'border-blue-400/50',
    bg: 'bg-blue-400/50',
    focus: 'focus:ring-blue-400/50'
  },
  green: {
    text: 'text-green-400 hover:text-green-300',
    decoration: 'decoration-green-400/50 hover:decoration-green-300',
    border: 'border-green-400/50',
    bg: 'bg-green-400/50',
    focus: 'focus:ring-green-400/50'
  },
  purple: {
    text: 'text-purple-400 hover:text-purple-300',
    decoration: 'decoration-purple-400/50 hover:decoration-purple-300',
    border: 'border-purple-400/50',
    bg: 'bg-purple-400/50',
    focus: 'focus:ring-purple-400/50'
  },
  red: {
    text: 'text-red-400 hover:text-red-300',
    decoration: 'decoration-red-400/50 hover:decoration-red-300',
    border: 'border-red-400/50',
    bg: 'bg-red-400/50',
    focus: 'focus:ring-red-400/50'
  },
  pink: {
    text: 'text-pink-400 hover:text-pink-300',
    decoration: 'decoration-pink-400/50 hover:decoration-pink-300',
    border: 'border-pink-400/50',
    bg: 'bg-pink-400/50',
    focus: 'focus:ring-pink-400/50'
  },
  yellow: {
    text: 'text-yellow-400 hover:text-yellow-300',
    decoration: 'decoration-yellow-400/50 hover:decoration-yellow-300',
    border: 'border-yellow-400/50',
    bg: 'bg-yellow-400/50',
    focus: 'focus:ring-yellow-400/50'
  },
  indigo: {
    text: 'text-indigo-400 hover:text-indigo-300',
    decoration: 'decoration-indigo-400/50 hover:decoration-indigo-300',
    border: 'border-indigo-400/50',
    bg: 'bg-indigo-400/50',
    focus: 'focus:ring-indigo-400/50'
  },
  teal: {
    text: 'text-teal-400 hover:text-teal-300',
    decoration: 'decoration-teal-400/50 hover:decoration-teal-300',
    border: 'border-teal-400/50',
    bg: 'bg-teal-400/50',
    focus: 'focus:ring-teal-400/50'
  }
} as const;

/**
 * Get color theme classes for a given accent color
 * @param color - The accent color
 * @returns ColorTheme object with predefined classes
 */
export function getColorTheme(
  color: string = DEFAULT_ACCENT_COLOR
): ColorTheme {
  const normalizedColor = color.toLowerCase() as AccentColor;
  return COLOR_THEMES[normalizedColor] || COLOR_THEMES[DEFAULT_ACCENT_COLOR];
}

/**
 * Determine accent color from post data with fallbacks
 * @param post - Post object that may contain color properties
 * @returns AccentColor string
 */
export function getAccentColor(post: any): AccentColor {
  const color =
    post?.accentColor ||
    post?.color ||
    post?.themeColor ||
    DEFAULT_ACCENT_COLOR;
  return (
    COLOR_THEMES[color as AccentColor] ? color : DEFAULT_ACCENT_COLOR
  ) as AccentColor;
}

/**
 * Format date to human readable string
 * @param date - Date string or Date object
 * @param fallback - Fallback text if date is invalid
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | null | undefined,
  fallback = 'Unpublished'
): string {
  if (!date) return fallback;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', DATE_FORMAT.STANDARD);
  } catch {
    return fallback;
  }
}

/**
 * Extract text content from React children recursively
 * @param node - React node to extract text from
 * @returns Extracted text string
 */
export function extractTextContent(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (!node || typeof node !== 'object') {
    return '';
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  // Handle React elements and objects with children
  const children = node.props?.children || node.children;
  return children ? extractTextContent(children) : '';
}

/**
 * Copy text to clipboard with fallback support
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text?.trim()) {
    return false;
  }

  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  } catch {
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback copy method using document.execCommand
 * @param text - Text to copy
 * @returns Success boolean
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText =
      'position:fixed;left:-999999px;top:-999999px;opacity:0;';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch {
    return false;
  }
}

/**
 * Clean text content by removing excluded phrases
 * @param text - Text to clean
 * @returns Cleaned text string
 */
export function cleanTextContent(text: string): string {
  let cleanedText = text;

  COPY_SETTINGS.EXCLUDED_TEXT.forEach((excludedText) => {
    cleanedText = cleanedText.replace(excludedText, '');
  });

  return cleanedText.trim();
}

/**
 * Debounce function to limit rapid function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if a value is a valid accent color
 * @param color - Color string to validate
 * @returns Boolean indicating if color is valid
 */
export function isValidAccentColor(color: string): color is AccentColor {
  return color in COLOR_THEMES;
}
