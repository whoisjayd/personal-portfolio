import ProjectItem from '@/components/projects/project-item';
import { getProjects } from '@/lib/get-projects';

interface Props {
  length?: number;
  compact?: boolean;
}

export default async function ProjectList({ length, compact = false }: Props) {
  const projects = await getProjects({
    length,
    prioritizeFeatured: length ? true : false
  });

  // Sort to ensure featured projects appear first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const containerClass = compact
    ? 'space-y-1'
    : 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr';

  return (
    <div className={containerClass}>
      {sortedProjects.map((project) => (
        <ProjectItem
          key={project._slug}
          title={project._title}
          slug={project._slug}
          excerpt={project.content?.plainText}
          coverImage={project.coverImage}
          technologies={project.technologies}
          githubUrl={project.githubUrl}
          liveUrl={project.liveUrl}
          readingTime={project.content?.readingTime}
          compact={compact}
          featured={project.featured}
        />
      ))}
    </div>
  );
}
