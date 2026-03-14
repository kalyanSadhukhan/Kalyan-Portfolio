import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, FolderOpen } from "lucide-react";
import { api } from "@/lib/api";

interface Project {
  id: string | number;
  title: string;
  description: string;
  techStack?: string;
  githubLink?: string;
  liveDemo?: string;
  imageUrl?: string;
}

/** Convert Google Drive share URL to a direct-embeddable image URL */
function toDriveDirectUrl(url: string): string {
  if (!url) return url;
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch && url.includes('drive.google.com')) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  return url;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseTags = (ts?: string) =>
    ts ? ts.split(',').map(t => t.trim()).filter(Boolean) : [];

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.get("/api/projects");
        let projectsToSet: Project[] = [];

        if (Array.isArray(data) && data.length > 0) {
          projectsToSet = data;
        } else if (Array.isArray(data) && data.length === 0) {
          // Provide fallback if database is empty
          projectsToSet = [
            {
              id: '1',
              title: 'E-commerce Platform',
              description: 'A full-stack e-commerce solution with cart, checkout, and admin features.',
              techStack: 'React, Node.js, Stripe',
            },
            {
              id: '2',
              title: 'AI Dashboard API',
              description: 'A dashboard application for monitoring AI model performance.',
              techStack: 'Vue, Python, FastAPI',
            }
          ];
        } else if (data && !Array.isArray(data)) {
          projectsToSet = [data];
        }

        // Sort projects
        const sorted = [...projectsToSet].sort((a, b) => {
          const aTitle = a.title || "";
          const bTitle = b.title || "";
          if (aTitle === "Hotel Reservation System") return -1;
          if (bTitle === "Hotel Reservation System") return 1;
          if (aTitle === "Kalyan Developer Portfolio") return -1;
          if (bTitle === "Kalyan Developer Portfolio") return 1;
          return 0;
        });

        setProjects(sorted);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of things I've built — click any card to see the full details.
          </p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <FolderOpen className="h-12 w-12 opacity-40" />
            <p className="text-lg">No projects found.</p>
          </div>
        ) : (
          <div
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)/0.4) transparent' }}
          >
            {projects.map((project, index) => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="block shrink-0 snap-start w-[300px] sm:w-[340px] group outline-none focus:ring-2 focus:ring-primary rounded-2xl"
              >
                <div
                  className="glass-card rounded-2xl h-full flex flex-col border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(77,163,255,0.2)] animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Thumbnail or icon accent */}
                  {project.imageUrl ? (
                    <div className="relative aspect-video overflow-hidden bg-background/50">
                      <img
                        src={toDriveDirectUrl(project.imageUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="p-6 pb-0">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {parseTags(project.techStack).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center gap-1 text-sm text-primary font-medium mt-auto pt-2 group-hover:gap-2 transition-all duration-300">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}