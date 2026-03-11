import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const aboutSchema = z.object({
    profileImageUrl: z.string().optional(),
    bio: z.string().min(1, 'Bio is required'),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AdminAboutPage() {
    const [aboutId, setAboutId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            profileImageUrl: '',
            bio: '',
        },
    });

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/about');
            // Backend returns a single About object
            if (data && data.id) {
                setAboutId(data.id);
                // Support old three-paragraph format and new single bio format
                const bio = data.bio ||
                    [data.bioParagraph1, data.bioParagraph2, data.bioParagraph3]
                        .filter(Boolean)
                        .join('\n\n');
                form.reset({
                    profileImageUrl: data.profileImageUrl || '',
                    bio,
                });
            }
        } catch (error) {
            console.error('Failed to load about section', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: AboutFormValues) => {
        setIsSubmitting(true);
        try {
            if (!aboutId) {
                const created = await api.post('/api/about', data);
                if (created?.id) setAboutId(created.id);
                toast.success('About section created successfully');
            } else {
                await api.put(`/api/about/${aboutId}`, data);
                toast.success('About section updated successfully');
            }
        } catch (error) {
            console.error('Failed to save about section', error);
            toast.error('Failed to save about section');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-heading font-bold tracking-tight">About Section</h1>
                <p className="text-muted-foreground mt-2">Edit the bio that appears on your portfolio.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="profileImageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image URL (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com/photo.jpg"
                                        className="bg-background/50 border-border"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write a single paragraph about yourself..."
                                        className="bg-background/50 border-border min-h-[200px] resize-y"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-muted-foreground">
                                    You can use line breaks to separate ideas. This is displayed as a single block on the main page.
                                </p>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}