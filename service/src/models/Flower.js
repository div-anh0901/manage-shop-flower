const mongoose = require("mongoose");

const FlowerSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true }, // e.g., "Rose"
    latinName: { type: String, trim: true },            // e.g., "Rosa"
    category: {type: String},
    
    // Default/base attributes (can be overridden per variant)
    defaultColor: { type: String, trim: true },
    defaultStemLengthCm: { type: Number, min: 0 },
    basePrice: { type: Number, min: 0 },  // used if no variants
    baseCost: { type: Number, min: 0 },
    currency: { type: String, default: "VND", uppercase: true },   
    suppliers: {type: String},

    // Meta
    images: [{ type: String }],
    description: { type: String, trim: true },
    originCountry: { type: String, trim: true, uppercase: true }, // e.g., "VN", "NL"
    seasonal: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive", "Archived"], default: "Active", index: true },
    isDeleted: { type: Boolean, default: false }, // soft delete

  },
  { timestamps: true }
);

module.exports = mongoose.model("Flowers", FlowerSchema);