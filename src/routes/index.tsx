import { createFileRoute } from "@tanstack/react-router";
import { Chatbot } from "@/components/Chatbot";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Chatbot />;
}
