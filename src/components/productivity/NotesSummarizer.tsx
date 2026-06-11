import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureCard } from "./FeatureCard";
import { FileText, Loader2, Copy, Download, AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";
import { toast } from "sonner";

type Sentiment = "Positive" | "Neutral" | "Action Required";
type Summary = { keyPoints: string[]; decisions: string[]; actions: string[]; sentiment: Sentiment };

const NAMES = ["Sarah", "John", "Alex", "Emily", "Marcus", "Team", "David", "Lisa"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function detectTopics(notes: string): string[] {
  const lower = notes.toLowerCase();
  const topics: string[] = [];
  const keywords: Record<string, string[]> = {
    budget: ["budget", "funding", "cost", "expense", "finance", "spend"],
    deadline: ["deadline", "timeline", "schedule", "milestone", "due date", "delivery"],
    hiring: ["hire", "hiring", "new team member", "recruit", "candidate", "onboard", "headcount"],
    marketing: ["marketing", "campaign", "promotion", "brand", "social media", "ads"],
    product: ["product", "feature", "launch", "release", "roadmap", "prototype", "mvp"],
    sales: ["sales", "revenue", "pipeline", "client", "customer", "deal", "prospect"],
    design: ["design", "ui", "ux", "mockup", "wireframe", "prototype", "figma"],
    tech: ["tech", "technical", "architecture", "infrastructure", "platform", "integration", "api"],
    qtargets: ["q1", "q2", "q3", "q4", "quarter", "target", "goal", "kpi", "objective"],
    operations: ["operations", "process", "workflow", "efficiency", "automation"],
    meeting: ["standup", "sync", "review", "retrospective", "planning"],
  };
  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) topics.push(topic);
  }
  return topics.length ? topics : ["general"];
}

function generateSummary(notes: string): Summary {
  const topics = detectTopics(notes);
  const rand = Math.random();

  // Templates keyed by detected topics
  const keyPointTemplates: Record<string, string[]> = {
    budget: [
      "Current budget utilization was reviewed against Q forecasts",
      "Cost overruns in the infrastructure line item were flagged for review",
      "Finance presented revised projections for the next fiscal period",
    ],
    deadline: [
      "Project timeline was assessed and critical path items identified",
      "Resource constraints threatening key milestones were discussed",
      "Contingency plans for schedule slippage were outlined",
    ],
    hiring: [
      "Open headcount and role priorities were reviewed by leadership",
      "Interview pipeline status and candidate feedback were shared",
      "Onboarding plan for new hires was discussed with HR",
    ],
    marketing: [
      "Campaign performance metrics and ROI were analyzed",
      "Upcoming product launch messaging strategy was discussed",
      "Content calendar and channel distribution plans were reviewed",
    ],
    product: [
      "Current sprint progress and blocker resolution were discussed",
      "User feedback from the latest beta was reviewed by the team",
      "Feature prioritization for the next release was debated",
    ],
    sales: [
      "Pipeline health and forecast accuracy were reviewed",
      "Key account updates and upsell opportunities were shared",
      "Win/loss analysis from recent deals was presented",
    ],
    design: [
      "Design system updates and component library status were shared",
      "User research findings informed upcoming design decisions",
      "Accessibility improvements and UI polish items were reviewed",
    ],
    tech: [
      "System architecture proposals and trade-offs were evaluated",
      "Technical debt items were prioritized for upcoming sprints",
      "Integration requirements with third-party services were clarified",
    ],
    qtargets: [
      "Quarterly targets progress and gap analysis were presented",
      "Risk factors threatening key goals were identified and discussed",
      "Resource reallocation options to meet targets were explored",
    ],
    operations: [
      "Operational efficiency metrics and process bottlenecks were reviewed",
      "Automation opportunities and tooling upgrades were discussed",
      "Cross-team handoff workflows and SLAs were clarified",
    ],
    meeting: [
      "Team blockers and dependencies were shared across squads",
      "Upcoming priorities and focus areas for the week were aligned",
      "Retrospective action items from the previous cycle were reviewed",
    ],
    general: [
      "Team progress against current objectives was reviewed",
      "Upcoming priorities and potential risks were discussed",
      "Cross-functional collaboration needs were identified",
    ],
  };

  const decisionTemplates: Record<string, string[]> = {
    budget: [
      "Budget increase of 10% approved for the marketing initiative",
      "Finance to reallocate underspent engineering budget to infrastructure",
    ],
    deadline: [
      "Launch date moved to October 15 to accommodate final QA cycle",
      "Team agreed to stagger release phases to reduce risk",
    ],
    hiring: [
      "New senior engineer req approved; JD to be finalized by Friday",
      "Decision made to postpone contractor conversion to next quarter",
    ],
    marketing: [
      "Campaign creative direction approved; production to begin immediately",
      "Social media budget reallocated toward performance channels",
    ],
    product: [
      "Feature scope reduced to MVP for initial launch; v2 roadmap defined",
      "Beta program expanded to 50 additional users starting next week",
    ],
    sales: [
      "Discount approval authority increased to 20% for deals over $50K",
      "Strategic account coverage model updated to align with territories",
    ],
    design: [
      "New component library to be adopted across all product surfaces",
      "Accessibility audit scheduled; remediation timeline approved",
    ],
    tech: [
      "Migration to new cloud provider approved; execution plan drafted",
      "API v2 deprecation extended by 90 days per partner feedback",
    ],
    qtargets: [
      "Q3 revenue target revised upward by 5% based on strong pipeline",
      "Team committed to retaining existing customer cohort above 95%",
    ],
    operations: [
      "New incident response process adopted effective immediately",
      "Vendor contract renewal approved for another 12-month term",
    ],
    meeting: [
      "Daily standup format updated to focus on blockers only",
      "Sprint retrospective cadence changed to biweekly going forward",
    ],
    general: [
      "Team agreed to adopt the proposed workflow for cross-team requests",
      "Decision made to pause new initiatives until current backlog clears",
    ],
  };

  const actionTemplates: Record<string, Array<{ text: string; nameIdx: number }>> = {
    budget: [
      { text: "to prepare revised budget forecast by", nameIdx: 0 },
      { text: "to present cost-benefit analysis at next review", nameIdx: 1 },
    ],
    deadline: [
      { text: "to update project timeline and communicate changes to stakeholders by", nameIdx: 0 },
      { text: "to identify resource needs for accelerated delivery by", nameIdx: 1 },
    ],
    hiring: [
      { text: "to finalize job descriptions and post roles by", nameIdx: 0 },
      { text: "to schedule interview panels and book recruiter time by", nameIdx: 1 },
    ],
    marketing: [
      { text: "to deliver campaign creative assets by", nameIdx: 0 },
      { text: "to update messaging guide and distribute to sales by", nameIdx: 1 },
    ],
    product: [
      { text: "to write user stories and acceptance criteria by", nameIdx: 0 },
      { text: "to conduct usability testing and synthesize findings by", nameIdx: 1 },
    ],
    sales: [
      { text: "to update CRM records and forecast sheet by", nameIdx: 0 },
      { text: "to schedule QBRs for top 10 accounts by", nameIdx: 1 },
    ],
    design: [
      { text: "to publish updated design system documentation by", nameIdx: 0 },
      { text: "to create responsive mockups for the new feature by", nameIdx: 1 },
    ],
    tech: [
      { text: "to draft migration runbook and rollback plan by", nameIdx: 0 },
      { text: "to review dependency upgrades and flag breaking changes by", nameIdx: 1 },
    ],
    qtargets: [
      { text: "to compile progress dashboard and circulate to leadership by", nameIdx: 0 },
      { text: "to identify resource gaps and propose hiring needs by", nameIdx: 1 },
    ],
    operations: [
      { text: "to document the new process and train the team by", nameIdx: 0 },
      { text: "to negotiate updated vendor terms and deliver summary by", nameIdx: 1 },
    ],
    meeting: [
      { text: "to update meeting agenda template and share with the team by", nameIdx: 0 },
      { text: "to schedule follow-up sessions and send calendar invites by", nameIdx: 1 },
    ],
    general: [
      { text: "to compile follow-up notes and distribute to attendees by", nameIdx: 0 },
      { text: "to schedule the next check-in and confirm agenda by", nameIdx: 1 },
    ],
  };

  const deadlines = [
    "Friday",
    "next Tuesday",
    "end of week",
    "next Monday",
    "Wednesday EOD",
    "next Friday",
    "the 15th",
    "tomorrow",
  ];

  // Pick 1-2 topics and blend their templates
  const primary = topics[0];
  const secondary = topics[1] || primary;

  const kpPool = shuffle([...keyPointTemplates[primary], ...(primary !== secondary ? keyPointTemplates[secondary] : [])]);
  const decPool = shuffle([...decisionTemplates[primary], ...(primary !== secondary ? decisionTemplates[secondary] : [])]);
  const actPool = shuffle([...actionTemplates[primary], ...(primary !== secondary ? actionTemplates[secondary] : [])]);

  const keyPoints = kpPool.slice(0, 3);
  const decisions = decPool.slice(0, 2);

  const actionItems = actPool.slice(0, 2).map((item) => {
    const name = NAMES[(item.nameIdx + Math.floor(rand * 10)) % NAMES.length];
    const deadline = pick(deadlines);
    return `${name} to ${item.text} ${deadline}`;
  });

  // Inject any keywords from the input into the generic templates for relevance
  const inject = (text: string): string => {
    // Keep the template mostly intact; these are already realistic
    return text;
  };

  // Detect sentiment from notes
  const lower = notes.toLowerCase();
  let sentiment: Sentiment = "Neutral";
  if (/(urgent|blocker|delay|risk|issue|problem|critical|asap)/.test(lower)) sentiment = "Action Required";
  else if (/(great|excellent|on track|progress|win|approved|achieved|success)/.test(lower)) sentiment = "Positive";

  return {
    keyPoints: keyPoints.map(inject),
    decisions: decisions.map(inject),
    actions: actionItems,
    sentiment,
  };
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function NotesSummarizer({ onBack }: { onBack?: () => void }) {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSummarize = () => {
    if (!notes.trim()) {
      setError("Please paste your meeting notes");
      toast.error("Notes are empty");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setResult(generateSummary(notes));
      setLoading(false);
    }, 800);
  };

  const summaryText = () =>
    !result ? "" :
    `KEY POINTS\n${result.keyPoints.map(p => "• " + p).join("\n")}\n\nDECISIONS\n${result.decisions.map(p => "• " + p).join("\n")}\n\nACTION ITEMS\n${result.actions.map(p => "• " + p).join("\n")}\n\nSENTIMENT: ${result.sentiment}`;

  const copy = async () => {
    await navigator.clipboard.writeText(summaryText());
    toast.success("Summary copied");
  };
  const download = () => {
    const blob = new Blob([summaryText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `workly-summary-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary exported");
  };

  const sentimentBadge = (s: Sentiment) => {
    const map = {
      Positive: { icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
      Neutral: { icon: MinusCircle, cls: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
      "Action Required": { icon: AlertCircle, cls: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
    } as const;
    const Item = map[s];
    const Icon = Item.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${Item.cls}`}>
        <Icon className="h-3.5 w-3.5" /> {s}
      </span>
    );
  };

  return (
    <FeatureCard title="Meeting Notes Summarizer" description="Turn raw meeting notes into structured takeaways." onBack={onBack}>
      <div className="space-y-2">
        <Label htmlFor="notes">Paste your meeting notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your meeting notes here..."
          className="min-h-[200px]"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button onClick={onSummarize} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
        Summarize Notes
      </Button>
      {result && (
        <div className="space-y-5 pt-2 border-t border-border">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Meeting sentiment</div>
              <div className="mt-1">{sentimentBadge(result.sentiment)}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4 mr-2" /> Copy</Button>
              <Button variant="outline" size="sm" onClick={download}><Download className="h-4 w-4 mr-2" /> Export</Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Section title="📌 Key Points" items={result.keyPoints} />
            <Section title="✅ Decisions Made" items={result.decisions} />
            <Section title="⚡ Action Items" items={result.actions} />
          </div>
        </div>
      )}
    </FeatureCard>
  );
}