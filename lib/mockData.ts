export type User = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  presence: "available" | "away" | "busy";
};

export type Channel = {
  id: string;
  name: string;
  topic: string;
};

export type ChatThread = {
  id: string;
  name: string;
  preview: string;
  timeLabel: string;
  unread?: number;
  status?: "available" | "away" | "busy";
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type ChatPayload = {
  messages: Message[];
};

export const mockUser: User = {
  id: "u-001",
  name: "Jordan Carter",
  title: "Product Manager",
  avatar: "https://avatars.githubusercontent.com/u/000?v=4",
  presence: "available"
};

export const mockChannels: Channel[] = [
  { id: "c-001", name: "Product Updates", topic: "Launch checklist" },
  { id: "c-002", name: "Support", topic: "Customer tickets" },
  { id: "c-003", name: "AI Lab", topic: "Agent prototypes" }
];

export const mockThreads: ChatThread[] = [
  {
    id: "t-hr",
    name: "HR Agent",
    preview: "Updated your PTO balance and drafted a reply to the candidate.",
    timeLabel: "1:32 PM",
    unread: 2,
    status: "available"
  },
  {
    id: "t-manager",
    name: "Alex Rivera",
    preview: "Shared the Q1 hiring plan for review.",
    timeLabel: "12:10 PM"
  },
  {
    id: "t-people",
    name: "People Ops",
    preview: "Reminder: new onboarding flow goes live Monday.",
    timeLabel: "Yesterday",
    status: "busy"
  }
];

export const mockHistory: Message[] = [
  
];
