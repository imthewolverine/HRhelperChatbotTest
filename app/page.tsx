import Chat from "@/components/Chat";
import { mockHistory } from "@/lib/mockData";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-panel">
      <Chat
        initialMessages={mockHistory}
        threadTitle="HR Agent"
        threadSubtitle="Ask about hiring, benefits, PTO, onboarding, and HR policies."
      />
    </main>
  );
}
