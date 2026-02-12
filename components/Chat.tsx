"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "@/lib/mockData";

const typingPlaceholder: Message = {
  id: "typing",
  role: "assistant",
  content: "...",
  timestamp: new Date().toISOString()
};

type ChatProps = {
  initialMessages: Message[];
  threadTitle?: string;
  threadSubtitle?: string;
};

const quickActions = ["Жинхлэх процесс хэрхэн явагддаг вэ?", "Ээлжийн амралт болон ээлжийн амралтын цалингаа хэрхэн авах вэ?"];

export default function Chat({ initialMessages, threadTitle, threadSubtitle }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [messages]
  );

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = (await res.json()) as { message: Message };
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I could not reach the AI service. Showing a mock response instead.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-panel">
      <header className="border-b border-border px-8 py-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl font-bold">🤖</div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-textPrimary">{threadTitle ?? "AI HR Agent"}</h1>
            <p className="text-sm text-textSecondary max-w-2xl">
              {threadSubtitle ?? "Ask about hiring, benefits, PTO, onboarding, and HR policies."}
            </p>
          </div>
        </div>
      </header>

      <div className="border-b border-border px-8 py-4 flex flex-wrap gap-2 bg-panelMuted/60 flex-shrink-0">
        {quickActions.map((qa) => (
          <button
            key={qa}
            onClick={() => setInput(qa)}
            className="px-4 py-2 rounded-full border border-border text-sm font-semibold bg-white hover:border-accent/60 transition-colors"
          >
            {qa}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-8 space-y-5 scrollbar-thin">
        {sortedMessages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div key={message.id} className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
              <div className={`flex items-start gap-3 max-w-2xl ${isUser ? "flex-row-reverse" : ""}`}>
                <div className="h-10 w-10 rounded-full bg-panelMuted border border-border flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {isUser ? "👤" : "🤖"}
                </div>
                <div
                  className={`rounded-2xl px-5 py-4 text-base leading-relaxed shadow-sm border ${
                    isUser
                      ? "bg-accent text-white border-accent rounded-br-none"
                      : "bg-panelMuted text-textPrimary border-border rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              </div>
              <span className="text-xs text-textSecondary px-3">
                {isUser ? "You" : "Agent"} · {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
        {loading && (
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-panelMuted border border-border flex items-center justify-center text-xs flex-shrink-0">
                🤖
              </div>
              <div className="max-w-xs rounded-2xl px-5 py-4 text-base bg-panelMuted text-textSecondary border border-border rounded-bl-none animate-pulse">
                {typingPlaceholder.content}
              </div>
            </div>
            <span className="text-xs text-textSecondary px-3">Agent · typing…</span>
          </div>
        )}
      </div>

      <div className="border-t border-border p-6 bg-panel flex-shrink-0">
        <div className="flex items-end gap-4 max-w-4xl mx-auto">
          <button className="h-11 w-11 rounded-lg border border-border bg-panelMuted hover:border-accent/60 flex items-center justify-center flex-shrink-0 text-lg">
            📎
          </button>
          <input
            className="flex-1 rounded-xl border border-border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent/60 bg-panelMuted"
            placeholder="Ask the HR agent..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="h-11 px-6 rounded-lg bg-accent text-white text-base font-semibold hover:opacity-90 disabled:opacity-50 flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
