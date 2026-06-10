import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureCard } from "./FeatureCard";
import { Loader2, Mail } from "lucide-react";

type Tone = "Formal" | "Informal" | "Persuasive";
type Audience = "Client" | "Manager" | "Team";

const greetings: Record<Audience, string> = {
  Client: "Dear Valued Client,",
  Manager: "Hi {name},",
  Team: "Hi team,",
};

const openers: Record<Tone, string> = {
  Formal: "I hope this message finds you well.",
  Informal: "Hope you're having a great week!",
  Persuasive: "I wanted to reach out about an opportunity I believe will be valuable to you.",
};

const closers: Record<Tone, string> = {
  Formal: "Please let me know if you have any questions or require further information.\n\nKind regards,\n[Your Name]",
  Informal: "Let me know what you think — happy to chat anytime.\n\nThanks,\n[Your Name]",
  Persuasive: "I'd love to discuss this further at your earliest convenience. I'm confident this is the right next step.\n\nBest regards,\n[Your Name]",
};

function generate(topic: string, tone: Tone, audience: Audience) {
  const subject = `Subject: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
  const body = `${openers[tone]} I'm writing regarding ${topic.trim() || "the matter below"}.\n\nBased on recent context, I'd like to share a quick update and outline the next steps so we can align efficiently. I've considered the priorities relevant to ${audience.toLowerCase()}s and structured this accordingly.\n\nKey points:\n• Status: on track and progressing as planned\n• Next step: confirm timing and ownership\n• Ask: a brief review and your go-ahead`;
  return `${subject}\n\n${greetings[audience]}\n\n${body}\n\n${closers[tone]}`;
}

export function EmailGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [audience, setAudience] = useState<Audience>("Client");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setOutput(generate(topic, tone, audience));
      setLoading(false);
    }, 600);
  };

  return (
    <FeatureCard title="Smart Email Generator" description="Draft polished emails in seconds.">
      <div className="space-y-2">
        <Label htmlFor="email-topic">What is this email about?</Label>
        <Input
          id="email-topic"
          placeholder="e.g. Project update for Q3 launch"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={onGenerate} disabled={loading || !topic.trim()}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
        Generate Email
      </Button>

      {output && (
        <div className="space-y-2">
          <Label htmlFor="email-output">Generated Email</Label>
          <Textarea id="email-output" readOnly value={output} className="min-h-[280px] font-mono text-sm" />
        </div>
      )}
    </FeatureCard>
  );
}