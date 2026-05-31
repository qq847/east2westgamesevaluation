import { Link, useLocation } from "wouter";
import { Gamepad2, History, BarChart3 } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Gamepad2 className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-none">
              E2W Assessment
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Game Publishing Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                location === "/"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              新评估
            </button>
          </Link>
          <Link href="/history">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                location === "/history"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <History className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              历史记录
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
