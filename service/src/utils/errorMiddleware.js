const { error } = require("../utils/response");

module.exports = (err, req, res, next) => {
  console.error("🔥 Global Error:", err);

  // Known error (custom)
  if (err.statusCode) {
    return error(
      res,
      err.message || "Error occurred",
      err.statusCode,
      err.errorCode || "UNKNOWN_ERROR",
      err.errors || null
    );
  }

  // Validation error (Mongoose)
  if (err.name === "ValidationError") {
    return error(
      res,
      "Validation error",
      400,
      "VALIDATION_ERROR",
      err.errors
    );
  }

  // Duplicate key (unique index)
  if (err.code === 11000) {
    return error(
      res,
      "Duplicate field value",
      409,
      "DUPLICATE_KEY",
      err.keyValue
    );
  }

  // Default: Internal server error
  return error(
    res,
    "Internal server error",
    500,
    "SERVER_ERROR",
    err.message
  );
};
