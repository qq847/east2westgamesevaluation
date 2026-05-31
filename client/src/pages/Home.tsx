import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Search,
  ArrowRight,
  Loader2,
  Gamepad2,
  Shield,
  Smartphone,
  Megaphone,
  Store,
  DollarSign,
  Globe,
  Zap,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  { icon: Globe, title: "中国市场进入评估", desc: "中国玩家占比分析、市场潜力评分、竞品分析、进入策略建议", color: "text-e2w-blue" },
  { icon: Shield, title: "版号可行性评估", desc: "内容审查风险识别、审批周期预估、合规修改建议", color: "text-e2w-green" },
  { icon: Smartphone, title: "移植评估", desc: "PC→Mobile工作量评估、成本预估、ROI预测", color: "text-e2w-amber" },
  { icon: Megaphone, title: "营销方案", desc: "KOL平台推荐、展会策略、社区运营方案", color: "text-e2w-purple" },
  { icon: Store, title: "渠道策略", desc: "40+安卓商店优先级矩阵、各渠道收入预估", color: "text-e2w-cyan" },
  { icon: DollarSign, title: "商业模式建议", desc: "分成结构、MG范围、DLC策略、ROI预测", color: "text-e2w-red" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.assessment.create.useMutation({
    onSuccess: (data) => {
      navigate(`/assessment/${data.id}`);
    },
    onError: (err) => {
      toast.error(err.message || "评估创建失败");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error("请输入Steam游戏URL或名称");
      return;
    }
    setIsSubmitting(true);
    createMutation.mutate({ steamInput: trimmed });
  }, [input, createMutation]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-e2w-purple/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative pt-16 pb-12">
          {/* Title */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              AI-Powered Game Publishing Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-foreground">游戏发行</span>
              <span className="text-primary">评估平台</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              输入Steam游戏链接，AI自动拉取数据并生成覆盖六大维度的中国市场发行评估报告。
              <br />
              基于East2West Games 15年、15款游戏的真实发行经验。
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-e2w-purple/20 to-primary/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative flex gap-2 bg-card border border-border rounded-xl p-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="输入Steam游戏URL或名称，如 https://store.steampowered.com/app/548430 或 Deep Rock Galactic"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 h-12"
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !input.trim()}
                  className="h-12 px-6 rounded-lg font-semibold text-base"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      分析中
                    </>
                  ) : (
                    <>
                      开始评估
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-muted-foreground">快速试试：</span>
              {[
                { name: "Northgard", id: "466560" },
                { name: "Deep Rock Galactic", id: "548430" },
                { name: "Kingdom Come: Deliverance II", id: "1771300" },
                { name: "Subnautica", id: "264710" },
              ].map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    setInput(`https://store.steampowered.com/app/${game.id}`);
                  }}
                  className="text-xs px-2.5 py-1 rounded-md bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {game.name}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {FEATURES.map((f, i) => (
              <Card
                key={i}
                className="bg-card/50 border-border/50 hover:border-border hover:bg-card/80 transition-all duration-200 group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-secondary/50 ${f.color} group-hover:bg-secondary transition-colors`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground mb-1">
                        {f.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-border/30">
            {[
              { icon: TrendingUp, label: "已发行游戏", value: "15+" },
              { icon: Gamepad2, label: "合作工作室", value: "4" },
              { icon: Globe, label: "中国市场经验", value: "15年" },
              { icon: Store, label: "覆盖渠道", value: "40+" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 text-muted-foreground">
                <s.icon className="w-4 h-4 text-primary/60" />
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
