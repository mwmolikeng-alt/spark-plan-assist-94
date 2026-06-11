import { useEffect, useState } from "react";
import {
  Mail, FileText, ListTodo, Search, MessageSquare, Clock, Zap, Lock, ArrowRight,
  Sparkles, TrendingUp, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FeatureKey } from "./ProductivityApp";

const stats = [
  { value: 8.5, suffix: "h", label: "Hours saved weekly", icon: Clock, color: "from-teal-400 to-cyan-500" },
  { value: 12, suffix: "×", label: "Faster task completion", icon: Zap, color: "from-purple-400 to-pink-500" },
  { value: 100, suffix: "%", label: "Editable output", icon: Lock, color: "from-blue-400 to-indigo-500" },
  { value: 5, suffix: "", label: "Productivity tools", icon: TrendingUp, color: "from-amber-400 to-orange-500" },
];

const tools: { key: FeatureKey; title: string; desc: string; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { key: "email", title: "Generate Email", desc: "Draft polished emails by tone & audience.", icon: Mail, tint: "bg-teal-500/10 text-teal-500" },
  { key: "notes", title: "Summarize Notes", desc: "Turn raw notes into key points & actions.", icon: FileText, tint: "bg-purple-500/10 text-purple-500" },
  { key: "tasks", title: "Plan Tasks", desc: "Prioritize your day with the Eisenhower matrix.", icon: ListTodo, tint: "bg-amber-500/10 text-amber-500" },
  { key: "research", title: "Research Topic", desc: "Get instant briefs on any topic.", icon: Search, tint: "bg-blue-500/10 text-blue-500" },
];

const insights = [
  "Most productive professionals plan their day before 9 AM.",
  "Time blocking can increase productivity by up to 30%.",
  "Batching emails twice daily reduces context switching costs.",
  "A 90-minute uninterrupted block beats a full reactive day.",
  "Single-tasking is up to 40% faster than multitasking.",
  "Writing tomorrow's top 3 tonight cuts morning friction in half.",
];

function useCounter(target: number, duration = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function Stat({ value, suffix, label, icon: Icon }: typeof stats[number]) {
  const v = useCounter(value);
  const display = value % 1 === 0 ? Math.round(v).toString() : v.toFixed(1);
  return (
    <Card className="shadow-sm hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
            <Icon className="h-5 w-5" />
          </div>
          <Sparkles className="h-4 w-4 text-muted-foreground/50" />
        </div>
        <div className="text-3xl font-bold tabular-nums">
          {display}<span className="text-primary">{suffix}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

export function Dashboard({ onNavigate }: { onNavigate: (k: FeatureKey) => void }) {
  const [insightIdx, setInsightIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setInsightIdx((i) => (i + 1) % insights.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-8 sm:p-12 shadow-sm">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/60 backdrop-blur border border-border text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3 text-primary" /> Workly AI by CAPACITI
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent max-w-3xl">
            Your AI Workplace Assistant
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
            Automate communication, organize tasks, accelerate research, and improve workplace productivity with intelligent tools.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => onNavigate("email")} className="bg-gradient-brand text-white hover:opacity-90 shadow-glow">
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("analytics")}>
              Explore Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <Stat key={s.label} {...s} />)}
      </section>

      {/* Quick actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Jump into a tool</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => onNavigate(t.key)}
                className="group text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`h-11 w-11 rounded-xl ${t.tint} grid place-items-center mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold">{t.title}</h4>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Insight widget */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shrink-0 shadow-glow">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Productivity insight</div>
            <p key={insightIdx} className="mt-1 text-base font-medium animate-fade-in">{insights[insightIdx]}</p>
            <div className="mt-3 flex gap-1">
              {insights.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all ${i === insightIdx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`} />
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("chat")} className="hidden sm:inline-flex">
            <MessageSquare className="h-4 w-4 mr-1" /> Ask AI
          </Button>
        </div>
      </section>
    </div>
  );
}