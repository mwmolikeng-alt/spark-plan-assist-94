import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureCard } from "./FeatureCard";
import { ListTodo, Loader2, AlertTriangle, Target, Lightbulb, Coffee, Clock } from "lucide-react";
import { toast } from "sonner";

type Plan = {
  urgent: string[];
  important: string[];
  low: string[];
  schedule: { time: string; activity: string }[];
  score: number;
  workload: string;
  tip: string;
};

const tips = [
  "Block 2 hours for urgent tasks in the morning when your focus is sharpest.",
  "Batch similar tasks together to reduce context switching.",
  "Time-box each task — short deadlines force focus.",
  "Protect a 2-hour deep work block before checking messages.",
  "End each day by picking tomorrow's top three.",
  "Use the Pomodoro technique: 25 minutes of focus, 5 minutes of rest.",
];

function planFor(input: string): Plan {
  const tasks = input.split("\n").map((t) => t.trim()).filter(Boolean);
  const urgent: string[] = [];
  const important: string[] = [];
  const low: string[] = [];
  const urgentRe = /(urgent|asap|today|now|deadline|due|critical|emergency|client)/i;
  const importantRe = /(plan|strategy|research|budget|report|review|roadmap)/i;
  const lowRe = /(later|someday|maybe|optional|nice to have|cleanup|tidy|sort)/i;
  for (const t of tasks) {
    const clean = t.replace(/^[-*•]\s*/, "");
    if (urgentRe.test(t)) urgent.push(clean);
    else if (lowRe.test(t)) low.push(clean);
    else if (importantRe.test(t)) important.push(clean);
    else important.push(clean);
  }

  const schedule = [
    { time: "09:00 – 11:00", activity: urgent[0] ? `Urgent: ${urgent[0]}` : "Deep work — top priority" },
    { time: "11:00 – 12:00", activity: "Meetings & async catch-up" },
    { time: "13:00 – 14:00", activity: "Lunch & recharge" },
    { time: "14:00 – 16:00", activity: important[0] ? `Important: ${important[0]}` : "Strategic work" },
    { time: "16:00 – 17:00", activity: low[0] ? `Low priority: ${low[0]}` : "Email & wrap-up" },
  ];

  const total = tasks.length;
  const score = Math.max(35, Math.min(98, 100 - urgent.length * 6 - Math.max(0, total - 7) * 4));
  const workload =
    total <= 3 ? "Light" : total <= 6 ? "Balanced" : total <= 9 ? "Heavy" : "Overloaded — consider deferring";

  return {
    urgent, important, low, schedule, score, workload,
    tip: tips[Math.floor(Math.random() * tips.length)],
  };
}

export function TaskPlanner({ onBack }: { onBack?: () => void }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onPlan = () => {
    if (!input.trim()) {
      setError("Please list at least one task");
      toast.error("Add at least one task");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setResult(planFor(input));
      setLoading(false);
    }, 500);
  };

  return (
    <FeatureCard title="AI Task Planner" description="Prioritize your day using the Eisenhower approach." onBack={onBack}>
      <div className="space-y-2">
        <Label htmlFor="tasks">List your tasks (one per line)</Label>
        <Textarea
          id="tasks"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Send Q3 report to client (urgent)\nReview design mockups\nPlan next sprint"}
          className="min-h-[180px]"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button onClick={onPlan} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ListTodo className="h-4 w-4 mr-2" />}
        Generate Daily Plan
      </Button>
      {result && (
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-4 bg-card">
              <div className="text-xs text-muted-foreground">Productivity Score</div>
              <div className="text-3xl font-bold mt-1 tabular-nums bg-gradient-brand bg-clip-text text-transparent">{result.score}</div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-brand transition-all duration-700" style={{ width: `${result.score}%` }} />
              </div>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <div className="text-xs text-muted-foreground">Estimated Workload</div>
              <div className="text-2xl font-bold mt-1">{result.workload}</div>
              <div className="text-xs text-muted-foreground mt-2">{result.urgent.length + result.important.length + result.low.length} tasks total</div>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <div className="text-xs text-muted-foreground">Focus Window</div>
              <div className="text-2xl font-bold mt-1">09:00 – 11:00</div>
              <div className="text-xs text-muted-foreground mt-2">Use this for your hardest task</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 mb-2 text-destructive font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" /> 🔴 Urgent & Important
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.urgent.length ? result.urgent.map((t, i) => <li key={i}>{t}</li>) : <li className="text-muted-foreground">None</li>}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                <Target className="h-4 w-4" /> 🟡 Important, Not Urgent
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.important.length ? result.important.map((t, i) => <li key={i}>{t}</li>) : <li className="text-muted-foreground">None</li>}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground font-semibold text-sm">
                <Coffee className="h-4 w-4" /> 🟢 Low Priority
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.low.length ? result.low.map((t, i) => <li key={i}>{t}</li>) : <li className="text-muted-foreground">None</li>}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
              <Clock className="h-4 w-4 text-primary" /> Suggested Schedule
            </div>
            <div className="space-y-2">
              {result.schedule.map((s, i) => (
                <div key={i} className="flex gap-3 items-center text-sm">
                  <div className="w-28 shrink-0 text-xs font-mono text-muted-foreground tabular-nums">{s.time}</div>
                  <div className="flex-1 truncate">{s.activity}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-accent text-accent-foreground p-4 flex gap-3 items-start">
            <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold">💡 Time Optimization Tip</div>
              <p className="text-sm">{result.tip}</p>
            </div>
          </div>
        </div>
      )}
    </FeatureCard>
  );
}