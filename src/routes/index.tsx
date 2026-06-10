import { createFileRoute } from "@tanstack/react-router";
import { ProductivityApp } from "@/components/productivity/ProductivityApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Productivity Assistant" },
      { name: "description", content: "Generate emails, summarize meetings, plan tasks, research topics, and chat with an AI productivity coach." },
      { property: "og:title", content: "AI Productivity Assistant" },
      { property: "og:description", content: "Generate emails, summarize meetings, plan tasks, research topics, and chat with an AI productivity coach." },
    ],
  }),
  component: Index,
});

function Index() {
  return <ProductivityApp />;
}
