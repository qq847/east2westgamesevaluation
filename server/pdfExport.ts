import type { Assessment } from "../drizzle/schema";

/**
 * Generate a Markdown report from assessment data.
 * This is used by the frontend to trigger PDF download via browser print.
 */
export function generateReportMarkdown(a: Assessment): string {
  const chinaMarket = a.chinaMarketEntry as any || {};
  const isbn = a.isbnRegulatory as any || {};
  const porting = a.crossPlatformPorting as any || {};
  const marketing = a.marketingStrategy as any || {};
  const channel = a.omniChannel as any || {};
  const business = a.businessModel as any || {};

  return `# ${a.gameName} - 中国市场发行评估报告

**评估日期**: ${new Date(a.createdAt).toLocaleDateString("zh-CN")}
**综合评级**: ${a.overallGrade || "N/A"}
**Steam App ID**: ${a.steamAppId}

---

## 游戏基础信息

| 指标 | 数据 |
|------|------|
| 开发商 | ${a.developer || "N/A"} |
| 发行商 | ${a.publisher || "N/A"} |
| 类型 | ${a.genres || "N/A"} |
| 价格 | ${a.price || "N/A"} |
| 发行日期 | ${a.releaseDate || "N/A"} |
| 平台 | ${a.platforms || "N/A"} |
| 好评率 | ${a.positiveRate || 0}% |
| 预估拥有者 | ${a.owners || "N/A"} |
| 中国玩家占比 | ${a.chinaPlayerPercent || "N/A"}% |
| 简体中文支持 | ${a.hasSimplifiedChinese ? "是" : "否"} |

## 评分总览

| 模块 | 评分 | 评级 |
|------|------|------|
| 中国市场进入 | ${a.scoreMarketEntry || 0}/100 | ${chinaMarket.grade || "N/A"} |
| 版号可行性 | ${a.scoreIsbn || 0}/100 | ${isbn.grade || "N/A"} |
| 移植评估 | ${a.scorePorting || 0}/100 | ${porting.grade || "N/A"} |
| 营销方案 | ${a.scoreMarketing || 0}/100 | ${marketing.grade || "N/A"} |
| 渠道策略 | ${a.scoreChannel || 0}/100 | ${channel.grade || "N/A"} |
| 商业模式 | ${a.scoreBusinessModel || 0}/100 | ${business.grade || "N/A"} |

---

## 一、中国市场进入评估 (${chinaMarket.grade || "N/A"} - ${a.scoreMarketEntry || 0}/100)

**预估市场规模**: ${chinaMarket.chinaMarketSize || "N/A"}

### 中国玩家分析
${chinaMarket.chinaPlayerAnalysis || "暂无数据"}

### 市场潜力
${chinaMarket.marketPotential || "暂无数据"}

### 竞品分析
${chinaMarket.competitorAnalysis || "暂无数据"}

### 进入策略
${chinaMarket.entryStrategy || "暂无数据"}

### 风险点
${(chinaMarket.risks || []).map((r: string) => `- ${r}`).join("\n") || "无"}

### 机会点
${(chinaMarket.opportunities || []).map((o: string) => `- ${o}`).join("\n") || "无"}

### 建议
${chinaMarket.recommendation || "暂无数据"}

---

## 二、版号可行性评估 (${isbn.grade || "N/A"} - ${a.scoreIsbn || 0}/100)

**预计审批周期**: ${isbn.estimatedTimeline || "N/A"}
**成功概率**: ${isbn.successProbability || "N/A"}

### 可行性评估
${isbn.feasibility || "暂无数据"}

### 内容风险点
${(isbn.contentRisks || []).map((r: any) => `- **${r.category}** (${r.level}风险): ${r.detail}\n  修改建议: ${r.solution || "无"}`).join("\n") || "无"}

### 合规修改建议
${isbn.complianceSuggestions || "暂无数据"}

### 建议
${isbn.recommendation || "暂无数据"}

---

## 三、移植评估 (${porting.grade || "N/A"} - ${a.scorePorting || 0}/100)

**推测引擎**: ${porting.estimatedEngine || "N/A"}
**移植复杂度**: ${porting.portingComplexity || "N/A"}
**预估成本**: ${porting.estimatedCost || "N/A"}
**预估周期**: ${porting.estimatedTimeline || "N/A"}

### 引擎评估
${porting.engineAssessment || "暂无数据"}

### UI适配
${porting.uiAdaptation || "暂无数据"}

### 性能考量
${porting.performanceConsiderations || "暂无数据"}

### ROI预测
- 预估移动端收入: ${porting.roiPrediction?.estimatedMobileRevenue || "N/A"}
- 回本周期: ${porting.roiPrediction?.breakEvenTimeline || "N/A"}
- ROI范围: ${porting.roiPrediction?.roiRange || "N/A"}

### 建议
${porting.recommendation || "暂无数据"}

---

## 四、营销方案 (${marketing.grade || "N/A"} - ${a.scoreMarketing || 0}/100)

**预估总预算**: ${marketing.estimatedBudget || "N/A"}

### 目标受众
${marketing.targetAudience || "暂无数据"}

### KOL策略
- 主要平台: ${marketing.kolStrategy?.primaryPlatforms?.join(", ") || "N/A"}
- KOL类型: ${marketing.kolStrategy?.kolTypes?.join(", ") || "N/A"}
- 预估预算: ${marketing.kolStrategy?.estimatedKolBudget || "N/A"}

${marketing.kolStrategy?.detail || ""}

### 社区运营
${marketing.communityStrategy || "暂无数据"}

### 展会策略
${marketing.eventStrategy || "暂无数据"}

### 参考案例
${marketing.referenceCase || "暂无数据"}

### 建议
${marketing.recommendation || "暂无数据"}

---

## 五、渠道策略 (${channel.grade || "N/A"} - ${a.scoreChannel || 0}/100)

### 整体策略
${channel.channelStrategy || "暂无数据"}

### 渠道优先级
${(channel.priorityChannels || []).map((ch: any) => `| ${ch.name} | ${ch.priority} | ${ch.estimatedRevenueShare || ""} | ${ch.reason || ""} |`).join("\n") || "无"}

### 安卓策略
${channel.androidStrategy || "暂无数据"}

### iOS策略
${channel.iosStrategy || "暂无数据"}

### PC策略
${channel.pcStrategy || "暂无数据"}

### 建议
${channel.recommendation || "暂无数据"}

---

## 六、商业模式建议 (${business.grade || "N/A"} - ${a.scoreBusinessModel || 0}/100)

**推荐模式**: ${business.recommendedModel || "N/A"}

### 定价策略
${business.pricingStrategy || "暂无数据"}

### 分成建议
- 分成模式: ${business.revenueShareRecommendation?.model || "N/A"}
- 开发商: ${business.revenueShareRecommendation?.developerShare || "N/A"}
- E2W: ${business.revenueShareRecommendation?.e2wShare || "N/A"}

${business.revenueShareRecommendation?.rationale || ""}

### MG建议
- 建议范围: ${business.mgRecommendation?.suggestedRange || "N/A"}

${business.mgRecommendation?.rationale || ""}

### DLC/内购策略
${business.dlcStrategy || "暂无数据"}

### ROI预测
- 预估总收入: ${business.roiPrediction?.estimatedTotalRevenue || "N/A"}
- 预估总成本: ${business.roiPrediction?.estimatedCost || "N/A"}
- 回本周期: ${business.roiPrediction?.breakEvenTimeline || "N/A"}
- ROI范围: ${business.roiPrediction?.roiRange || "N/A"}

### 建议
${business.recommendation || "暂无数据"}

---

*本报告由E2W Assessment Platform自动生成，基于East2West Games 15年中国市场发行经验。*
*报告仅供内部参考，实际决策需结合更多市场调研和商务谈判。*
`;
}
