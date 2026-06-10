import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureCard } from "./FeatureCard";
import { ListTodo, Loader2, AlertTriangle, Target, Lightbulb } from "lucide-react";

type Plan = { urgent: string[]; important: string[]; tip: string };

const tips = [
  "Batch similar tasks together to reduce context switching.",
  "Tackle your highest-energy work in the first 90 minutes of the day.",
  "Time-box each task — short deadlines force focus.",
  "Protect a 2-hour deep work block before checking messages.",
  "End each day by picking tomorrow's top three.",
];

function planFor(input: string): Plan {
  const tasks = input.split("\n").map((t) => t.trim()).filter(Boolean);
  const urgent: string[] = [];
  const important: string[] = [];
  const urgentRe = /(urgent|asap|today|now|deadline|due|critical|emergency)/i;
  for (const t of tasks) {
    const clean = t.replace(/^[-*•]\s*/, "");
    if (urgentRe.test(t)) urgent.push(clean);
    else important.push(clean);
  }
  if (!urgent.length && important.length) urgent.push(important.shift() as string);
  return { urgent, important, tip: tips[Math.floor(Math.random() * tips.length)] };
}

export function TaskPlanner() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const onPlan = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(planFor(input));
      setLoading(false);
    }, 500);
  };

  return (
    <FeatureCard title="AI Task Planner" description="Prioritize your day using the Eisenhower approach.">
      <div className="space-y-2">
        <Label htmlFor="tasks">List your tasks (one per line)</Label>
        <Textarea
          id="tasks"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Send Q3 report to client (urgent)\nReview design mockups\nPlan next sprint"}
          className="min-h-[180px]"
        />
      </div>
      <Button onClick={onPlan} disabled={loading || !input.trim()}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ListTodo className="h-4 w-4 mr-2" />}
        Generate Daily Plan
      </Button>
      {result && (
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 mb-2 text-destructive font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" /> Urgent & Important
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.urgent.length ? result.urgent.map((t, i) => <li key={i}>{t}</li>) : <li className="text-muted-foreground">None</li>}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                <Target className="h-4 w-4" /> Important, Not Urgent
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {result.important.length ? result.important.map((t, i) => <li key={i}>{t}</li>) : <li className="text-muted-foreground">None</li>}
              </ul>
            </div>
          </div>
          <div className="rounded-lg bg-accent text-accent-foreground p-4 flex gap-3 items-start">
            <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold">Time Optimization Tip</div>
              <p className="text-sm">{result.tip}</p>
            </div>
          </div>
        </div>
      )}
    </FeatureCard>
  );
}