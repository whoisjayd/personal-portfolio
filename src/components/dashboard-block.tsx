"use client";

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type DashboardBlockProps = {
  id: string;
  title: string;
  onExpand: (id: string) => void;
  className?: string;
};

export function DashboardBlock({ id, title, onExpand, className }: DashboardBlockProps) {
  return (
    <motion.div
      layoutId={`card-container-${id}`}
      onClick={() => onExpand(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onExpand(id)}
      tabIndex={0}
      role="button"
      aria-label={`Open ${title} app`}
      className={cn("w-full h-full", className)}
    >
      <Card
        className={cn(
          'relative h-full w-full flex flex-col cursor-pointer group transition-all duration-300 bg-card/80 backdrop-blur-sm overflow-hidden',
          'hover:bg-card hover:shadow-2xl hover:border-primary/60'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 text-muted-foreground transition-transform duration-500 ease-out group-hover:scale-125 group-hover:text-primary" />
        
        <div className="p-4 flex-1 flex flex-col justify-end">
          <motion.h2 layoutId={`title-${id}`} className="text-xl font-bold">{title}</motion.h2>
        </div>
      </Card>
    </motion.div>
  );
}
