import { logger } from "../utils/logger.js";

export function notFound(_req, res) {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) logger.error({ err }, "Unhandled error");
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(err.details ? { details: err.details } : {}),
  });
}
