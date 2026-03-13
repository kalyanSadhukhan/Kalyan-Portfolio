import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, Loader2, GraduationCap } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

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

interface Education {
    id: string | number;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
    gradeScore?: string;
    marksheetUrl?: string;
}

const educationSchema = z.object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    description: z.string(),
    gradeScore: z.string().optional(),
    marksheetUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type EducationFormValues = z.infer<typeof educationSchema>;

export default function AdminEducation() {
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [educationToDelete, setEducationToDelete] = useState<string | number | null>(null);

    const form = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
            description: '',
            gradeScore: '',
            marksheetUrl: '',
        },
    });

    const fetchEducation = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/education');
            if (Array.isArray(data)) {
                setEducationList(data);
            }
        } catch (error) {
            console.error('Failed to fetch education', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    const handleOpenDialog = (education?: Education) => {
        if (education) {
            setEditingEducation(education);
            form.reset({
                institution: education.institution,
                degree: education.degree,
                startDate: education.startDate,
                endDate: education.endDate,
                description: education.description || '',
                gradeScore: education.gradeScore || '',
                marksheetUrl: education.marksheetUrl || '',
            });
        } else {
            setEditingEducation(null);
            form.reset({
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
                gradeScore: '',
                marksheetUrl: '',
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: EducationFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingEducation) {
                await api.put(`/api/education/${editingEducation.id}`, data);
                toast.success('Education updated successfully');
            } else {
                await api.post('/api/education', data);
                toast.success('Education added successfully');
            }
            setIsDialogOpen(false);
            fetchEducation();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to save education');
            } else {
                toast.error('Failed to save education');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!educationToDelete) return;
        try {
            await api.delete(`/api/education/${educationToDelete}`);
            toast.success('Education deleted successfully');
            fetchEducation();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to delete education');
            } else {
                toast.error('Failed to delete education');
            }
        } finally {
            setEducationToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Education</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your educational background and degrees.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Education
                </Button>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : educationList.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No education entries added yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Degree</TableHead>
                                    <TableHead className="hidden sm:table-cell">Duration</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {educationList.map((edu) => (
                                    <TableRow key={edu.id} className="border-border/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                                {edu.institution}
                                            </div>
                                        </TableCell>
                                        <TableCell>{edu.degree}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                                            {edu.startDate} - {edu.endDate}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(edu)}>
                                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setEducationToDelete(edu.id)}>
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] glass-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingEducation ? 'Edit Education' : 'Add Education'}</DialogTitle>
                        <DialogDescription>
                            Provide details about your educational background.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="institution"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. University of Technology" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="degree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Degree / Program</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. B.S. Computer Science" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="gradeScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grade / CGPA / Percentage (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 8.5 CGPA or 85%" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="marksheetUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marksheet / Certificate URL (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://drive.google.com/..." className="bg-background/50" {...field} />
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
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Highlights, coursework, etc..." className="bg-background/50 resize-none" rows={3} {...field} />
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
                                        'Save Education'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={educationToDelete !== null} onOpenChange={(open) => !open && setEducationToDelete(null)}>
                <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this educational record.
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
