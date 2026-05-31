import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import RadarChart from "@/components/RadarChart";
import GradeBadge from "@/components/GradeBadge";
import ModuleCard, { InfoRow, RiskList, OpportunityList, SectionTitle, ContentBlock } from "@/components/ModuleCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe, Shield, Smartphone, Megaphone, Store, DollarSign,
  ArrowLeft, Loader2, AlertTriangle, Clock, ExternalLink,
  Users, Calendar, Tag, Star, Monitor, Download, FileText,
} from "lucide-react";

export default function AssessmentDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = parseInt(params.id || "0", 10);

  const { data: assessment, isLoading, refetch } = trpc.assessment.get.useQuery(
    { id },
    { enabled: id > 0, refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 3000;
    }}
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">评估记录不存在</h2>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  const isPending = assessment.status === "pending" || assessment.status === "fetching" || assessment.status === "analyzing";
  const isFailed = assessment.status === "failed";
  const isCompleted = assessment.status === "completed";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 pb-16">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
          {isCompleted && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.open(`/api/report/${id}`, '_blank');
                }}
              >
                <FileText className="w-4 h-4 mr-1" />
                导出Markdown
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-1" />
                导出PDF
              </Button>
            </div>
          )}
        </div>

        {/* Game Header */}
        <GameHeader assessment={assessment} />

        {/* Status: Loading / Failed */}
        {isPending && <PendingState status={assessment.status} />}
        {isFailed && <FailedState error={assessment.errorMessage} />}

        {/* Completed: Show full report */}
        {isCompleted && <CompletedReport assessment={assessment} />}
      </div>
    </div>
  );
}

function GameHeader({ assessment }: { assessment: any }) {
  return (
    <Card className="bg-card/80 border-border/50 mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Game image */}
          {assessment.headerImage && (
            <div className="md:w-80 shrink-0">
              <img
                src={assessment.headerImage}
                alt={assessment.gameName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/* Game info */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">{assessment.gameName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  {assessment.developer && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {assessment.developer}
                    </span>
                  )}
                  {assessment.releaseDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {assessment.releaseDate}
                    </span>
                  )}
                  {assessment.genres && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {assessment.genres}
                    </span>
                  )}
                </div>

                {/* Key metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricBox label="价格" value={assessment.price || "N/A"} />
                  <MetricBox label="好评率" value={assessment.positiveRate ? `${assessment.positiveRate}%` : "N/A"} />
                  <MetricBox label="预估拥有者" value={assessment.owners || "N/A"} />
                  <MetricBox
                    label="中国玩家占比"
                    value={assessment.chinaPlayerPercent ? `${assessment.chinaPlayerPercent}%` : "N/A"}
                    highlight
                  />
                </div>

                {/* Additional info */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {assessment.platforms && (
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground flex items-center gap-1">
                      <Monitor className="w-3 h-3" />
                      {assessment.platforms}
                    </span>
                  )}
                  {assessment.hasSimplifiedChinese === 1 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-e2w-green/10 text-e2w-green border border-e2w-green/20">
                      ✓ 已支持简体中文
                    </span>
                  )}
                  {assessment.ccu > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                      峰值CCU: {assessment.ccu.toLocaleString()}
                    </span>
                  )}
                  {assessment.steamAppId && (
                    <a
                      href={`https://store.steampowered.com/app/${assessment.steamAppId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-primary hover:bg-secondary transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Steam页面
                    </a>
                  )}
                </div>
              </div>

              {/* Overall grade */}
              {assessment.overallGrade && (
                <div className="text-center shrink-0">
                  <GradeBadge grade={assessment.overallGrade} size="lg" />
                  <p className="text-xs text-muted-foreground mt-1">综合评级</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-2.5 ${highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary/30"}`}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function PendingState({ status }: { status: string }) {
  const messages: Record<string, string> = {
    pending: "正在准备评估...",
    fetching: "正在从Steam拉取游戏数据...",
    analyzing: "AI正在分析六大维度评估报告...",
  };

  return (
    <Card className="bg-card/80 border-border/50 animate-pulse-glow">
      <CardContent className="py-16 text-center">
        <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="text-lg font-semibold text-foreground mb-2">{messages[status] || "处理中..."}</h2>
        <p className="text-sm text-muted-foreground">
          {status === "analyzing"
            ? "AI正在基于E2W 15年发行经验分析六大模块，预计需要30-60秒..."
            : "正在获取Steam Store API和SteamSpy数据..."}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">页面会自动刷新，请稍候</span>
        </div>
      </CardContent>
    </Card>
  );
}

function FailedState({ error }: { error: string | null }) {
  const [, navigate] = useLocation();
  return (
    <Card className="bg-destructive/5 border-destructive/20">
      <CardContent className="py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">评估失败</h2>
        <p className="text-sm text-muted-foreground mb-4">{error || "未知错误"}</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回重试
        </Button>
      </CardContent>
    </Card>
  );
}

function CompletedReport({ assessment }: { assessment: any }) {
  const radarScores = [
    { label: "市场进入", value: assessment.scoreMarketEntry || 0 },
    { label: "版号可行性", value: assessment.scoreIsbn || 0 },
    { label: "移植评估", value: assessment.scorePorting || 0 },
    { label: "营销方案", value: assessment.scoreMarketing || 0 },
    { label: "渠道策略", value: assessment.scoreChannel || 0 },
    { label: "商业模式", value: assessment.scoreBusinessModel || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Radar Chart Overview */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="shrink-0">
              <RadarChart scores={radarScores} size={300} />
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
              {radarScores.map((s, i) => {
                const icons = [Globe, Shield, Smartphone, Megaphone, Store, DollarSign];
                const colors = ["text-e2w-blue", "text-e2w-green", "text-e2w-amber", "text-e2w-purple", "text-e2w-cyan", "text-e2w-red"];
                const Icon = icons[i];
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Icon className={`w-5 h-5 ${colors[i]} shrink-0`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-lg font-bold text-foreground">{s.value}<span className="text-xs text-muted-foreground font-normal">/100</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Summary Table */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="py-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">评分总览</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">模块</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">评级</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">分数</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">说明</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "中国市场进入", grade: assessment.chinaMarketEntry?.grade, score: assessment.scoreMarketEntry, desc: assessment.chinaMarketEntry?.chinaMarketSize },
                  { label: "版号可行性", grade: assessment.isbnRegulatory?.grade, score: assessment.scoreIsbn, desc: assessment.isbnRegulatory?.estimatedTimeline },
                  { label: "移植评估", grade: assessment.crossPlatformPorting?.grade, score: assessment.scorePorting, desc: assessment.crossPlatformPorting?.estimatedCost },
                  { label: "营销方案", grade: assessment.marketingStrategy?.grade, score: assessment.scoreMarketing, desc: assessment.marketingStrategy?.estimatedBudget },
                  { label: "渠道策略", grade: assessment.omniChannel?.grade, score: assessment.scoreChannel, desc: `${assessment.omniChannel?.priorityChannels?.length || 0}个渠道` },
                  { label: "商业模式", grade: assessment.businessModel?.grade, score: assessment.scoreBusinessModel, desc: assessment.businessModel?.recommendedModel },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                    <td className="py-2 px-3 text-center"><GradeBadge grade={row.grade || "D"} size="sm" /></td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-lg font-bold text-foreground">{row.score || 0}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">{row.desc || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Six Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module 1: China Market Entry */}
        <ModuleCard
          title="中国市场进入评估"
          icon={Globe}
          iconColor="text-e2w-blue"
          grade={assessment.chinaMarketEntry?.grade || "D"}
          score={assessment.scoreMarketEntry || 0}
          data={assessment.chinaMarketEntry || {}}
          renderContent={(d) => (
            <>
              <InfoRow label="市场规模" value={d.chinaMarketSize} />
              <ContentBlock text={d.chinaPlayerAnalysis} />
              <SectionTitle>市场潜力</SectionTitle>
              <ContentBlock text={d.marketPotential} />
              <SectionTitle>竞品分析</SectionTitle>
              <ContentBlock text={d.competitorAnalysis} />
              <SectionTitle>进入策略</SectionTitle>
              <ContentBlock text={d.entryStrategy} />
              <SectionTitle>风险</SectionTitle>
              <RiskList items={d.risks} />
              <SectionTitle>机会</SectionTitle>
              <OpportunityList items={d.opportunities} />
              <SectionTitle>建议</SectionTitle>
              <ContentBlock text={d.recommendation} />
            </>
          )}
        />

        {/* Module 2: ISBN & Regulatory */}
        <ModuleCard
          title="版号可行性评估"
          icon={Shield}
          iconColor="text-e2w-green"
          grade={assessment.isbnRegulatory?.grade || "D"}
          score={assessment.scoreIsbn || 0}
          data={assessment.isbnRegulatory || {}}
          renderContent={(d) => (
            <>
              <InfoRow label="预计周期" value={d.estimatedTimeline} />
              <InfoRow label="成功概率" value={d.successProbability} />
              <ContentBlock text={d.feasibility} />
              {d.contentRisks?.length > 0 && (
                <>
                  <SectionTitle>内容风险点 ({d.contentRisks.length}项)</SectionTitle>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">风险等级</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">类别</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">详情</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">修改建议</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.contentRisks.map((r: any, i: number) => (
                          <tr key={i} className="border-b border-border/20">
                            <td className="py-1.5 px-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                r.level === "高" ? "bg-destructive/20 text-destructive" :
                                r.level === "中" ? "bg-e2w-amber/20 text-e2w-amber" :
                                "bg-e2w-green/20 text-e2w-green"
                              }`}>{r.level}风险</span>
                            </td>
                            <td className="py-1.5 px-2 font-medium text-foreground">{r.category}</td>
                            <td className="py-1.5 px-2 text-muted-foreground">{r.detail}</td>
                            <td className="py-1.5 px-2 text-primary">{r.solution || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              <SectionTitle>合规建议</SectionTitle>
              <ContentBlock text={d.complianceSuggestions} />
              <SectionTitle>风险</SectionTitle>
              <RiskList items={d.risks} />
              <SectionTitle>建议</SectionTitle>
              <ContentBlock text={d.recommendation} />
            </>
          )}
        />

        {/* Module 3: Cross-platform Porting */}
        <ModuleCard
          title="移植评估"
          icon={Smartphone}
          iconColor="text-e2w-amber"
          grade={assessment.crossPlatformPorting?.grade || "D"}
          score={assessment.scorePorting || 0}
          data={assessment.crossPlatformPorting || {}}
          renderContent={(d) => (
            <>
              <InfoRow label="推测引擎" value={d.estimatedEngine} />
              <InfoRow label="移植复杂度" value={d.portingComplexity} />
              <InfoRow label="预估成本" value={d.estimatedCost} />
              <InfoRow label="预估周期" value={d.estimatedTimeline} />
              <ContentBlock text={d.engineAssessment} />
              <SectionTitle>UI适配</SectionTitle>
              <ContentBlock text={d.uiAdaptation} />
              <SectionTitle>性能考量</SectionTitle>
              <ContentBlock text={d.performanceConsiderations} />
              {d.roiPrediction && (
                <>
                  <SectionTitle>ROI预测</SectionTitle>
                  <InfoRow label="移动端收入" value={d.roiPrediction.estimatedMobileRevenue} />
                  <InfoRow label="回本周期" value={d.roiPrediction.breakEvenTimeline} />
                  <InfoRow label="ROI范围" value={d.roiPrediction.roiRange} />
                </>
              )}
              <SectionTitle>风险</SectionTitle>
              <RiskList items={d.risks} />
              <SectionTitle>建议</SectionTitle>
              <ContentBlock text={d.recommendation} />
            </>
          )}
        />

        {/* Module 4: Marketing Strategy */}
        <ModuleCard
          title="营销方案"
          icon={Megaphone}
          iconColor="text-e2w-purple"
          grade={assessment.marketingStrategy?.grade || "D"}
          score={assessment.scoreMarketing || 0}
          data={assessment.marketingStrategy || {}}
          renderContent={(d) => (
            <>
              <ContentBlock text={d.targetAudience} />
              {d.kolStrategy && (
                <>
                  <SectionTitle>KOL策略</SectionTitle>
                  <InfoRow label="主要平台" value={d.kolStrategy.primaryPlatforms?.join(", ")} />
                  <InfoRow label="KOL类型" value={d.kolStrategy.kolTypes?.join(", ")} />
                  <InfoRow label="预估预算" value={d.kolStrategy.estimatedKolBudget} />
                  <ContentBlock text={d.kolStrategy.detail} />
                </>
              )}
              <SectionTitle>社区运营</SectionTitle>
              <ContentBlock text={d.communityStrategy} />
              <SectionTitle>展会策略</SectionTitle>
              <ContentBlock text={d.eventStrategy} />
              <InfoRow label="总预算" value={d.estimatedBudget} />
              <SectionTitle>预期效果</SectionTitle>
              <ContentBlock text={d.expectedResults} />
              <SectionTitle>参考案例</SectionTitle>
              <ContentBlock text={d.referenceCase} />
              <SectionTitle>时间线</SectionTitle>
              <ContentBlock text={d.timeline} />
              <SectionTitle>风险</SectionTitle>
              <RiskList items={d.risks} />
              <SectionTitle>建议</SectionTitle>
              <ContentBlock text={d.recommendation} />
            </>
          )}
        />

        {/* Module 5: Omni-channel */}
        <ModuleCard
          title="渠道策略"
          icon={Store}
          iconColor="text-e2w-cyan"
          grade={assessment.omniChannel?.grade || "D"}
          score={assessment.scoreChannel || 0}
          data={assessment.omniChannel || {}}
          renderContent={(d) => (
            <>
              <ContentBlock text={d.channelStrategy} />
              {d.priorityChannels?.length > 0 && (
                <>
                  <SectionTitle>渠道优先级矩阵 ({d.priorityChannels.length}个渠道)</SectionTitle>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">优先级</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">渠道</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">类型</th>
                          <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">收入占比</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">接入要求</th>
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">备注</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.priorityChannels.map((ch: any, i: number) => (
                          <tr key={i} className="border-b border-border/20 hover:bg-secondary/10">
                            <td className="py-1.5 px-2">
                              <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                                ch.priority === "S" ? "grade-s" :
                                ch.priority === "A" ? "grade-a" :
                                ch.priority === "B" ? "grade-b" : "grade-c"
                              }`}>{ch.priority}</span>
                            </td>
                            <td className="py-1.5 px-2 font-medium text-foreground">{ch.name}</td>
                            <td className="py-1.5 px-2 text-muted-foreground">{ch.type || "-"}</td>
                            <td className="py-1.5 px-2 text-right text-muted-foreground">{ch.estimatedRevenueShare || "-"}</td>
                            <td className="py-1.5 px-2 text-muted-foreground">{ch.requirements || "-"}</td>
                            <td className="py-1.5 px-2 text-muted-foreground">{ch.reason || ch.note || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              <SectionTitle>安卓策略</SectionTitle>
              <ContentBlock text={d.androidStrategy} />
              <SectionTitle>iOS策略</SectionTitle>
              <ContentBlock text={d.iosStrategy} />
              <SectionTitle>PC策略</SectionTitle>
              <ContentBlock text={d.pcStrategy} />
              <SectionTitle>独占 vs 全渠道</SectionTitle>
              <ContentBlock text={d.exclusiveVsOpen} />
              <SectionTitle>风险</SectionTitle>
              <RiskList items={d.risks} />
              <SectionTitle>建议</SectionTitle>
              <ContentBlock text={d.recommendation} />
            </>
          )}
        />

        {/* Module 6: Business Model */}
        <ModuleCard
          title="商业模式建议"
          icon={DollarSign}
          iconColor="text-e2w-red"
          grade={assessment.businessModel?.grade || "D"}
          score={assessment.scoreBusinessModel || 0}
          data={assessment.businessModel || {}}
          renderContent={(d) => (
            <>
              <InfoRow label="推荐模式" value={d.recommendedModel} />
              <ContentBlock text={d.pricingStrategy} />
              {d.revenueShareRecommendation && (
                <>
                  <SectionTitle>分成建议</SectionTitle>
                  <InfoRow label="分成模式" value={d.revenueShareRecommendation.model} />
                  <InfoRow label="开发商" value={d.revenueShareRecommendation.developerShare} />
                  <InfoRow label="E2W" value={d.revenueShareRecommendation.e2wShare} />
                  <ContentBlock text={d.revenueShareRecommendation.rationale} />
                </>
              )}
              {d.mgRecommendation && (
                <>
                  <SectionTitle>MG建议</SectionTitle>
                  <InfoRow label="建议范围" value={d.mgRecommendation.suggestedRange} />
                  <ContentBlock text={d.mgRecommendation.rationale} />
                </>
              )}
              <SectionTitle>DLC/内购策略</SectionTitle>
              <ContentBlock text={d.dlcStrategy} />
              {d.roiPrediction && (
                <>
                  <SectionTitle>ROI预测</SectionTitle>
                  <InfoRow label="预估总收入" value={d.roiPrediction.estimatedTotalRevenue} />
                  <InfoRow label="预估总成本" value={d.roiPrediction.estimatedCost} />
                  <InfoRow label="回本周期" value={d.roiPrediction.breakEvenTimeline} />
                  <InfoRow label="ROI范围" value={d.roiPrediction.roiRange} />
                </>
              )}
              <SectionTitle>风险</SectionTitle>
              <RiskList items={d.risks} />
              <SectionTitle>建议</SectionTitle>
              <ContentBlock text={d.recommendation} />
            </>
          )}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
