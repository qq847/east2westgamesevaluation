import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { GATE_COOKIE_NAME } from "../../shared/const";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Password gate: verify and issue cookie
  const GATE_PASSWORD = "0426";
  const gateSecret = new TextEncoder().encode(ENV.cookieSecret + "_gate");

  app.post("/api/gate/verify", async (req, res) => {
    const { password } = req.body || {};
    if (password === GATE_PASSWORD) {
      const token = await new SignJWT({ gate: true })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(Math.floor(Date.now() / 1000) + 86400 * 30)
        .sign(gateSecret);
      res.cookie(GATE_COOKIE_NAME, token, {
        httpOnly: true,
        path: "/",
        sameSite: "none" as const,
        secure: req.protocol === "https" || req.headers["x-forwarded-proto"] === "https",
        maxAge: 86400 * 30 * 1000,
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Invalid password" });
    }
  });

  app.get("/api/gate/status", async (req, res) => {
    try {
      const cookieHeader = req.headers.cookie || "";
      const match = cookieHeader.match(new RegExp(`${GATE_COOKIE_NAME}=([^;]+)`));
      if (!match) { res.json({ authenticated: false }); return; }
      await jwtVerify(match[1], gateSecret);
      res.json({ authenticated: true });
    } catch {
      res.json({ authenticated: false });
    }
  });

  // Middleware: protect /api/trpc and /api/report with gate cookie
  app.use("/api/trpc", async (req, res, next) => {
    try {
      const cookieHeader = req.headers.cookie || "";
      const match = cookieHeader.match(new RegExp(`${GATE_COOKIE_NAME}=([^;]+)`));
      if (!match) { res.status(403).json({ error: "Access denied" }); return; }
      await jwtVerify(match[1], gateSecret);
      next();
    } catch {
      res.status(403).json({ error: "Access denied" }); return;
    }
  });

  app.use("/api/report", async (req, res, next) => {
    try {
      const cookieHeader = req.headers.cookie || "";
      const match = cookieHeader.match(new RegExp(`${GATE_COOKIE_NAME}=([^;]+)`));
      if (!match) { res.status(403).json({ error: "Access denied" }); return; }
      await jwtVerify(match[1], gateSecret);
      next();
    } catch {
      res.status(403).json({ error: "Access denied" }); return;
    }
  });

  // PDF report export endpoint
  app.get("/api/report/:id", async (req, res) => {
    try {
      const { getAssessmentById } = await import("../db");
      const { generateReportMarkdown } = await import("../pdfExport");
      const id = parseInt(req.params.id, 10);
      const assessment = await getAssessmentById(id);
      if (!assessment) {
        res.status(404).json({ error: "Assessment not found" });
        return;
      }
      const markdown = generateReportMarkdown(assessment);
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(assessment.gameName)}_report.md"`);
      res.send(markdown);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
