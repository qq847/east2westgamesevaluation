import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import GradeBadge from "@/components/GradeBadge";
import RadarChart from "@/components/RadarChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const MODULE_LABELS = [
  { key: "scoreMarketEntry", label: "市场进入" },
  { key: "scoreIsbn", label: "版号可行性" },
  { key: "scorePorting", label: "移植评估" },
  { key: "scoreMarketing", label: "营销方案" },
  { key: "scoreChannel", label: "渠道策略" },
  { key: "scoreBusinessModel", label: "商业模式" },
];

export default function Compare() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const idsStr = params.get("ids") || "";
  const ids = idsStr.split(",").map(Number).filter(Boolean);

  const queries = ids.map((id) =>
    trpc.assessment.get.useQuery({ id }, { enabled: id > 0 })
  );

  const isLoading = queries.some((q) => q.isLoading);
  const assessments = queries.map((q) => q.data).filter(Boolean);

  if (ids.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">请选择至少2款游戏进行对比</h2>
          <Button variant="outline" onClick={() => navigate("/history")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回历史记录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 pb-16">
        <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="mb-4 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回历史记录
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">游戏对比</h1>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header comparison */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${assessments.length}, 1fr)` }}>
              {assessments.map((a: any) => (
                <Card key={a.id} className="bg-card/80 border-border/50">
                  <CardContent className="p-4 text-center">
                    {a.headerImage && (
                      <img src={a.headerImage} alt={a.gameName} className="w-full h-28 object-cover rounded-md mb-3" />
                    )}
                    <h3 className="font-semibold text-foreground text-sm mb-2 truncate">{a.gameName}</h3>
                    <GradeBadge grade={a.overallGrade || "D"} size="md" />
                    <p className="text-xs text-muted-foreground mt-2">{a.developer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Score comparison table */}
            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-foreground">评分对比</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">模块</th>
                        {assessments.map((a: any) => (
                          <th key={a.id} className="text-center py-2 px-3 text-muted-foreground font-medium">
                            {a.gameName.length > 20 ? a.gameName.substring(0, 20) + "..." : a.gameName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MODULE_LABELS.map((m) => {
                        const scores = assessments.map((a: any) => (a as any)[m.key] || 0);
                        const maxScore = Math.max(...scores);
                        return (
                          <tr key={m.key} className="border-b border-border/30">
                            <td className="py-2.5 px-3 text-foreground font-medium">{m.label}</td>
                            {assessments.map((a: any, i: number) => {
                              const score = (a as any)[m.key] || 0;
                              const isMax = score === maxScore && score > 0;
                              return (
                                <td key={a.id} className="text-center py-2.5 px-3">
                                  <span className={`text-lg font-bold ${isMax ? "text-primary" : "text-foreground"}`}>
                                    {score}
                                  </span>
                                  <span className="text-xs text-muted-foreground">/100</span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                      {/* Overall */}
                      <tr className="bg-secondary/20">
                        <td className="py-2.5 px-3 text-foreground font-bold">综合评级</td>
                        {assessments.map((a: any) => (
                          <td key={a.id} className="text-center py-2.5 px-3">
                            <GradeBadge grade={a.overallGrade || "D"} size="sm" />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Key metrics comparison */}
            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-foreground">关键指标对比</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">指标</th>
                        {assessments.map((a: any) => (
                          <th key={a.id} className="text-center py-2 px-3 text-muted-foreground font-medium">
                            {a.gameName.length > 20 ? a.gameName.substring(0, 20) + "..." : a.gameName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "价格", key: "price" },
                        { label: "好评率", key: "positiveRate", suffix: "%" },
                        { label: "预估拥有者", key: "owners" },
                        { label: "中国玩家占比", key: "chinaPlayerPercent", suffix: "%" },
                        { label: "简体中文", key: "hasSimplifiedChinese", format: (v: any) => v ? "✓" : "✗" },
                        { label: "类型", key: "genres" },
                      ].map((row) => (
                        <tr key={row.key} className="border-b border-border/30">
                          <td className="py-2.5 px-3 text-foreground font-medium">{row.label}</td>
                          {assessments.map((a: any) => {
                            let val = (a as any)[row.key];
                            if (row.format) val = row.format(val);
                            else if (row.suffix && val) val = `${val}${row.suffix}`;
                            return (
                              <td key={a.id} className="text-center py-2.5 px-3 text-muted-foreground">
                                {val || "N/A"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
