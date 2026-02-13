import thumb1 from "@/assets/video-thumb-1.jpg";
import thumb2 from "@/assets/video-thumb-2.jpg";
import thumb3 from "@/assets/video-thumb-3.jpg";
import thumb4 from "@/assets/video-thumb-4.jpg";
import thumb5 from "@/assets/video-thumb-5.jpg";

export interface VideoData {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  description: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  thumbnail: string;
  isFollowing: boolean;
}

export const mockVideos: VideoData[] = [
  {
    id: "1",
    username: "@neonqueen",
    displayName: "Neon Queen",
    avatar: "https://i.pravatar.cc/100?img=1",
    description: "vibes are immaculate tonight ✨🔥 #dance #neon #opium",
    music: "♫ Blinding Lights - The Weeknd",
    likes: 234500,
    comments: 4521,
    shares: 1203,
    bookmarks: 8934,
    thumbnail: thumb1,
    isFollowing: false,
  },
  {
    id: "2",
    username: "@urbanwalk",
    displayName: "Urban Walker",
    avatar: "https://i.pravatar.cc/100?img=3",
    description: "lost in the city at 2am 🌃 #streetstyle #night #urban",
    music: "♫ After Hours - The Weeknd",
    likes: 189300,
    comments: 2890,
    shares: 892,
    bookmarks: 5621,
    thumbnail: thumb2,
    isFollowing: true,
  },
  {
    id: "3",
    username: "@chefmood",
    displayName: "Chef Mood",
    avatar: "https://i.pravatar.cc/100?img=5",
    description: "when the pasta hits different 🍝😮‍💨 #foodie #cooking #asmr",
    music: "♫ original sound - chefmood",
    likes: 456200,
    comments: 8934,
    shares: 3201,
    bookmarks: 12400,
    thumbnail: thumb3,
    isFollowing: false,
  },
  {
    id: "4",
    username: "@sk8ordie",
    displayName: "Sk8 or Die",
    avatar: "https://i.pravatar.cc/100?img=8",
    description: "golden hour kickflip 🛹🌅 #skate #sunset #extreme",
    music: "♫ HUMBLE. - Kendrick Lamar",
    likes: 312800,
    comments: 5621,
    shares: 2103,
    bookmarks: 9870,
    thumbnail: thumb4,
    isFollowing: false,
  },
  {
    id: "5",
    username: "@cattax",
    displayName: "Cat Tax",
    avatar: "https://i.pravatar.cc/100?img=9",
    description: "smol criminal caught in the act 🐱🧶 #cat #cute #viral",
    music: "♫ Cute BGM - sounds",
    likes: 892100,
    comments: 15230,
    shares: 8901,
    bookmarks: 34500,
    thumbnail: thumb5,
    isFollowing: true,
  },
];
