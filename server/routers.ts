import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { parseAppId, searchSteamGame, fetchAllGameData } from "./steamApi";
import { runFullAssessment } from "./aiEngine";
import { createAssessment, updateAssessment, getAssessmentById, listAssessments, deleteAssessment } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  assessment: router({
    // Search Steam games by name
    searchGame: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        // Try to parse as URL/appid first
        const appid = parseAppId(input.query);
        if (appid) {
          return [{ appid: appid!, name: `App ID: ${appid}` }];
        }
        return searchSteamGame(input.query);
      }),

    // Start a new assessment
    create: publicProcedure
      .input(z.object({
        steamInput: z.string().min(1),
        appid: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        let appid: number | undefined = input.appid;

        // Resolve appid from input
        if (!appid) {
          appid = parseAppId(input.steamInput) ?? undefined;
          if (!appid) {
            const results = await searchSteamGame(input.steamInput);
            if (results.length === 0) {
              throw new Error("未找到匹配的Steam游戏，请检查输入");
            }
            appid = results[0].appid;
          }
        }

        // Create initial record
        const assessmentId = await createAssessment({
          steamAppId: appid,
          gameName: "加载中...",
          status: "fetching",
        });

        // Run async: fetch data then AI analysis
        (async () => {
          try {
            // Phase 1: Fetch Steam data
            const gameData = await fetchAllGameData(appid!);

            await updateAssessment(assessmentId, {
              ...gameData,
              status: "analyzing",
            });

            // Phase 2: Run AI analysis
            const aiResults = await runFullAssessment(gameData as any);

            await updateAssessment(assessmentId, {
              chinaMarketEntry: aiResults.chinaMarketEntry,
              isbnRegulatory: aiResults.isbnRegulatory,
              crossPlatformPorting: aiResults.crossPlatformPorting,
              marketingStrategy: aiResults.marketingStrategy,
              omniChannel: aiResults.omniChannel,
              businessModel: aiResults.businessModel,
              scoreMarketEntry: aiResults.scoreMarketEntry,
              scoreIsbn: aiResults.scoreIsbn,
              scorePorting: aiResults.scorePorting,
              scoreMarketing: aiResults.scoreMarketing,
              scoreChannel: aiResults.scoreChannel,
              scoreBusinessModel: aiResults.scoreBusinessModel,
              overallGrade: aiResults.overallGrade,
              status: "completed",
            });
          } catch (e: any) {
            console.error("[Assessment] Failed:", e);
            await updateAssessment(assessmentId, {
              status: "failed",
              errorMessage: e.message || "评估过程中发生错误",
            });
          }
        })();

        return { id: assessmentId, appid };
      }),

    // Get assessment by ID (for polling)
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const assessment = await getAssessmentById(input.id);
        if (!assessment) throw new Error("评估记录不存在");
        return assessment;
      }),

    // List all assessments
    list: publicProcedure.query(async () => {
      return listAssessments(100);
    }),

    // Delete an assessment
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteAssessment(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
