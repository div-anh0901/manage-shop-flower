const express = require("express");
const router = express.Router();

const flowerRoutes = require("./items/flowerRoutes");
const flowerHistoryRoutes = require("./items/flower-history.route");
const userRoutes = require("./items/userRoutes");

// Mount routes
router.use("/flowers", flowerRoutes);
router.use("/flowers-history", flowerHistoryRoutes);
router.use("/users", userRoutes);

module.exports = router;