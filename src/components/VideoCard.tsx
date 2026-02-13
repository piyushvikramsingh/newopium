import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Music, Plus } from "lucide-react";
import type { VideoData } from "@/data/mockVideos";

function formatCount(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

interface VideoCardProps {
  video: VideoData;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(video.isFollowing);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [bookmarkCount, setBookmarkCount] = useState(video.bookmarks);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    setBookmarkCount((prev) => (bookmarked ? prev - 1 : prev + 1));
  };

  return (
    <div className="snap-item relative w-full overflow-hidden bg-background">
      {/* Background Image */}
      <img
        src={video.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

      {/* Right side actions */}
      <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5">
        {/* Avatar */}
        <div className="relative">
          <img
            src={video.avatar}
            alt={video.displayName}
            className="h-12 w-12 rounded-full border-2 border-foreground object-cover"
          />
          {!following && (
            <button
              onClick={() => setFollowing(true)}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
            >
              <Plus className="h-3 w-3 text-primary-foreground" />
            </button>
          )}
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart
            className={`h-7 w-7 transition-all ${
              liked ? "fill-primary text-primary scale-110" : "text-foreground"
            }`}
          />
          <span className="text-xs text-foreground font-medium">
            {formatCount(likeCount)}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7 text-foreground" />
          <span className="text-xs text-foreground font-medium">
            {formatCount(video.comments)}
          </span>
        </button>

        {/* Bookmark */}
        <button onClick={handleBookmark} className="flex flex-col items-center gap-1">
          <Bookmark
            className={`h-7 w-7 transition-all ${
              bookmarked ? "fill-primary text-primary scale-110" : "text-foreground"
            }`}
          />
          <span className="text-xs text-foreground font-medium">
            {formatCount(bookmarkCount)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <Share2 className="h-7 w-7 text-foreground" />
          <span className="text-xs text-foreground font-medium">
            {formatCount(video.shares)}
          </span>
        </button>

        {/* Music disc */}
        <div className="mt-1 h-10 w-10 rounded-full border-2 border-muted bg-secondary animate-spin-slow overflow-hidden">
          <img
            src={video.avatar}
            alt="music"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-20 left-3 right-20">
        <p className="text-base font-bold text-foreground">{video.username}</p>
        <p className="mt-1 text-sm text-foreground/90 leading-snug line-clamp-2">
          {video.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Music className="h-3.5 w-3.5 text-foreground" />
          <p className="text-xs text-foreground/80 truncate">{video.music}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
