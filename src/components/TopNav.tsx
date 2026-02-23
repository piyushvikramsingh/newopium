interface TopNavProps {
  activeTab: "following" | "foryou";
  onTabChange: (tab: "following" | "foryou") => void;
  followingCount?: number;
}

const TopNav = ({ activeTab, onTabChange, followingCount = 0 }: TopNavProps) => {

  return (
    <div className="fixed left-0 right-0 top-0 z-50 pt-safe">
      <div className="mx-auto mt-2 flex max-w-lg items-center justify-between px-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Clippy</div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-border/80 bg-background/70 px-2 py-1 backdrop-blur-xl">
          <button
            onClick={() => onTabChange("following")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              activeTab === "following"
                ? "bg-secondary text-foreground"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            Following{followingCount > 0 ? ` (${followingCount})` : ""}
          </button>
          <button
            onClick={() => onTabChange("foryou")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              activeTab === "foryou"
                ? "bg-secondary text-foreground"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            For You
          </button>
        </div>
        <div className="w-12" />
      </div>
    </div>
  );
};

export default TopNav;
