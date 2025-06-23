"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { achievements } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { ExternalLink, Calendar, Award } from "lucide-react";
import Link from "next/link";
import type { Achievement } from "@/lib/types";
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from "@/lib/animations";

// Loading skeleton component for better UX
const AchievementSkeleton = ({ index }: { index: number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </CardContent>
  </Card>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-16">
    <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">No Achievements Yet</h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      This section will showcase milestones and recognitions as they're achieved. 
      Check back soon for updates!
    </p>
  </div>
);

// Achievement card component for better organization
const AchievementCard = ({ 
  achievement, 
  mounted
}: { 
  achievement: Achievement; 
  mounted: boolean;
}) => {
  const formattedDate = useMemo(() => {
    if (!achievement.date || !mounted) return null;
    
    try {
      return new Date(achievement.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return achievement.date; // Fallback to original string if date parsing fails
    }
  }, [achievement.date, mounted]);

  const isExternalLink = achievement.link && achievement.link.startsWith('http');

  const cardContent = (
    <Card
      className="bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group h-full flex flex-col"
    >
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <div className="p-3 bg-primary/10 rounded-lg transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 flex-shrink-0">
          {achievement.icon || <Award className="h-5 w-5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {achievement.title}
            </CardTitle>
            {isExternalLink && (
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 flex-shrink-0 mt-1" />
            )}
          </div>
          {achievement.category && (
            <Badge variant="secondary" className="mt-2 text-xs">
              {achievement.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0 flex-grow flex flex-col justify-between">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {achievement.description}
        </p>
        
        <div className="mt-4">
          {formattedDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <time dateTime={achievement.date}>{formattedDate}</time>
            </div>
          )}
          
          {achievement.featured && (
            <Badge variant="default" className="text-xs mt-2">
              Featured
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Wrap in Link only if there's a valid link
  if (achievement.link) {
    return (
      <Link
        href={achievement.link}
        className="block group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl h-full"
        aria-label={`View details for ${achievement.title}`}
        {...(isExternalLink && {
          target: "_blank",
          rel: "noopener noreferrer"
        })}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export function AchievementsApp() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate async data fetching with error handling
  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate and sort achievements
      const validAchievements = achievements.filter(achievement => 
        achievement && achievement.title && achievement.description
      );
      
      // Sort by date (newest first) and featured status
      const sortedAchievements = validAchievements.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;
        
        return 0;
      });
      
      setData(sortedAchievements);
    } catch (err) {
      setError('Failed to load achievements. Please try again later.');
      console.error('Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Memoize grid classes for performance
  const gridClasses = useMemo(() => 
    "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
    []
  );

  const achievementCount = data.length;

  return (
    <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      
      {/* Content Section */}
      <motion.div variants={itemVariants}>
        {error ? (
          <div className="text-center py-16">
            <div className="text-destructive text-lg mb-2">{error}</div>
            <button 
              onClick={fetchAchievements}
              className="text-primary hover:text-primary/80 transition-colors underline"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className={gridClasses} role="status" aria-label="Loading achievements">
            {Array.from({ length: 6 }, (_, index) => (
              <AchievementSkeleton key={index} index={index} />
            ))}
          </div>
        ) : data.length === 0 ? (
            <EmptyState />
        ) : (
          <motion.div 
              className={gridClasses}
              variants={containerVariants}
          >
            {data.map((achievement, index) => (
              <motion.div variants={itemVariants} key={`${achievement.title}-${index}`} className="h-full">
                  <AchievementCard
                    achievement={achievement}
                    mounted={mounted}
                  />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
