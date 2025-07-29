import { basehub } from 'basehub';

export async function getProjects(options?: {
  length?: number;
  prioritizeFeatured?: boolean;
}) {
  const allProjects = await basehub()
    .query({
      projects: {
        items: {
          _id: true,
          _slug: true,
          _title: true,
          content: {
            plainText: true,
            readingTime: true
          },
          coverImage: { url: true },
          demoVideo: { url: true },
          featured: true,
          technologies: {
            items: {
              _title: true,
              _slug: true
            }
          },
          githubUrl: true,
          liveUrl: true
        }
      }
    })
    .then((res) => res.projects.items);

  if (!options?.prioritizeFeatured && !options?.length) {
    return allProjects;
  }

  if (options.prioritizeFeatured && options.length) {
    const featured = allProjects.filter((project) => project.featured);
    const nonFeatured = allProjects.filter((project) => !project.featured);

    const result = [...featured];

    // Fill remaining slots with latest non-featured projects
    if (result.length < options.length) {
      const remaining = options.length - result.length;
      result.push(...nonFeatured.slice(0, remaining));
    }

    return result.slice(0, options.length);
  }

  return allProjects.slice(0, options.length);
}

export async function getFeaturedProjects() {
  return getProjects({ prioritizeFeatured: true, length: 3 });
}

export async function getProjectsByTechnology(tech: string) {
  const projects = await getProjects();
  return projects.filter(
    (project) =>
      project.technologies?.items &&
      Array.isArray(project.technologies.items) &&
      project.technologies.items.some(
        (techItem: any) =>
          techItem._title?.toLowerCase() === tech.toLowerCase() ||
          techItem._slug?.toLowerCase() === tech.toLowerCase()
      )
  );
}
