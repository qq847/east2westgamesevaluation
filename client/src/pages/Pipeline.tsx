import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Shield,
  Smartphone,
  Megaphone,
  Store,
  DollarSign,
  Globe,
  TrendingUp,
  Wrench,
  Rocket,
  FileCheck,
  Languages,
  Plug,
  Users,
  Calendar,
  Target,
  Radio,
  ArrowRight,
} from "lucide-react";

type Phase = "sourcing" | "production" | "publishing";
type ModuleStatus = "live" | "dev" | "planned";

interface Capability {
  id: string;
  icon: typeof Globe;
  title: string;
  description: string;
  status: ModuleStatus;
  businessTypes: string[];
  link?: string;
  color: string;
}

const PHASES: { key: Phase; label: string; subtitle: string; icon: typeof Search; color: string }[] = [
  {
    key: "sourcing",
    label: "Sourcing",
    subtitle: "选品阶段 · 值不值得做？",
    icon: Search,
    color: "text-e2w-blue",
  },
  {
    key: "production",
    label: "Production",
    subtitle: "制作阶段 · 具体怎么做？",
    icon: Wrench,
    color: "text-e2w-amber",
  },
  {
    key: "publishing",
    label: "Publishing",
    subtitle: "发行阶段 · 怎么推怎么卖？",
    icon: Rocket,
    color: "text-e2w-green",
  },
];

const CAPABILITIES: Record<Phase, Capability[]> = {
  sourcing: [
    {
      id: "market-radar",
      icon: Radio,
      title: "市场雷达",
      description: "实时监控Steam热门游戏，自动发现高潜力选品机会，跟踪中国玩家占比趋势",
      status: "live",
      businessTypes: ["全部业务"],
      link: "/",
      color: "text-e2w-cyan",
    },
    {
      id: "market-entry",
      icon: Globe,
      title: "中国市场进入评估",
      description: "中国玩家占比分析、市场规模预估、竞品分析、是否值得进入中国",
      status: "live",
      businessTypes: ["移动端发行", "Steam中国"],
      link: "/",
      color: "text-e2w-blue",
    },
    {
      id: "isbn-feasibility",
      icon: Shield,
      title: "版号可行性预判",
      description: "能否获取版号？成功概率多大？审批周期预估、内容风险初筛",
      status: "live",
      businessTypes: ["移动端发行", "Steam中国"],
      link: "/",
      color: "text-e2w-green",
    },
    {
      id: "porting-feasibility",
      icon: Smartphone,
      title: "移植可行性评估",
      description: "能否移植？复杂度判断、大致成本范围、ROI初步预测",
      status: "live",
      businessTypes: ["移动端发行"],
      link: "/",
      color: "text-e2w-amber",
    },
    {
      id: "marketing-potential",
      icon: TrendingUp,
      title: "营销潜力评估",
      description: "这款游戏在中国有没有营销爆点？KOL传播潜力、社区热度预判",
      status: "live",
      businessTypes: ["全部业务"],
      link: "/",
      color: "text-e2w-purple",
    },
    {
      id: "channel-fit",
      icon: Store,
      title: "渠道匹配度",
      description: "适合哪些渠道？40+渠道优先级矩阵、大致收入预期",
      status: "live",
      businessTypes: ["移动端发行", "Steam中国"],
      link: "/",
      color: "text-e2w-cyan",
    },
    {
      id: "biz-model-sourcing",
      icon: DollarSign,
      title: "商业模式初判",
      description: "初步分成结构建议、MG范围预估、合作模式推荐",
      status: "live",
      businessTypes: ["全部业务"],
      link: "/",
      color: "text-e2w-red",
    },
  ],
  production: [
    {
      id: "isbn-compliance",
      icon: FileCheck,
      title: "版号合规方案",
      description: "具体修改清单：哪些内容要改、怎么改、满足广电总局审查要求的详细方案",
      status: "dev",
      businessTypes: ["移动端发行", "Steam中国"],
      color: "text-e2w-green",
    },
    {
      id: "porting-plan",
      icon: Smartphone,
      title: "移植执行方案",
      description: "具体移植方案：引擎适配策略、UI重设计规范、性能优化目标、里程碑时间线",
      status: "dev",
      businessTypes: ["移动端发行"],
      color: "text-e2w-amber",
    },
    {
      id: "localization",
      icon: Languages,
      title: "本地化方案",
      description: "翻译质量标准、文化适配策略、UI中文适配、配音方案",
      status: "planned",
      businessTypes: ["全部业务"],
      color: "text-e2w-purple",
    },
    {
      id: "channel-integration",
      icon: Plug,
      title: "渠道接入方案",
      description: "各渠道SDK接入清单、支付对接流程、合规要求checklist、接入时间线",
      status: "planned",
      businessTypes: ["移动端发行"],
      color: "text-e2w-cyan",
    },
  ],
  publishing: [
    {
      id: "marketing-execution",
      icon: Megaphone,
      title: "营销执行方案",
      description: "具体KOL名单、投放计划、社区运营方案、展会安排、预算分配",
      status: "dev",
      businessTypes: ["全部业务"],
      color: "text-e2w-purple",
    },
    {
      id: "channel-ops",
      icon: Calendar,
      title: "渠道运营方案",
      description: "各渠道上架时间线、首发策略、更新节奏、渠道关系维护",
      status: "planned",
      businessTypes: ["移动端发行", "Steam中国"],
      color: "text-e2w-cyan",
    },
    {
      id: "biz-ops",
      icon: Target,
      title: "商业运营方案",
      description: "定价策略执行、促销节奏规划、DLC发布计划、数据监控体系",
      status: "planned",
      businessTypes: ["全部业务"],
      color: "text-e2w-red",
    },
    {
      id: "community-ops",
      icon: Users,
      title: "用户运营方案",
      description: "QQ群运营规范、社区管理方案、玩家反馈处理流程、留存策略",
      status: "planned",
      businessTypes: ["全部业务"],
      color: "text-e2w-blue",
    },
  ],
};

const STATUS_CONFIG: Record<ModuleStatus, { label: string; className: string }> = {
  live: { label: "已上线", className: "bg-e2w-green/15 text-e2w-green border-e2w-green/30" },
  dev: { label: "开发中", className: "bg-e2w-amber/15 text-e2w-amber border-e2w-amber/30" },
  planned: { label: "规划中", className: "bg-muted/50 text-muted-foreground border-border" },
};

export default function Pipeline() {
  const [activePhase, setActivePhase] = useState<Phase>("sourcing");
  const [, navigate] = useLocation();

  const capabilities = CAPABILITIES[activePhase];
  const activePhaseConfig = PHASES.find((p) => p.key === activePhase)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">能力矩阵</h1>
          <p className="text-sm text-muted-foreground">
            E2W游戏发行全流程能力，按三大阶段组织。同一能力在不同阶段有不同深度。
          </p>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-card/50 rounded-xl border border-border/50 w-fit">
          {PHASES.map((phase) => {
            const isActive = activePhase === phase.key;
            const Icon = phase.icon;
            return (
              <button
                key={phase.key}
                onClick={() => setActivePhase(phase.key)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? phase.color : ""}`} />
                <div className="text-left">
                  <div className="font-semibold">{phase.label}</div>
                  <div className={`text-[10px] ${isActive ? "text-primary/70" : "text-muted-foreground"}`}>
                    {phase.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {PHASES.map((phase, i) => (
            <div key={phase.key} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activePhase === phase.key ? "bg-primary scale-125" : "bg-border"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  activePhase === phase.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {phase.label}
              </span>
              {i < PHASES.length - 1 && (
                <ArrowRight className="w-3 h-3 text-border mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            const statusCfg = STATUS_CONFIG[cap.status];
            const isClickable = cap.status === "live" && cap.link;

            return (
              <Card
                key={cap.id}
                className={`bg-card/60 border-border/50 transition-all duration-200 group ${
                  isClickable
                    ? "hover:border-primary/30 hover:bg-card/80 cursor-pointer"
                    : "opacity-80"
                }`}
                onClick={() => isClickable && navigate(cap.link!)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-secondary/50 ${cap.color} group-hover:bg-secondary transition-colors`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-foreground mb-1.5">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {cap.description}
                  </p>

                  {/* Business type tags */}
                  <div className="flex flex-wrap gap-1">
                    {cap.businessTypes.map((bt) => (
                      <span
                        key={bt}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/40 text-muted-foreground"
                      >
                        {bt}
                      </span>
                    ))}
                  </div>

                  {isClickable && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入评估
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-10 pt-6 border-t border-border/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-e2w-green" />
                <span className="text-xs text-muted-foreground">
                  已上线 {Object.values(CAPABILITIES).flat().filter((c) => c.status === "live").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-e2w-amber" />
                <span className="text-xs text-muted-foreground">
                  开发中 {Object.values(CAPABILITIES).flat().filter((c) => c.status === "dev").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <span className="text-xs text-muted-foreground">
                  规划中 {Object.values(CAPABILITIES).flat().filter((c) => c.status === "planned").length}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              E2W · 15年 · 15款游戏 · 4家长期合作工作室
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
