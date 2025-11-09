const Flower = require("../models/Flower");

// 📌 Create new flower
exports.createFlower = async (req, res) => {
  try {
    const flower = new Flower(req.body);
    const saved = await flower.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📌 Get all flowers (filter out deleted)
exports.getFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find({ isDeleted: false });
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get single flower
exports.getFlowerById = async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);
    if (!flower || flower.isDeleted) return res.status(404).json({ error: "Flower not found" });
    res.json(flower);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update flower
exports.updateFlower = async (req, res) => {
  try {
    const flower = await Flower.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flower || flower.isDeleted) return res.status(404).json({ error: "Flower not found" });
    res.json(flower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📌 Soft delete flower
exports.deleteFlower = async (req, res) => {
  try {
    const flower = await Flower.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!flower) return res.status(404).json({ error: "Flower not found" });
    res.json({ message: "Flower deleted (soft)", flower });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
