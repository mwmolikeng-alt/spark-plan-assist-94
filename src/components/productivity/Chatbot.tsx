import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureCard } from "./FeatureCard";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string; ts: number };

const STORAGE_KEY = "workly-chat";

const tips = [
  "Try the Pomodoro technique — 25 minutes of focus, then a 5-minute break. Repeat four times, then take a longer rest.",
  "Block your calendar for deep work in the first 90 minutes of your day, before email or Slack.",
  "Use the 2-minute rule: if a task takes under two minutes, do it immediately instead of adding it to your list.",
  "Time-block your week on Sunday or Monday morning — decide when work happens, not just what.",
  "Batch similar tasks together (emails, calls, admin) to reduce costly context-switching.",
];

function reply(input: string): string {
  const lower = input.toLowerCase().trim();
  if (/^(hello|hi|hey|yo|hiya|good (morning|afternoon|evening))\b/.test(lower)) {
    return "Hello! I'm your AI workmate. Need help with emails, tasks, or research?";
  }
  if (/email/.test(lower)) return "Try our Email Generator in the sidebar! It can draft formal, informal, or persuasive emails for any audience.";
  if (/(task|plan|todo|to do|schedule)/.test(lower)) return "Use the Task Planner to organize your day! Just list your tasks and I'll sort them by urgency.";
  if (/(focus|distract|deep work|pomodoro|time block|2.minute)/.test(lower)) {
    const techniques = [
      "Try the Pomodoro technique — 25 min focus, 5 min break, repeat 4× then take a long rest.",
      "Time-block tomorrow tonight. Decide when work happens, not just what.",
      "Run a 90-minute deep work block before opening messages.",
      "Use the 2-minute rule: if it takes under 2 minutes, do it now.",
    ];
    return techniques[Math.floor(Math.random() * techniques.length)];
  }
  if (/(productivity|tip)/.test(lower)) {
    return tips[Math.floor(Math.random() * tips.length)];
  }
  if (/(meeting|notes|summary|summarize)/.test(lower)) return "Paste your meeting notes into the Notes Summarizer to get key points, decisions, and action items in seconds.";
  if (/(research|topic|learn about)/.test(lower)) return "Head to the Research Assistant — type any topic and you'll get a summary, key insights, and recommendations.";
  const followups = [
    "Interesting — can you give me a bit more context?",
    "Tell me more. Are you trying to plan something, write something, or learn something?",
    "Got it. What outcome would success look like here?",
  ];
  return followups[Math.floor(Math.random() * followups.length)];
}

const INITIAL: Msg[] = [
  { role: "assistant", content: "Hi! I'm your AI workmate. Ask me about emails, tasks, focus, or anything productivity-related.", ts: Date.now() },
];

export function Chatbot({ onBack }: { onBack?: () => void }) {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    const text = input.trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { role: "user", content: text, ts: Date.now() }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply(text), ts: Date.now() }]);
      setThinking(false);
    }, 700 + Math.random() * 400);
  };

  const clear = () => {
    setMessages(INITIAL);
    toast.success("Chat cleared");
  };

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <FeatureCard title="AI Chatbot" description="Your always-on workplace productivity coach." onBack={onBack}>
      <div className="border border-border rounded-lg bg-muted/30 h-[480px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                m.role === "user" ? "bg-gradient-brand text-white" : "bg-accent text-accent-foreground",
              )}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn("max-w-[80%] flex flex-col gap-1", m.role === "user" && "items-end")}>
                <div className={cn(
                  "rounded-2xl px-3.5 py-2 text-sm animate-fade-in",
                  m.role === "user"
                    ? "bg-gradient-brand text-white rounded-tr-sm"
                    : "bg-card border border-border text-foreground rounded-tl-sm",
                )}>
                  {m.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1 tabular-nums">{fmtTime(m.ts)}</span>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl px-3.5 py-2.5 text-sm bg-card border border-border">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="border-t border-border p-3 flex gap-2 bg-card rounded-b-lg">
          <Input
            placeholder="Ask me anything about productivity..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button onClick={send} disabled={!input.trim() || thinking}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={clear} className="w-fit">
        <Trash2 className="h-4 w-4 mr-2" /> Clear Chat
      </Button>
    </FeatureCard>
  );
}