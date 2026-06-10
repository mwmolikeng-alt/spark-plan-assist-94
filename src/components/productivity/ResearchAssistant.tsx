import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeatureCard } from "./FeatureCard";
import { Loader2, Search } from "lucide-react";

type Research = { summary: string; insights: string[]; recommendations: string[] };

function research(topic: string): Research {
  const t = topic.trim();
  return {
    summary: `${t} is a multifaceted area shaping how modern teams operate. Recent developments point to faster adoption cycles and a stronger emphasis on measurable outcomes. Organizations leading in this space treat it as a strategic capability rather than a one-off project.`,
    insights: [
      `Demand for expertise in ${t} continues to grow across industries.`,
      "Early adopters report meaningful gains in productivity and decision quality.",
      "Tooling is maturing quickly, lowering the barrier to entry for smaller teams.",
      "Success depends as much on process and culture as on technology choices.",
    ],
    recommendations: [
      `Start with a focused pilot on ${t} tied to a clear business metric.`,
      "Invest in training so the whole team can contribute, not just specialists.",
      "Track outcomes monthly and iterate on what is actually working.",
      "Document learnings publicly inside the org to compound knowledge.",
    ],
  };
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}

export function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<Research | null>(null);
  const [loading, setLoading] = useState(false);

  const onResearch = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(research(topic));
      setLoading(false);
    }, 700);
  };

  return (
    <FeatureCard title="AI Research Assistant" description="Get a quick research brief on any topic.">
      <div className="space-y-2">
        <Label htmlFor="topic">Topic or article summary request</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Remote team productivity in 2025"
          onKeyDown={(e) => e.key === "Enter" && onResearch()}
        />
      </div>
      <Button onClick={onResearch} disabled={loading || !topic.trim()}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
        Research
      </Button>
      {result && (
        <div className="space-y-5 pt-2 border-t border-border">
          <div>
            <h3 className="text-sm font-semibold mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>
          <Section title="Key Insights" items={result.insights} />
          <Section title="Recommendations" items={result.recommendations} />
        </div>
      )}
    </FeatureCard>
  );
}