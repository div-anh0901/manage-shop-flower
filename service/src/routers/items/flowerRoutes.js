const express = require("express");
const router = express.Router();
const flowerController = require("../../controllers/flowerController");
const multer = require("multer");
const storage = multer.memoryStorage(); // lưu vào buffer
const upload = multer({ storage });
router.post("/exportExcel", flowerController.exportFlowersExcelWithFilter);
router.post("/importExcel", upload.single("file"), flowerController.importFlowersExcel);
router.post("/", flowerController.createFlower);
router.post("/getAll", flowerController.getFlowers);
router.get("/:id", flowerController.getFlowerById);
router.put("/:id", flowerController.updateFlower);
router.delete("/:id", flowerController.deleteFlower);


module.exports = router;