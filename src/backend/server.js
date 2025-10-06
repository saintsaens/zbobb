import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Allow all origins (for development)
app.use(cors());

app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
