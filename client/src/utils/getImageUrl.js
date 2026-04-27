export const getImageUrl = (url, fallback = "/default.jpg") => {
  if (!url || url.includes("localhost") || url.startsWith("http://")) {
    return fallback;
  }
  return url;
};