export const getImageUrl = (url, fallback = "/default.jpg") => {
  if (!url || url instanceof File || typeof url !== "string") {
    return fallback;
  }
  if (url.includes("localhost") || url.startsWith("http://")) {
    return fallback;
  }
  return url;
};