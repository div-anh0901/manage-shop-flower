const FlowerHistory = require("../models/FlowerHistory");
const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/response");
const toObjectId = require("../utils/toObjectId");
// GET /api/flowers/:id/history
exports.getProductHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const history = await FlowerHistory.find({ productId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
  
    return success(res, "OK", history, 200);
  });

  // GET /api/history/user/:userId
exports.getHistoryByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    const history = await FlowerHistory.find({ userId })
      .populate("productId", "name code")
      .sort({ createdAt: -1 });
  
    return success(res, "OK", history, 200);
});
  

exports.filterHistory = asyncHandler(async (req, res) => {
    const { startDate, endDate, field, productId, userId } = req.body;

    let query = {};

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (field) query["changes.field"] = field;
    if (productId) query.flowerId = toObjectId(productId);
    if (userId) query.userId = userId;

    const history = await FlowerHistory.find(query)
        .sort({ createdAt: -1 });

    return success(res, "Filtered result", history, 200);
});