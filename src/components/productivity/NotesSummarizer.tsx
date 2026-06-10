import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureCard } from "./FeatureCard";
import { FileText, Loader2 } from "lucide-react";

type Summary = { keyPoints: string[]; decisions: string[]; actions: string[] };

function summarize(notes: string): Summary {
  const lines = notes.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const keyPoints: string[] = [];
  const decisions: string[] = [];
  const actions: string[] = [];
  const deadlineRe = /(by\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|end of week|eow|eod|\w+ \d{1,2}))/i;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const clean = line.replace(/^[-*•]\s*/, "");
    if (/(decid|agreed|approved|chose|finalized)/.test(lower)) {
      decisions.push(clean);
    } else if (/(will|todo|action|assign|follow up|next step|need to|owner|@\w+)/.test(lower)) {
      const m = line.match(deadlineRe);
      actions.push(m ? `${clean} — deadline: ${m[1]}` : clean);
    } else {
      keyPoints.push(clean);
    }
  }

  if (!keyPoints.length) keyPoints.push("Team reviewed current progress and overall status.");
  if (!decisions.length) decisions.push("No formal decisions recorded.");
  if (!actions.length) actions.push("No explicit action items captured.");

  return { keyPoints: keyPoints.slice(0, 6), decisions: decisions.slice(0, 5), actions: actions.slice(0, 6) };
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}

export function NotesSummarizer() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  const onSummarize = () => {
    if (!notes.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(summarize(notes));
      setLoading(false);
    }, 600);
  };

  return (
    <FeatureCard title="Meeting Notes Summarizer" description="Turn raw meeting notes into structured takeaways.">
      <div className="space-y-2">
        <Label htmlFor="notes">Paste your meeting notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste notes here. One thought per line works best."
          className="min-h-[200px]"
        />
      </div>
      <Button onClick={onSummarize} disabled={loading || !notes.trim()}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
        Summarize Notes
      </Button>
      {result && (
        <div className="grid md:grid-cols-3 gap-5 pt-2 border-t border-border">
          <Section title="Key Points" items={result.keyPoints} />
          <Section title="Decisions Made" items={result.decisions} />
          <Section title="Action Items" items={result.actions} />
        </div>
      )}
    </FeatureCard>
  );
}