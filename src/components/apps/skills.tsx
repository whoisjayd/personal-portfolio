"use client";

import { useState, useEffect } from "react";
import { getLanguageStats } from "@/lib/actions/github";
import { customSkills } from "@/lib/data";
import { Badge } from "../ui/badge";
import { SkillsChart } from "./skills-chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Skeleton } from "../ui/skeleton";

export function SkillsApp() {
  const [languageStats, setLanguageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await getLanguageStats();
        setLanguageStats(stats);
      } catch (err) {
        setError("Failed to load language stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = languageStats
    ? Object.entries(languageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([language, bytes], index) => ({
          language,
          bytes,
          fill: `hsl(var(--primary) / ${1 - index * 0.15})`,
        }))
    : [];

  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
              My Technical Toolkit
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A showcase of my programming languages, frameworks, and core technical skills based on my public work.
          </p>
      </motion.header>

      {/* Main Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Technical Languages Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full transition-transform hover:scale-[1.01]">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Programming Languages
            </h2>
            <p className="text-base text-foreground/70 mb-6">
              A breakdown of languages used across my public GitHub
              repositories, measured by bytes of code.
            </p>
            {loading ? (
              <Skeleton
                className="h-[400px] w-full rounded-lg"
                aria-label="Loading chart"
              />
            ) : error ? (
              <div className="text-red-500 text-base p-4 bg-destructive/10 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="h-[400px]">
                <SkillsChart chartData={chartData} />
              </div>
            )}
          </div>
        </div>

        {/* Core Skills Section */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border transition-transform hover:scale-[1.01]">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Core Skills
            </h2>
            <p className="text-base text-foreground/70 mb-6">
              Expertise in full-stack development with modern, scalable
              technologies.
            </p>
            <TooltipProvider>
              <div className="flex flex-wrap gap-3" role="list">
                {loading ? (
                  Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-8 w-24 rounded-full"
                        aria-label="Loading skill badge"
                      />
                    ))
                ) : (
                  customSkills.map((skill) => (
                    <Tooltip key={skill.name}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="text-sm px-3 py-1 flex items-center gap-2 border-primary/30 border hover:bg-primary/10 transition-colors cursor-help"
                          role="listitem"
                        >
                          {skill.icon}
                          {skill.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{skill.description || `Proficient in ${skill.name}`}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
