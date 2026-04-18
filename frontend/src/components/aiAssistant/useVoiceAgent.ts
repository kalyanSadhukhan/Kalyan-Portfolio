import { useState, useRef, useEffect, useCallback } from "react";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface UseVoiceAgentOptions {
  /** Called with the final transcript when the user finishes speaking */
  onTranscript: (text: string) => void;
}

interface UseVoiceAgentReturn {
  voiceState: VoiceState;
  isVoiceActive: boolean;
  isVoiceSupported: boolean;
  startConversation: () => void;
  stopConversation: () => void;
  /** Call this after receiving the bot reply to speak it aloud; restarts listening automatically */
  speakText: (text: string) => void;
  /** Transition from processing → speaking (or back to listening if no text) */
  setVoiceProcessing: () => void;
}

// Strip markdown-ish symbols before speaking (they sound bad when read aloud)
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/\*(.*?)\*/g, "$1")     // *italic*
    .replace(/`(.*?)`/g, "$1")       // `code`
    .replace(/#{1,6}\s/g, "")        // headings
    .replace(/[•\-]\s/g, "")         // bullet points
    .replace(/\n+/g, " ")            // newlines → space
    .trim();
}

export function useVoiceAgent({ onTranscript }: UseVoiceAgentOptions): UseVoiceAgentReturn {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  // Ref mirrors voiceState for use inside async callbacks (avoids stale closures)
  const isVoiceActiveRef = useRef(false);
  const voiceStateRef = useRef<VoiceState>("idle");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // ─── Browser support check ────────────────────────────────────────────────
  const isVoiceSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // ─── Voice selection (SpeechSynthesis) ───────────────────────────────────
  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "en-US" && v.localService) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0] ||
      null
    );
  }, []);

  useEffect(() => {
    if (!isVoiceSupported) return;
    // getVoices() may be empty on first call; listen for the change event
    selectedVoiceRef.current = pickVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      selectedVoiceRef.current = pickVoice();
    };
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isVoiceSupported, pickVoice]);

  // ─── Helpers to keep state + ref in sync ─────────────────────────────────
  const transitionTo = useCallback((next: VoiceState) => {
    voiceStateRef.current = next;
    setVoiceState(next);
  }, []);

  // ─── Clear any pending restart timer ─────────────────────────────────────
  const clearRestartTimer = () => {
    if (restartTimerRef.current !== null) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  // ─── Start listening (internal) ───────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!isVoiceActiveRef.current || !recognitionRef.current) return;
    clearRestartTimer();
    try {
      recognitionRef.current.start();
      transitionTo("listening");
    } catch {
      // recognition.start() throws if already started — ignore
    }
  }, [transitionTo]);

  // ─── speakText ────────────────────────────────────────────────────────────
  const speakText = useCallback(
    (text: string) => {
      if (!isVoiceActiveRef.current) return;
      window.speechSynthesis.cancel(); // cancel any leftover utterance

      const clean = stripMarkdown(text);
      if (!clean) {
        // Nothing to speak — restart listening immediately
        restartTimerRef.current = setTimeout(() => startListening(), 300);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      utterance.onstart = () => {
        if (isVoiceActiveRef.current) transitionTo("speaking");
      };

      // After bot finishes speaking → restart listening automatically
      utterance.onend = () => {
        if (isVoiceActiveRef.current) {
          clearRestartTimer();
          restartTimerRef.current = setTimeout(() => startListening(), 300);
        }
      };

      utterance.onerror = () => {
        if (isVoiceActiveRef.current) {
          clearRestartTimer();
          restartTimerRef.current = setTimeout(() => startListening(), 300);
        }
      };

      transitionTo("speaking");
      window.speechSynthesis.speak(utterance);
    },
    [transitionTo, startListening]
  );

  // ─── stopConversation ─────────────────────────────────────────────────────
  const stopConversation = useCallback(() => {
    isVoiceActiveRef.current = false;
    clearRestartTimer();
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // already stopped
      }
    }
    transitionTo("idle");
  }, [transitionTo]);

  // ─── setVoiceProcessing ───────────────────────────────────────────────────
  const setVoiceProcessing = useCallback(() => {
    if (isVoiceActiveRef.current) transitionTo("processing");
  }, [transitionTo]);

  // ─── startConversation ────────────────────────────────────────────────────
  const startConversation = useCallback(() => {
    if (!isVoiceSupported) return;

    // Build the SpeechRecognition instance fresh each session
    const SpeechRecognitionCtor =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec: SpeechRecognition = new SpeechRecognitionCtor();
    rec.lang = "en-US";
    rec.continuous = false;      // single-shot; we restart manually
    rec.interimResults = false;  // final results only

    // ── Interrupt: user speaks while bot is talking ────────────────────────
    rec.onstart = () => {
      // If synthesis is playing, cancel it so the user can take over
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };

    // ── Result: user finished speaking ────────────────────────────────────
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ")
        .trim();

      if (transcript && isVoiceActiveRef.current) {
        transitionTo("processing");
        onTranscript(transcript);
      }
    };

    // ── Error handling ─────────────────────────────────────────────────────
    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        // Mic denied — terminate the session
        stopConversation();
        return;
      }
      if (!isVoiceActiveRef.current) return;

      // For no-speech / aborted / network: silently restart listening
      if (
        event.error === "no-speech" ||
        event.error === "aborted" ||
        event.error === "network"
      ) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => startListening(), 300);
      }
    };

    // ── End: recognition stopped (silence / result / error) ──────────────
    rec.onend = () => {
      // Only auto-restart when we're in listening state
      // (processing/speaking manage their own restarts)
      if (
        isVoiceActiveRef.current &&
        voiceStateRef.current === "listening"
      ) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => startListening(), 300);
      }
    };

    recognitionRef.current = rec;
    isVoiceActiveRef.current = true;
    startListening();
  }, [isVoiceSupported, onTranscript, startListening, stopConversation, transitionTo]);

  // ─── Tab-hidden safety stop ───────────────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isVoiceActiveRef.current) stopConversation();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [stopConversation]);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isVoiceActiveRef.current = false;
      clearRestartTimer();
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, []);

  return {
    voiceState,
    isVoiceActive: voiceState !== "idle",
    isVoiceSupported,
    startConversation,
    stopConversation,
    speakText,
    setVoiceProcessing,
  };
}
