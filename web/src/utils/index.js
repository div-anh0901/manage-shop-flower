export function parseNumber(value) {
    if (!value) return 0;
  
    // value có thể là Number (Excel number) hoặc String ("100,000")
    if (typeof value === "number") return value;
  
    return Number(value.toString().replace(/,/g, "")) || 0;
  }

  export const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    return d.toLocaleString("vi-VN"); // 22/11/2025, 16:07:33
  };

export const formatNumber = (num) =>
    typeof num === "number"
      ? num.toLocaleString("vi-VN")
      : num;


export const formatObjectId = (val) => val?.toString();

export const formatArray = (arr) => Array.isArray(arr) ? `${arr.length} items` : "";

export const formatDateYYYYMMDD = (dateStr) => {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};