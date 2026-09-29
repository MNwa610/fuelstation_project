import { z } from "zod";

// Минимальная схема на этапе 1 — расширим на следующих этапах
export const stationIdParamSchema = z.object({
  id: z.string().uuid("Некорректный id заправки"),
});
