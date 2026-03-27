import { YoutubeService } from "../services/YoutubeService.js";
import { YoutubeController } from "../controllers/YoutubeController.js";

const youtubeService = new YoutubeService();
const youtubeController = new YoutubeController(youtubeService);

export { youtubeController };
