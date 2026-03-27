import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import youtubeRoutes from "./routes/youtubeRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public")); // Serve static files from 'public' folder
app.use(express.json()); // Parse JSON bodies
app.use("/api/youtube", youtubeRoutes);
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});
export default app;
