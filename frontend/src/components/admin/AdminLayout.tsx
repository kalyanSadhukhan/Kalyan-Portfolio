import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, ArrowLeft, Menu, User, Lightbulb, GraduationCap, Award, Heart, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'About', path: '/admin/about', icon: User },
        { name: 'Skills', path: '/admin/skills', icon: Lightbulb },
        { name: 'Education', path: '/admin/education', icon: GraduationCap },
        { name: 'Certifications', path: '/admin/certifications', icon: Award },
        { name: 'Hobbies', path: '/admin/hobbies', icon: Heart },
        { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
        { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
                <span className="font-heading font-bold gradient-text text-xl">Admin Portal</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 border-r bg-card p-4 space-y-4`}>
                <div className="hidden md:flex items-center mb-8 px-2">
                    <span className="font-heading font-bold gradient-text text-2xl">Admin Portal</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        // Fix absolute match for root dashboard path
                        const isStrictActive = item.path === '/admin' ? location.pathname === '/admin' : isActive;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isStrictActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-4 border-t space-y-2 mt-auto">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Site</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full bg-muted/20">
                <div className="max-w-6xl mx-auto h-full flex flex-col">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
