import express from "express"
import "dotenv/config"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import { connectionDB } from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js"
import job from "./lib/cron.js";

const app = express();
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 3000

job.start();
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectionDB();
});