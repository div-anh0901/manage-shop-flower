const { default: mongoose } = require("mongoose");
const Flower = require("../models/Flower");
const asyncHandler = require("../utils/asyncHandler");
const { paginate } = require("../utils/pagination");
const { success, error } = require("../utils/response");
const { saveFlowerHistory } = require("../services/flowerHistory.service");
const ExcelJS = require("exceljs");
const { parseNumber } = require("../utils/convert");

// 📌 Create new flower
exports.createFlower = asyncHandler(async (req, res) => {
  const data = req.body;

  if(!data.name || !data.code){
    return error(res, "Name and Code are required", 400, "VALIDATION_ERROR");
  }

  data.code = data.code.trim().toUpperCase();

  // --- 2. Check duplicate (faster than countDocuments) ---
  const exists = await Flower.exists({ code: data.code, isDeleted: false });
  if (exists) {
    return error(res, "Flower code already exists", 409, "FLOWER_CODE_DUPLICATE");
  }

  if (data.basePrice < 0 || data.currentPrice < 0) {
    return error(res, "Price must be >= 0", 409, "PRICE_ERROR");
  }
  
  if (data.currentPrice < data.basePrice) {
    return error(res, "currentPrice cannot be lower than basePrice", 409, "PRICE_ERROR");
  }

    // --- 3. Create new flower ---
  const newFlower = await Flower.create(data);

  // --- 4. Return success ---
  return success(res, "Created new flower successfull", newFlower, 201);
});

const getDataFlower = async (body) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filter,
    category,
    sort = "-createdAt",
    isAll = true
  } = body;

  const skip = (page - 1) * limit;

  const filterOptions = { isDeleted: false };

  // 🔍 Search by name or code
  if (search) {
    filterOptions.$or = [
      { name: new RegExp(search, "i") },
      { code: new RegExp(search, "i") }
    ];
  }

  // 🎯 Filter by category
  if (category) {
    filterOptions.category = category;
  }

  // 🔒 Filter by status
  if (filter.status) {
    filterOptions.status = filter.status;
  }
  let items , total;
  if(!isAll){
     [items, total] = await Promise.all([
      Flower.find(filterOptions)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Flower.countDocuments(filterOptions)
    ]);
  }else {
    [items, total] = await Promise.all([
      Flower.find(filterOptions),
      Flower.countDocuments(filterOptions)
    ]);
  }
  return {
    items, 
    page : Number(page), 
    limit: Number(limit), 
    total
  }
}

// 📌 Get all flowers (filter out deleted)
exports.getFlowers = asyncHandler(async (req, res, next) => {
  const rs  = await getDataFlower(req.body)
  return success(
    res,
    "", 
    paginate(rs.items, rs.page, rs.limit, rs.total), 
    200
  );
});


// 📌 Get single flower
exports.getFlowerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Validate MongoDB ObjectId
  if (!mongoose.isValidObjectId(id)) {
    console.log(4)
    return error(res, "Invalid flower ID format", 400, "INVALID_ID");
  }

  // 2. Query flower (ignore deleted)
  const flower = await Flower.findOne({ _id: id, isDeleted: false });

  if (!flower) {
    return error(res, "Flower not found", 404, "NOT_FOUND");
  }

  // 3. Success response
  return success(res, "Flower fetched successfully", flower);
});

// 📌 Update flower
exports.updateFlower = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // 1. Validate MongoDB ObjectId
  if (!mongoose.isValidObjectId(id)) {
    console.log(5)
    return error(res, "Invalid flower ID format", 400, "INVALID_ID");
  }

  if(!data.name || !data.code){
    return error(res, "Name and Code are required", 400, "VALIDATION_ERROR");
  }

  data.code = data.code.trim().toUpperCase();

  if (data.basePrice < 0 || data.currentPrice < 0) {
    return error(res, "Price must be >= 0", 409, "PRICE_ERROR");
  }
  
  if (data.currentPrice < data.basePrice) {
    return error(res, "currentPrice cannot be lower than basePrice", 409, "PRICE_ERROR");
  }

  // 3. Get old data
  const oldFlower = await Flower.findOne({ _id: id, isDeleted: false });

  if (!oldFlower) {
    return error(res, "Flower not found", 404, "NOT_FOUND");
  }

  // 4. Save history BEFORE updating
  await saveFlowerHistory(req, oldFlower.toObject(), data, req.user?.id);

  // 5. Update flower
  const updatedFlower = await Flower.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return success(res, "Flower updated successfully", updatedFlower);
});

// 📌 Soft delete flower
exports.deleteFlower = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Validate MongoDB ObjectId
  if (!mongoose.isValidObjectId(id)) {
    console.log(12)
    return error(res, "Invalid flower ID format", 400, "INVALID_ID");
  }

   // 2. Check product exists and not deleted
   const flower = await Flower.findOne({ _id: id, isDeleted: false });
   if (!flower) {
     return error(res, "Flower not found", 404, "NOT_FOUND");
   }
 
  // 3. Soft delete
  flower.isDeleted = true;
  await flower.save();

  return success(res, "Flower deleted (soft)", flower);
});


// 📌 Export Flowers with filter
exports.exportFlowersExcelWithFilter = asyncHandler(async (req, res) => {
  req.body.isAll = true
  const rs  = await getDataFlower(req.body)
  const flowers = rs.items
  if (!flowers || flowers.length === 0) {
    return error(res, "No flowers to export", 404, "NO_DATA");
  }

  // 3. Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Flowers");

  // 4. Header
  worksheet.columns = [
    { header: "ID", key: "_id", width: 25 },
    { header: "Name", key: "name", width: 20 },
    { header: "Code", key: "code", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Base Price", key: "basePrice", width: 15,style: { numFmt: "#,##0" } },
    { header: "Current Price", key: "currentPrice", width: 15,style: { numFmt: "#,##0" } },
    { header: "Status", key: "status", width: 15 },
    { header: "Created At", key: "createdAt", width: 20 ,style: { numFmt: "yyyy-mm-dd" }},
    { header: "Updated At", key: "updatedAt", width: 20 ,style: { numFmt: "yyyy-mm-dd" }},
  ];

  // 3. Thiết lập màu cho header row
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' } // màu xanh lá ví dụ
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' }, // màu chữ trắng
      bold: true
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // 5. Add rows
  flowers.forEach((flower) => {
    worksheet.addRow({
      _id: flower._id.toString(),
      name: flower.name,
      code: flower.code,
      category: flower.category || "",
      basePrice: flower.basePrice || 0,
      currentPrice: flower.currentPrice || 0,
      status: flower.status,
      createdAt: new Date(flower.createdAt),
      updatedAt: new Date(flower.createdAt),
    });
  });

  // 6. Set response headers for download
  const fileName = `Flowers_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  // 7. Write workbook to response
  await workbook.xlsx.write(res);
  res.end();
});

// 📌 Import Flowers from Excel
exports.importFlowersExcel = asyncHandler(async (req, res) => {
  if (!req.file) {
    return error(res, "No file uploaded", 400, "NO_FILE");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);
  const worksheet = workbook.worksheets[0];

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    rows.push({
      name: row.getCell(1).value?.toString().trim(),
      code: row.getCell(2).value?.toString().trim().toUpperCase(),
      category: row.getCell(3).value?.toString().trim() || "",
      basePrice: parseNumber(row.getCell(4).value) || 0,
      currentPrice: parseNumber(row.getCell(5).value) || 0,
      status: row.getCell(6).value?.toString().trim() || "Active",
    });
  });

  const result = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const row of rows) {
    // Validate required
    if (!row.name || !row.code) {
      result.skipped++;
      result.errors.push({ row, reason: "Name or code missing" });
      continue;
    }

    if (row.basePrice < 0 || row.currentPrice < 0 || row.currentPrice < row.basePrice) {
      result.skipped++;
      result.errors.push({ row, reason: "Invalid price" });
      continue;
    }

    // Check duplicate code
    const existing = await Flower.findOne({ code: row.code });

    if (existing) {
      // Update
      const oldData = existing.toObject();
      Object.assign(existing, row);
      await existing.save();

      // 4. Save history
      await saveFlowerHistory(req, oldData, row, req.user?.id);

      result.updated++;
    } else {
      // Create new
      await Flower.create(row);
      result.created++;
    }
  }

  return success(res, "Import completed", result, 200);
});



