import { basehub } from "basehub"

export async function getProject(slug: string) {
  const res = await basehub().query({
    projects: {
      items: {
        _slug: true,
        _title: true,
        content: {
          html: true,
          plainText: true,
          readingTime: true,
          json: {
            content: true,
            toc: true,
          },
        },
        coverImage: { url: true },
        demoVideo: { url: true },
        featured: true,
        technologies: {
          items: {
            _title: true,
            _slug: true,
          },
        },
        githubUrl: true,
        liveUrl: true,
      },
    },
  })

  const project = res.projects.items.find((p) => p._slug === slug)
  return project || null
}
