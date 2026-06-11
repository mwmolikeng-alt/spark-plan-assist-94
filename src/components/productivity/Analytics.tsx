import { FeatureCard } from "./FeatureCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { Mail, FileText, Search, ListTodo } from "lucide-react";

const tasksData = [
  { day: "Mon", tasks: 8 }, { day: "Tue", tasks: 12 }, { day: "Wed", tasks: 9 },
  { day: "Thu", tasks: 14 }, { day: "Fri", tasks: 11 }, { day: "Sat", tasks: 4 }, { day: "Sun", tasks: 2 },
];
const researchData = [
  { day: "Mon", sessions: 2 }, { day: "Tue", sessions: 3 }, { day: "Wed", sessions: 5 },
  { day: "Thu", sessions: 4 }, { day: "Fri", sessions: 6 }, { day: "Sat", sessions: 1 }, { day: "Sun", sessions: 1 },
];
const ringData = [{ name: "Score", value: 87, fill: "var(--color-primary)" }];

const metrics = [
  { label: "Emails Generated", value: 42, icon: Mail, hint: "+18% vs last week" },
  { label: "Notes Summarized", value: 17, icon: FileText, hint: "+9% vs last week" },
  { label: "Research Sessions", value: 22, icon: Search, hint: "+12% vs last week" },
  { label: "Tasks Planned", value: 60, icon: ListTodo, hint: "Across the week" },
];

export function Analytics({ onBack }: { onBack?: () => void }) {
  return (
    <FeatureCard title="Productivity Analytics" description="Your weekly Workly AI activity at a glance." onBack={onBack}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold mt-3 tabular-nums">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-[11px] text-primary mt-1">{m.hint}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-sm lg:col-span-1">
          <CardContent className="p-5">
            <h4 className="text-sm font-semibold mb-3">Weekly Productivity Score</h4>
            <div className="h-[220px] relative">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={ringData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "var(--color-muted)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl font-bold">87</div>
                  <div className="text-xs text-muted-foreground">out of 100</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <h4 className="text-sm font-semibold mb-3">Tasks Completed</h4>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <BarChart data={tasksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-popover-foreground)" }} />
                  <Bar dataKey="tasks" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-5">
          <h4 className="text-sm font-semibold mb-3">Research Sessions</h4>
          <div className="h-[220px]">
            <ResponsiveContainer>
              <LineChart data={researchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-popover-foreground)" }} />
                <Line type="monotone" dataKey="sessions" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-secondary)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </FeatureCard>
  );
}