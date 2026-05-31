import { invokeLLM } from "./_core/llm";
import { E2W_SYSTEM_PROMPT, E2W_PUBLISHED_GAMES, E2W_BENCHMARK_DATA, E2W_REVENUE_SHARE, E2W_ISBN_TRACK_RECORD, E2W_MARKETING_CAPABILITIES, E2W_DISTRIBUTION_CHANNELS } from "../shared/e2wKnowledge";

interface GameContext {
  gameName: string;
  developer: string;
  publisher: string;
  genres: string;
  tags: string;
  price: string;
  releaseDate: string;
  platforms: string;
  languages: string;
  hasSimplifiedChinese: number;
  totalReviews: number;
  positiveRate: number;
  owners: string;
  ccu: number;
  chinaPlayerPercent: string;
  reviewStats: any;
  steamData: any;
  steamSpyData: any;
}

function buildGameSummary(ctx: GameContext): string {
  const langBreakdown = ctx.reviewStats?.languageBreakdown || {};
  const topLangs = Object.entries(langBreakdown)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([lang, count]) => `${lang}: ${count}`)
    .join(", ");

  return `## 游戏基础数据
- 游戏名称: ${ctx.gameName}
- 开发商: ${ctx.developer}
- 发行商: ${ctx.publisher}
- 类型: ${ctx.genres}
- 标签: ${ctx.tags}
- 价格: ${ctx.price}
- 发行日期: ${ctx.releaseDate}
- 平台: ${ctx.platforms}
- 支持语言: ${ctx.languages}
- 已支持简体中文: ${ctx.hasSimplifiedChinese ? "是" : "否"}
- 总评论数: ${ctx.totalReviews}
- 好评率: ${ctx.positiveRate}%
- 预估拥有者: ${ctx.owners}
- 昨日峰值CCU: ${ctx.ccu}
- 中国玩家评论占比: ${ctx.chinaPlayerPercent}%

## 评论语言分布（Top 10）
${topLangs}

## 游戏描述
${ctx.steamData?.short_description || "无"}

## 游戏详细描述
${(ctx.steamData?.detailed_description || "无").substring(0, 2000)}`;
}

// Module 1: China Market Entry Assessment
export async function analyzeMarketEntry(ctx: GameContext) {
  const prompt = `${buildGameSummary(ctx)}

## E2W市场基准数据
${JSON.stringify(E2W_BENCHMARK_DATA.marketBenchmarks, null, 2)}

## 任务
作为E2W的市场分析专家，请对这款游戏的中国市场进入机会进行全面评估。

请严格按照以下JSON格式输出（不要输出其他内容）：
{
  "grade": "S/A/B/C/D之一",
  "score": 0-100的整数,
  "chinaMarketSize": "预估中国市场收入范围（如$500K-$1M）",
  "chinaPlayerAnalysis": "中国玩家占比分析（200字以内）",
  "marketPotential": "市场潜力分析（300字以内）",
  "competitorAnalysis": "同类型已进入中国的竞品分析（200字以内）",
  "entryStrategy": "建议的进入策略（300字以内）",
  "risks": ["风险点1", "风险点2", "风险点3"],
  "opportunities": ["机会点1", "机会点2", "机会点3"],
  "recommendation": "最终建议（200字以内）"
}`;

  return callAI(prompt, "china_market_entry");
}

// Module 2: ISBN & Regulatory Assessment
export async function analyzeIsbn(ctx: GameContext) {
  const prompt = `${buildGameSummary(ctx)}

## E2W版号经验
${JSON.stringify(E2W_ISBN_TRACK_RECORD, null, 2)}

## 内容风险分类标准
${JSON.stringify(E2W_BENCHMARK_DATA.isbnRiskFactors, null, 2)}

## 任务
作为E2W的版号合规专家，请评估这款游戏获取中国版号的可行性。

注意：
- KR5九个月获批是E2W的标杆案例
- Northgard六个月一审通过
- 行业平均18-36个月
- 2018年版号冻结期间E2W亏损$40万，2022年后反转

请严格按照以下JSON格式输出：
{
  "grade": "S/A/B/C/D之一",
  "score": 0-100的整数,
  "feasibility": "可行性评估（200字以内）",
  "estimatedTimeline": "预计审批周期（如9-12个月）",
  "contentRisks": [
    {"category": "风险类别", "level": "高/中/低", "detail": "具体描述", "solution": "修改建议"}
  ],
  "requiredModifications": ["需要修改的内容1", "需要修改的内容2"],
  "complianceSuggestions": "合规修改总体建议（300字以内）",
  "successProbability": "成功概率（如85%）",
  "risks": ["风险点1", "风险点2"],
  "recommendation": "最终建议（200字以内）"
}`;

  return callAI(prompt, "isbn_regulatory");
}

// Module 3: Cross-platform Porting Assessment
export async function analyzePorting(ctx: GameContext) {
  const prompt = `${buildGameSummary(ctx)}

## E2W移植成本基准
${JSON.stringify(E2W_BENCHMARK_DATA.portingCosts, null, 2)}

## E2W移植分成结构
${JSON.stringify(E2W_REVENUE_SHARE.crossPlatformPorting, null, 2)}

## 任务
作为E2W的技术评估专家，请评估这款游戏从PC移植到移动端（iOS/Android）的可行性。

请严格按照以下JSON格式输出：
{
  "grade": "S/A/B/C/D之一",
  "score": 0-100的整数,
  "engineAssessment": "引擎和技术栈评估（200字以内）",
  "estimatedEngine": "推测使用的引擎（如Unity/Unreal/自研）",
  "portingComplexity": "移植复杂度（简单/中等/复杂/极复杂）",
  "estimatedCost": "预估移植成本范围（如$150K-$300K）",
  "estimatedTimeline": "预估移植周期（如6-9个月）",
  "uiAdaptation": "UI/UX适配难度评估（200字以内）",
  "performanceConsiderations": "性能优化需求（200字以内）",
  "roiPrediction": {
    "estimatedMobileRevenue": "预估移动端中国区收入",
    "breakEvenTimeline": "预计回本周期",
    "roiRange": "预估ROI范围（如1.5x-3x）"
  },
  "risks": ["风险点1", "风险点2"],
  "recommendation": "最终建议（200字以内）"
}`;

  return callAI(prompt, "cross_platform_porting");
}

// Module 4: Marketing Strategy
export async function analyzeMarketing(ctx: GameContext) {
  const prompt = `${buildGameSummary(ctx)}

## E2W营销能力
${JSON.stringify(E2W_MARKETING_CAPABILITIES, null, 2)}

## E2W营销标杆案例
- Iron Marines鸟巢发布会：127个城市电视媒体覆盖，iOS中国区付费游戏榜第1名
- Give It Up零投放3亿播放：3.4万抖音创作者自发参与，3亿播放量，1亿点赞，零付费投放
- The Escapists 2: TapTap 10万+关注，B站589M播放量，中国区三榜同时第1名
- 500+ QQ群，25万+活跃玩家社区

## 任务
作为E2W的营销策略专家，请为这款游戏制定中国市场营销方案。

请严格按照以下JSON格式输出：
{
  "grade": "S/A/B/C/D之一",
  "score": 0-100的整数,
  "targetAudience": "目标受众画像（200字以内）",
  "kolStrategy": {
    "primaryPlatforms": ["平台1", "平台2"],
    "kolTypes": ["KOL类型1", "KOL类型2"],
    "estimatedKolBudget": "预估KOL预算",
    "detail": "KOL策略详情（200字以内）"
  },
  "communityStrategy": "社区运营方案（200字以内）",
  "eventStrategy": "展会策略（ChinaJoy/WePlay等，200字以内）",
  "estimatedBudget": "预估总营销预算范围",
  "expectedResults": "预期效果（200字以内）",
  "referenceCase": "最相似的E2W历史案例及参考价值（200字以内）",
  "timeline": "营销时间线规划（200字以内）",
  "risks": ["风险点1", "风险点2"],
  "recommendation": "最终建议（200字以内）"
}`;

  return callAI(prompt, "marketing_strategy");
}

// Module 5: Omni-channel Distribution
export async function analyzeChannel(ctx: GameContext) {
  const prompt = `${buildGameSummary(ctx)}

## E2W渠道网络
${JSON.stringify(E2W_DISTRIBUTION_CHANNELS, null, 2)}

## 任务
作为E2W的渠道策略专家，请为这款游戏制定中国市场全渠道分发策略。
重要：prioritychannels必须包含上述所有渠道（40+个），每个渠道都要给出针对这款游戏的优先级、预估收入占比和接入要求。

请严格按照以下JSON格式输出：
{
  "grade": "S/A/B/C/D之一",
  "score": 0-100的整数,
  "channelStrategy": "整体渠道策略（300字以内）",
  "priorityChannels": [
    {"name": "渠道名", "priority": "S/A/B/C/D", "type": "渠道类型", "estimatedRevenueShare": "预估收入占比", "requirements": "接入要求", "reason": "选择原因"}
  ],
  "androidStrategy": "安卓渠道策略（200字以内）",
  "iosStrategy": "iOS策略（200字以内）",
  "pcStrategy": "PC渠道策略（Steam/WeGame，200字以内）",
  "exclusiveVsOpen": "独占 vs 全渠道策略建议（200字以内）",
  "estimatedRevenueByChannel": "各渠道预估收入分布（200字以内）",
  "risks": ["风险点1", "风险点2"],
  "recommendation": "最终建议（200字以内）"
}`;

  return callAI(prompt, "omni_channel");
}

// Module 6: Business Model
export async function analyzeBusinessModel(ctx: GameContext) {
  const prompt = `${buildGameSummary(ctx)}

## E2W分成结构
- China Publishing: E2W标准60/40（开发商/E2W），Tier-1 65/35
- Cross-platform Porting: 标准50/50，Tier-1 55/45
- E2W承担所有营销、版号、制作和运营成本

## E2W已签约MG参考
- Northgard DE: $50,000 MG
- Wartales: $80,000 MG
- Ale Abbey: $30,000 MG
- Northgard Battlegrounds: $150,000 MG

## 任务
作为E2W的商务策略专家，请为这款游戏制定商业模式建议。

请严格按照以下JSON格式输出：
{
  "grade": "S/A/B/C/D之一",
  "score": 0-100的整数,
  "recommendedModel": "推荐的商业模式（买断制/F2P/混合/订阅）",
  "pricingStrategy": "中国市场定价策略（200字以内）",
  "revenueShareRecommendation": {
    "model": "推荐分成模式",
    "developerShare": "开发商分成比例",
    "e2wShare": "E2W分成比例",
    "rationale": "分成比例依据（200字以内）"
  },
  "mgRecommendation": {
    "suggestedRange": "建议MG范围（如$50K-$100K）",
    "rationale": "MG建议依据（200字以内）"
  },
  "dlcStrategy": "DLC/内购/赛季通行证策略（200字以内）",
  "roiPrediction": {
    "estimatedTotalRevenue": "预估总收入",
    "estimatedCost": "预估总成本",
    "breakEvenTimeline": "预计回本周期",
    "roiRange": "预估ROI范围"
  },
  "risks": ["风险点1", "风险点2"],
  "recommendation": "最终建议（200字以内）"
}`;

  return callAI(prompt, "business_model");
}

async function callAI(userPrompt: string, moduleName: string): Promise<any> {
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: E2W_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("AI返回空内容");
    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);

    return JSON.parse(content);
  } catch (e: any) {
    console.error(`[AI Engine] ${moduleName} error:`, e.message);
    throw new Error(`AI分析模块 ${moduleName} 失败: ${e.message}`);
  }
}

// Run all 6 modules in parallel
export async function runFullAssessment(ctx: GameContext) {
  const [
    chinaMarketEntry,
    isbnRegulatory,
    crossPlatformPorting,
    marketingStrategy,
    omniChannel,
    businessModel,
  ] = await Promise.all([
    analyzeMarketEntry(ctx),
    analyzeIsbn(ctx),
    analyzePorting(ctx),
    analyzeMarketing(ctx),
    analyzeChannel(ctx),
    analyzeBusinessModel(ctx),
  ]);

  // Calculate overall grade based on weighted scores
  const scores = {
    scoreMarketEntry: chinaMarketEntry.score || 0,
    scoreIsbn: isbnRegulatory.score || 0,
    scorePorting: crossPlatformPorting.score || 0,
    scoreMarketing: marketingStrategy.score || 0,
    scoreChannel: omniChannel.score || 0,
    scoreBusinessModel: businessModel.score || 0,
  };

  const avgScore = Math.round(
    (scores.scoreMarketEntry * 0.25 +
      scores.scoreIsbn * 0.20 +
      scores.scorePorting * 0.15 +
      scores.scoreMarketing * 0.15 +
      scores.scoreChannel * 0.10 +
      scores.scoreBusinessModel * 0.15)
  );

  let overallGrade = "D";
  if (avgScore >= 90) overallGrade = "S";
  else if (avgScore >= 75) overallGrade = "A";
  else if (avgScore >= 60) overallGrade = "B";
  else if (avgScore >= 40) overallGrade = "C";

  return {
    chinaMarketEntry,
    isbnRegulatory,
    crossPlatformPorting,
    marketingStrategy,
    omniChannel,
    businessModel,
    ...scores,
    overallGrade,
  };
}
