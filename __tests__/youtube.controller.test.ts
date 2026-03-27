import request from "supertest";
import express from "express";
import { YoutubeController } from "../src/controllers/YoutubeController.js";
import { YoutubeService } from "../src/services/YoutubeService.js";
import fs from "fs";
import path from "path";

// Buat mock service
const mockYoutubeService: Partial<YoutubeService> = {
  validateUrl: jest.fn((url) => url.startsWith("https://")),
  getVideoInfo: jest.fn(async (url) => ({
    title: "Mock Video",
    thumbnail: "https://img.youtube.com/vi/mockid/default.jpg",
    formats: [],
    url,
    author: "Unknown",
    duration: 0,
    views: 0,
  })),
  downloadAudio: jest.fn(async (url, outputPath) => {
    // Buat file dummy untuk ditest
    fs.writeFileSync(outputPath, "fake mp3 content");
  }),
};

const app = express();
const controller = new YoutubeController(mockYoutubeService as YoutubeService);

// Bind route ke express
app.get("/api/youtube/download-mp3", controller.downloadAudio);

// Cleanup file setelah test
afterEach(() => {
  const filePath = path.resolve(__dirname, "../temp/Mock_Video.mp3");
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

describe("GET /api/youtube/download-mp3", () => {
  it("should return mp3 file for valid URL", async () => {
    const response = await request(app)
      .get("/api/youtube/download-mp3")
      .query({ url: "https://www.youtube.com/watch?v=mock" });

    expect(response.status).toBe(200);
    expect(response.headers["content-disposition"]).toContain("attachment");
    expect(response.headers["content-type"]).toBe("audio/mpeg");
  });

  it("should return 400 for invalid URL", async () => {
    (mockYoutubeService.validateUrl as jest.Mock).mockReturnValue(false);

    const response = await request(app)
      .get("/api/youtube/download-mp3")
      .query({ url: "invalid-url" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "URL tidak valid" });
  });

  it("should return 500 if service throws error", async () => {
    (mockYoutubeService.validateUrl as jest.Mock).mockReturnValue(true);
    (mockYoutubeService.downloadAudio as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error("Service error");
      },
    );

    const response = await request(app)
      .get("/api/youtube/download-mp3")
      .query({ url: "https://www.youtube.com/watch?v=mock" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Service error" });
  });
});
