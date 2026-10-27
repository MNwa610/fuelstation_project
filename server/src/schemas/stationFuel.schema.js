import { z } from "zod";

export const updateStationFuelSchema = z
  .object({
    status: z.enum(["AVAILABLE", "LOW", "OUT"]).optional(),
    currentLiters: z.number().min(0, "Литры не могут быть отрицательными").optional(),
    price: z.number().positive("Цена должна быть больше 0").optional(),
  })
  .refine(
    (data) =>
      data.status !== undefined ||
      data.currentLiters !== undefined ||
      data.price !== undefined,
    { message: "Нужно передать хотя бы одно поле" }
  );
