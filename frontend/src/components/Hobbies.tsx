import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { api } from "../lib/api";

interface Hobby {
  id: string | number;
  name: string;
  icon: string;
  description: string;
}

export const Hobbies = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [flipped, setFlipped] = useState<Set<string | number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHobbies = async () => {
      setIsLoading(true);
      try {
        const data = await api.get('/api/hobbies');
        if (Array.isArray(data)) setHobbies(data);
      } catch (error) {
        console.error("Failed to fetch hobbies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHobbies();
  }, []);

  const toggleFlip = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </section>
    );
  }

  if (hobbies.length === 0) return null;

  return (
    <section id="hobbies" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Beyond <span className="gradient-text">Code</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            When I'm not building applications, here's what keeps me balanced and inspired.
          </p>
        </div>

        {/* Flip-cards grid — 2 cols mobile, 3 sm, 4 lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {hobbies.map((hobby, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[hobby.icon] || LucideIcons.Heart;
            const isFlipped = flipped.has(hobby.id);

            return (
              <div
                key={hobby.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 60}ms`,
                  perspective: "1000px",
                  height: "110px",
                }}
              >
                {/* 3-D flip wrapper */}
                <div
                  className="relative w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* ─── FRONT ─── icon left, name beside it, flip button bottom-right */}
                  <div
                    className="absolute inset-0 glass-card rounded-xl border border-white/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(var(--primary),0.25)] transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Top row: icon + name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-base font-bold text-white leading-tight line-clamp-2">
                        {hobby.name}
                      </span>
                    </div>

                    {/* Bottom row: flip trigger aligned right */}
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => toggleFlip(hobby.id, e)}
                        className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
                        aria-label="Flip to see description"
                      >
                        <LucideIcons.RefreshCw className="w-3 h-3" />
                        <span>details</span>
                      </button>
                    </div>
                  </div>

                  {/* ─── BACK ─── description */}
                  <div
                    className="absolute inset-0 glass-card rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col justify-between overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                      {hobby.description || "No description added yet."}
                    </p>

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={(e) => toggleFlip(hobby.id, e)}
                        className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
                        aria-label="Flip back"
                      >
                        <LucideIcons.RefreshCw className="w-3 h-3" />
                        <span>flip back</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
