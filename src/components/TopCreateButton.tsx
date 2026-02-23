import { PlusSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const TopCreateButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const shouldShow = location.pathname === "/" || location.pathname === "/discover";
  if (!shouldShow) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[61] mx-auto w-full max-w-lg px-3 pt-3">
      <div className="pointer-events-auto mr-auto w-fit">
        <button
          onClick={() => navigate("/create")}
          className="lift-on-tap rounded-xl border border-border bg-background/90 p-2 backdrop-blur-xl"
          aria-label="Create"
        >
          <PlusSquare className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default TopCreateButton;
