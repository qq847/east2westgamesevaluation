import axios from "axios";

/**
 * Steam Data Fetching Service
 * Combines Steam Store API + SteamSpy API + Review Language Stats
 */

// Extract appid from various Steam URL formats
export function parseAppId(input: string): number | null {
  // Direct number
  if (/^\d+$/.test(input.trim())) {
    return parseInt(input.trim(), 10);
  }
  // Steam URL patterns
  const patterns = [
    /store\.steampowered\.com\/app\/(\d+)/,
    /steamcommunity\.com\/app\/(\d+)/,
    /steampowered\.com\/app\/(\d+)/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

// Search Steam for a game by name, return appid
export async function searchSteamGame(query: string): Promise<{ appid: number; name: string }[]> {
  try {
    const res = await axios.get("https://store.steampowered.com/api/storesearch/", {
      params: { term: query, l: "english", cc: "US" },
      timeout: 10000,
    });
    if (res.data?.total > 0) {
      return res.data.items.map((item: any) => ({
        appid: item.id,
        name: item.name,
      }));
    }
    return [];
  } catch (e) {
    console.error("[Steam Search] Error:", e);
    return [];
  }
}

// Fetch Steam Store API data
export async function fetchSteamStoreData(appid: number): Promise<any> {
  try {
    const res = await axios.get(`https://store.steampowered.com/api/appdetails`, {
      params: { appids: appid, cc: "US", l: "english" },
      timeout: 15000,
    });
    const data = res.data?.[String(appid)];
    if (data?.success) {
      return data.data;
    }
    return null;
  } catch (e) {
    console.error("[Steam Store] Error:", e);
    return null;
  }
}

// Fetch SteamSpy data
export async function fetchSteamSpyData(appid: number): Promise<any> {
  try {
    const res = await axios.get("https://steamspy.com/api.php", {
      params: { request: "appdetails", appid },
      timeout: 15000,
    });
    return res.data;
  } catch (e) {
    console.error("[SteamSpy] Error:", e);
    return null;
  }
}

// Fetch review language distribution to estimate China player percentage
export async function fetchReviewLanguageStats(appid: number): Promise<{
  total: number;
  chinese: number;
  chinaPercent: string;
  languageBreakdown: Record<string, number>;
}> {
  const languages = [
    "schinese", "tchinese", "english", "japanese", "koreana",
    "german", "french", "spanish", "russian", "portuguese",
    "brazilian", "polish", "turkish", "thai", "vietnamese",
  ];

  const breakdown: Record<string, number> = {};
  let total = 0;

  // Fetch review counts for major languages
  for (const lang of languages) {
    try {
      const res = await axios.get(
        `https://store.steampowered.com/appreviews/${appid}`,
        {
          params: {
            json: 1,
            language: lang,
            filter: "all",
            purchase_type: "all",
            num_per_page: 0,
            review_type: "all",
          },
          timeout: 10000,
        }
      );
      const count = res.data?.query_summary?.total_reviews || 0;
      breakdown[lang] = count;
      total += count;
      // Rate limiting: small delay between requests
      await new Promise((r) => setTimeout(r, 300));
    } catch {
      breakdown[lang] = 0;
    }
  }

  const chinese = (breakdown["schinese"] || 0) + (breakdown["tchinese"] || 0);
  const chinaPercent = total > 0 ? ((chinese / total) * 100).toFixed(1) : "0.0";

  return { total, chinese, chinaPercent, languageBreakdown: breakdown };
}

// Combined data fetch
export async function fetchAllGameData(appid: number) {
  const [storeData, spyData, reviewStats] = await Promise.all([
    fetchSteamStoreData(appid),
    fetchSteamSpyData(appid),
    fetchReviewLanguageStats(appid),
  ]);

  if (!storeData) {
    throw new Error(`无法获取Steam游戏数据 (appid: ${appid})，请检查游戏ID是否正确`);
  }

  // Extract key metadata
  const gameName = storeData.name || spyData?.name || "Unknown";
  const headerImage = storeData.header_image || "";
  const developer = storeData.developers?.join(", ") || spyData?.developer || "";
  const publisher = storeData.publishers?.join(", ") || spyData?.publisher || "";
  const genres = storeData.genres?.map((g: any) => g.description).join(", ") || "";
  const tags = spyData?.tags ? Object.keys(spyData.tags).slice(0, 20).join(", ") : "";
  const price = storeData.is_free
    ? "Free to Play"
    : storeData.price_overview
      ? `$${(storeData.price_overview.initial / 100).toFixed(2)}`
      : spyData?.initialprice
        ? `$${(parseInt(spyData.initialprice) / 100).toFixed(2)}`
        : "N/A";
  const releaseDate = storeData.release_date?.date || "";
  const platforms = [
    storeData.platforms?.windows && "Windows",
    storeData.platforms?.mac && "macOS",
    storeData.platforms?.linux && "Linux",
  ].filter(Boolean).join(", ");

  const languages = storeData.supported_languages || "";
  const hasSimplifiedChinese = languages.toLowerCase().includes("simplified chinese") ? 1 : 0;

  // Reviews
  const totalReviews = storeData.recommendations?.total || spyData?.positive + spyData?.negative || 0;
  const positive = spyData?.positive || 0;
  const negative = spyData?.negative || 0;
  const positiveRate = (positive + negative) > 0 ? Math.round((positive / (positive + negative)) * 100) : 0;

  // Owners & CCU
  const owners = spyData?.owners || "N/A";
  const ccu = spyData?.ccu || 0;

  return {
    steamAppId: appid,
    gameName,
    steamData: storeData,
    steamSpyData: spyData,
    reviewStats,
    headerImage,
    developer,
    publisher,
    genres,
    tags,
    price,
    releaseDate,
    platforms,
    languages,
    hasSimplifiedChinese,
    totalReviews,
    positiveRate,
    owners,
    ccu,
    chinaPlayerPercent: reviewStats.chinaPercent,
  };
}
