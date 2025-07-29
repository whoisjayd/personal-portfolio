import { db } from '@/db';
import { posts } from '@/db/schema';
import { inArray } from 'drizzle-orm';

export const getPostsViews = async (
  slugs: string[]
): Promise<Record<string, number>> => {
  if (slugs.length === 0) return {};

  const results = await db
    .select()
    .from(posts)
    .where(inArray(posts.slug, slugs))
    .execute();

  // Create a map of slug to views
  const viewsMap: Record<string, number> = {};
  results.forEach((result) => {
    viewsMap[result.slug] = result.views ?? 0;
  });

  // Ensure all slugs have a value (default to 0 if not found)
  slugs.forEach((slug) => {
    if (!(slug in viewsMap)) {
      viewsMap[slug] = 0;
    }
  });

  return viewsMap;
};
