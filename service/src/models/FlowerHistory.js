const mongoose = require("mongoose");

const FlowerHistorySchema = new mongoose.Schema(
  {
    flowerId: { type: mongoose.Schema.Types.ObjectId, ref: "Flowers", required: true },
    changedBy: { type: String }, // optional, e.g. req.user.id
    
    // OBJECT chứa tất cả field bị thay đổi { old, new }
    changes: [
      {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
      }
    ],
    ipAddress: String,
    userAgent: String,
    device: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlowerHistory", FlowerHistorySchema);
