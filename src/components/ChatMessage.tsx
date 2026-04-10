import { cn } from "@/lib/utils";
import { GraduationCap, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "bot";
  isTyping?: boolean;
}

function renderMarkdown(text: string) {
  // Simple markdown: bold, italic, line breaks
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
    return (
      <span key={i}>
        {i > 0 && <br />}
        <span dangerouslySetInnerHTML={{ __html: parts }} />
      </span>
    );
  });
}

export function ChatMessage({ content, role, isTyping }: ChatMessageProps) {
  const isBot = role === "bot";

  return (
    <div className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isBot
            ? "rounded-tl-sm bg-bot-bubble text-bot-bubble-foreground"
            : "rounded-tr-sm bg-user-bubble text-user-bubble-foreground"
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{renderMarkdown(content)}</div>
        )}
      </div>
      {!isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
