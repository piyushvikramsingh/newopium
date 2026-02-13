import { Search } from "lucide-react";
import { mockVideos } from "@/data/mockVideos";

const trendingTags = [
  "#opium", "#dance", "#viral", "#foodie", "#cats",
  "#streetstyle", "#comedy", "#music", "#fitness", "#art",
];

const Discover = () => {
  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      {/* Search bar */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Trending tags */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
        {trendingTags.map((tag) => (
          <span
            key={tag}
            className="shrink-0 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {[...mockVideos, ...mockVideos].map((video, i) => (
          <div key={`${video.id}-${i}`} className="relative aspect-[9/16] overflow-hidden">
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

export default Discover;
