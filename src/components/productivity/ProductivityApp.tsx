import { useState } from "react";
import { Mail, FileText, ListTodo, Search, MessageSquare, LayoutDashboard, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailGenerator } from "./EmailGenerator";
import { NotesSummarizer } from "./NotesSummarizer";
import { TaskPlanner } from "./TaskPlanner";
import { ResearchAssistant } from "./ResearchAssistant";
import { Chatbot } from "./Chatbot";
import { Dashboard } from "./Dashboard";

export type FeatureKey = "dashboard" | "email" | "notes" | "tasks" | "research" | "chat";

const features: { key: FeatureKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "email", label: "Email Generator", icon: Mail },
  { key: "notes", label: "Notes Summarizer", icon: FileText },
  { key: "tasks", label: "Task Planner", icon: ListTodo },
  { key: "research", label: "Research", icon: Search },
  { key: "chat", label: "AI Chat", icon: MessageSquare },
];

export function ProductivityApp() {
  const [active, setActive] = useState<FeatureKey>("dashboard");
  const goto = (k: FeatureKey) => setActive(k);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">
              Workly AI <span className="text-muted-foreground font-normal">by CAPACITI</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Your AI workplace assistant</p>
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
                      ? "bg-primary text-primary-foreground shadow-sm"
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
          {active === "dashboard" && <Dashboard onNavigate={goto} />}
          {active === "email" && <EmailGenerator onBack={() => goto("dashboard")} />}
          {active === "notes" && <NotesSummarizer onBack={() => goto("dashboard")} />}
          {active === "tasks" && <TaskPlanner onBack={() => goto("dashboard")} />}
          {active === "research" && <ResearchAssistant onBack={() => goto("dashboard")} />}
          {active === "chat" && <Chatbot onBack={() => goto("dashboard")} />}
        </main>
      </div>

      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-muted-foreground">
          Powered by CAPACITI | AI-generated content. Please verify for accuracy.
        </div>
      </footer>
    </div>
  );
}