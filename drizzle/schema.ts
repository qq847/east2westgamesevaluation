import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, bigint } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  
  // Steam game identifiers
  steamAppId: int("steamAppId").notNull(),
  gameName: varchar("gameName", { length: 512 }).notNull(),
  
  // Raw Steam data snapshot
  steamData: json("steamData"),           // Steam Store API response
  steamSpyData: json("steamSpyData"),     // SteamSpy API response
  reviewStats: json("reviewStats"),       // Review language distribution
  
  // Game metadata (denormalized for quick display)
  headerImage: text("headerImage"),
  developer: varchar("developer", { length: 512 }),
  publisher: varchar("publisher", { length: 512 }),
  genres: varchar("genres", { length: 512 }),
  tags: text("tags"),
  price: varchar("price", { length: 64 }),
  releaseDate: varchar("releaseDate", { length: 64 }),
  platforms: varchar("platforms", { length: 128 }),
  languages: text("languages"),
  totalReviews: int("totalReviews"),
  positiveRate: int("positiveRate"),       // percentage 0-100
  owners: varchar("owners", { length: 128 }),
  ccu: int("ccu"),
  
  // China-specific metrics
  chinaPlayerPercent: varchar("chinaPlayerPercent", { length: 32 }),
  hasSimplifiedChinese: int("hasSimplifiedChinese").default(0),
  
  // AI Assessment Results (each module stored as JSON)
  chinaMarketEntry: json("chinaMarketEntry"),     // Module 1
  isbnRegulatory: json("isbnRegulatory"),          // Module 2
  crossPlatformPorting: json("crossPlatformPorting"), // Module 3
  marketingStrategy: json("marketingStrategy"),    // Module 4
  omniChannel: json("omniChannel"),                // Module 5
  businessModel: json("businessModel"),            // Module 6
  
  // Overall scores (0-100 for radar chart)
  scoreMarketEntry: int("scoreMarketEntry"),
  scoreIsbn: int("scoreIsbn"),
  scorePorting: int("scorePorting"),
  scoreMarketing: int("scoreMarketing"),
  scoreChannel: int("scoreChannel"),
  scoreBusinessModel: int("scoreBusinessModel"),
  overallGrade: varchar("overallGrade", { length: 8 }),  // S/A/B/C/D
  
  // Assessment status
  status: mysqlEnum("status", ["pending", "fetching", "analyzing", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  
  // Metadata
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;
