import { getPosts } from '@/lib/get-posts';
import { QueryGenqlSelection, basehub } from 'basehub';

export async function getPost(slug: string) {
  const res = await basehub().query({
    blog: {
      posts: {
        items: {
          _slug: true,
          _title: true,
          excerpt: true,
          content: {
            readingTime: true,
            html: true,
            markdown: true,
            json: {
              content: true,
              toc: true
            }
          },
          coverImage: { url: true },
          date: true,
          tags: {
            items: {
              _title: true,
              _slug: true
            }
          },
          // Add potential accent color field
          accentColor: true,
          color: true,
          themeColor: true
        }
      }
    }
  });

  const [post] = res.blog.posts.items;

  return post;
}
