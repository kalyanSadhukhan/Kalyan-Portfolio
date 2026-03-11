import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { MessageBubble, TypingIndicator, Message } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./assistant.css";

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SUGGESTIONS = [
    "Show Kalyan's projects",
    "What technologies does Kalyan use?",
    "Tell me about Kalyan's experience",
    "View GitHub work",
];

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm Kalyan's AI assistant. I can guide you through his projects, technical skills, and experience.",
        },
    ]);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);



    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {

            const response = await fetch("http://localhost:8081/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                }),
            });

            if (!response.ok) {
                throw new Error("API error");
            }

            // Parse JSON if backend returns it
            const textResponse = await response.text();
            let replyText = textResponse;
            try {
                const jsonObj = JSON.parse(textResponse);
                replyText = jsonObj.reply || jsonObj.response || jsonObj.message || jsonObj.content || textResponse;
            } catch (e) {
                // If it's not JSON, stick with plain text
            }

            const botMessage: Message = {
                role: "assistant",
                content: replyText,
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {

            const errorMessage: Message = {
                role: "assistant",
                content:
                    "⚠️ I'm having trouble connecting to the AI service right now. Please try again later.",
            };

            setMessages((prev) => [...prev, errorMessage]);

        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div
            className={`fixed bottom-6 right-6 z-50 w-[360px] h-[500px] flex flex-col rounded-2xl chat-panel-glass shadow-2xl transition-all duration-300 origin-bottom-right ${
                isOpen
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-0 pointer-events-none"
            }`}
        >
            {/* Header */}

            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/60 backdrop-blur-md rounded-t-2xl">
                <div className="flex items-center gap-3">

                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>

                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-[15px] leading-none text-foreground">
                            Kalyan's AI Assistant
                        </h3>

                        <p className="text-[11px] text-muted-foreground mt-1 tracking-wide">
                            Ask me about Kalyan's work
                        </p>
                    </div>

                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>



            {/* Messages */}

            <ScrollArea className="flex-1 p-4 w-full">
                <div className="flex flex-col gap-1 pb-4">

                    {messages.map((msg, i) => (
                        <MessageBubble key={i} message={msg} />
                    ))}

                    {messages.length === 1 && (
                        <div
                            className="flex flex-col gap-2 mt-4 message-bubble-enter"
                            style={{ animationDelay: "0.2s" }}
                        >
                            {SUGGESTIONS.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(suggestion)}
                                    className="text-xs text-left px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/15 text-primary transition-all duration-200 hover:-translate-y-0.5 w-[fit-content] shadow-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && <TypingIndicator />}

                    <div ref={scrollRef} className="h-1" />

                </div>
            </ScrollArea>



            {/* Input */}

            <div className="p-3 border-t border-border/50 bg-card/40 backdrop-blur-md rounded-b-2xl">

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend(inputValue);
                    }}
                    className="flex items-center gap-2"
                >

                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about Kalyan's projects..."
                        className="flex-1 bg-background/50 border-border/50 focus-visible:ring-primary/50 text-sm rounded-xl h-11 px-4 placeholder:text-muted-foreground/70"
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputValue.trim() || isLoading}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-lg glow-primary h-11 w-11 transition-all duration-200"
                    >
                        <Send className="w-5 h-5" />
                    </Button>

                </form>

            </div>
        </div>
    );
}