"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { getRepositories, getProjectDetails } from "@/lib/actions/github";
import { projectOverrides } from "@/lib/data";
import type { Project, ProjectDetails, ProjectMedia } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, GitFork, Loader2, Star, Code } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, staggeredGridVariants } from "@/lib/animations";

// Utility function to sort projects
const sortProjects = (projects: Project[]): Project[] => {
  return projects.sort((a, b) => {
    const aPriority = a.priority ?? Infinity;
    const bPriority = b.priority ?? Infinity;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
  });
};

interface MediaCarouselProps {
  media: ProjectMedia[];
  isDetailView?: boolean;
}

const MediaCarousel = memo(({ media, isDetailView = false }: MediaCarouselProps) => {
  if (!media || media.length === 0) return null;

  const carouselClasses = cn(
    "w-full",
    isDetailView ? "max-w-4xl mx-auto" : "h-full"
  );

  return (
    <Carousel className={carouselClasses} opts={{ loop: true }}>
      <CarouselContent>
        {media.map((item, index) => (
          <CarouselItem key={index} role="group" aria-roledescription="slide">
            {item.type === "video" ? (
              <video
                src={item.url}
                className="rounded-lg w-full aspect-video object-cover border"
                autoPlay
                loop
                muted
                playsInline
                aria-label={`Video ${index + 1} for project`}
              />
            ) : (
              <Image
                src={item.url}
                width={isDetailView ? 1280 : 400}
                height={isDetailView ? 720 : 225}
                alt={item.aiHint || `Project media ${index + 1}`}
                className="rounded-lg w-full h-full object-cover"
                loading="lazy"
                data-ai-hint={item.aiHint || "technology abstract"}
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      {media.length > 1 && (
        <>
          <CarouselPrevious
            className="absolute left-2"
            aria-label="Previous slide"
            tabIndex={0}
          />
          <CarouselNext
            className="absolute right-2"
            aria-label="Next slide"
            tabIndex={0}
          />
        </>
      )}
    </Carousel>
  );
});
MediaCarousel.displayName = "MediaCarousel";

interface ProjectsAppProps {
  onBack: () => void;
}

export function ProjectsApp({ onBack }: ProjectsAppProps) {
  const [view, setView] = useState<"list" | "detail">("list");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [details, setDetails] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRepos = await getRepositories();
      const overrideMap = new Map(projectOverrides.map((p) => [p.name, p]));

      const githubProjects: Project[] = fetchedRepos.map((repo) => {
        const override = overrideMap.get(repo.name);
        if (override) {
          overrideMap.delete(repo.name);
          return { ...repo, ...override, isCustom: false };
        }
        return { ...repo, isCustom: false };
      });

      const remainingCustomProjects = Array.from(overrideMap.values()).filter(
        (p) => p.isCustom
      );

      const allProjects = sortProjects([
        ...githubProjects,
        ...remainingCustomProjects,
      ]);
      setProjects(allProjects);
    } catch (err) {
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDetails = useCallback(async () => {
    if (!selectedProject) return;
    try {
      setDetailsLoading(true);
      setError(null);
      if (selectedProject.summary) {
        setDetails({
          summary: selectedProject.summary,
          languages: selectedProject.languages || {},
        });
      } else if (selectedProject.full_name) {
        const fetchedDetails = await getProjectDetails({
          full_name: selectedProject.full_name,
          name: selectedProject.name,
          description: selectedProject.description,
          topics: selectedProject.topics || [],
        });
        setDetails(fetchedDetails);
      } else {
        setDetails({
          summary: selectedProject.description || "No summary available.",
          languages: selectedProject.languages || {},
        });
      }
    } catch (err) {
      setError("Failed to load project details.");
    } finally {
      setDetailsLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (view === "detail" && selectedProject) {
      loadDetails();
    }
  }, [view, selectedProject, loadDetails]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setView("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setView("list");
    setSelectedProject(null);
    setDetails(null);
  }, []);

  if (view === "detail" && selectedProject) {
    return (
      <motion.div 
        className="h-full w-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="hover:bg-primary/10 -ml-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </Button>
          </motion.div>

          <motion.header variants={itemVariants} className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-primary">
              {selectedProject.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-4xl">
              {selectedProject.description}
            </p>
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
              {(selectedProject.stargazers_count ?? 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-accent" /> {selectedProject.stargazers_count} Stars
                </div>
              )}
              {(selectedProject.forks_count ?? 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4 text-accent" /> {selectedProject.forks_count} Forks
                </div>
              )}
              {selectedProject.language && (
                <div className="flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-accent" /> {selectedProject.language}
                </div>
              )}
            </div>
          </motion.header>

          {selectedProject.media && selectedProject.media.length > 0 && (
            <motion.div variants={itemVariants} className="rounded-xl overflow-hidden border border-border">
              <MediaCarousel media={selectedProject.media} isDetailView={true} />
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="flex gap-4">
            {selectedProject.html_url && (
              <Button asChild className="hover:bg-primary/90">
                <a
                  href={selectedProject.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Source <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {selectedProject.homepage && (
              <Button variant="secondary" asChild className="hover:bg-secondary/90">
                <a
                  href={selectedProject.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Separator />
          </motion.div>
          
          {detailsLoading ? (
            <motion.div variants={itemVariants} className="flex items-center justify-center p-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing project...</span>
            </motion.div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            details && (
              <motion.main variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
                <div className="lg:col-span-8 space-y-4">
                  <h2 className="text-2xl font-semibold">AI Summary</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: details.summary.replace(/\n/g, '<br />') }} />
                </div>
                <aside className="lg:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Languages</h2>
                    <div className="space-y-3">
                      {Object.keys(details.languages).length > 0 ? (
                        Object.entries(details.languages).map(([lang, bytes]) => (
                          <div key={lang}>
                            <div className="flex justify-between text-sm mb-1.5 text-foreground">
                              <span>{lang}</span>
                              <span className="text-muted-foreground">
                                {bytes.toLocaleString()} bytes
                              </span>
                            </div>
                            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full"
                                style={{
                                  width: `${
                                    (bytes /
                                      Object.values(details.languages).reduce(
                                        (a, b) => a + b,
                                        0
                                      )) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Language data not available.
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedProject.topics && selectedProject.topics.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">Topics</h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.topics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </motion.main>
            )
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full w-full bg-background flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-2 md:p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="w-24 flex justify-start">
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
            </div>
            <CardTitle className="text-lg text-center">Projects</CardTitle>
            <div className="w-24"></div> 
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.header variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
                My Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A selection of my work, from full-stack applications to AI-powered tools. Click on any project to learn more.
              </p>
            </motion.header>
            <motion.div variants={itemVariants}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="p-0 aspect-video bg-muted/30" />
                      <CardContent className="p-4 space-y-2">
                        <div className="h-6 bg-muted/50 rounded w-3/4" />
                        <div className="h-4 bg-muted/50 rounded w-full" />
                        <div className="h-4 bg-muted/50 rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : projects.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No projects found. Check back later!
                </p>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggeredGridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                    >
                      <Card
                        className="flex flex-col bg-card/50 hover:border-primary transition-colors cursor-pointer group h-full"
                        onClick={() => handleSelectProject(project)}
                      >
                        <CardHeader className="p-0 relative aspect-video bg-muted/30 flex items-center justify-center">
                          {project.media && project.media.length > 0 ? (
                            <MediaCarousel media={project.media} />
                          ) : (
                            <div className="w-full h-full bg-card group-hover:bg-muted/50 transition-colors" />
                          )}
                        </CardHeader>
                        <CardContent className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <CardTitle className="mb-2 text-xl">{project.name}</CardTitle>
                            <CardDescription className="text-card-foreground/70 line-clamp-3">
                              {project.description || "No description provided."}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                            {(project.stargazers_count ?? 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" /> {project.stargazers_count}
                              </div>
                            )}
                            {(project.forks_count ?? 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <GitFork className="h-4 w-4" /> {project.forks_count}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </CardContent>
    </div>
  );
}
