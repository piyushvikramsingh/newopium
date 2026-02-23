import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TopMoreMenu from "@/components/TopMoreMenu";

const AppLayout = () => {
  const gitSha = __APP_GIT_SHA__ || "unknown";

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-lg bg-background shadow-2xl shadow-black/20">
      <TopMoreMenu />
      <Outlet />
      <div className="border-t border-border/40 bg-background/95 px-4 py-1 text-center text-[10px] font-medium tracking-wide text-muted-foreground">
        rev {gitSha}
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
