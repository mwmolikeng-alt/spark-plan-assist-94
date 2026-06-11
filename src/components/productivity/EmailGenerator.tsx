import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureCard } from "./FeatureCard";
import { Loader2, Mail, Copy, Check, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

type Tone = "Formal" | "Informal" | "Persuasive" | "Friendly" | "Executive";
type Audience = "Client" | "Manager" | "Team" | "Stakeholder";

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const greetings: Record<Audience, string[]> = {
  Client: ["Dear Client,", "Dear Client,", "Hello,"],
  Manager: ["Hi [Manager],", "Hello [Manager],", "Hi [Manager], hope your week is going well."],
  Team: ["Hi team,", "Hey team,", "Hi all,"],
  Stakeholder: ["Dear Stakeholder,", "Hello,", "Dear all,"],
};

const signoffs: Record<Tone, string[]> = {
  Formal: ["Best regards,", "Kind regards,", "Sincerely,"],
  Informal: ["Cheers,", "Thanks,", "Talk soon,"],
  Persuasive: ["Best regards,", "Looking forward,", "Thanks in advance,"],
  Friendly: ["Warm regards,", "All the best,", "Thanks so much,"],
  Executive: ["Best,", "Regards,", "Thank you,"],
};

// Detect topic intent for more relevant bodies
function detectIntent(topic: string) {
  const t = topic.toLowerCase();
  if (/(deadline|extension|more time|postpone|delay)/.test(t)) return "extension";
  if (/(meeting|call|sync|catch ?up|schedule)/.test(t)) return "meeting";
  if (/(update|status|progress|report)/.test(t)) return "update";
  if (/(proposal|pitch|offer|recommend|suggest|approve|approval|budget)/.test(t)) return "proposal";
  if (/(feedback|review|thoughts)/.test(t)) return "feedback";
  if (/(thank|thanks|appreciat)/.test(t)) return "thanks";
  if (/(apolog|sorry|issue|problem|delay)/.test(t)) return "apology";
  return "general";
}

function futureDateISO(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function subjectFor(intent: string, topic: string, tone: Tone) {
  const clean = topic.trim().replace(/\.$/, "");
  const prefix = tone === "Persuasive" ? pick(["Proposal:", "Recommendation:", "Quick proposal —"]) : "";
  const map: Record<string, string[]> = {
    extension: ["Request: Deadline Extension", "Proposed Timeline Adjustment", "Request to Extend Project Deadline"],
    meeting: ["Meeting Request", "Quick Sync — Proposed Times", "Scheduling a Call"],
    update: ["Project Update", "Status Update", "Weekly Progress Update"],
    proposal: ["Proposal for Your Review", "Recommended Next Step", "For Your Approval"],
    feedback: ["Requesting Your Feedback", "Quick Review Request"],
    thanks: ["Thank You", "Appreciate Your Support"],
    apology: ["Apologies & Path Forward", "Update on Recent Issue"],
    general: [clean.charAt(0).toUpperCase() + clean.slice(1)],
  };
  const base = pick(map[intent] ?? map.general);
  return `Subject: ${prefix ? prefix + " " : ""}${base}`.replace(/\s+/g, " ").trim();
}

function bodyFor(intent: string, topic: string, tone: Tone, audience: Audience) {
  const t = topic.trim();
  const newDate = futureDateISO(7 + Math.floor(Math.random() * 8));

  // Formal + Client
  if (tone === "Formal" && audience === "Client") {
    if (intent === "extension") {
      return [
        `I hope this message finds you well. I am writing regarding ${t || "our current engagement"}.`,
        `After a careful review of the remaining scope, I would like to respectfully request a short extension to ensure the quality of the final deliverable meets the standard you expect from us. We are proposing a revised completion date of ${newDate}.`,
        `This additional time will allow our team to complete final QA, incorporate the latest requirements, and deliver a polished result. Please let me know if this revised timeline works on your end, or if you would prefer to discuss alternatives.`,
        `Thank you very much for your understanding.`,
      ].join("\n\n");
    }
    return [
      `I hope this message finds you well. I am reaching out regarding ${t || "our recent discussion"}.`,
      `${pick([
        "Following our last conversation, I wanted to share a brief update and confirm the next steps.",
        "I would like to provide a short summary of where we currently stand and outline how we intend to move forward.",
      ])}`,
      `Please do not hesitate to reach out should you have any questions or require further clarification.`,
    ].join("\n\n");
  }

  // Informal + Team
  if (tone === "Informal" && audience === "Team") {
    if (intent === "meeting") {
      return [
        `Quick one — looking to get everyone together to chat about ${t || "a few things"}.`,
        `How does ${newDate} sound? Should only take 30 minutes. Drop a 👍 in the thread if that works, or shout if you'd prefer another slot.`,
        `Bring any blockers or ideas you want to talk through.`,
      ].join("\n\n");
    }
    if (intent === "update") {
      return [
        `Wanted to send a quick update on ${t || "where things are at"}.`,
        `Things are moving along nicely — a couple of items still in flight, but nothing blocking. I'll share more detail in our next stand-up.`,
        `Shout if you have questions in the meantime!`,
      ].join("\n\n");
    }
    return [
      `Hope you're all doing well! Just a quick note about ${t || "something on my mind"}.`,
      `${pick([
        "Wanted to flag this early so we're all on the same page. Nothing urgent — just keep it in mind for the week ahead.",
        "Sharing this so everyone's looped in. Happy to jump on a quick call if anyone wants to chat through it.",
      ])}`,
    ].join("\n\n");
  }

  // Persuasive + Manager
  if (tone === "Persuasive" && audience === "Manager") {
    return [
      `I wanted to share a quick thought on ${t || "an opportunity I've been considering"}.`,
      `${pick([
        `I recommend we move forward with this — it directly addresses a gap we've been seeing and will help us hit our targets faster.`,
        `Based on the data so far, I recommend we prioritize this. This will help us reduce friction for the team and unlock measurable gains in the next quarter.`,
        `I'd like to recommend we green-light this. The upside is meaningful, the downside is contained, and it positions us well for what's coming.`,
      ])}`,
      `Let's move forward with a short pilot — I can have a proposal ready by ${newDate}. Happy to walk you through the details whenever you have ten minutes.`,
    ].join("\n\n");
  }

  // Generic fallbacks for other combinations
  const opener = tone === "Formal"
    ? "I hope this message finds you well."
    : tone === "Informal"
    ? "Hope you're having a good week!"
    : "I wanted to share something I believe is worth your time.";

  const middle = tone === "Persuasive"
    ? `I recommend we explore ${t || "this opportunity"} together — this will help us move faster and align on what matters most.`
    : `I'm writing regarding ${t || "the topic below"}. ${pick([
        "Wanted to give you a heads up and outline what's next.",
        "Sharing a quick summary and the next steps so we stay aligned.",
      ])}`;

  return [opener, middle, tone === "Formal" ? "Please let me know your thoughts at your convenience." : "Let me know what you think!"].join("\n\n");
}

function generate(topic: string, tone: Tone, audience: Audience) {
  const intent = detectIntent(topic);
  const subject = subjectFor(intent, topic, tone);
  const greeting = pick(greetings[audience]);
  const body = bodyFor(intent, topic, tone, audience);
  const signoff = pick(signoffs[tone]);
  return `${subject}\n\n${greeting}\n\n${body}\n\n${signoff}\n[Your Name]`;
}

export function EmailGenerator({ onBack }: { onBack?: () => void }) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [audience, setAudience] = useState<Audience>("Client");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const onGenerate = () => {
    if (!topic.trim()) {
      setError("Please describe what the email is about");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setOutput(generate(topic, tone, audience));
      setLoading(false);
    }, 600);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Email copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workly-email-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Email downloaded");
  };

  return (
    <FeatureCard title="Smart Email Generator" description="Draft polished emails in seconds." onBack={onBack}>
      <div className="space-y-2">
        <Label htmlFor="email-topic">What is this email about?</Label>
        <Input
          id="email-topic"
          placeholder="Need deadline extension for project"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Informal">Informal</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Audience</Label>
          <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Team">Team</SelectItem>
              <SelectItem value="Stakeholder">Stakeholder</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={onGenerate} disabled={loading || !topic.trim()}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
        Generate Email
      </Button>

      {output && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-output" className="text-sm font-semibold">Generated Email</Label>
            <span className="text-xs text-muted-foreground tabular-nums">{output.length} characters · {output.split(/\s+/).length} words</span>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <Textarea id="email-output" readOnly value={output} className="min-h-[280px] font-mono text-sm bg-transparent border-0 focus-visible:ring-0 resize-none p-0" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={onGenerate} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
            </Button>
            <Button variant="outline" size="sm" onClick={download}>
              <Download className="h-4 w-4 mr-2" /> Download .txt
            </Button>
          </div>
        </div>
      )}
    </FeatureCard>
  );
}