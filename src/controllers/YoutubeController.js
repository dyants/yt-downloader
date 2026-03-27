import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class YoutubeController {
    youtubeService;
    constructor(youtubeService) {
        this.youtubeService = youtubeService;
    }
    getInfo = async (req, res) => {
        const url = req.query.url;
        if (!this.youtubeService.validateUrl(url)) {
            return res.status(400).json({ error: "URL tidak valid" });
        }
        try {
            const info = await this.youtubeService.getVideoInfo(url);
            return res.json(info);
        }
        catch (err) {
            console.error("Get Info Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    };
    download = async (req, res) => {
        const url = req.query.url;
        if (!this.youtubeService.validateUrl(url)) {
            return res.status(400).json({ error: "URL tidak valid" });
        }
        try {
            const info = await this.youtubeService.getVideoInfo(url);
            const safeTitle = info.title.replace(/[^\w\s]/gi, "_");
            const outputPath = path.resolve(__dirname, `../../temp/${safeTitle}.mp4`);
            await this.youtubeService.downloadVideo(url, outputPath);
            res.download(outputPath, `${safeTitle}.mp4`, (err) => {
                if (err)
                    console.error("Download error:", err);
                fs.unlink(outputPath, () => { });
            });
        }
        catch (err) {
            console.error("Download Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    };
    downloadAudio = async (req, res) => {
        const url = req.query.url;
        if (!this.youtubeService.validateUrl(url)) {
            return res.status(400).json({ error: "URL tidak valid" });
        }
        try {
            const info = await this.youtubeService.getVideoInfo(url);
            const safeTitle = info.title.replace(/[^\w\s]/gi, "_");
            const outputPath = path.resolve(__dirname, `../../temp/${safeTitle}.mp3`);
            await this.youtubeService.downloadAudio(url, outputPath);
            res.download(outputPath, `${safeTitle}.mp3`, (err) => {
                if (err)
                    console.error("Download error:", err);
                fs.unlink(outputPath, () => { });
            });
        }
        catch (err) {
            console.error("Download MP3 Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    };
}
