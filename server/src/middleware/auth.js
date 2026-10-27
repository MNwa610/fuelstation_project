import jwt from "jsonwebtoken";
import { HttpError } from "../lib/httpError.js";

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(new HttpError(401, "Нет токена"));
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.userId,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch (_err) {
    next(new HttpError(401, "Недействительный токен"));
  }
}
