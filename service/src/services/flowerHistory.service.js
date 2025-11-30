const FlowerHistory = require("../models/FlowerHistory");

exports.saveFlowerHistory = async (req, oldData, newData, updatedBy = null) => {
  const changes = [];
  delete newData._id;
  delete newData.images;
  delete newData.createdAt;
  delete newData.updatedAt;
  Object.keys(newData).forEach((field) => {
    if (oldData[field] !== undefined && oldData[field] !== newData[field]) {
      changes.push({
        field,
        oldValue: oldData[field],
        newValue: newData[field],
      });
    }
  });

  if (changes.length === 0) return; // nothing changed

  await FlowerHistory.create({
    flowerId: oldData._id,
    changedBy: updatedBy,
    changes,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    device: req.headers["x-device-info"] || "unknown",
  });
};
