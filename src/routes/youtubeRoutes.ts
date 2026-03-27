import { Router } from "express";
import { youtubeController } from "../containers/container.js";

const router = Router();

router.get("/info", youtubeController.getInfo);
router.get("/download", youtubeController.download);
router.get("/download-mp3", youtubeController.downloadAudio);

export default router;
