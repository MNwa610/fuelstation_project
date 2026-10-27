import cron from "node-cron";
import app from "./app.js";
import { runSimulation } from "./services/simulation.service.js";

const PORT = process.env.PORT || 3000;

cron.schedule("0 0 * * *", () => {
  runSimulation().catch((err) => {
    console.error("Ошибка симуляции:", err.message);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
