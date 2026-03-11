import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github, Loader2, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

/**
 * Convert any Google Drive share/view URL to a direct-embeddable URL.
 * drive.google.com/file/d/<ID>/view  →  drive.google.com/uc?export=view&id=<ID>
 * drive.google.com/open?id=<ID>      →  same
 */
function toDriveDirectUrl(url: string): string {
    if (!url) return url;
    // Match /file/d/<ID>/...
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
    if (fileMatch) {
        return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    }
    // Match ?id=<ID>
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch && url.includes('drive.google.com')) {
        return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
    return url; // return as-is for non-Drive URLs
}

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/projects/${id}`);
                if (response) {
                    setProject(response);
                } else {
                    throw new Error('Project not found');
                }
            } catch (error) {
                console.error("Failed to fetch project details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProject();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col justify-center items-center gap-4">
                    <h1 className="text-2xl font-bold font-heading">Project not found</h1>
                    <Button asChild variant="outline">
                        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    const thumbnailUrl = project.imageUrl ? toDriveDirectUrl(project.imageUrl) : null;
    const tags: string[] = project.techStack
        ? project.techStack.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* ── Hero / Header ── */}
                <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                    <div className="container mx-auto relative z-10 max-w-4xl">
                        <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
                            <Link to="/#projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
                        </Button>

                        {/* Tech badges + complexity inline */}
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-none">
                                    {tag}
                                </Badge>
                            ))}
                            {project.complexity && (
                                <span className="flex items-center gap-1 ml-auto text-xs font-semibold text-muted-foreground border border-border/50 rounded-full px-3 py-1">
                                    <Zap className="w-3 h-3 text-yellow-400" />
                                    {project.complexity}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-5">{project.title}</h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                            {project.description}
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-4">
                            {project.liveDemo && (
                                <Button asChild size="lg" className="glow-primary">
                                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-5 w-5" /> Live Demo
                                    </a>
                                </Button>
                            )}
                            {project.githubLink && (
                                <Button asChild size="lg" variant="outline">
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-5 w-5" /> Source Code
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Main content ── */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-4xl space-y-12">

                        {/* Thumbnail image */}
                        {thumbnailUrl && (
                            <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                                <img
                                    src={thumbnailUrl}
                                    alt={project.title}
                                    className="w-full aspect-video object-cover"
                                    onError={(e) => {
                                        (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        {/* Demo video */}
                        {project.demoVideo && (
                            <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                                {project.demoVideo.endsWith('.mp4') || project.demoVideo.endsWith('.webm') ? (
                                    <video className="w-full aspect-video object-cover bg-black" controls preload="metadata">
                                        <source src={project.demoVideo} />
                                    </video>
                                ) : (
                                    <iframe
                                        className="w-full aspect-video"
                                        src={project.demoVideo.replace("watch?v=", "embed/")}
                                        title={project.title}
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        )}

                        {/* ── Features (plain text / bullet list) ── */}
                        {project.features && (
                            <div className="glass-card p-8 rounded-2xl border border-border/50">
                                <h2 className="text-2xl font-heading font-bold mb-5 text-foreground">Key Features</h2>
                                <article className="prose prose-base dark:prose-invert prose-primary max-w-none
                                    prose-headings:font-heading prose-headings:text-foreground
                                    prose-p:text-foreground/80 prose-li:text-foreground/80
                                    prose-strong:text-foreground prose-a:text-primary
                                    prose-ul:text-foreground/80 prose-ol:text-foreground/80
                                    [&_li]:marker:text-primary">
                                    <ReactMarkdown>{project.features}</ReactMarkdown>
                                </article>
                            </div>
                        )}

                        {/* ── Architecture / Additional Details (markdown) ── */}
                        {project.architecture && (
                            <div className="glass-card p-8 rounded-2xl border border-border/50">
                                <h2 className="text-2xl font-heading font-bold mb-5 text-foreground">Additional Details</h2>
                                <article className="prose prose-base dark:prose-invert prose-primary max-w-none
                                    prose-headings:font-heading prose-headings:text-foreground
                                    prose-p:text-foreground/80 prose-li:text-foreground/80
                                    prose-strong:text-foreground prose-a:text-primary
                                    prose-ul:text-foreground/80 prose-ol:text-foreground/80
                                    [&_li]:marker:text-primary prose-code:text-primary prose-pre:bg-background/60">
                                    <ReactMarkdown>{project.architecture}</ReactMarkdown>
                                </article>
                            </div>
                        )}

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
