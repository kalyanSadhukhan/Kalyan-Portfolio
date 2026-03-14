import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, Loader2, Code, Wrench, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Skill {
    id: string | number;
    name: string;
    url: string;
    category: string; // e.g., 'Programming Languages', 'Tools & Platforms', 'Core Concepts and Frameworks'
    displayOrder?: number;
}

const skillSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Must be a valid URL').or(z.literal('')),
    category: z.string().min(1, 'Category is required'),
});

type SkillFormValues = z.infer<typeof skillSchema>;

const CATEGORIES = [
    { id: 'Programming Languages', icon: Code, color: 'primary' },
    { id: 'Tools & Platforms', icon: Wrench, color: 'accent' },
    { id: 'Core Concepts and Frameworks', icon: BookOpen, color: 'primary' }
];

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | number | null>(null);

    const form = useForm<SkillFormValues>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: '',
            url: '',
            category: 'Programming Languages',
        },
    });

    const fetchSkills = async () => {
        setIsLoading(true);
        try {
            // Trying API
            const data = await api.get('/api/skills');
            if (Array.isArray(data)) {
                setSkills(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
            } else {
                throw new Error("Invalid format");
            }
        } catch (error) {
            console.warn('Backend not hooked up, using mock data');
            // Mock Data if API fails
            setTimeout(() => {
                setSkills([
                    { id: '1', name: 'Java', url: 'https://example.com/java', category: 'Programming Languages', displayOrder: 0 },
                    { id: '2', name: 'React', url: 'https://reactjs.org', category: 'Tools & Platforms', displayOrder: 1 },
                    { id: '3', name: 'DSA', url: 'https://example.com/dsa', category: 'Core Concepts and Frameworks', displayOrder: 2 },
                ]);
                setIsLoading(false);
            }, 500);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleOpenDialog = (skill?: Skill) => {
        if (skill) {
            setEditingSkill(skill);
            form.reset({
                name: skill.name,
                url: skill.url,
                category: skill.category,
            });
        } else {
            setEditingSkill(null);
            form.reset({
                name: '',
                url: '',
                category: 'Programming Languages',
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: SkillFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingSkill) {
                await api.put(`/api/skills/${editingSkill.id}`, data);
                toast.success('Skill updated successfully');
            } else {
                await api.post('/api/skills', data);
                toast.success('Skill created successfully');
            }
            setIsDialogOpen(false);
            fetchSkills();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to save skill');
            } else {
                toast.error('Failed to save skill');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string | number) => {
        setSkillToDelete(id);
    };

    const confirmDelete = async () => {
        if (!skillToDelete) return;
        try {
            await api.delete(`/api/skills/${skillToDelete}`);
            toast.success('Skill deleted successfully');
            fetchSkills();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to delete skill');
            } else {
                toast.error('Failed to delete skill');
            }
        } finally {
            setSkillToDelete(null);
        }
    };

    const handleMoveInCategory = async (skill: Skill, direction: 'up' | 'down') => {
        const categorySkills = skills.filter(s => s.category === skill.category);
        const catIndex = categorySkills.findIndex(s => s.id === skill.id);
        
        const targetIndex = direction === 'up' ? catIndex - 1 : catIndex + 1;
        if (targetIndex < 0 || targetIndex >= categorySkills.length) return;
        
        const newCategorySkills = [...categorySkills];
        const temp = newCategorySkills[catIndex];
        newCategorySkills[catIndex] = newCategorySkills[targetIndex];
        newCategorySkills[targetIndex] = temp;
        
        // rebuild the full array
        const otherSkills = skills.filter(s => s.category !== skill.category);
        const combined = [...otherSkills, ...newCategorySkills];
        
        // reassign displayOrder globally
        combined.forEach((s, i) => {
            s.displayOrder = i;
        });
        
        setSkills(combined);
        
        try {
            await Promise.all([
                api.put(`/api/skills/${newCategorySkills[catIndex].id}`, newCategorySkills[catIndex]),
                api.put(`/api/skills/${newCategorySkills[targetIndex].id}`, newCategorySkills[targetIndex])
            ]);
            toast.success('Order updated');
        } catch (error) {
            toast.error('Failed to save order');
            fetchSkills(); 
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Skills</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage the list of abilities displayed in your portfolio grid.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Skill
                </Button>
            </div>

            {/* Card fills exactly the remaining viewport height */}
            <Card
                className="glass-card shadow-sm border-white/5 overflow-hidden"
                style={{ height: 'calc(100vh - 13rem)' }}
            >
                <CardContent
                    className="p-0 h-full overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--primary)/0.3) transparent' }}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : skills.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No skills added yet. Time to flex your abilities!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {CATEGORIES.map((category) => {
                                const categorySkills = skills.filter(s => s.category === category.id);
                                if (categorySkills.length === 0) return null;
                                return (
                                    <div key={category.id} className="p-4">
                                        <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
                                            <category.icon className="h-5 w-5 text-primary" />
                                            <h3 className="text-lg font-semibold">{category.id}</h3>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-border/50 hover:bg-transparent">
                                                    <TableHead className="w-16">Sort</TableHead>
                                                    <TableHead>Skill Name</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Resource URL</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {categorySkills.map((skill, index) => (
                                                    <TableRow key={skill.id} className="border-border/50">
                                                        <TableCell>
                                                            <div className="flex flex-col -space-y-1">
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveInCategory(skill, 'up')} disabled={index === 0}>
                                                                    <ArrowUp className="h-3 w-3 text-muted-foreground" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveInCategory(skill, 'down')} disabled={index === categorySkills.length - 1}>
                                                                    <ArrowDown className="h-3 w-3 text-muted-foreground" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            <Badge variant="outline" className="bg-muted/50">{skill.name}</Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            {skill.url ? (
                                                                <a href={skill.url} target="_blank" rel="noreferrer" className="text-primary hover:underline max-w-[200px] truncate block text-sm">
                                                                    {skill.url}
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm">No link</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(skill)}>
                                                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(skill.id)}>
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] glass-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
                        <DialogDescription>
                            Provide the details of the technology or concept.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skill Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Next.js" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CATEGORIES.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        <div className="flex items-center gap-2">
                                                            <c.icon className="w-4 h-4" />
                                                            {c.id}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resource / Tutorial URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                        'Save Skill'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={skillToDelete !== null} onOpenChange={(open) => !open && setSkillToDelete(null)}>
                <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this skill.
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
