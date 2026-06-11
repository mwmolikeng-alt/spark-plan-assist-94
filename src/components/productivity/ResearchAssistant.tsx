import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeatureCard } from "./FeatureCard";
import { Loader2, Search, Copy, Bookmark } from "lucide-react";
import { toast } from "sonner";

type Research = { summary: string; insights: string[]; opportunities: string[]; recommendations: string[] };

const library: Record<string, Research> = {
  remote: {
    summary:
      "Remote work has shifted from emergency response to a deliberate operating model. Companies are designing async-first workflows, investing in collaboration tooling, and measuring outcomes over hours-in-seat.",
    insights: [
      "Hybrid setups now outperform both fully-remote and fully-in-office on retention.",
      "Async communication reduces meeting load by up to 40% when documented well.",
      "Top-performing remote teams over-invest in written context and clear ownership.",
    ],
    opportunities: [
      "Tap a global talent pool without relocation costs.",
      "Reduce real-estate footprint and reinvest in tooling.",
    ],
    recommendations: [
      "Adopt async-by-default communication with explicit response-time expectations.",
      "Hold two intentional in-person offsites per year for trust and strategy.",
    ],
  },
  blockchain: {
    summary:
      "Blockchain is moving past speculation into focused enterprise use cases like supply-chain provenance, cross-border payments, and tokenized assets. Layer-2 networks have made transactions fast and cheap enough for real workloads.",
    insights: [
      "Stablecoin settlement volume now rivals major card networks.",
      "Tokenized real-world assets crossed $10B+ in on-chain value.",
      "Regulation is converging in major markets, lowering enterprise risk.",
    ],
    opportunities: [
      "Cut settlement times for cross-border payments from days to minutes.",
      "Open new tokenized product lines for under-served markets.",
    ],
    recommendations: [
      "Start with a narrow pilot tied to a measurable cost or trust problem.",
      "Partner with a regulated custodian instead of self-managing keys.",
    ],
  },
  ai: {
    summary:
      "Generative AI has rapidly moved from novelty to core productivity infrastructure. Knowledge workers report measurable time savings on writing, summarization, coding, and research tasks.",
    insights: [
      "Teams using AI copilots ship 25–55% faster on routine work.",
      "Quality of output depends more on prompting and review process than on model choice.",
      "Governance and data privacy are now the #1 enterprise adoption blocker.",
    ],
    opportunities: [
      "Automate the long tail of repetitive knowledge work.",
      "Launch AI-augmented services with senior-level quality at junior-level cost.",
    ],
    recommendations: [
      "Roll out AI tools with clear acceptable-use policies and human review for client-facing work.",
      "Train teams on prompting, not just access — outcomes scale with skill.",
    ],
  },
  productivity: {
    summary:
      "Modern productivity is less about doing more and more about protecting attention. Time blocking, deep-work rituals, and reduced meeting load consistently outperform multitasking and reactive work.",
    insights: [
      "A 90-minute uninterrupted block produces more than a full reactive day.",
      "Single-tasking is up to 40% faster than context-switching equivalent work.",
      "Energy management beats time management for sustained output.",
    ],
    opportunities: [
      "Reclaim 5–10 hours per week by auditing meetings and async-ifying status updates.",
      "Compound output by protecting your peak energy window.",
    ],
    recommendations: [
      "Schedule one daily deep-work block before checking messages.",
      "Audit meetings monthly — cancel or shorten any without a clear decision owner.",
    ],
  },
  marketing: {
    summary:
      "Modern marketing favors compounding owned channels — content, SEO, community, email — over rented attention. AI is reshaping content production, but distinctiveness and trust remain the moat.",
    insights: [
      "Brands with a strong content engine pay 60% less per qualified lead over time.",
      "Short-form video remains the highest-reach format on most social platforms.",
      "Email lists outperform social audiences on conversion by 3–5x.",
    ],
    opportunities: [
      "Repurpose long-form into 10+ short pieces and 3x distribution.",
      "Stand up an email engine before adding another paid channel.",
    ],
    recommendations: [
      "Build one owned channel deeply before adding another.",
      "Invest in measurement — pick 2–3 metrics that map directly to revenue.",
    ],
  },
  cybersecurity: {
    summary:
      "Cybersecurity has shifted from perimeter defense to identity-centric, zero-trust architectures. Phishing, credential theft, and supply-chain attacks remain the leading entry points for breaches.",
    insights: [
      "Over 80% of breaches start with stolen credentials or social engineering.",
      "Zero-trust adoption is becoming a board-level conversation, not just IT.",
      "AI is being used by both defenders and attackers — speed of response matters most.",
    ],
    opportunities: [
      "Mature identity and access management to remove the highest-risk attack surface.",
      "Automate incident response with playbooks to cut mean time to contain.",
    ],
    recommendations: [
      "Enforce MFA everywhere, especially for admins and remote access.",
      "Run quarterly tabletop exercises so the team knows the playbook under pressure.",
    ],
  },
  leadership: {
    summary:
      "Modern leadership is shifting from command-and-control to clarity-and-context. Distributed teams need leaders who write well, decide quickly, and create the conditions for autonomous execution.",
    insights: [
      "Teams with high psychological safety ship more and recover from mistakes faster.",
      "Written decision logs reduce repeat debates and align distributed teams.",
      "1:1s focused on growth — not status — drive retention more than compensation alone.",
    ],
    opportunities: [
      "Build a decision-making operating system that scales as the team grows.",
      "Invest in middle managers — they own the day-to-day culture.",
    ],
    recommendations: [
      "Default to written context for any cross-team decision.",
      "Run weekly 30-minute 1:1s focused on goals, blockers, and growth.",
    ],
  },
};

function detectKey(topic: string): keyof typeof library | null {
  const t = topic.toLowerCase();
  if (/(remote|hybrid|wfh|work from home)/.test(t)) return "remote";
  if (/(blockchain|crypto|web3|bitcoin|ethereum)/.test(t)) return "blockchain";
  if (/( ai |\bai\b|artificial intelligence|machine learning|llm|gpt)/.test(t)) return "ai";
  if (/(productiv|focus|deep work|time management)/.test(t)) return "productivity";
  if (/(marketing|brand|seo|content|social media)/.test(t)) return "marketing";
  if (/(security|cyber|phishing|breach|zero trust|infosec)/.test(t)) return "cybersecurity";
  if (/(leader|management|manager|culture|team building)/.test(t)) return "leadership";
  return null;
}

function research(topic: string): Research {
  const key = detectKey(topic);
  if (key) return library[key];
  const t = topic.trim();
  return {
    summary: `${t} is an evolving area attracting growing attention across industries. Adoption is uneven but accelerating, and the organizations leading in this space treat it as a strategic capability rather than a one-off project.`,
    insights: [
      `Demand and investment in ${t} have grown steadily over the past two years.`,
      `Early adopters report measurable productivity and decision-quality gains.`,
      `Best practices around ${t} are still emerging, rewarding teams who experiment early.`,
    ],
    opportunities: [
      `Move early on ${t} to build internal expertise before competitors.`,
      `Use ${t} to unlock workflows that were previously too slow or costly.`,
    ],
    recommendations: [
      `Run a focused 30-day pilot on ${t} tied to one measurable business outcome.`,
      `Document what works and share learnings internally to compound knowledge.`,
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

export function ResearchAssistant({ onBack }: { onBack?: () => void }) {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<Research | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onResearch = () => {
    if (!topic.trim()) {
      setError("Please enter a topic to research");
      toast.error("Enter a topic to research");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setResult(research(topic));
      setLoading(false);
    }, 700);
  };

  const copyResults = async () => {
    if (!result) return;
    const text =
      `RESEARCH: ${topic}\n\nSUMMARY\n${result.summary}\n\nINSIGHTS\n${result.insights.map(i => "• " + i).join("\n")}\n\nOPPORTUNITIES\n${result.opportunities.map(i => "• " + i).join("\n")}\n\nRECOMMENDATIONS\n${result.recommendations.map(i => "• " + i).join("\n")}`;
    await navigator.clipboard.writeText(text);
    toast.success("Research copied");
  };
  const saveResults = () => {
    if (!result) return;
    try {
      const stored = JSON.parse(localStorage.getItem("workly-research") || "[]");
      stored.unshift({ topic, savedAt: new Date().toISOString(), ...result });
      localStorage.setItem("workly-research", JSON.stringify(stored.slice(0, 20)));
      toast.success("Research saved");
    } catch {
      toast.error("Could not save research");
    }
  };

  return (
    <FeatureCard title="AI Research Assistant" description="Get a quick research brief on any topic." onBack={onBack}>
      <div className="space-y-2">
        <Label htmlFor="topic">Enter a topic to research</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Remote work trends, blockchain technology, AI productivity…"
          onKeyDown={(e) => e.key === "Enter" && onResearch()}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button onClick={onResearch} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
        Research
      </Button>
      {result && (
        <div className="space-y-5 pt-2 border-t border-border">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={copyResults}><Copy className="h-4 w-4 mr-2" /> Copy</Button>
            <Button variant="outline" size="sm" onClick={saveResults}><Bookmark className="h-4 w-4 mr-2" /> Save</Button>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">📖 Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>
          <Section title="💡 Key Insights" items={result.insights} />
          <Section title="🚀 Opportunities" items={result.opportunities} />
          <Section title="🎯 Recommendations" items={result.recommendations} />
        </div>
      )}
    </FeatureCard>
  );
}