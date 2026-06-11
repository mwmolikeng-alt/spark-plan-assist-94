import { createFileRoute } from "@tanstack/react-router";
import { ProductivityApp } from "@/components/productivity/ProductivityApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workly AI by CAPACITI – Your AI Workplace Assistant" },
      { name: "description", content: "Automate communication, organize tasks, accelerate research, and improve workplace productivity with Workly AI." },
      { property: "og:title", content: "Workly AI by CAPACITI" },
      { property: "og:description", content: "Premium AI productivity suite: email drafting, meeting summaries, task planning, research and a productivity coach." },
    ],
  }),
  component: Index,
});

function Index() {
  return <ProductivityApp />;
}
