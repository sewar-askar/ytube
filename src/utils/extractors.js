export const extractVideoId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

export const extractPlaylistId = (url) => {
  const match = url.match(/[&?]list=([^&]+)/i);
  return match ? match[1] : null;
};
export const extractUsernameFromUrl = (url) => {
  const match = url.match(/youtube\.com\/(?:c\/|user\/|@|channel\/)?([^/]+)/);
  return match ? match[1] : null;
};
