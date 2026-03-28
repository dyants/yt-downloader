import ytdl from "ytdl-core";
import fs from "fs";

export class YoutubeService {
  validateUrl(url: string): boolean {
    return ytdl.validateURL(url);
  }

  async getVideoInfo(url: string) {
    try {
      const info = await ytdl.getInfo(url);
      const details = info.videoDetails;

      return {
        title: details.title,
        thumbnail:
          details.thumbnails?.[details.thumbnails.length - 1]?.url ?? "",
        formats: info.formats,
        url: details.video_url,
        author: details.author?.name ?? "Unknown",
        duration: parseInt(details.lengthSeconds, 10) || 0,
        views: parseInt(details.viewCount, 10) || 0,
      };
    } catch (error: any) {
      throw new Error(`Gagal mendapatkan info video: ${error.message}`);
    }
  }

  async downloadVideo(url: string, outputPath: string): Promise<void> {
    try {
      const info = await ytdl.getInfo(url);

      // Prefer a format that has both video and audio; fall back to any mp4
      const format =
        ytdl.chooseFormat(info.formats, {
          quality: "highestvideo",
          filter: (f) =>
            f.container === "mp4" && !!f.hasVideo && !!f.hasAudio,
        }) ??
        ytdl.chooseFormat(info.formats, {
          quality: "highestvideo",
          filter: "videoandaudio",
        });

      await new Promise<void>((resolve, reject) => {
        const stream = ytdl.downloadFromInfo(info, { format });
        const fileStream = fs.createWriteStream(outputPath);
        stream.pipe(fileStream);
        stream.on("error", reject);
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
    } catch (error: any) {
      throw new Error(`Gagal mengunduh video: ${error.message}`);
    }
  }

  async downloadAudio(url: string, outputPath: string): Promise<void> {
    try {
      const info = await ytdl.getInfo(url);

      await new Promise<void>((resolve, reject) => {
        const stream = ytdl.downloadFromInfo(info, {
          quality: "highestaudio",
          filter: "audioonly",
        });
        const fileStream = fs.createWriteStream(outputPath);
        stream.pipe(fileStream);
        stream.on("error", reject);
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
    } catch (error: any) {
      throw new Error(`Gagal mengunduh audio: ${error.message}`);
    }
  }
}
