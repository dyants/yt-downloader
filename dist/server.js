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
const PORT = process.env.PORT || process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    startCleanTempJob();
});
