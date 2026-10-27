import { HttpError } from "../lib/httpError.js";

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new HttpError(403, "Недостаточно прав"));
      return;
    }
    next();
  };
}
