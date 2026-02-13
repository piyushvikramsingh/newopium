import { MessageCircle } from "lucide-react";

const notifications = [
  { id: 1, user: "neonqueen", text: "liked your video", time: "2h", avatar: "https://i.pravatar.cc/100?img=1" },
  { id: 2, user: "urbanwalk", text: "started following you", time: "4h", avatar: "https://i.pravatar.cc/100?img=3" },
  { id: 3, user: "chefmood", text: "commented: fire 🔥", time: "6h", avatar: "https://i.pravatar.cc/100?img=5" },
  { id: 4, user: "sk8ordie", text: "shared your video", time: "1d", avatar: "https://i.pravatar.cc/100?img=8" },
  { id: 5, user: "cattax", text: "liked your comment", time: "2d", avatar: "https://i.pravatar.cc/100?img=9" },
];

const Inbox = () => {
  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Inbox</h1>
      </div>

      {/* Messages shortcut */}
      <button className="flex w-full items-center gap-3 px-4 py-3 active:bg-secondary/50 transition-colors">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-foreground">Messages</p>
          <p className="text-xs text-muted-foreground">Direct messages</p>
        </div>
      </button>

      <div className="mx-4 border-t border-border" />

      {/* Notifications */}
      <div className="py-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-center gap-3 px-4 py-3 active:bg-secondary/50 transition-colors"
          >
            <img
              src={n.avatar}
              alt={n.user}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{n.user}</span>{" "}
                <span className="text-muted-foreground">{n.text}</span>
              </p>
              <p className="text-xs text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
