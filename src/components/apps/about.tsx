"use client";

import Image from 'next/image';
import type { GithubUser } from '@/lib/types';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { MapPin, Calendar, Users, Star, GitBranch } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';

interface AboutAppProps {
    user: GithubUser | null;
    loading?: boolean;
}

// Loading skeleton for user info
const UserInfoSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-3/4 mx-auto lg:mx-0" />
    <Skeleton className="h-8 w-2/3 mx-auto lg:mx-0" />
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-6 w-20" />
      ))}
    </div>
  </div>
);

// User statistics component
const UserStats = ({ user }: { user: GithubUser }) => {
  const stats = useMemo(() => [
    {
      icon: <GitBranch className="h-4 w-4" />,
      label: 'Repositories',
      value: user.public_repos || 0,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: 'Followers',
      value: user.followers || 0,
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: 'Following',
      value: user.following || 0,
    },
  ], [user]);

  return (
    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg"
        >
          {stat.icon}
          <span className="text-sm font-medium">
            {stat.value} {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// User badges component
const UserBadges = ({ user, mounted }: { user: GithubUser, mounted: boolean }) => {
  const badges = useMemo(() => {
    const badgeList = [];
    
    if (user.company) {
      badgeList.push({
        label: user.company,
        variant: 'default' as const,
        icon: <Users className="h-3 w-3" />,
      });
    }
    
    if (user.location) {
      badgeList.push({
        label: user.location,
        variant: 'secondary' as const,
        icon: <MapPin className="h-3 w-3" />,
      });
    }
    
    if (user.created_at && mounted) {
      const joinYear = new Date(user.created_at).getFullYear();
      badgeList.push({
        label: `Joined ${joinYear}`,
        variant: 'outline' as const,
        icon: <Calendar className="h-3 w-3" />,
      });
    }
    
    return badgeList;
  }, [user, mounted]);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
      {badges.map((badge, index) => (
        <Badge 
          key={badge.label} 
          variant={badge.variant}
          className="flex items-center gap-1 text-xs"
        >
          {badge.icon}
          {badge.label}
        </Badge>
      ))}
    </div>
  );
};

export function AboutApp({ user, loading = false }: AboutAppProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize avatar URL with fallback
  const avatarUrl = useMemo(() => {
    if (user?.avatar_url) return user.avatar_url;
    return 'https://images.unsplash.com/photo-1637603460405-3c86307993aa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  }, [user?.avatar_url]);

  // Handle image load success
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  // Memoize personal info content
  const personalInfo = useMemo(() => ({
    intro: "I'm a final-year Electronics and Communication Engineering student at Nirma University, driven by a passion for creating impactful tech solutions.",
    experience: "My work spans web development, data analysis, and automation, with hands-on experience in Python, Flask, FastAPI, MongoDB, Docker, and Scrapy. I've built full-stack applications, large-scale web scrapers, and AI-powered tools like GitResume.",
    collaboration: "I thrive in collaborative environments, mentoring peers, and leading initiatives, from international competitions like Teknofest to guiding Team Dyaus.",
    aspirations: "This portfolio showcases my projects, growth, and aspirations. I'm excited about new challenges, collaborations, and opportunities to innovate."
  }), []);

  // Memoize skills/technologies
  const technologies = useMemo(() => [
    'Python', 'Flask', 'FastAPI', 'MongoDB', 'Docker', 'Scrapy', 
    'React', 'Next.js', 'TypeScript', 'JavaScript'
  ], []);

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
        <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start"
        >
            {/* Avatar Section */}
            <div className="lg:col-span-4 flex flex-col items-center space-y-6">
              <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-square">
                {imageLoading && (
                  <Skeleton className="w-full h-full rounded-full absolute inset-0 z-10" />
                )}
                
                <div className="relative w-full h-full">
                  <Image
                    src={avatarUrl}
                    alt={user?.name ? `${user.name}'s avatar` : 'User avatar'}
                    fill
                    className={`rounded-full object-cover border-4 border-primary/20 shadow-xl transition-all duration-500 hover:scale-105 hover:border-primary/40 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                  />
                  
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-full">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {user && !loading && (
                <div className="w-full space-y-4">
                  <UserStats user={user} />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="lg:col-span-8 space-y-8">
              {/* User Info */}
              <div className="space-y-4 text-center lg:text-left">
                {loading ? (
                  <UserInfoSkeleton />
                ) : user ? (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                      {user.name || 'Anonymous User'}
                    </h2>
                    
                    {user.bio && (
                      <p className="text-xl sm:text-2xl font-medium text-muted-foreground">
                        {user.bio}
                      </p>
                    )}
                    
                    <UserBadges user={user} mounted={mounted} />
                  </>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                      Jaydeep Solanki
                    </h2>
                    <p className="text-xl font-medium text-muted-foreground">
                      Full Stack Developer & Engineering Student
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Story */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground mb-4 text-center lg:text-left">My Journey</h3>
                
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  <p className="leading-relaxed">{personalInfo.intro}</p>
                  <p className="leading-relaxed">{personalInfo.experience}</p>
                  <p className="leading-relaxed">{personalInfo.collaboration}</p>
                  <p className="leading-relaxed">{personalInfo.aspirations}</p>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4 text-center lg:text-left">Technologies I Work With</h3>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary"
                      className="text-sm py-1 px-3"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
        </motion.div>
    </motion.div>
  );
}
