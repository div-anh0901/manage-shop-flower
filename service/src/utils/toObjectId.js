const mongoose = require("mongoose");

function toObjectId(id) {
  if (!id) return null;

  // Validate trước khi convert
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; // hoặc throw new Error("Invalid ObjectId")
  }

  return new mongoose.Types.ObjectId(id);
}

module.exports = toObjectId;