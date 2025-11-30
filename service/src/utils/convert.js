 const  parseNumber = (value) => {
    if (!value) return 0;
    // value có thể là Number (Excel number) hoặc String ("100,000")
    if (typeof value === "number") return value;
    return Number(value.toString().replace(/,/g, "")) || 0;
  }


  module.exports = {
    parseNumber
  }