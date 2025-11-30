// 📌 Success Response
exports.success = (res, message, data = null, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  };
  
  // 📌 Error Response
  exports.error = (res, message, status = 400, errorCode = null, errors = null) => {
    return res.status(status).json({
      success: false,
      message,
      errorCode,
      errors
    });
  };
  