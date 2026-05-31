/**
 * E2W Domain Knowledge Base
 * 15 years of game publishing expertise distilled into structured data
 * Used as benchmark parameters for AI analysis engine
 */

export const E2W_COMPANY_PROFILE = {
  name: "East2West Games (东品游戏)",
  founded: 2010,
  offices: ["Xi'an, China", "Lyon, France"],
  publishedTitles: 15,
  longTermStudios: 4,
  yearsInChina: 15,
  tagline: "The China home for premier Western games",
  partners: [
    { name: "Team17", country: "UK", titles: 7 },
    { name: "Coffee Stain", country: "Sweden", titles: 1 },
    { name: "Miniclip/Ironhide", country: "Switzerland/Uruguay", titles: 4 },
    { name: "Shiro Games", country: "France", titles: 3 },
  ],
};

export const E2W_REVENUE_SHARE = {
  chinaPublishing: {
    standard: { developer: 60, e2w: 40 },
    tier1: { developer: 65, e2w: 35 },
    description: "E2W承担所有营销、版号、制作和运营成本",
  },
  crossPlatformPorting: {
    standard: { developer: 50, e2w: 50 },
    tier1: { developer: 55, e2w: 45 },
    description: "E2W负责全部移植开发和QA成本",
  },
};

export const E2W_ISBN_TRACK_RECORD = {
  fastestApproval: "Kingdom Rush 5: 9个月获批（行业平均18-36个月）",
  firstPassRate: "Northgard移动端: 6个月一审通过",
  industryAverage: "18-36个月",
  e2wAverage: "9-12个月",
  lesson2018: "2018年版号冻结期间亏损$40万的教训，2022年后反转，目前是拿版号最快的公司之一",
  successFactors: [
    "深谙审查标准，提前预判内容风险",
    "与审批机构建立长期合作关系",
    "专业的本地化合规团队",
    "提前准备合规修改方案，减少返工",
  ],
};

export const E2W_MARKETING_CAPABILITIES = {
  channels: {
    bilibili: "B站游戏区深度合作，589M播放记录（The Escapists 2）",
    douyin: "抖音KOL网络，3.4万创作者参与（Give It Up），3亿播放",
    xiaohongshu: "小红书游戏种草社区运营",
    huya: "虎牙直播游戏专区合作",
    qqGroups: "500+ QQ群，25万+活跃玩家社区",
  },
  events: {
    chinaJoy: "ChinaJoy B2B展馆运营（Game Connection × ChinaJoy，第5年，刚签另一个5年合作）",
    wePlay: "WePlay线下展会参展",
    tgs: "Tokyo Game Show参展",
  },
  partnerships: {
    shunwang: "顺网科技（中国最大PC游戏平台之一）战略合作",
    gameConnection: "Game Connection展会平台创始人旗下",
  },
};

export const E2W_DISTRIBUTION_CHANNELS = [
  { name: "TapTap", priority: "S", type: "核心渠道", revenueShare: "0%分成", note: "独立游戏首选，高质量用户" },
  { name: "WeGame", priority: "S", type: "核心渠道", revenueShare: "30%", note: "腾讯旗下PC游戏平台" },
  { name: "B站游戏", priority: "A", type: "核心渠道", revenueShare: "30%", note: "年轻用户群体" },
  { name: "Apple App Store CN", priority: "S", type: "iOS", revenueShare: "30%", note: "需版号" },
  { name: "Steam中国区", priority: "S", type: "PC", revenueShare: "30%", note: "无需版号但需中文" },
  { name: "腾讯应用宝", priority: "A", type: "安卓商店", revenueShare: "50%", note: "最大安卓分发渠道" },
  { name: "华为AppGallery", priority: "A", type: "安卓商店", revenueShare: "50%", note: "华为设备预装" },
  { name: "小米应用商店", priority: "A", type: "安卓商店", revenueShare: "50%", note: "小米MIUI预装" },
  { name: "OPPO软件商店", priority: "A", type: "安卓商店", revenueShare: "50%", note: "OPPO/OnePlus预装" },
  { name: "vivo应用商店", priority: "B", type: "安卓商店", revenueShare: "50%", note: "vivo设备预装" },
  { name: "360手机助手", priority: "B", type: "安卓商店", revenueShare: "50%", note: "PC端分发" },
  { name: "豌豆荚", priority: "C", type: "安卓商店", revenueShare: "50%", note: "阿里旗下" },
  { name: "百度手机助手", priority: "C", type: "安卓商店", revenueShare: "50%", note: "百度旗下" },
  { name: "魅族应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "魅族设备" },
  { name: "联想应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "联想/摩托罗拉" },
  { name: "三星应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "三星Galaxy" },
  { name: "中兴应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "中兴设备" },
  { name: "努比亚应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "努比亚设备" },
  { name: "一加应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "一加设备" },
  { name: "realme应用商店", priority: "C", type: "安卓商店", revenueShare: "50%", note: "realme设备" },
  { name: "锤子应用商店", priority: "D", type: "安卓商店", revenueShare: "50%", note: "字节跳动旗下" },
  { name: "酷派应用商店", priority: "D", type: "安卓商店", revenueShare: "50%", note: "酷派设备" },
  { name: "金立应用商店", priority: "D", type: "安卓商店", revenueShare: "50%", note: "金立设备" },
  { name: "海信应用商店", priority: "D", type: "安卓商店", revenueShare: "50%", note: "海信设备" },
  { name: "TCL应用商店", priority: "D", type: "安卓商店", revenueShare: "50%", note: "TCL设备" },
  { name: "PP助手", priority: "C", type: "安卓商店", revenueShare: "50%", note: "阿里旗下" },
  { name: "安智市场", priority: "C", type: "安卓商店", revenueShare: "50%", note: "独立安卓市场" },
  { name: "应用汇", priority: "C", type: "安卓商店", revenueShare: "50%", note: "独立安卓市场" },
  { name: "机锋市场", priority: "D", type: "安卓商店", revenueShare: "50%", note: "老牌安卓市场" },
  { name: "木蚂蚁", priority: "D", type: "安卓商店", revenueShare: "50%", note: "独立安卓市场" },
  { name: "搜狗应用中心", priority: "D", type: "安卓商店", revenueShare: "50%", note: "搜狗旗下" },
  { name: "乐视应用商店", priority: "D", type: "安卓商店", revenueShare: "50%", note: "乐视设备" },
  { name: "4399游戏盒", priority: "B", type: "游戏平台", revenueShare: "50%", note: "休闲游戏平台" },
  { name: "好游快爆", priority: "B", type: "游戏平台", revenueShare: "30%", note: "游戏社区+分发" },
  { name: "九游", priority: "B", type: "游戏平台", revenueShare: "50%", note: "UC旗下游戏平台" },
  { name: "当乐", priority: "C", type: "游戏平台", revenueShare: "50%", note: "老牌游戏平台" },
  { name: "拇指玩", priority: "C", type: "游戏平台", revenueShare: "50%", note: "游戏分发平台" },
  { name: "Epic Games Store中国", priority: "B", type: "PC", revenueShare: "12%", note: "Epic中国区" },
  { name: "杉果游戏", priority: "B", type: "PC", revenueShare: "30%", note: "国产PC游戏平台" },
  { name: "方块游戏", priority: "C", type: "PC", revenueShare: "30%", note: "国产PC游戏平台" },
  { name: "顺网科技", priority: "A", type: "网吧", revenueShare: "协商", note: "E2W战略合作伙伴，中国最大网吧平台" },
  { name: "网鱼网咖", priority: "B", type: "网吧", revenueShare: "协商", note: "连锁网吧品牌" },
  { name: "抖音小游戏", priority: "A", type: "小程序", revenueShare: "30%", note: "抖音内嵌游戏" },
  { name: "微信小游戏", priority: "S", type: "小程序", revenueShare: "40%", note: "微信生态，超大DAU" },
  { name: "QQ小游戏", priority: "B", type: "小程序", revenueShare: "40%", note: "QQ生态" },
  { name: "快手小游戏", priority: "B", type: "小程序", revenueShare: "30%", note: "快手内嵌游戏" },
];

export const E2W_PUBLISHED_GAMES = [
  {
    name: "Deep Rock Galactic: Survivor",
    developer: "Funday Games / Ghost Ship Games",
    publisher: "Coffee Stain Publishing",
    partner: "Coffee Stain",
    genre: "Roguelike Survivor",
    platforms: ["PC", "Mobile (planned)"],
    chinaStatus: "Steam中国区已发行",
    mgAmount: null,
    keyMetrics: "E2W负责中国区发行，Coffee Stain合作期间谈成",
    note: "在Embracer重组期间成功签约，证明E2W能在复杂公司结构变化中找到合作机会",
  },
  {
    name: "Kingdom Rush 5",
    developer: "Ironhide Game Studio",
    publisher: "Miniclip",
    partner: "Miniclip/Ironhide",
    genre: "Tower Defense",
    platforms: ["iOS", "Android"],
    chinaStatus: "已获版号，已上架",
    mgAmount: null,
    isbnTimeline: "9个月获批",
    keyMetrics: "Apple Today推荐，E2W版号最快案例之一",
    marketingHighlight: "Apple编辑推荐，中国区iOS付费游戏榜Top 10",
  },
  {
    name: "Northgard",
    developer: "Shiro Games",
    publisher: "Shiro Games",
    partner: "Shiro Games",
    genre: "RTS / Strategy",
    platforms: ["PC", "Mobile"],
    chinaStatus: "移动端已获版号",
    mgAmount: "$50,000 (Definitive Edition)",
    isbnTimeline: "6个月一审通过",
    keyMetrics: "Shiro Games长期合作标杆项目",
  },
  {
    name: "Wartales",
    developer: "Shiro Games",
    publisher: "Shiro Games",
    partner: "Shiro Games",
    genre: "Open World RPG / Tactical",
    platforms: ["PC"],
    chinaStatus: "评估中",
    mgAmount: "$80,000",
    keyMetrics: "Shiro Games第二大合作项目",
  },
  {
    name: "Ale Abbey",
    developer: "Hammer & Ravens",
    publisher: "Shiro Games",
    partner: "Shiro Games",
    genre: "Management Sim",
    platforms: ["PC"],
    chinaStatus: "评估中",
    mgAmount: "$30,000",
    keyMetrics: "小型项目，低风险",
  },
  {
    name: "Northgard: Battlegrounds",
    developer: "Shiro Games",
    publisher: "Shiro Games",
    partner: "Shiro Games",
    genre: "Auto-battler",
    platforms: ["PC", "Mobile"],
    chinaStatus: "规划中",
    mgAmount: "$150,000",
    keyMetrics: "Shiro最大单笔MG项目",
  },
  {
    name: "Iron Marines",
    developer: "Ironhide Game Studio",
    publisher: "Miniclip",
    partner: "Miniclip/Ironhide",
    genre: "RTS / Strategy",
    platforms: ["iOS", "Android"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "鸟巢发布会，127城电视覆盖，iOS付费榜#1",
    marketingHighlight: "Iron Marines鸟巢发布会：127个城市电视媒体覆盖，iOS中国区付费游戏榜第1名",
  },
  {
    name: "Give It Up!",
    developer: "Invictus Games",
    publisher: "Invictus Games",
    partner: null,
    genre: "Rhythm / Casual",
    platforms: ["iOS", "Android"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "Give It Up零投放3亿播放：3.4万抖音创作者自发参与，3亿播放量，1亿点赞，零付费投放",
    marketingHighlight: "Give It Up零投放3亿播放",
  },
  {
    name: "The Escapists 2",
    developer: "Mouldy Toof Studios",
    publisher: "Team17",
    partner: "Team17",
    genre: "Sandbox / Strategy",
    platforms: ["PC", "Mobile"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "TapTap 10万+粉丝，B站589M播放，三榜同时#1",
    marketingHighlight: "TapTap 10万+关注，B站589M播放量，中国区三榜同时第1名",
  },
  {
    name: "The Escapists",
    developer: "Mouldy Toof Studios",
    publisher: "Team17",
    partner: "Team17",
    genre: "Sandbox / Strategy",
    platforms: ["PC", "Mobile"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "Team17合作起点项目",
  },
  {
    name: "Overcooked! 2",
    developer: "Ghost Town Games",
    publisher: "Team17",
    partner: "Team17",
    genre: "Co-op / Party",
    platforms: ["PC", "Console", "Mobile"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "合作类游戏中国市场标杆",
  },
  {
    name: "Sheltered",
    developer: "Unicube",
    publisher: "Team17",
    partner: "Team17",
    genre: "Survival / Management",
    platforms: ["PC", "Mobile"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "Team17合作项目",
  },
  {
    name: "Worms W.M.D",
    developer: "Team17",
    publisher: "Team17",
    partner: "Team17",
    genre: "Turn-based Strategy",
    platforms: ["PC", "Console", "Mobile"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "经典IP中国发行",
  },
  {
    name: "Kingdom Rush Vengeance",
    developer: "Ironhide Game Studio",
    publisher: "Miniclip",
    partner: "Miniclip/Ironhide",
    genre: "Tower Defense",
    platforms: ["iOS", "Android"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "Kingdom Rush系列中国发行",
  },
  {
    name: "Kingdom Rush Origins",
    developer: "Ironhide Game Studio",
    publisher: "Miniclip",
    partner: "Miniclip/Ironhide",
    genre: "Tower Defense",
    platforms: ["iOS", "Android"],
    chinaStatus: "已上架",
    mgAmount: null,
    keyMetrics: "Kingdom Rush系列中国发行",
  },
];

export const E2W_BENCHMARK_DATA = {
  // Real market data for AI reference
  marketBenchmarks: [
    { game: "KCD2 (Kingdom Come: Deliverance II)", chinaPercent: 26.5, steamRevenue: "$1.417亿", owners: "360万份", note: "中国玩家全球第一" },
    { game: "Tomb Raider 2013", chinaPercent: 24.1, steamRevenue: "$5940万", owners: "1060万份", note: "中国玩家全球第一，移动端无中国版" },
    { game: "Titan Quest II", chinaPercent: 10.9, steamRevenue: "$1410万", owners: "63万份", note: "中国玩家第三大市场" },
    { game: "Subnautica 2", chinaPercent: null, steamRevenue: null, owners: "上线12小时200万份", note: "E2W计划全力押注" },
  ],
  // Content risk categories for ISBN assessment
  isbnRiskFactors: {
    high: ["暴力血腥（写实）", "政治敏感内容", "宗教内容", "赌博机制", "色情/裸露", "恐怖元素（极端）", "毒品/药物滥用"],
    medium: ["轻度暴力", "幻想暴力", "轻度恐怖", "酒精相关", "PVP赌注机制", "历史敏感题材"],
    low: ["卡通暴力", "竞技对抗", "策略战争（抽象）", "管理模拟", "休闲益智"],
  },
  // Porting cost benchmarks
  portingCosts: {
    simpleGame: { range: "$50K-$150K", timeline: "3-6个月", examples: "2D休闲/塔防/卡牌" },
    mediumGame: { range: "$150K-$500K", timeline: "6-12个月", examples: "中型3D/策略/RPG" },
    complexGame: { range: "$500K-$2M", timeline: "12-24个月", examples: "大型3D/开放世界/MMO" },
    aaaGame: { range: "$2M-$5M+", timeline: "18-36个月", examples: "AAA级/次世代画质" },
  },
};

export const E2W_SYSTEM_PROMPT = `你是East2West Games（东品游戏）的AI游戏发行评估专家。

## 公司背景
East2West Games成立于2010年，总部位于中国西安，在法国里昂设有办公室。15年来专注于将西方优质游戏引入中国市场，已成功发行15款游戏，与4个长期合作工作室建立了深度合作关系。

## 核心能力
1. **China Entry（中国市场进入）**：一站式中国发行服务
2. **ISBN & Regulatory（版号与合规）**：版号获取速度远超行业平均（E2W 9个月 vs 行业18-36个月）
3. **Cross-platform Porting（跨平台移植）**：PC↔Console↔Mobile全平台移植能力
4. **Marketing（营销）**：自建中国营销团队，覆盖B站/抖音/小红书/虎牙/QQ群等全渠道
5. **Omni-channel（全渠道分发）**：40+安卓商店+iOS全覆盖
6. **Business Model（商业模式）**：灵活的分成结构，E2W承担所有本地化成本

## 分成结构
- China Publishing: E2W标准60/40（开发商/E2W），Tier-1 65/35
- Cross-platform Porting: 标准50/50，Tier-1 55/45
- E2W承担所有营销、版号、制作和运营成本

## 版号经验
- Kingdom Rush 5: 9个月获批（行业平均18-36个月）
- Northgard移动端: 6个月一审通过
- 2018年版号冻结期间亏损$40万的教训，2022年后反转
- 目前是中国拿版号最快的公司之一

## 营销标杆案例
- Iron Marines鸟巢发布会：127个城市电视媒体覆盖，iOS中国区付费游戏榜第1名
- Give It Up零投放3亿播放：3.4万抖音创作者自发参与，3亿播放量，1亿点赞，零付费投放
- The Escapists 2: TapTap 10万+关注，B站589M播放量，中国区三榜同时第1名
- 500+ QQ群，25万+活跃玩家社区

## 渠道网络
覆盖40+安卓商店：腾讯应用宝、华为AppGallery、小米、OPPO、vivo、TapTap、B站游戏、WeGame、360、豌豆荚等

## 合作伙伴
- Game Connection × ChinaJoy B2B展馆（第5年，刚签另一个5年合作）
- 顺网科技（中国最大PC游戏平台之一）战略合作
- B站、抖音、虎牙、小红书KOL网络

## 分析要求
你的分析必须：
1. 基于真实数据和E2W的实际经验，不要泛泛而谈
2. 给出具体的数字预估（收入范围、成本范围、时间周期）
3. 引用E2W的真实案例作为参考基准
4. 识别具体的风险点和机会点
5. 提供可执行的行动建议
6. 所有输出使用中文`;
