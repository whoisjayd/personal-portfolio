"use client";

import React, { useEffect, useState } from 'react';
import { experience } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';

export function ExperienceApp() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.div
            className="max-w-4xl mx-auto"
            aria-labelledby="experience-heading"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            

            {/* Timeline */}
            <motion.div 
                variants={containerVariants}
                className="relative"
            >
                {/* The vertical line running through the timeline */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-0.5 bg-border"></div>

                {experience.map((job, index) => (
                    <motion.div 
                        key={index} 
                        className="relative mb-12 last:mb-0"
                        variants={itemVariants}
                    >
                        {/* Timeline Dot */}
                        <div className="absolute top-5 left-6 md:left-1/2 -translate-x-1/2 z-10">
                            <div className="w-5 h-5 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="pl-16 md:pl-0 md:flex md:items-center"
                             style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
                        >
                            <div className="md:w-1/2">
                                {/* Empty space for alternating layout on desktop */}
                            </div>
                            <div className="md:w-1/2 md:px-8">
                                <Card className="bg-card/80 border border-border/80 hover:border-primary/50 hover:bg-card transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {job.role}
                                                </CardTitle>
                                                <CardDescription className="text-base font-medium text-primary/90 mt-1">
                                                    {job.company}
                                                </CardDescription>
                                            </div>
                                            <Briefcase className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                                        </div>
                                        <CardDescription className="text-sm text-muted-foreground pt-2">
                                            {job.period}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {job.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
