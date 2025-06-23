"use client";

import { useState, type ReactNode } from 'react';
import { DashboardGrid } from '@/components/dashboard-grid';
import { MainSidebar } from '@/components/main-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import type { GithubUser } from '@/lib/types';
import { ProjectsApp } from '@/components/apps/projects';

interface HomeClientProps {
  about: ReactNode;
  skills: ReactNode;
  experience: ReactNode;
  achievements: ReactNode;
  contact: ReactNode;
  user: GithubUser | null;
}

export function HomeClient(props: HomeClientProps) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const apps = [
    { id: 'about', title: 'About', content: props.about, className: "md:col-span-2 lg:col-span-2" },
    { id: 'skills', title: 'Skills', content: props.skills, className: "md:col-span-2 lg:col-span-2" },
    { id: 'experience', title: 'Experience', content: props.experience, className: "md:col-span-4 lg:col-span-2" },
    { id: 'projects', title: 'Projects', content: <ProjectsApp onBack={() => setExpandedBlock(null)} />, className: "md:col-span-4 lg:col-span-4" },
    { id: 'achievements', title: 'Achievements', content: props.achievements, className: "md:col-span-2 lg:col-span-2" },
    { id: 'contact', title: 'Contact', content: props.contact, className: "md:col-span-2 lg:col-span-2" },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      {!expandedBlock && (
        <header className="md:hidden flex h-16 shrink-0 items-center justify-between border-b bg-card/80 p-4 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-primary">{props.user?.name}</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-80 bg-card/95 backdrop-blur-sm">
              <MainSidebar user={props.user} isMobile={true} />
            </SheetContent>
          </Sheet>
        </header>
      )}
      <main className="flex-1 overflow-hidden">
        <DashboardGrid 
          expandedBlock={expandedBlock} 
          setExpandedBlock={setExpandedBlock}
          apps={apps}
        />
      </main>
    </div>
  );
}
