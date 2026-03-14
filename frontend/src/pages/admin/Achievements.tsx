import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, Loader2, Trophy, GripVertical } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface Achievement {
    id: string | number;
    title: string;
    organization: string;
    date: string;
    description: string;
    url?: string;
}

const achievementSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().min(1, 'Organization is required'),
    date: z.string().min(1, 'Date is required'),
    description: z.string().or(z.literal('')),
    url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

// ── Sortable row ───────────────────────────────────────────────────────────
interface SortableRowProps {
    item: Achievement;
    onEdit: (item: Achievement) => void;
    onDelete: (id: string | number) => void;
}

function SortableAchievementRow({ item, onEdit, onDelete }: SortableRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: String(item.id) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    return (
        <TableRow ref={setNodeRef} style={style} className="border-border/50">
            {/* Drag handle */}
            <TableCell className="w-8 pr-0">
                <span
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                </span>
            </TableCell>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    {item.title}
                </div>
            </TableCell>
            <TableCell>{item.organization}</TableCell>
            <TableCell className="hidden sm:table-cell text-muted-foreground">
                {item.date}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AdminAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Achievement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const form = useForm<AchievementFormValues>({
        resolver: zodResolver(achievementSchema),
        defaultValues: { title: '', organization: '', date: '', description: '', url: '' },
    });

    const fetchAchievements = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/achievements');
            if (Array.isArray(data)) setAchievements(data);
        } catch (error) {
            console.error('Failed to fetch achievements', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAchievements(); }, []);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = achievements.findIndex(a => String(a.id) === active.id);
        const newIndex = achievements.findIndex(a => String(a.id) === over.id);
        const reordered = arrayMove(achievements, oldIndex, newIndex);
        setAchievements(reordered);

        try {
            await api.put('/api/achievements/reorder', { ids: reordered.map(a => a.id) });
        } catch {
            // Reorder endpoint may not exist — silently ignore
        }
    };

    const handleOpenDialog = (item?: Achievement) => {
        if (item) {
            setEditingItem(item);
            form.reset({
                title: item.title,
                organization: item.organization,
                date: item.date,
                description: item.description || '',
                url: item.url || '',
            });
        } else {
            setEditingItem(null);
            form.reset({ title: '', organization: '', date: '', description: '', url: '' });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: AchievementFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await api.put(`/api/achievements/${editingItem.id}`, data);
                toast.success('Achievement updated successfully');
            } else {
                await api.post('/api/achievements', data);
                toast.success('Achievement added successfully');
            }
            setIsDialogOpen(false);
            fetchAchievements();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to save achievement');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/api/achievements/${itemToDelete}`);
            toast.success('Achievement deleted successfully');
            fetchAchievements();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete achievement');
        } finally {
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Achievements &amp; Participation</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your notable achievements. Drag rows to reorder.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Achievement
                </Button>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardContent className="p-0 max-h-[420px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No achievements added yet.
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={achievements.map(a => String(a.id))}
                                strategy={verticalListSortingStrategy}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead className="w-8" />
                                            <TableHead>Title</TableHead>
                                            <TableHead>Organization</TableHead>
                                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {achievements.map(item => (
                                            <SortableAchievementRow
                                                key={item.id}
                                                item={item}
                                                onEdit={handleOpenDialog}
                                                onDelete={setItemToDelete}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </SortableContext>
                        </DndContext>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] glass-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle>
                        <DialogDescription>
                            Enter the details of your achievement or participation.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 1st Place Hackathon" className="bg-background/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="organization" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Google" className="bg-background/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="bg-background/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" className="bg-background/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details about this achievement..." className="bg-background/50 min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Achievement'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this achievement record.
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
