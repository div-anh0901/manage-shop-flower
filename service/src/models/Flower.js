const mongoose = require("mongoose");
const { STATUS_FLOWER } = require("./contants/FlowerContant");

const FlowerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: {type: String, required: true, trim: true },
    category: { type: String },
    basePrice: { type: Number, min: 0 },
    currentPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    description: { type: String, trim: true },
    status: { type: String, enum: [STATUS_FLOWER.ACTIVE, STATUS_FLOWER.LOCK],default: STATUS_FLOWER.ACTIVE, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flowers", FlowerSchema);