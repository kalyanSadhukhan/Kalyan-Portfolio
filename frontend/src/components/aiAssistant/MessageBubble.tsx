import { Bot, User } from "lucide-react";
import "./assistant.css";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex w-full message-bubble-enter ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}>
                {/* Avatar */}
                <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full ${isUser ? "bg-muted" : "bg-gradient-to-br from-primary to-accent"} text-foreground`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
                </div>

                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-sm ${isUser
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm"
                    }`}>
                    {message.content}
                </div>
            </div>
        </div>
    );
}

export function TypingIndicator() {
    return (
        <div className="flex w-full justify-start mb-4 message-bubble-enter">
            <div className="flex flex-row items-center gap-2">
                <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-tl-sm flex gap-1 items-center justify-center h-[44px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 typing-dot"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 typing-dot mx-1"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 typing-dot"></div>
                </div>
            </div>
        </div>
    );
}
