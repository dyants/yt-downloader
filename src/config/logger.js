import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";
dotenv.config();
const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/app.log" }),
    ],
});
export default logger;
