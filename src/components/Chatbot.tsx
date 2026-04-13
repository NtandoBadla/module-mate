import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { getResponse, quickSuggestions, moduleData } from "@/lib/chatbot-data";

interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
}

const STORAGE_KEY = "module-assistant-history";

function loadHistory(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: Message = { id: crypto.randomUUID(), content: trimmed, role: "user" };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const botResponse = getResponse(trimmed);
        const botMsg: Message = { id: crypto.randomUUID(), content: botResponse, role: "bot" };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 800 + Math.random() * 600);
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const showWelcome = messages.length === 0 && !isTyping;

  return (
    <div className="flex h-screen flex-col bg-background font-[var(--font-body)]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-lg font-semibold text-foreground leading-tight">
              Module chatbot
            </h1>
            <p className="text-xs text-muted-foreground">{moduleData.code} · {moduleData.name}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {showWelcome && (
            <div className="flex flex-col items-center py-12 text-center animate-in fade-in duration-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-foreground">
                Welcome to your Module Guide
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                I can help you with tests, assignments, chapters, study tips, and more for <strong>{moduleData.code}</strong>. Pick a topic below or type your question!
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.message)}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm transition-all hover:border-primary hover:bg-accent hover:shadow-md active:scale-95"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} content={msg.content} role={msg.role} />
          ))}

          {isTyping && <ChatMessage content="" role="bot" isTyping />}
        </div>
      </div>

      {/* Quick suggestions (when chat active) */}
      {messages.length > 0 && !isTyping && (
        <div className="border-t border-border bg-card/50 px-4 py-2">
          <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto no-scrollbar">
            {quickSuggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.message)}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3 sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tests, assignments, study tips..."
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-10 w-10 shrink-0 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
