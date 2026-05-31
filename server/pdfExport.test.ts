import { describe, expect, it } from "vitest";
import { generateReportMarkdown } from "./pdfExport";
import type { Assessment } from "../drizzle/schema";

describe("generateReportMarkdown", () => {
  const mockAssessment = {
    id: 1,
    steamAppId: 548430,
    gameName: "Deep Rock Galactic",
    steamData: null,
    steamSpyData: null,
    reviewStats: null,
    headerImage: "https://example.com/header.jpg",
    developer: "Ghost Ship Games",
    publisher: "Coffee Stain Publishing",
    genres: "Action, FPS",
    tags: "Co-op, FPS, Mining",
    price: "$29.99",
    releaseDate: "May 13, 2020",
    platforms: "Windows",
    languages: "English, Simplified Chinese",
    totalReviews: 200000,
    positiveRate: 95,
    owners: "5,000,000 .. 10,000,000",
    ccu: 15000,
    chinaPlayerPercent: "12.5",
    hasSimplifiedChinese: 1,
    chinaMarketEntry: { grade: "A", chinaMarketSize: "$2M-$5M", chinaPlayerAnalysis: "Test analysis" },
    isbnRegulatory: { grade: "B", estimatedTimeline: "9-12个月", feasibility: "Test feasibility" },
    crossPlatformPorting: { grade: "C", estimatedEngine: "Unreal Engine", portingComplexity: "复杂" },
    marketingStrategy: { grade: "A", targetAudience: "Test audience" },
    omniChannel: { grade: "B", channelStrategy: "Test strategy" },
    businessModel: { grade: "A", recommendedModel: "买断制" },
    scoreMarketEntry: 82,
    scoreIsbn: 65,
    scorePorting: 45,
    scoreMarketing: 78,
    scoreChannel: 70,
    scoreBusinessModel: 85,
    overallGrade: "A",
    status: "completed" as const,
    errorMessage: null,
    createdBy: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  } as Assessment;

  it("generates markdown with game name as title", () => {
    const md = generateReportMarkdown(mockAssessment);
    expect(md).toContain("# Deep Rock Galactic");
  });

  it("includes all six module sections", () => {
    const md = generateReportMarkdown(mockAssessment);
    expect(md).toContain("中国市场进入评估");
    expect(md).toContain("版号可行性评估");
    expect(md).toContain("移植评估");
    expect(md).toContain("营销方案");
    expect(md).toContain("渠道策略");
    expect(md).toContain("商业模式建议");
  });

  it("includes game metadata", () => {
    const md = generateReportMarkdown(mockAssessment);
    expect(md).toContain("Ghost Ship Games");
    expect(md).toContain("$29.99");
    expect(md).toContain("95%");
    expect(md).toContain("12.5%");
  });

  it("includes overall grade", () => {
    const md = generateReportMarkdown(mockAssessment);
    expect(md).toContain("**综合评级**: A");
  });

  it("includes score table", () => {
    const md = generateReportMarkdown(mockAssessment);
    expect(md).toContain("82/100");
    expect(md).toContain("65/100");
  });
});
