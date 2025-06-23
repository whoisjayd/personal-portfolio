"use client";

import { DashboardBlock } from './dashboard-block';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import React, { type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type AppInfo = {
  id: string;
  title: string;
  content: ReactNode;
  className: string;
};

type DashboardGridProps = {
  expandedBlock: string | null;
  setExpandedBlock: (id: string | null) => void;
  apps: AppInfo[];
};

export function DashboardGrid({ expandedBlock, setExpandedBlock, apps }: DashboardGridProps) {
    const expandedApp = apps.find(app => app.id === expandedBlock);

    return (
      <div className="relative h-full w-full bg-transparent">
        <AnimatePresence>
          {!expandedBlock && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="h-full p-4 sm:p-6 md:p-8"
              >
              <div
                className='grid w-full h-full gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-6'
              >
                {apps.map((app) => (
                  <DashboardBlock
                    key={app.id}
                    id={app.id}
                    title={app.title}
                    onExpand={() => setExpandedBlock(app.id)}
                    className={app.className}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        <AnimatePresence>
          {expandedApp && (
            <motion.div
              key="expanded-card"
              layoutId={`card-container-${expandedApp.id}`}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="absolute inset-0 z-50"
            >
              {expandedApp.id === 'projects' ? (
                 <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="h-full w-full bg-background"
                 >
                  {expandedApp.content}
                 </motion.div>
              ) : (
                <Card className="h-full w-full rounded-xl border-0 flex flex-col bg-card">
                  <CardHeader className="flex flex-row items-center justify-between p-2 md:p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-20">
                    <div className="w-24 flex justify-start">
                      <Button variant="ghost" onClick={() => setExpandedBlock(null)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    </div>
                    <motion.div layoutId={`title-${expandedApp.id}`}>
                      <CardTitle className="text-lg text-center">{expandedApp.title}</CardTitle>
                    </motion.div>
                    <div className="w-24"></div> 
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                     <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                     >
                      {expandedApp.content}
                     </motion.div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}
