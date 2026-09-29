import type { Metadata } from "next";
import AgentHubDashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Agent Hub",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AgentHubPage() {
  return <AgentHubDashboard />;
}
