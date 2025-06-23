import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, Twitter, Terminal } from "lucide-react";
import type { GithubUser } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MainSidebarProps {
  user: GithubUser | null;
  isMobile?: boolean;
}

export function MainSidebar({ user, isMobile = false }: MainSidebarProps) {
  const currentYear = new Date().getFullYear();
  return (
    <aside className={cn(
      "flex w-72 flex-shrink-0 flex-col border-r bg-card/50 p-6",
      isMobile ? "w-full h-full" : "hidden md:flex h-screen sticky top-0"
    )}>
      <div className="flex-grow flex flex-col items-center text-center">
        <Avatar className="h-32 w-32 border-4 border-primary/80">
          <AvatarImage src={user?.avatar_url} alt={user?.name || user?.login} data-ai-hint="man portrait" />
          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="mt-4">
          <h1 className="font-bold text-2xl text-primary">{user?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">{user?.bio}</p>
        </div>
        
        <div className="mt-8 text-left w-full space-y-4">
            <h2 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider text-center">Currently working on</h2>
            <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                <Terminal className="h-5 w-5 text-accent mt-1 flex-shrink-0"/>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">Exploring Data Structures, Algorithms, and Golang</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Building a strong foundation in DSA while learning Golang through hands-on projects and problem-solving.
                  </p>
                </div>
                

            </div>
            <div className="flex-grow">
              <h2 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider text-center mt-6">Spotify Now Playing</h2>
              
              <a href="https://spotify-github-profile.kittinanx.com/api/view?uid=v7979a26s0d6q6o4ncpdss42v&redirect=true" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://spotify-github-profile.kittinanx.com/api/view?uid=v7979a26s0d6q6o4ncpdss42v&cover_image=true&theme=natemoo-re&show_offline=false&background_color=121212&interchange=true&bar_color=53b14f&bar_color_cover=false"
                  alt="Spotify Now Playing"
                />
              </a>
            </div>
        </div>
      </div>
      
      <div className="shrink-0 flex flex-col items-center space-y-4 pt-4">
        <Separator className="w-2/3" />
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/whoisjayd" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://www.linkedin.com/in/solanki-jaydeep" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://twitter.com/JaydeepS14216" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:contactjaydeepsolanki@gmail.com" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
            © {currentYear} {user?.name || "Jaydeep Solanki"}. All Rights Reserved.
        </p>
      </div>
    </aside>
  );
}
