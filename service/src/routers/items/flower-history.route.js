const express = require("express");
const { filterHistory } = require("../../controllers/flowerHistory.controller");
const router = express.Router();

router.post("/", filterHistory);

module.exports = router;