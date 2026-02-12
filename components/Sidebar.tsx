import { Channel, ChatThread, User } from "@/lib/mockData";

type SidebarProps = {
  user: User;
  channels: Channel[];
  threads: ChatThread[];
  activeThreadId?: string;
};

const navFilters = ["Chats", "Teams", "Calendar", "HR Desk"];

export default function Sidebar({ user, channels, threads, activeThreadId }: SidebarProps) {
  return (
    <aside className="bg-panel border-r border-border flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-accent text-panel flex items-center justify-center text-sm font-semibold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-xs text-textSecondary">{user.title}</span>
          </div>
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            user.presence === "available" ? "bg-success" : user.presence === "busy" ? "bg-warning" : "bg-textSecondary"
          }`}
          aria-label={`Status: ${user.presence}`}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-panelMuted focus:outline-none focus:ring-2 focus:ring-accent/60"
          placeholder="Search chats, people, files"
        />
        <button className="h-10 w-10 rounded-lg border border-border bg-panelMuted text-sm">⋯</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {navFilters.map((item) => (
          <span
            key={item}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              item === "Chats" ? "border-accent text-accent bg-accentSoft" : "border-border text-textSecondary"
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-textSecondary">
        <span>Chats</span>
        <button className="text-accent font-semibold">New</button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-[38vh] scrollbar-thin">
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          return (
            <button
              key={thread.id}
              className={`w-full text-left rounded-xl border px-3 py-3 transition-all ${
                isActive ? "border-accent bg-accentSoft/60 shadow-sm" : "border-border hover:border-accent/60 bg-panelMuted"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      thread.status === "available"
                        ? "bg-success"
                        : thread.status === "busy"
                          ? "bg-warning"
                          : "bg-textSecondary"
                    }`}
                  />
                  <span className="text-sm font-semibold">{thread.name}</span>
                </div>
                <span className="text-[11px] text-textSecondary">{thread.timeLabel}</span>
              </div>
              <div className="text-xs text-textSecondary overflow-hidden text-ellipsis whitespace-nowrap">{thread.preview}</div>
              {thread.unread ? (
                <span className="mt-2 inline-flex h-5 min-w-[24px] items-center justify-center rounded-full bg-accent text-white text-[11px] font-semibold">
                  {thread.unread}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-border">
        <div className="text-xs uppercase tracking-wide text-textSecondary mb-2">Channels</div>
        <div className="flex flex-col gap-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className="text-left px-3 py-2 rounded-lg bg-panelMuted hover:border-accent/60 border border-border transition-colors"
            >
              <div className="text-sm font-semibold"># {channel.name}</div>
              <div className="text-xs text-textSecondary">{channel.topic}</div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
