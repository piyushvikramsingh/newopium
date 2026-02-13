import VideoCard from "@/components/VideoCard";
import TopNav from "@/components/TopNav";
import { mockVideos } from "@/data/mockVideos";

const Index = () => {
  return (
    <div className="snap-container scrollbar-hide">
      <TopNav />
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default Index;
