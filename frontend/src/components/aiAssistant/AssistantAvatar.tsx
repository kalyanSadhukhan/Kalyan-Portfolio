import { Bot, Sparkles } from "lucide-react";
import "./assistant.css";

interface AssistantAvatarProps {
    onClick: () => void;
    isOpen: boolean;
}

export function AssistantAvatar({ onClick, isOpen }: AssistantAvatarProps) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'}`}>
            <div className="relative group ai-avatar-container">
                {/* Tooltip */}
                <div className="absolute -top-14 right-0 w-max px-4 py-2 bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-sm font-medium text-foreground">
                        Hi! I'm <span className="gradient-text font-bold">Kalyan</span>'s AI Assistant
                    </span>
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card/90 border-b border-r border-border transform rotate-45"></div>
                </div>

                {/* Avatar Button */}
                <button
                    onClick={onClick}
                    className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-[0_0_30px_hsl(180_80%_60%_/_0.4)] transition-all duration-300 hover:-translate-y-1"
                >
                    <Bot className="w-7 h-7" />
                    <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                </button>
            </div>
        </div>
    );
}
