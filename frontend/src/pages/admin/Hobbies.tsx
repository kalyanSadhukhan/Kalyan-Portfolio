import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, Loader2, Heart, GripVertical } from 'lucide-react';
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

interface Hobby {
    id: string | number;
    name: string;
    icon: string;
    description: string;
}

const hobbySchema = z.object({
    name: z.string().min(1, 'Hobby Name is required'),
    icon: z.string().min(1, 'Icon name (lucide-react) is required'),
    description: z.string(),
});

type HobbyFormValues = z.infer<typeof hobbySchema>;

// ── Sortable row ───────────────────────────────────────────────────────────
interface SortableRowProps {
    hobby: Hobby;
    onEdit: (hobby: Hobby) => void;
    onDelete: (id: string | number) => void;
}

function SortableHobbyRow({ hobby, onEdit, onDelete }: SortableRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: String(hobby.id) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    return (
        <TableRow ref={setNodeRef} style={style} className="border-border/50">
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
                    <Heart className="h-4 w-4 text-primary" />
                    {hobby.name}
                </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell text-muted-foreground">{hobby.icon}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(hobby)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(hobby.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AdminHobbies() {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hobbyToDelete, setHobbyToDelete] = useState<string | number | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const form = useForm<HobbyFormValues>({
        resolver: zodResolver(hobbySchema),
        defaultValues: { name: '', icon: 'Heart', description: '' },
    });

    const fetchHobbies = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/hobbies');
            if (Array.isArray(data)) setHobbies(data);
        } catch (error) {
            console.error('Failed to fetch hobbies', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchHobbies(); }, []);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = hobbies.findIndex(h => String(h.id) === active.id);
        const newIndex = hobbies.findIndex(h => String(h.id) === over.id);
        const reordered = arrayMove(hobbies, oldIndex, newIndex);
        setHobbies(reordered);

        try {
            await api.put('/api/hobbies/reorder', { ids: reordered.map(h => h.id) });
        } catch {
            // Silently ignore if endpoint doesn't exist
        }
    };

    const handleOpenDialog = (hobby?: Hobby) => {
        if (hobby) {
            setEditingHobby(hobby);
            form.reset({ name: hobby.name, icon: hobby.icon || 'Heart', description: hobby.description || '' });
        } else {
            setEditingHobby(null);
            form.reset({ name: '', icon: 'Heart', description: '' });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: HobbyFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingHobby) {
                await api.put(`/api/hobbies/${editingHobby.id}`, data);
                toast.success('Hobby updated successfully');
            } else {
                await api.post('/api/hobbies', data);
                toast.success('Hobby added successfully');
            }
            setIsDialogOpen(false);
            fetchHobbies();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to save hobby');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!hobbyToDelete) return;
        try {
            await api.delete(`/api/hobbies/${hobbyToDelete}`);
            toast.success('Hobby deleted successfully');
            fetchHobbies();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete hobby');
        } finally {
            setHobbyToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Hobbies</h1>
                    <p className="text-muted-foreground mt-2">
                        Share what you love doing outside of work. Drag rows to reorder.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Hobby
                </Button>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardContent className="p-0 max-h-[420px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : hobbies.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No hobbies added yet. What do you do for fun?
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={hobbies.map(h => String(h.id))}
                                strategy={verticalListSortingStrategy}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead className="w-8" />
                                            <TableHead>Hobby</TableHead>
                                            <TableHead className="hidden sm:table-cell">Icon Keyword</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hobbies.map(hobby => (
                                            <SortableHobbyRow
                                                key={hobby.id}
                                                hobby={hobby}
                                                onEdit={handleOpenDialog}
                                                onDelete={setHobbyToDelete}
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
                        <DialogTitle>{editingHobby ? 'Edit Hobby' : 'Add Hobby'}</DialogTitle>
                        <DialogDescription>Showcase your personal interests.</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hobby Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Photography" className="bg-background/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="icon" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon Keyword (Lucide React)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Camera, Gamepad2, Plane, etc." className="bg-background/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-muted-foreground mt-1">Visit <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer" className="underline">lucide.dev/icons</a> for names.</p>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Why do you love it?" className="bg-background/50 resize-none" rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Hobby'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={hobbyToDelete !== null} onOpenChange={(open) => !open && setHobbyToDelete(null)}>
                <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this hobby.</AlertDialogDescription>
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
