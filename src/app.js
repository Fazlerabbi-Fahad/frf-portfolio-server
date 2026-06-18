import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import albumRoutes from "./routes/album.routes.js";
import projectRoutes from "./routes/project.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import metaRoutes from "./routes/meta.routes.js";
import { sitemap } from "./controllers/sitemap.controller.js";
import eventRoutes from "./routes/event.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));
  app.use("/api", apiLimiter);

  app.get("/sitemap.xml", sitemap);
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, env: env.nodeEnv }),
  );
  app.use("/api/auth", authRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/albums", albumRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/testimonials", testimonialRoutes);
  app.use("/api", metaRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/settings", settingsRoutes);
  
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
