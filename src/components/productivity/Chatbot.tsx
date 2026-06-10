import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureCard } from "./FeatureCard";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const tips = [
  "Try the Pomodoro technique — 25 minutes of focus, then a 5-minute break. Repeat four times, then take a longer rest.",
  "Block your calendar for deep work in the first 90 minutes of your day, before email or Slack.",
  "Use the 2-minute rule: if a task takes under two minutes, do it immediately instead of adding it to your list.",
  "Time-block your week on Sunday or Monday morning — decide when work happens, not just what.",
  "Batch similar tasks together (emails, calls, admin) to reduce costly context-switching.",
];

function reply(input: string): string {
  const lower = input.toLowerCase().trim();
  if (/^(hello|hi|hey|yo|hiya)\b/.test(lower)) {
    return "Hello! I'm your AI workmate. Need help with emails, tasks, or research?";
  }
  if (/email/.test(lower)) return "Try our Email Generator in the sidebar! It can draft formal, informal, or persuasive emails for any audience.";
  if (/(task|plan|todo|to do|schedule)/.test(lower)) return "Use the Task Planner to organize your day! Just list your tasks and I'll sort them by urgency.";
  if (/(focus|productivity tip|tip|distract|deep work|pomodoro|time block)/.test(lower)) {
    return tips[Math.floor(Math.random() * tips.length)];
  }
  if (/(meeting|notes|summary|summarize)/.test(lower)) return "Paste your meeting notes into the Notes Summarizer to get key points, decisions, and action items in seconds.";
  if (/(research|topic|learn about)/.test(lower)) return "Head to the Research Assistant — type any topic and you'll get a summary, key insights, and recommendations.";
  return "That's a great question! Can you tell me more about what you need?";
}

const INITIAL: Msg[] = [
  { role: "assistant", content: "Hi! I'm your AI workmate. Ask me about emails, tasks, focus, or anything productivity-related." },
];

export function Chatbot({ onBack }: { onBack?: () => void }) {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    const text = input.trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply(text) }]);
      setThinking(false);
    }, 600);
  };

  const clear = () => setMessages(INITIAL);

  return (
    <FeatureCard title="AI Chatbot" description="Your always-on workplace productivity coach." onBack={onBack}>
      <div className="border border-border rounded-lg bg-muted/30 h-[480px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
              )}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground",
              )}>
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg px-3 py-2 text-sm bg-card border border-border text-muted-foreground">
                Thinking…
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