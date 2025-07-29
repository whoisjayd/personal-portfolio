import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export const incrementPostViews = async (slug: string) => {
  const result = await db
    .insert(posts)
    .values({
      slug,
      views: 1
    })
    .onConflictDoUpdate({
      target: posts.slug,
      set: {
        views: sql`COALESCE(${posts.views}, 0) + 1`
      }
    })
    .returning();
  if (result.length) return result[0].views;
  else return null;
};
