import { basehub } from 'basehub';

export async function getPosts(options?: {
  length?: number;
  prioritizeFeatured?: boolean;
}) {
  const allPosts = await basehub()
    .query({
      blog: {
        posts: {
          items: {
            _id: true,
            _slug: true,
            _title: true,
            excerpt: true,
            date: true,
            coverImage: { url: true },
            content: {
              readingTime: true
            },
            featured: true,
            tags: {
              items: {
                _title: true,
                _slug: true
              }
            }
          }
        }
      }
    })
    .then((res) => res.blog.posts.items);

  if (!options?.prioritizeFeatured && !options?.length) {
    return allPosts;
  }

  if (options.prioritizeFeatured && options.length) {
    const featured = allPosts.filter((post) => post.featured);
    const nonFeatured = allPosts.filter((post) => !post.featured);

    const result = [...featured];

    // Fill remaining slots with latest non-featured posts
    if (result.length < options.length) {
      const remaining = options.length - result.length;
      result.push(...nonFeatured.slice(0, remaining));
    }

    return result.slice(0, options.length);
  }

  return allPosts.slice(0, options.length);
}

export async function getFeaturedPosts() {
  return getPosts({ prioritizeFeatured: true, length: 3 });
}

export async function getPostsByTag(tag: string) {
  const posts = await getPosts();
  return posts.filter(
    (post) =>
      post.tags?.items &&
      Array.isArray(post.tags.items) &&
      post.tags.items.some(
        (tagItem: any) =>
          tagItem._title?.toLowerCase() === tag.toLowerCase() ||
          tagItem._slug?.toLowerCase() === tag.toLowerCase()
      )
  );
}
