const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getImageUrl = (img) => {
  if (!img) return '/placeholder.jpg';
  if (img.startsWith('http') || img.startsWith('blob:')) return img;
  return `${BASE_URL}/${img.startsWith('/') ? img.slice(1) : img}`;
};
