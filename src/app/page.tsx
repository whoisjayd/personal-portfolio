import { MainSidebar } from '@/components/main-sidebar';
import { HomeClient } from '@/app/home-client';
import { getUserProfile } from '@/lib/actions/github';
import { AboutApp } from '@/components/apps/about';
import { SkillsApp } from '@/components/apps/skills';
import { ExperienceApp } from '@/components/apps/experience';
import { AchievementsApp } from '@/components/apps/achievements';
import { ContactApp } from '@/components/apps/contact';

export default async function Home() {
  const user = await getUserProfile();

  const appData = {
    about: <AboutApp user={user} />,
    skills: <SkillsApp />,
    experience: <ExperienceApp />,
    achievements: <AchievementsApp />,
    contact: <ContactApp />,
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      <MainSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <HomeClient {...appData} user={user} />
      </div>
    </div>
  );
}
