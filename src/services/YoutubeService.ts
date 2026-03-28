import { youtubeDl as youtubedl, Payload } from "youtube-dl-exec";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path ke cookies file yang ditulis oleh server.ts saat startup
const COOKIES_PATH = path.resolve(__dirname, "../../cookies.txt");
const hasCookies = () =>
  fs.existsSync(COOKIES_PATH) && fs.statSync(COOKIES_PATH).size > 0;

export class YoutubeService {
  validateUrl(url: string): boolean {
    return /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(url);
  }

  async getVideoInfo(url: string) {
    try {
      const output = (await youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        noPlaylist: true,
        // Gunakan cookies jika tersedia (untuk bypass bot detection di server)
        ...(hasCookies() ? { cookies: COOKIES_PATH } : {}),
      })) as Payload;

      return {
        title: output.title,
        thumbnail: output.thumbnail,
        formats: output.formats,
        url: output.webpage_url,
        author: output.uploader || output.channel || "Unknown",
        duration: output.duration || 0,
        views: output.view_count || 0,
      };
    } catch (error: any) {
      throw new Error(`Gagal mendapatkan info video: ${error.message}`);
    }
  }

  async downloadVideo(url: string, outputPath: string): Promise<void> {
    try {
      await youtubedl(url, {
        output: outputPath,
        format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        noPlaylist: true,
        mergeOutputFormat: "mp4",
        ffmpegLocation: "ffmpeg",
        ...(hasCookies() ? { cookies: COOKIES_PATH } : {}),
      });
    } catch (error: any) {
      throw new Error(`Gagal mengunduh video: ${error.message}`);
    }
  }

  async downloadAudio(url: string, outputPath: string): Promise<void> {
    try {
      await youtubedl(url, {
        output: outputPath,
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: "192k" as any,
        ffmpegLocation: "ffmpeg",
        noPlaylist: true,
        ...(hasCookies() ? { cookies: COOKIES_PATH } : {}),
      });
    } catch (error: any) {
      throw new Error(`Gagal mengunduh audio: ${error.message}`);
    }
  }
}
