import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, Mic, MicOff } from "lucide-react";
import { MessageBubble, TypingIndicator, Message } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceAgent } from "./useVoiceAgent";
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

// ── Voice status badge ─────────────────────────────────────────────────────
function VoiceStatusBadge({ state }: { state: "listening" | "processing" | "speaking" }) {
    if (state === "listening") {
        return (
            <span className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
                <span className="w-2 h-2 rounded-full bg-primary voice-listening-dot" />
                Listening…
            </span>
        );
    }
    if (state === "processing") {
        return (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-muted-foreground opacity-60 animate-pulse" />
                Processing…
            </span>
        );
    }
    // speaking
    return (
        <span className="flex items-center gap-1.5 text-[11px] text-accent font-medium">
            <span className="flex items-end gap-[2px] h-3">
                <span className="voice-speaking-bar w-[3px] h-full bg-accent rounded-sm" />
                <span className="voice-speaking-bar w-[3px] h-full bg-accent rounded-sm" />
                <span className="voice-speaking-bar w-[3px] h-full bg-accent rounded-sm" />
            </span>
            Speaking…
        </span>
    );
}

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
    const [micError, setMicError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    // ── Core send logic (shared by text input AND voice) ──────────────────
    const handleSend = useCallback(async (text: string, fromVoice = false) => {
        if (!text.trim()) return;

        const userMessage: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Tell the voice agent we're now in processing state
        if (fromVoice) setVoiceProcessing();

        let botReply = "⚠️ I'm having trouble connecting to the AI service right now. Please try again later.";

        try {
            const baseUrl = import.meta.env.VITE_API_URL || "";
            const response = await fetch(`${baseUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) throw new Error("API error");

            const textResponse = await response.text();
            try {
                const jsonObj = JSON.parse(textResponse);
                botReply = jsonObj.reply || jsonObj.response || jsonObj.message || jsonObj.content || textResponse;
            } catch {
                botReply = textResponse;
            }

        } catch {
            // botReply already set to error string above
        } finally {
            setIsLoading(false);
        }

        const botMessage: Message = { role: "assistant", content: botReply };
        setMessages((prev) => [...prev, botMessage]);

        // If in voice mode, speak the reply then restart listening (hook handles restart)
        if (fromVoice) {
            speakText(botReply);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Voice agent hook ───────────────────────────────────────────────────
    const {
        voiceState,
        isVoiceActive,
        isVoiceSupported,
        startConversation,
        stopConversation,
        speakText,
        setVoiceProcessing,
    } = useVoiceAgent({
        onTranscript: (transcript) => handleSend(transcript, true),
    });

    // Clear mic error when voice becomes active
    useEffect(() => {
        if (isVoiceActive) setMicError(null);
    }, [isVoiceActive]);

    // Handle mic-denied scenario: if voice stops unexpectedly right after starting
    // we detect it by watching voiceState transitions
    const handleStartConversation = () => {
        setMicError(null);
        startConversation();
    };

    // ── Form submit (text input) ──────────────────────────────────────────
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSend(inputValue, false);
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 w-[360px] flex flex-col rounded-2xl chat-panel-glass shadow-2xl transition-all duration-300 origin-bottom-right ${
                isOpen
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-0 pointer-events-none"
            }`}
            style={{ height: isVoiceSupported ? "548px" : "500px" }}
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
                    onClick={() => {
                        if (isVoiceActive) stopConversation();
                        onClose();
                    }}
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
                                    disabled={isVoiceActive || isLoading}
                                    className="text-xs text-left px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/15 text-primary transition-all duration-200 hover:-translate-y-0.5 w-[fit-content] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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



            {/* Input + Voice Controls */}

            <div className="p-3 border-t border-border/50 bg-card/40 backdrop-blur-md rounded-b-2xl space-y-2">

                {/* Text input row */}
                <form
                    onSubmit={handleFormSubmit}
                    className="flex items-center gap-2"
                >

                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isVoiceActive ? "Voice mode active…" : "Ask about Kalyan's projects..."}
                        className="flex-1 bg-background/50 border-border/50 focus-visible:ring-primary/50 text-sm rounded-xl h-11 px-4 placeholder:text-muted-foreground/70"
                        disabled={isLoading || isVoiceActive}
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputValue.trim() || isLoading || isVoiceActive}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-lg glow-primary h-11 w-11 transition-all duration-200"
                    >
                        <Send className="w-5 h-5" />
                    </Button>

                </form>

                {/* Voice controls row — only rendered if browser supports it */}
                {isVoiceSupported && (
                    <div className="flex items-center justify-between gap-2 px-1">

                        {/* State badge (hidden when idle) */}
                        <div className="min-w-[100px]">
                            {voiceState !== "idle" && (
                                <VoiceStatusBadge state={voiceState} />
                            )}
                        </div>

                        {/* Start / Stop button */}
                        {isVoiceActive ? (
                            <Button
                                id="voice-stop-btn"
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={stopConversation}
                                className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[12px] font-medium text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30 transition-all duration-200"
                            >
                                <MicOff className="w-3.5 h-3.5" />
                                Stop
                            </Button>
                        ) : (
                            <Button
                                id="voice-start-btn"
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleStartConversation}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[12px] font-medium text-primary hover:text-primary hover:bg-primary/10 border border-primary/30 transition-all duration-200 disabled:opacity-40"
                            >
                                <Mic className="w-3.5 h-3.5" />
                                Start Conversation
                            </Button>
                        )}

                    </div>
                )}

                {/* Mic permission error */}
                {micError && (
                    <p className="text-[11px] text-destructive px-1">{micError}</p>
                )}

            </div>
        </div>
    );
}