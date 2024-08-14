export const extractUsernameFromUrl = (url) => {
  const match = url.match(/youtube\.com\/(?:c\/|user\/|@|channel\/)?([^/]+)/);
  return match ? match[1] : null;
};
