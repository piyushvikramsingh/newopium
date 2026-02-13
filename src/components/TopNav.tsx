import { useState } from "react";

const TopNav = () => {
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-6 pt-4 pb-2">
      <button
        onClick={() => setActiveTab("following")}
        className={`text-base font-semibold transition-all ${
          activeTab === "following"
            ? "text-foreground"
            : "text-foreground/50"
        }`}
      >
        Following
      </button>
      <span className="text-foreground/20">|</span>
      <button
        onClick={() => setActiveTab("foryou")}
        className={`text-base font-semibold transition-all ${
          activeTab === "foryou"
            ? "text-foreground"
            : "text-foreground/50"
        }`}
      >
        For You
      </button>
    </div>
  );
};

export default TopNav;
