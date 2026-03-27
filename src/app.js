import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import youtubeRoutes from "./routes/youtubeRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use("/api/youtube", youtubeRoutes);
app.get("/", (req, res) => {
    res.send({
        message: "Youtube Download is running!",
    });
});
export default app;
