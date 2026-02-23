import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  TrendingUp,
  Clock,
  Hash,
  User,
  Video,
  X,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGlobalSearch,
  useSearchHistory,
  useAddToSearchHistory,
  useClearSearchHistory,
  useTrendingHashtags,
  useFollowedHashtags,
  useFollowHashtag,
  useUnfollowHashtag,
} from "@/hooks/useSearch";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "video" | "user" | "hashtag">(
    "all"
  );

  const { data: searchResults, isLoading: searchLoading } = useGlobalSearch(
    debouncedQuery,
    activeTab === "all" ? undefined : activeTab
  );
  const { data: searchHistory = [] } = useSearchHistory();
  const { data: trendingHashtags = [] } = useTrendingHashtags(15);
  const { data: followedHashtags = [] } = useFollowedHashtags();

  const addToSearchHistory = useAddToSearchHistory();
  const clearSearchHistory = useClearSearchHistory();
  const followHashtag = useFollowHashtag();
  const unfollowHashtag = useUnfollowHashtag();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchTerm: string, type?: string) => {
    setQuery(searchTerm);
    addToSearchHistory.mutate({
      query: searchTerm,
      search_type: type || "general",
    });
  };

  const isFollowingHashtag = (hashtag: string) => {
    return followedHashtags.some((h: any) => h.hashtag === hashtag.toLowerCase());
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const hasResults =
      searchResults.videos.length > 0 ||
      searchResults.users.length > 0 ||
      searchResults.hashtags.length > 0;

    if (!hasResults) {
      return (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
          <p className="text-sm text-gray-500">
            Try different keywords or check spelling
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Users */}
        {(activeTab === "all" || activeTab === "user") &&
          searchResults.users.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Users
              </h3>
              <div className="space-y-2">
                {searchResults.users.map((user: any) => (
                  <button
                    key={user.id}
                    onClick={() => navigate(`/profile/${user.user_id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-500">
                          {(user.display_name?.[0] || "U").toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{user.display_name || user.username}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                    {user.is_verified && (
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Videos */}
        {(activeTab === "all" || activeTab === "video") &&
          searchResults.videos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Videos
              </h3>
              <div className="grid grid-cols-3 gap-1">
                {searchResults.videos.map((video: any) => (
                  <button
                    key={video.id}
                    onClick={() =>
                      navigate("/clipy", {
                        state: { focusVideoId: video.id, focusSource: "search" },
                      })
                    }
                    className="relative aspect-[9/16] bg-gray-200 overflow-hidden rounded-lg"
                  >
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 right-1 bg-black/60 rounded px-1 py-0.5">
                      <p className="text-white text-[10px] truncate">
                        {video.profiles?.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Hashtags */}
        {(activeTab === "all" || activeTab === "hashtag") &&
          searchResults.hashtags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Hashtags
              </h3>
              <div className="space-y-2">
                {searchResults.hashtags.map((hashtag: any) => {
                  const isFollowing = isFollowingHashtag(hashtag.hashtag);
                  return (
                    <div
                      key={hashtag.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary"
                    >
                      <button
                        onClick={() => handleSearch(hashtag.hashtag, "hashtag")}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Hash className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">#{hashtag.hashtag}</p>
                          <p className="text-sm text-muted-foreground">
                            {hashtag.video_count} videos
                          </p>
                        </div>
                      </button>
                      <Button
                        size="sm"
                        variant={isFollowing ? "secondary" : "default"}
                        onClick={() => {
                          if (isFollowing) {
                            unfollowHashtag.mutate(hashtag.hashtag);
                          } else {
                            followHashtag.mutate(hashtag.hashtag);
                          }
                        }}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20 pt-safe fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl pb-4">
          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, users, hashtags..."
              className="pl-12 pr-12 h-12 rounded-xl"
              autoFocus
            />
            {query && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8"
                onClick={() => setQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="user">Users</TabsTrigger>
              <TabsTrigger value="hashtag">Tags</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="mt-6">
          {debouncedQuery.length >= 2 ? (
            searchLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              renderSearchResults()
            )
          ) : (
            <div className="space-y-6">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => clearSearchHistory.mutate()}
                      >
                        Clear all
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleSearch(item.query, item.search_type)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm flex-1">{item.query}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trending Hashtags */}
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    Trending Hashtags
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {trendingHashtags.slice(0, 9).map((hashtag: any, index: number) => (
                      <button
                        key={hashtag.id}
                        onClick={() => handleSearch(hashtag.hashtag, "hashtag")}
                        className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left"
                      >
                        <p className="text-sm font-medium">#{hashtag.hashtag}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hashtag.video_count} posts
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Discovery Suggestions */}
              <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Discover More</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Search for trending content, creators, and hashtags to grow your network.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["viral", "dance", "comedy", "foodie"].map((tag) => (
                          <Button
                            key={tag}
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSearch(tag, "hashtag")}
                          >
                            #{tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
