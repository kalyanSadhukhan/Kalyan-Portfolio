import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, ExternalLink, Github, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';

// Backend entity field names
interface Project {
    id: string | number;
    title: string;
    description: string;
    techStack?: string;   // comma-separated tags
    githubLink?: string;
    liveDemo?: string;
    demoVideo?: string;
    features?: string;
    architecture?: string;
    complexity?: string;
    featured?: boolean;
    imageUrl?: string;
}

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    techStack: z.string().optional(),
    githubLink: z.string().url('Invalid URL').optional().or(z.literal('')),
    liveDemo: z.string().url('Invalid URL').optional().or(z.literal('')),
    features: z.string().optional(),
    architecture: z.string().optional(),
    complexity: z.string().optional(),
    imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | number | null>(null);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            techStack: '',
            githubLink: '',
            liveDemo: '',
            features: '',
            architecture: '',
            complexity: '',
            imageUrl: '',
        },
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/projects');
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            toast.error('Could not load projects from the server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenDialog = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            form.reset({
                title: project.title,
                description: project.description,
                techStack: project.techStack || '',
                githubLink: project.githubLink || '',
                liveDemo: project.liveDemo || '',
                features: project.features || '',
                architecture: project.architecture || '',
                complexity: project.complexity || '',
                imageUrl: project.imageUrl || '',
            });
        } else {
            setEditingProject(null);
            form.reset({
                title: '',
                description: '',
                techStack: '',
                githubLink: '',
                liveDemo: '',
                features: '',
                architecture: '',
                complexity: '',
                imageUrl: '',
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingProject) {
                await api.put(`/api/projects/${editingProject.id}`, data);
                toast.success('Project updated successfully');
            } else {
                await api.post('/api/projects', data);
                toast.success('Project created successfully');
            }
            setIsDialogOpen(false);
            fetchProjects();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to save project');
            } else {
                toast.error('Failed to save project');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;
        try {
            await api.delete(`/api/projects/${projectToDelete}`);
            toast.success('Project deleted successfully');
            fetchProjects();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to delete project');
            } else {
                toast.error('Failed to delete project');
            }
        } finally {
            setProjectToDelete(null);
        }
    };

    // Parse comma-separated techStack into display tags
    const parseTags = (techStack?: string) =>
        techStack ? techStack.split(',').map(t => t.trim()).filter(Boolean) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your portfolio projects.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Project
                </Button>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No projects found. Ready to build your portfolio?
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Tech Stack</TableHead>
                                    <TableHead className="hidden sm:table-cell">Links</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id} className="border-border/50">
                                        <TableCell className="font-medium">{project.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex gap-1 flex-wrap">
                                                {parseTags(project.techStack).slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {parseTags(project.techStack).length > 3 && (
                                                    <span className="px-2 py-0.5 rounded text-xs bg-muted">
                                                        +{parseTags(project.techStack).length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex gap-2">
                                                {project.liveDemo && (
                                                    <a href={project.liveDemo} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {project.githubLink && (
                                                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                                        <Github className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(project)}>
                                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setProjectToDelete(project.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[1000px] w-full glass-card border-border max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader className="shrink-0 mb-4">
                        <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
                        <DialogDescription>
                            {editingProject ? 'Update your project details below.' : 'Fill out the form to add a new project.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Hotel Reservation System" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="A brief summary of the project..." className="h-20 bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="techStack"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tech Stack (comma-separated)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Java, JDBC, SQL, GitHub" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="liveDemo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Live Demo URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://demo.com" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="githubLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GitHub URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/..." className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="features"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Key Features</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="List the main features..." className="h-24 bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="architecture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Architecture / README (Markdown)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="# Overview&#10;Describe the architecture..." className="h-32 bg-background/50 font-mono text-sm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="complexity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complexity Level</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Beginner / Intermediate / Advanced" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://i.imgur.com/your-image.png" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            {/* Live image preview */}
                                            {field.value && (
                                                <div className="mt-2 rounded-lg overflow-hidden border border-border/50 aspect-video bg-background/30">
                                                    <img
                                                        src={field.value}
                                                        alt="Thumbnail preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                        ) : (
                                            'Save Project'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>

                        {/* Markdown Preview Pane */}
                        <div className="flex flex-col h-full min-h-[400px] border border-border/50 rounded-md bg-background/30 p-4">
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Architecture Preview</h3>
                            <div className="flex-1 overflow-y-auto prose prose-sm dark:prose-invert prose-primary max-w-none">
                                <ReactMarkdown>
                                    {form.watch('architecture') || '*No markdown content entered.*'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={projectToDelete !== null} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this project.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
