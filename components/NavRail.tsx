const navItems = [
  { id: "activity", label: "Activity", icon: "🔔" },
  { id: "chat", label: "Chat", icon: "💬", active: true },
  { id: "teams", label: "Teams", icon: "👥" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "calls", label: "Calls", icon: "📞" },
  { id: "files", label: "Files", icon: "📁" },
  { id: "apps", label: "Apps", icon: "✨" }
];

export default function NavRail() {
  return (
    <nav className="bg-panel border-r border-border flex flex-col items-center py-4 gap-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`h-12 w-12 rounded-2xl text-lg flex items-center justify-center transition-all border ${
            item.active
              ? "bg-accent text-white border-accent shadow-sm"
              : "border-transparent hover:border-accent/50 text-textSecondary hover:text-textPrimary"
          }`}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
