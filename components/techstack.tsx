"use client"

import React from "react"
import {
  SiAmazons3,
  SiAxios,
  SiCloudflare,
  SiCloudflarepages,
  SiClerk,
  SiCss3,
  SiDebian,
  SiDjango,
  SiDocker,
  SiDotenv,
  SiDrizzle,
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFlask,
  SiFolium,
  SiGit,
  SiGo,
  SiGoogleanalytics,
  SiGooglecloud,
  SiHuggingface,
  SiInfluxdb,
  SiJinja,
  SiKnime,
  SiLangchain,
  SiLatex,
  SiLeaflet,
  SiLinux,
  SiMapbox,
  SiMongodb,
  SiMongoose,
  SiMysql,
  SiNano,
  SiNamecheap,
  SiNestjs,
  SiNextdotjs,
  SiNgrok,
  SiNodedotjs,
  SiNpm,
  SiNumpy,
  SiOpenai,
  SiOpencv,
  SiPandas,
  SiPerl,
  SiPoetry,
  SiPnpm,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiScikitlearn,
  SiScrapy,
  SiScipy,
  SiSelenium,
  SiTableau,
  SiTailwindcss,
  SiTqdm,
  SiTypescript,
  SiUbuntu,
} from "react-icons/si"

const techStack = [
  { name: "AWS S3", icon: <SiAmazons3 className="text-foreground/90" size={18} /> },
  { name: "Axios", icon: <SiAxios className="text-foreground/90" size={18} /> },
  { name: "Clerk", icon: <SiClerk className="text-foreground/90" size={18} /> },
  { name: "Cloudflare", icon: <SiCloudflare className="text-foreground/90" size={18} /> },
  { name: "Cloudflare Pages", icon: <SiCloudflarepages className="text-foreground/90" size={18} /> },
  { name: "CSS3", icon: <SiCss3 className="text-foreground/90" size={18} /> },
  { name: "Debian", icon: <SiDebian className="text-foreground/90" size={18} /> },
  { name: "Django", icon: <SiDjango className="text-foreground/90" size={18} /> },
  { name: "Docker", icon: <SiDocker className="text-foreground/90" size={18} /> },
  { name: "Dotenv", icon: <SiDotenv className="text-foreground/90" size={18} /> },
  { name: "Drizzle ORM", icon: <SiDrizzle className="text-foreground/90" size={18} /> },
  { name: "Express", icon: <SiExpress className="text-foreground/90" size={18} /> },
  { name: "FastAPI", icon: <SiFastapi className="text-foreground/90" size={18} /> },
  { name: "Firebase", icon: <SiFirebase className="text-foreground/90" size={18} /> },
  { name: "Flask", icon: <SiFlask className="text-foreground/90" size={18} /> },
  { name: "Folium", icon: <SiFolium className="text-foreground/90" size={18} /> },
  { name: "Git", icon: <SiGit className="text-foreground/90" size={18} /> },
  { name: "Go", icon: <SiGo className="text-foreground/90" size={18} /> },
  { name: "Google Analytics", icon: <SiGoogleanalytics className="text-foreground/90" size={18} /> },
  { name: "GCP", icon: <SiGooglecloud className="text-foreground/90" size={18} /> },
  { name: "Hugging Face", icon: <SiHuggingface className="text-foreground/90" size={18} /> },
  { name: "InfluxDB", icon: <SiInfluxdb className="text-foreground/90" size={18} /> },
  { name: "Jinja2", icon: <SiJinja className="text-foreground/90" size={18} /> },
  { name: "KNIME", icon: <SiKnime className="text-foreground/90" size={18} /> },
  { name: "LangChain", icon: <SiLangchain className="text-foreground/90" size={18} /> },
  { name: "LaTeX", icon: <SiLatex className="text-foreground/90" size={18} /> },
  { name: "Leaflet", icon: <SiLeaflet className="text-foreground/90" size={18} /> },
  { name: "Linux", icon: <SiLinux className="text-foreground/90" size={18} /> },
  { name: "Mapbox", icon: <SiMapbox className="text-foreground/90" size={18} /> },
  { name: "MongoDB", icon: <SiMongodb className="text-foreground/90" size={18} /> },
  { name: "Mongoose", icon: <SiMongoose className="text-foreground/90" size={18} /> },
  { name: "MySQL", icon: <SiMysql className="text-foreground/90" size={18} /> },
  { name: "Nano", icon: <SiNano className="text-foreground/90" size={18} /> },
  { name: "Namecheap", icon: <SiNamecheap className="text-foreground/90" size={18} /> },
  { name: "NestJS", icon: <SiNestjs className="text-foreground/90" size={18} /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-foreground/90" size={18} /> },
  { name: "Ngrok", icon: <SiNgrok className="text-foreground/90" size={18} /> },
  { name: "Node.js", icon: <SiNodedotjs className="text-foreground/90" size={18} /> },
  { name: "NPM", icon: <SiNpm className="text-foreground/90" size={18} /> },
  { name: "NumPy", icon: <SiNumpy className="text-foreground/90" size={18} /> },
  { name: "OpenAI", icon: <SiOpenai className="text-foreground/90" size={18} /> },
  { name: "OpenCV", icon: <SiOpencv className="text-foreground/90" size={18} /> },
  { name: "Pandas", icon: <SiPandas className="text-foreground/90" size={18} /> },
  { name: "Perl", icon: <SiPerl className="text-foreground/90" size={18} /> },
  { name: "Poetry", icon: <SiPoetry className="text-foreground/90" size={18} /> },
  { name: "PNPM", icon: <SiPnpm className="text-foreground/90" size={18} /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="text-foreground/90" size={18} /> },
  { name: "Postman", icon: <SiPostman className="text-foreground/90" size={18} /> },
  { name: "Python", icon: <SiPython className="text-foreground/90" size={18} /> },
  { name: "React", icon: <SiReact className="text-foreground/90" size={18} /> },
  { name: "Redis", icon: <SiRedis className="text-foreground/90" size={18} /> },
  { name: "scikit-learn", icon: <SiScikitlearn className="text-foreground/90" size={18} /> },
  { name: "Scrapy", icon: <SiScrapy className="text-foreground/90" size={18} /> },
  { name: "SciPy", icon: <SiScipy className="text-foreground/90" size={18} /> },
  { name: "Selenium", icon: <SiSelenium className="text-foreground/90" size={18} /> },
  { name: "Tableau", icon: <SiTableau className="text-foreground/90" size={18} /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-foreground/90" size={18} /> },
  { name: "TQDM", icon: <SiTqdm className="text-foreground/90" size={18} /> },
  { name: "TypeScript", icon: <SiTypescript className="text-foreground/90" size={18} /> },
  { name: "Ubuntu", icon: <SiUbuntu className="text-foreground/90" size={18} /> },
]


export default function TechStack() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const innerContainerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on mount and window resize
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  // Handle mouse leave and up
  const handleMouseUp = () => {
    if (isDragging) {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsDragging(false);
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle wheel scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    containerRef.current.scrollLeft += e.deltaY * 0.5;
    if (!isPaused) {
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsPaused(true);
    const touch = e.touches[0];
    setStartX(touch.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || !isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const x = touch.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setIsPaused(false), 1500);
    }
  };

  // Duplicate items for seamless looping
  const duplicatedTechStack = [...techStack, ...techStack, ...techStack];

  return (
    <div className="relative h-10 my-3 w-full group">
      {/* Gradient fade effect */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div
        ref={containerRef}
        className="flex items-center h-full overflow-x-auto no-scrollbar px-2"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          ref={innerContainerRef}
          className={`flex flex-row items-center gap-2 ${!isPaused ? 'animate-techstack-horizontal' : ''}`}
          style={{ willChange: 'transform' }}
        >
          {duplicatedTechStack.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center justify-center px-2.5 py-1 rounded-lg bg-muted/20 border border-border/20 text-xs font-normal text-foreground/70 hover:text-foreground hover:bg-muted/40 hover:border-border/40 transition-all duration-200 whitespace-nowrap hover:scale-[1.03] hover:shadow-sm"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {React.cloneElement(tech.icon, { size: 14 })}
              </span>
              <span className="ml-1.5">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes techstack-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333% - 0.5rem)); }
        }
        
        .animate-techstack-horizontal {
          animation: techstack-horizontal 100s linear infinite;
          animation-play-state: running;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .animate-techstack-horizontal {
            animation: techstack-horizontal 100s linear infinite;
          }
        }
        
        @media (max-width: 480px) {
          .animate-techstack-horizontal {
            animation: techstack-horizontal 100s linear infinite;
          }
        }
      `}</style>
    </div>
  )
}
