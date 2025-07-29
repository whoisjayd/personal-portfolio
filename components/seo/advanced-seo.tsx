import {
  generateSEO,
  generateBreadcrumbStructuredData,
  generateWebsiteStructuredData,
  generatePersonStructuredData
} from '@/lib/seo';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
  readingTime?: number;
  category?: string;
  section?: string;
  locale?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
  alternateUrls?: { href: string; hreflang: string }[];
  priority?: number;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  breadcrumbs?: { name: string; url: string }[];
  structuredData?: any[];
}

export function generateAdvancedSEO(props: SEOHeadProps): Metadata {
  return generateSEO(props);
}

export function SEOHead({
  breadcrumbs,
  structuredData,
  ...seoProps
}: SEOHeadProps) {
  const combinedStructuredData = [
    generateWebsiteStructuredData(),
    generatePersonStructuredData(),
    ...(breadcrumbs ? [generateBreadcrumbStructuredData(breadcrumbs)] : []),
    ...(structuredData || [])
  ];

  return (
    <>
      {combinedStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

// Hook for dynamic SEO updates
export function useDynamicSEO() {
  const updateSEO = (seoData: Partial<SEOHeadProps>) => {
    // Update meta tags dynamically
    Object.entries(seoData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const metaTag =
          document.querySelector(`meta[name="${key}"]`) ||
          document.querySelector(`meta[property="og:${key}"]`) ||
          document.querySelector(`meta[property="twitter:${key}"]`);

        if (metaTag) {
          metaTag.setAttribute('content', value);
        }
      }
    });

    // Update title
    if (seoData.title) {
      document.title = seoData.title;
    }
  };

  return { updateSEO };
}

// Utility for validating SEO data
export function validateSEO(seoData: SEOHeadProps) {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Title validation
  if (!seoData.title) {
    errors.push('Title is required');
  } else if (seoData.title.length > 60) {
    warnings.push('Title is longer than recommended 60 characters');
  } else if (seoData.title.length < 30) {
    warnings.push('Title is shorter than recommended 30 characters');
  }

  // Description validation
  if (!seoData.description) {
    errors.push('Description is required');
  } else if (seoData.description.length > 160) {
    warnings.push('Description is longer than recommended 160 characters');
  } else if (seoData.description.length < 120) {
    warnings.push('Description is shorter than recommended 120 characters');
  }

  // Image validation
  if (!seoData.image) {
    warnings.push('OG image not specified - will use default');
  }

  // URL validation
  if (seoData.url && !seoData.url.startsWith('/')) {
    warnings.push('URL should start with / for relative paths');
  }

  return { warnings, errors, isValid: errors.length === 0 };
}

// Generate social media sharing URLs
export function generateSocialUrls(
  url: string,
  title: string,
  description?: string
) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };
}

// Generate reading time estimate
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Generate excerpt from content
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

// SEO performance analyzer
export function analyzeSEOPerformance(seoData: SEOHeadProps) {
  const score = {
    title: 0,
    description: 0,
    image: 0,
    structured: 0,
    social: 0,
    total: 0
  };

  // Title scoring
  if (seoData.title) {
    if (seoData.title.length >= 30 && seoData.title.length <= 60) {
      score.title = 100;
    } else if (seoData.title.length >= 20 && seoData.title.length <= 70) {
      score.title = 75;
    } else {
      score.title = 50;
    }
  }

  // Description scoring
  if (seoData.description) {
    if (
      seoData.description.length >= 120 &&
      seoData.description.length <= 160
    ) {
      score.description = 100;
    } else if (
      seoData.description.length >= 100 &&
      seoData.description.length <= 180
    ) {
      score.description = 75;
    } else {
      score.description = 50;
    }
  }

  // Image scoring
  score.image = seoData.image ? 100 : 0;

  // Structured data scoring
  score.structured = seoData.type === 'article' ? 100 : 75;

  // Social media scoring
  score.social =
    seoData.title && seoData.description && seoData.image ? 100 : 50;

  // Total score
  score.total = Math.round(
    (score.title +
      score.description +
      score.image +
      score.structured +
      score.social) /
      5
  );

  return score;
}

// Breadcrumb Component
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-muted-foreground/80 ${className}`}
      aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center hover:text-foreground/80 transition-colors"
        aria-label="Home">
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={item.url} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
          {index === items.length - 1 ? (
            <span className="text-foreground/90 font-medium" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link
              href={item.url}
              className="hover:text-foreground/80 transition-colors">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

// Structured Data Component
interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
