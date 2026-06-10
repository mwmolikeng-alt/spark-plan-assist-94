import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureCard } from "./FeatureCard";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const replies = [
  "Great question. A simple framework: identify your single most important outcome today, block 90 minutes for it, and silence notifications during that window.",
  "Try the 2-minute rule — if a task takes under two minutes, do it immediately. Otherwise schedule or delegate it.",
  "Burnout often comes from unclear priorities, not too much work. Write down your top 3 outcomes for the week and revisit them daily.",
  "Consider batching meetings into specific days to protect deep work blocks on the other days.",
  "Energy management matters more than time management. Schedule demanding work when you naturally feel sharpest.",
  "Reviewing your week on Friday for 15 minutes pays off massively. Note what worked, what didn't, and one experiment for next week.",
];

function reply(input: string): string {
  const lower = input.toLowerCase();
  if (/(hello|hi|hey)/.test(lower)) return "Hi! I'm your productivity coach. What are you working on today?";
  if (/(stress|overwhelm|burn)/.test(lower)) return replies[2];
  if (/(meeting)/.test(lower)) return replies[3];
  if (/(focus|distract)/.test(lower)) return replies[0];
  if (/(time|schedule)/.test(lower)) return replies[1];
  return replies[Math.floor(Math.random() * replies.length)];
}

export function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your AI productivity coach. Ask me anything about focus, planning, or workplace habits." },
  ]);
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
    }, 700);
  };

  return (
    <FeatureCard title="AI Chatbot" description="Your always-on workplace productivity coach.">
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
            placeholder="Ask your productivity coach…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button onClick={send} disabled={!input.trim() || thinking}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </FeatureCard>
  );
}