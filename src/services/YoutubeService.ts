import { exec } from "child_process";
import { promisify } from "util";
import { youtubeDl as youtubedl, Payload } from "youtube-dl-exec";

const execAsync = promisify(exec);

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
        addHeader: ["referer:youtube.com", "user-agent:googlebot"],
        noPlaylist: true,
      })) as Payload;

      return {
        title: output.title,
        thumbnail: output.thumbnail,
        formats: output.formats,
        url: output.webpage_url,
        author: output.uploader || output.channel || "Unknown", // Tambahan
        duration: output.duration || 0, // Tambahan
        views: output.view_count || 0, // Tambahan
      };
    } catch (error: any) {
      // ❌ SALAH: throw new Error`...` (template literal)
      // ✅ BENAR: throw new Error("...") (string biasa)
      throw new Error(`Gagal mendapatkan info video: ${error.message}`);
    }
  }

  async downloadVideo(url: string, outputPath: string): Promise<void> {
    try {
      await youtubedl(url, {
        output: outputPath,
        format: "mp4",
        noPlaylist: true,
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
      });
    } catch (error: any) {
      throw new Error(`Gagal mengunduh audio: ${error.message}`);
    }
  }
}
