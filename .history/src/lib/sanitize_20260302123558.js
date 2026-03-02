export function sanitizeInput(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  for (const key in obj) {
    if (key.includes("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitizeInput(obj[key]);
    }
  }

  return obj;
}
