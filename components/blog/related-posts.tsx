import { getPosts } from '@/lib/get-posts';
import BlogItem from './blog-item';

interface Props {
  currentSlug: string;
  limit?: number;
}

export default async function RelatedPosts({ currentSlug, limit = 3 }: Props) {
  const allPosts = await getPosts();

  // Filter out current post and get random related posts
  const relatedPosts = allPosts
    .filter((post) => post._slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-border/50">
      <h2 className="text-xl font-semibold text-foreground/90 mb-6">
        Related Posts
      </h2>
      <ul className="flex flex-col">
        {relatedPosts.map((post) => (
          <BlogItem
            key={post._slug}
            title={post._title}
            date={post.date!}
            slug={post._slug}
            excerpt={post.excerpt}
            coverImage={post.coverImage}
            readingTime={post.content?.readingTime}
            tags={post.tags}
          />
        ))}
      </ul>
    </section>
  );
}
