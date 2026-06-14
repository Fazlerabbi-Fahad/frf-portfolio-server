import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);


async function start() {
  await connectDB(env.mongoUri);
  const app = createApp();
  app.listen(env.port, () => logger.info(`API listening on :${env.port}`));
}

start().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
