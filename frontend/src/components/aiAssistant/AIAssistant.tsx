import { useState } from "react";
import { AssistantAvatar } from "./AssistantAvatar";
import { ChatPanel } from "./ChatPanel";

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AssistantAvatar onClick={() => setIsOpen(true)} isOpen={isOpen} />
            <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
