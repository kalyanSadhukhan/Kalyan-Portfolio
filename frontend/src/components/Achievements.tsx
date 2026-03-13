import { useEffect, useState } from "react";
import { Trophy, Calendar, Loader2, ExternalLink } from "lucide-react";
import { api } from "../lib/api";

interface Achievement {
  id: string | number;
  title: string;
  organization: string;
  date: string;
  description: string;
  url?: string;
}

export const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await api.get('/api/achievements');
        if (Array.isArray(data)) {
            setAchievements(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </section>
    );
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="py-20 px-4 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none opacity-50 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl rounded-tr-none border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                    <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Achievements & Participation</h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Notable accomplishments and activities</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((item) => {
                    const CardWrapper = item.url ? 'a' : 'div';
                    const cardProps = item.url
                        ? { href: item.url, target: '_blank', rel: 'noreferrer' }
                        : {};
                    return (
                        <CardWrapper
                            key={item.id}
                            {...cardProps}
                            className="group relative glass-card p-6 border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/[0.03] hover:border-primary/30 hover:shadow-[0_8px_30px_-8px_rgba(var(--primary),0.25)] overflow-hidden block"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150 pointer-events-none" />
                            
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
                                    {item.url && (
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                                    )}
                                </div>
                                <p className="text-accent font-medium text-sm mb-4">{item.organization}</p>
                                
                                {item.description && (
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto border-t border-white/5 pt-4">
                                    <Calendar className="w-4 h-4 text-primary/70" />
                                    <span>
                                        {item.date ? (() => {
                                            const d = new Date(item.date);
                                            return isNaN(d.getTime()) ? item.date : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                        })() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardWrapper>
                    );
                })}
            </div>
        </div>
    </section>
  );
};
