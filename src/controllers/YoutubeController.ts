import { Request, Response } from "express";
import { YoutubeService } from "../services/YoutubeService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import logger from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class YoutubeController {
  constructor(private youtubeService: YoutubeService) {}

  getInfo = async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
      logger.warn("Get info - URL tidak disediakan");
      return res.status(400).json({ error: "URL tidak disediakan" });
    }

    if (!this.youtubeService.validateUrl(url)) {
      logger.warn(`Get info - URL tidak valid: ${url}`);
      return res.status(400).json({ error: "URL tidak valid" });
    }

    try {
      logger.info(`Get info - Mengambil info untuk: ${url}`);
      const info = await this.youtubeService.getVideoInfo(url);
      logger.info(`Get info - Berhasil: ${info.title}`);
      return res.json(info);
    } catch (err: any) {
      logger.error(`Get Info Error: ${err.message}`);
      return res.status(500).json({
        error: "Gagal mengambil informasi video",
        details: err.message,
      });
    }
  };

  download = async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
      logger.warn("Download - URL tidak disediakan");
      return res.status(400).json({ error: "URL tidak disediakan" });
    }

    if (!this.youtubeService.validateUrl(url)) {
      logger.warn(`Download - URL tidak valid: ${url}`);
      return res.status(400).json({ error: "URL tidak valid" });
    }

    try {
      logger.info(`Download - Memulai download video: ${url}`);
      const info = await this.youtubeService.getVideoInfo(url);
      const safeTitle = info.title.replace(/[^\w\s]/gi, "_");
      const outputPath = path.resolve(__dirname, `../../temp/${safeTitle}.mp4`);

      // Pastikan folder temp ada
      const tempDir = path.resolve(__dirname, "../../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      await this.youtubeService.downloadVideo(url, outputPath);

      logger.info(`Download - Berhasil mendownload: ${safeTitle}`);

      res.download(outputPath, `${safeTitle}.mp4`, (err) => {
        if (err) {
          logger.error(`Download error saat mengirim file: ${err.message}`);
        }
        // Hapus file setelah dikirim
        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error(`Gagal menghapus temp file: ${unlinkErr.message}`);
          } else {
            logger.info(`Temp file dihapus: ${outputPath}`);
          }
        });
      });
    } catch (err: any) {
      logger.error(`Download Error: ${err.message}`);
      return res.status(500).json({
        error: "Gagal mengunduh video",
        details: err.message,
      });
    }
  };

  downloadAudio = async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
      logger.warn("Download MP3 - URL tidak disediakan");
      return res.status(400).json({ error: "URL tidak disediakan" });
    }

    if (!this.youtubeService.validateUrl(url)) {
      logger.warn(`Download MP3 - URL tidak valid: ${url}`);
      return res.status(400).json({ error: "URL tidak valid" });
    }

    try {
      logger.info(`Download MP3 - Memulai download audio: ${url}`);
      const info = await this.youtubeService.getVideoInfo(url);
      const safeTitle = info.title.replace(/[^\w\s]/gi, "_");
      const outputPath = path.resolve(__dirname, `../../temp/${safeTitle}.mp3`);

      // Pastikan folder temp ada
      const tempDir = path.resolve(__dirname, "../../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      await this.youtubeService.downloadAudio(url, outputPath);

      logger.info(`Download MP3 - Berhasil mendownload: ${safeTitle}`);

      res.download(outputPath, `${safeTitle}.mp3`, (err) => {
        if (err) {
          logger.error(`Download MP3 error saat mengirim file: ${err.message}`);
        }
        // Hapus file setelah dikirim
        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error(`Gagal menghapus temp file: ${unlinkErr.message}`);
          } else {
            logger.info(`Temp file dihapus: ${outputPath}`);
          }
        });
      });
    } catch (err: any) {
      logger.error(`Download MP3 Error: ${err.message}`);
      return res.status(500).json({
        error: "Gagal mengunduh audio",
        details: err.message,
      });
    }
  };
}
