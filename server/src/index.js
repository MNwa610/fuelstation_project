import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
