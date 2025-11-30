// middlewares/uploadFile.js
const multer = require("multer");
const path = require("path");

// Chỉ chấp nhận Excel
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".xlsx") {
    return cb(new Error("Only .xlsx files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
