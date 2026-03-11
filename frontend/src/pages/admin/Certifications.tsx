import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, Loader2, Award, ExternalLink } from 'lucide-react';
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

interface Certification {
    id: string | number;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    credentialUrl: string;
}

const certificationSchema = z.object({
    name: z.string().min(1, 'Certification Name is required'),
    issuingOrganization: z.string().min(1, 'Issuing Organization is required'),
    issueDate: z.string().min(1, 'Issue Date is required'),
    credentialUrl: z.string().url('Must be a valid URL').or(z.literal('')),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

export default function AdminCertifications() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [certToDelete, setCertToDelete] = useState<string | number | null>(null);

    const form = useForm<CertificationFormValues>({
        resolver: zodResolver(certificationSchema),
        defaultValues: {
            name: '',
            issuingOrganization: '',
            issueDate: '',
            credentialUrl: '',
        },
    });

    const fetchCertifications = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/certifications');
            if (Array.isArray(data)) {
                setCertifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch certifications', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const handleOpenDialog = (cert?: Certification) => {
        if (cert) {
            setEditingCert(cert);
            form.reset({
                name: cert.name,
                issuingOrganization: cert.issuingOrganization,
                issueDate: cert.issueDate,
                credentialUrl: cert.credentialUrl || '',
            });
        } else {
            setEditingCert(null);
            form.reset({
                name: '',
                issuingOrganization: '',
                issueDate: '',
                credentialUrl: '',
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: CertificationFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingCert) {
                await api.put(`/api/certifications/${editingCert.id}`, data);
                toast.success('Certification updated successfully');
            } else {
                await api.post('/api/certifications', data);
                toast.success('Certification added successfully');
            }
            setIsDialogOpen(false);
            fetchCertifications();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to save certification');
            } else {
                toast.error('Failed to save certification');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!certToDelete) return;
        try {
            await api.delete(`/api/certifications/${certToDelete}`);
            toast.success('Certification deleted successfully');
            fetchCertifications();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to delete certification');
            } else {
                toast.error('Failed to delete certification');
            }
        } finally {
            setCertToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Certifications</h1>
                    <p className="text-muted-foreground mt-2">
                        Showcase your professional certificates and credentials.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Certification
                </Button>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : certifications.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No certifications added yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead>Certification</TableHead>
                                    <TableHead>Issuer</TableHead>
                                    <TableHead className="hidden sm:table-cell">Issue Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {certifications.map((cert) => (
                                    <TableRow key={cert.id} className="border-border/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Award className="h-4 w-4 text-primary" />
                                                {cert.name}
                                                {cert.credentialUrl && (
                                                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{cert.issuingOrganization}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                                            {cert.issueDate}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(cert)}>
                                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setCertToDelete(cert.id)}>
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
                        <DialogTitle>{editingCert ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
                        <DialogDescription>
                            Enter the details of your certification.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Certification Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. AWS Certified Solutions Architect" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="issuingOrganization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Issuing Organization</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Amazon Web Services" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Issue Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="credentialUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Credential URL (Optional)</FormLabel>
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
                                        'Save Certification'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={certToDelete !== null} onOpenChange={(open) => !open && setCertToDelete(null)}>
                <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this certification record.
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
