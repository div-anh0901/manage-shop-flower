const express = require("express");
const router = express.Router();

const flowerRoutes = require("./items/flowerRoutes");
const userRoutes = require("./items/userRoutes");

// Mount routes
router.use("/flowers", flowerRoutes);
router.use("/users", userRoutes);

module.exports = router;