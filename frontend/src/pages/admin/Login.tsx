import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            // Temporary Mock Login for Testing
            if (data.username === 'admin' && data.password === 'admin123') {
                setTimeout(() => {
                    login('mock-jwt-token-12345');
                    toast.success('Logged in successfully (Mock)');
                    navigate('/admin');
                    setIsLoading(false); // Ensure isLoading is reset after mock login
                }, 800);
                return; // Exit onSubmit to prevent actual API call
            }

            // Keep backend fetch code for later use
            const response = await api.post('/admin/auth/login', data);

            if (response && response.token) {
                login(response.token);
                toast.success('Logged in successfully');
                navigate('/admin');
            } else {
                throw new Error('Invalid token received');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to login. Please check your credentials.');
            } else {
                toast.error('Failed to login. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md mx-auto glass-card border-white/10 shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-heading font-bold gradient-text text-center">
                        Admin Portal
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" className="bg-background/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
