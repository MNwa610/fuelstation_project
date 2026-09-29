export function errorHandler(err, _req, res, _next) {
  console.error(err.message);
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
}
