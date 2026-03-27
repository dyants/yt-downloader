import app from "./app.js";
import logger from "./config/logger.js";
import { startCleanTempJob } from "./jobs/cleanTempFiles.js";

const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
  startCleanTempJob();
});
