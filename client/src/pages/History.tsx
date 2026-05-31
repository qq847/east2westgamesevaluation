import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import GradeBadge from "@/components/GradeBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Search, Trash2, ExternalLink, Clock, Loader2,
  BarChart3, ArrowRight, AlertTriangle,
} from "lucide-react";

export default function History() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const { data: assessments, isLoading, refetch } = trpc.assessment.list.useQuery();
  const deleteMutation = trpc.assessment.delete.useMutation({
    onSuccess: () => {
      toast.success("已删除");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    if (!assessments) return [];
    if (!search.trim()) return assessments;
    const q = search.toLowerCase();
    return assessments.filter(
      (a) =>
        a.gameName.toLowerCase().includes(q) ||
        a.developer?.toLowerCase().includes(q) ||
        a.genres?.toLowerCase().includes(q)
    );
  }, [assessments, search]);

  const toggleCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">评估历史</h1>
            <p className="text-sm text-muted-foreground mt-1">
              共 {assessments?.length || 0} 条评估记录
            </p>
          </div>
          {compareIds.length >= 2 && (
            <Button
              onClick={() => navigate(`/compare?ids=${compareIds.join(",")}`)}
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              对比 ({compareIds.length})
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索游戏名称、开发商、类型..."
            className="pl-10 bg-card border-border/50"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-16 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">暂无评估记录</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "没有找到匹配的记录" : "开始你的第一次游戏评估"}
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowRight className="w-4 h-4 mr-2" />
                开始评估
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <Card
                key={a.id}
                className={`bg-card/60 border-border/50 hover:bg-card/80 transition-all cursor-pointer group ${
                  compareIds.includes(a.id) ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  if (a.status === "completed" || a.status === "failed") {
                    navigate(`/assessment/${a.id}`);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    {a.headerImage ? (
                      <img
                        src={a.headerImage as string}
                        alt={a.gameName}
                        className="w-24 h-14 rounded-md object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-14 rounded-md bg-secondary/50 shrink-0 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{a.gameName}</h3>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {a.developer && <span>{a.developer}</span>}
                        {a.genres && <span>· {a.genres}</span>}
                        {a.chinaPlayerPercent && <span>· 中国玩家 {a.chinaPlayerPercent}%</span>}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(a.createdAt).toLocaleString("zh-CN")}
                      </div>
                    </div>

                    {/* Grade + Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      {a.overallGrade && <GradeBadge grade={a.overallGrade} size="sm" />}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(a.id);
                          }}
                        >
                          <BarChart3 className={`w-4 h-4 ${compareIds.includes(a.id) ? "text-primary" : "text-muted-foreground"}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("确定要删除这条评估记录吗？")) {
                              deleteMutation.mutate({ id: a.id });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: "等待中", className: "bg-muted text-muted-foreground" },
    fetching: { label: "拉取数据", className: "bg-e2w-blue/15 text-e2w-blue" },
    analyzing: { label: "AI分析中", className: "bg-e2w-purple/15 text-e2w-purple" },
    completed: { label: "已完成", className: "bg-e2w-green/15 text-e2w-green" },
    failed: { label: "失败", className: "bg-destructive/15 text-destructive" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}
