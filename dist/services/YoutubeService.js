import { exec } from "child_process";
import { promisify } from "util";
import { youtubeDl as youtubedl } from "youtube-dl-exec";
const execAsync = promisify(exec);
export class YoutubeService {
    validateUrl(url) {
        return /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(url);
    }
    async getVideoInfo(url) {
        try {
            const output = (await youtubedl(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: ["referer:youtube.com", "user-agent:googlebot"],
                noPlaylist: true,
            }));
            return {
                title: output.title,
                thumbnail: output.thumbnail,
                formats: output.formats,
                url: output.webpage_url,
                author: output.uploader || output.channel || "Unknown", // Tambahan
                duration: output.duration || 0, // Tambahan
                views: output.view_count || 0, // Tambahan
            };
        }
        catch (error) {
            // ❌ SALAH: throw new Error`...` (template literal)
            // ✅ BENAR: throw new Error("...") (string biasa)
            throw new Error(`Gagal mendapatkan info video: ${error.message}`);
        }
    }
    async downloadVideo(url, outputPath) {
        try {
            await youtubedl(url, {
                output: outputPath,
                format: "mp4",
                noPlaylist: true,
            });
        }
        catch (error) {
            throw new Error(`Gagal mengunduh video: ${error.message}`);
        }
    }
    async downloadAudio(url, outputPath) {
        try {
            await youtubedl(url, {
                output: outputPath,
                extractAudio: true,
                audioFormat: "mp3",
                audioQuality: "192k",
                ffmpegLocation: "ffmpeg",
                noPlaylist: true,
            });
        }
        catch (error) {
            throw new Error(`Gagal mengunduh audio: ${error.message}`);
        }
    }
}
