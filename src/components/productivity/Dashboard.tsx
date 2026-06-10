import { Mail, FileText, ListTodo, Search, MessageSquare, Clock, Zap, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { FeatureKey } from "./ProductivityApp";

const stats = [
  { value: "8.5h", label: "Hours saved per week", icon: Clock },
  { value: "12x", label: "Faster response time", icon: Zap },
  { value: "100%", label: "Editable & private", icon: Lock },
];

const tools: { key: FeatureKey; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "email", title: "Smart Email Generator", desc: "Draft polished emails by tone & audience.", icon: Mail },
  { key: "notes", title: "Meeting Notes Summarizer", desc: "Turn raw notes into key points & actions.", icon: FileText },
  { key: "tasks", title: "AI Task Planner", desc: "Prioritize your day using urgency signals.", icon: ListTodo },
  { key: "research", title: "Research Assistant", desc: "Get instant briefs on any topic.", icon: Search },
];

export function Dashboard({ onNavigate }: { onNavigate: (k: FeatureKey) => void }) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <MessageSquare className="h-3 w-3" /> Workly AI by CAPACITI
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Your AI workplace assistant</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Write better emails, summarize meetings, plan your day, research any topic, and chat with a productivity coach — all in one place.
        </p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 text-foreground">Tools</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => onNavigate(t.key)}
                className="group text-left rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-foreground">{t.title}</h4>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}