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
const COOKIES_PATH = path.resolve(__dirname, "../cookies.txt");
if (process.env.YOUTUBE_COOKIES) {
  fs.writeFileSync(COOKIES_PATH, process.env.YOUTUBE_COOKIES, "utf-8");
  logger.info("YouTube cookies berhasil dimuat dari environment variable");
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
