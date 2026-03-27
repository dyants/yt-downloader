import cron from "node-cron";
import fs from "fs";
import path from "path";
import logger from "../config/logger.js";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMP_DIR = path.resolve(
  __dirname,
  "../../",
  process.env.TEMP_DIR || "temp",
); // DIREKTORI TEMP FILE

const MAX_AGE_MINUTES = 10; // SET MENJADI 10 MENIT

export const startCleanTempJob = () => {
  cron.schedule("*/5 * * * *", () => {
    logger.info("[CRON] Menjalankan pembersihan file temp...");

    fs.readdir(TEMP_DIR, (err, files) => {
      // ❌ SALAH: logger.error`...` (template literal call)
      // ✅ BENAR: logger.error("...") (function call biasa)
      if (err)
        return logger.error(`[CRON] Gagal membaca folder temp: ${err.message}`);

      const now = Date.now();

      files.forEach((file) => {
        const filePath = path.join(TEMP_DIR, file);

        fs.stat(filePath, (err, stats) => {
          if (err)
            return logger.error(
              `[CRON] Gagal membaca file: ${file} - ${err.message}`,
            );

          const fileAgeMinutes = (now - stats.mtimeMs) / 60000;

          if (fileAgeMinutes > MAX_AGE_MINUTES) {
            fs.unlink(filePath, (err) => {
              if (err) {
                logger.error(
                  `[CRON] Gagal menghapus file: ${filePath} - ${err.message}`,
                );
              } else {
                // ❌ SALAH: logger.info`...` (template literal)
                // ✅ BENAR: logger.info("...") (string biasa)
                logger.info(`[CRON] File dihapus: ${filePath}`);
              }
            });
          }
        });
      });
    });
  });
};
