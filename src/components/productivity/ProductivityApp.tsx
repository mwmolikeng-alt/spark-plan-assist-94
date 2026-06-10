import { useState } from "react";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailGenerator } from "./EmailGenerator";
import { NotesSummarizer } from "./NotesSummarizer";
import { TaskPlanner } from "./TaskPlanner";
import { ResearchAssistant } from "./ResearchAssistant";
import { Chatbot } from "./Chatbot";

type FeatureKey = "email" | "notes" | "tasks" | "research" | "chat";

const features: { key: FeatureKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "email", label: "Email Generator", icon: Mail },
  { key: "notes", label: "Notes Summarizer", icon: FileText },
  { key: "tasks", label: "Task Planner", icon: ListTodo },
  { key: "research", label: "Research Assistant", icon: Search },
  { key: "chat", label: "AI Chatbot", icon: MessageSquare },
];

export function ProductivityApp() {
  const [active, setActive] = useState<FeatureKey>("email");

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">AI Productivity Assistant</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Your all-in-one workplace copilot</p>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-60 shrink-0">
          <div className="bg-card border border-border rounded-xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {features.map((f) => {
              const Icon = f.icon;
              const isActive = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 min-w-0">
          {active === "email" && <EmailGenerator />}
          {active === "notes" && <NotesSummarizer />}
          {active === "tasks" && <TaskPlanner />}
          {active === "research" && <ResearchAssistant />}
          {active === "chat" && <Chatbot />}
        </main>
      </div>

      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-muted-foreground">
          AI-generated content. Please verify for accuracy.
        </div>
      </footer>
    </div>
  );
}