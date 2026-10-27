import { HttpError } from "../lib/httpError.js";

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors[0]?.message || "Ошибка валидации";
      next(new HttpError(400, message));
      return;
    }
    req.body = result.data;
    next();
  };
}
