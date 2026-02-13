import { Settings, Grid3X3, Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { mockVideos } from "@/data/mockVideos";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"videos" | "liked" | "saved">("videos");

  const tabs = [
    { id: "videos" as const, icon: Grid3X3 },
    { id: "liked" as const, icon: Heart },
    { id: "saved" as const, icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-lg font-bold text-foreground">@you</span>
        <Settings className="h-6 w-6 text-foreground" />
      </div>

      {/* Profile info */}
      <div className="flex flex-col items-center py-6">
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
          Y
        </div>
        <p className="mt-3 text-base font-bold text-foreground">@you</p>

        <div className="mt-4 flex gap-8">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">1.2K</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">8.4K</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="rounded-lg bg-secondary px-8 py-2 text-sm font-semibold text-secondary-foreground">
            Edit profile
          </button>
          <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
            Share
          </button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">No bio yet.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex justify-center py-3 transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {mockVideos.slice(0, 3).map((video) => (
          <div key={video.id} className="relative aspect-[9/16] overflow-hidden">
            <img
              src={video.thumbnail}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-1 left-1 flex items-center gap-1 text-foreground">
              <span className="text-[10px] font-medium">
                ▶ {(video.likes / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
