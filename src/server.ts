import app from "./app.js";
import logger from "./config/logger.js";
import { startCleanTempJob } from "./jobs/cleanTempFiles.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Auto-create temp directory if it doesn't exist (needed for Railway)
const TEMP_DIR = path.resolve(__dirname, "../", process.env.TEMP_DIR || "temp");
fs.mkdirSync(TEMP_DIR, { recursive: true });

// Write YouTube cookies from env var to file (for Railway deployment)
// Supports both plain text and Base64-encoded cookies
const COOKIES_PATH = path.resolve(__dirname, "../cookies.txt");
if (process.env.YOUTUBE_COOKIES) {
  let cookiesContent = process.env.YOUTUBE_COOKIES;
  // Detect if value is Base64 encoded (no newlines, long string)
  if (!cookiesContent.includes("\n") && !cookiesContent.startsWith("#")) {
    try {
      cookiesContent = Buffer.from(cookiesContent, "base64").toString("utf-8");
      logger.info("YouTube cookies (Base64) berhasil di-decode");
    } catch {
      // Not base64, use as-is
    }
  }
  fs.writeFileSync(COOKIES_PATH, cookiesContent, "utf-8");
  logger.info(`YouTube cookies berhasil dimuat (${cookiesContent.split("\n").length} baris)`);
} else {
  logger.warn(
    "YOUTUBE_COOKIES tidak ditemukan - YouTube mungkin memblokir request dari server"
  );
}

const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
  startCleanTempJob();
});
