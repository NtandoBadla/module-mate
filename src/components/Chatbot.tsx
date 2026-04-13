import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { DocumentUpload } from "@/components/DocumentUpload";
import { getResponse, quickSuggestions, moduleData } from "@/lib/chatbot-data";
import { askAI } from "@/lib/ai";
import { correctSpelling } from "@/lib/spellcheck";

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
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);
  const [spellSuggestion, setSpellSuggestion] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);
  useEffect(() => { saveHistory(messages); }, [messages]);

  // Check spelling as user types
  useEffect(() => {
    if (!input.trim()) { setSpellSuggestion(null); return; }
    const { corrected, hasChanges } = correctSpelling(input);
    setSpellSuggestion(hasChanges ? corrected : null);
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setSpellSuggestion(null);
      const userMsg: Message = { id: crypto.randomUUID(), content: trimmed, role: "user" };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        let botResponse: string;

        if (documentText) {
          const history = messages
            .slice(-10)
            .map((m) => ({
              role: m.role === "bot" ? "assistant" as const : "user" as const,
              text: m.content,
            }));
          botResponse = await askAI(trimmed, documentText, history);
        } else {
          await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
          botResponse = getResponse(trimmed);
        }

        const botMsg: Message = { id: crypto.randomUUID(), content: botResponse, role: "bot" };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errMsg: Message = {
          id: crypto.randomUUID(),
          content: "⚠️ Something went wrong reaching the AI.",
          role: "bot",
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, documentText, messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDocumentLoaded = (text: string, fileName: string) => {
    setDocumentText(text);
    setDocumentFileName(fileName);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDocumentClear = () => {
    setDocumentText(null);
    setDocumentFileName(null);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const showWelcome = messages.length === 0 && !isTyping;
  const isAIMode = !!documentText;

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
            <p className="text-xs text-muted-foreground">
              {isAIMode ? "AI mode · " + documentFileName : `${moduleData.code} · ${moduleData.name}`}
            </p>
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
                {isAIMode ? "Module guide loaded!" : "Welcome to your Module chatbot"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {isAIMode
                  ? "Ask me anything about your module guide. I'll answer based on the document you uploaded."
                  : `Upload your module guide PDF above for AI-powered answers, or use the quick topics below for ${moduleData.code}.`}
              </p>
              {!isAIMode && (
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
              )}
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} content={msg.content} role={msg.role} />
          ))}

          {isTyping && <ChatMessage content="" role="bot" isTyping />}
        </div>
      </div>

      {/* Quick suggestions (keyword mode only, when chat active) */}
      {!isAIMode && messages.length > 0 && !isTyping && (
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

      {/* Document Upload */}
      <div className="border-t border-border bg-card/30 pt-3">
        <DocumentUpload
          onDocumentLoaded={handleDocumentLoaded}
          onClear={handleDocumentClear}
          uploadedFileName={documentFileName}
        />
      </div>

      {/* Spell check suggestion */}
      {spellSuggestion && (
        <div className="border-t border-border bg-card/50 px-4 py-1.5 sm:px-6">
          <div className="mx-auto flex max-w-2xl items-center gap-2 text-xs text-muted-foreground">
            <span>Did you mean:</span>
            <button
              onClick={() => { setInput(spellSuggestion); setSpellSuggestion(null); inputRef.current?.focus(); }}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {spellSuggestion}
            </button>
            <button
              onClick={() => setSpellSuggestion(null)}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
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
            placeholder={isAIMode ? "Ask anything about your module guide..." : "Ask about tests, assignments, study tips..."}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            disabled={isTyping}
            spellCheck
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-10 w-10 shrink-0 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
