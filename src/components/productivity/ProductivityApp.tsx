import { useEffect, useState } from "react";
import {
  Mail, FileText, ListTodo, Search, MessageSquare, LayoutDashboard,
  Sparkles, BarChart3, Settings as SettingsIcon, Sun, Moon, Bell,
  Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmailGenerator } from "./EmailGenerator";
import { NotesSummarizer } from "./NotesSummarizer";
import { TaskPlanner } from "./TaskPlanner";
import { ResearchAssistant } from "./ResearchAssistant";
import { Chatbot } from "./Chatbot";
import { Dashboard } from "./Dashboard";
import { Analytics } from "./Analytics";
import { SettingsPage } from "./SettingsPage";
import { useTheme } from "./ThemeProvider";

export type FeatureKey =
  | "dashboard" | "email" | "notes" | "tasks" | "research" | "chat" | "analytics" | "settings";

const NAV: { key: FeatureKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "email", label: "Email Generator", icon: Mail },
  { key: "notes", label: "Notes Summarizer", icon: FileText },
  { key: "tasks", label: "Task Planner", icon: ListTodo },
  { key: "research", label: "Research Assistant", icon: Search },
  { key: "chat", label: "AI Chat", icon: MessageSquare },
  { key: "analytics", label: "Productivity Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function ProductivityApp() {
  const [active, setActive] = useState<FeatureKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const now = useNow();
  const goto = (k: FeatureKey) => {
    setActive(k);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
          mobileOpen ? "left-0 w-72" : "-left-72 w-72 lg:left-0",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <button onClick={() => goto("dashboard")} className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">Workly AI</div>
                <div className="text-[10px] text-muted-foreground -mt-0.5">by CAPACITI</div>
              </div>
            )}
          </button>
          <button
            className="lg:hidden p-1 rounded hover:bg-sidebar-accent"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {NAV.map((f) => {
            const Icon = f.icon;
            const isActive = active === f.key;
            return (
              <button
                key={f.key}
                onClick={() => goto(f.key)}
                title={f.label}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "lg:justify-center",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{f.label}</span>}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 border-b border-border glass">
          <div className="h-full px-4 sm:px-6 flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold truncate">
                Workly AI <span className="text-muted-foreground font-normal hidden sm:inline">by CAPACITI</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center text-xs text-muted-foreground tabular-nums px-3 py-1.5 rounded-lg bg-muted/50">
              {now ? now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "—"}
              <span className="mx-2 opacity-50">·</span>
              {now ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—"}
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-secondary" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Avatar className="h-8 w-8 ring-2 ring-primary/30">
              <AvatarFallback className="bg-gradient-brand text-white text-xs font-semibold">WA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto animate-fade-in">
          {active === "dashboard" && <Dashboard onNavigate={goto} />}
          {active === "email" && <EmailGenerator onBack={() => goto("dashboard")} />}
          {active === "notes" && <NotesSummarizer onBack={() => goto("dashboard")} />}
          {active === "tasks" && <TaskPlanner onBack={() => goto("dashboard")} />}
          {active === "research" && <ResearchAssistant onBack={() => goto("dashboard")} />}
          {active === "chat" && <Chatbot onBack={() => goto("dashboard")} />}
          {active === "analytics" && <Analytics onBack={() => goto("dashboard")} />}
          {active === "settings" && <SettingsPage onBack={() => goto("dashboard")} />}
        </main>

        <footer className="border-t border-border bg-card/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Powered by CAPACITI</span>
            <span className="mx-2 opacity-50">|</span>
            AI-generated content may contain inaccuracies. Please verify important information before use.
          </div>
        </footer>
      </div>
    </div>
  );
}