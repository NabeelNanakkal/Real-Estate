const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getImageUrl = (img) => {
  if (!img) return '/placeholder.jpg';
  if (img.startsWith('http') || img.startsWith('blob:')) return img;
  return `${BASE_URL}/${img.startsWith('/') ? img.slice(1) : img}`;
};

export const generateFavicon = (srcUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      // Draw background (dark color) and rounded rect effect
      ctx.fillStyle = '#0F172A';
      
      // Path for rounded rect
      const radius = 12;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(64 - radius, 0);
      ctx.quadraticCurveTo(64, 0, 64, radius);
      ctx.lineTo(64, 64 - radius);
      ctx.quadraticCurveTo(64, 64, 64 - radius, 64);
      ctx.lineTo(radius, 64);
      ctx.quadraticCurveTo(0, 64, 0, 64 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();

      // Calculate aspect ratio preserving padding
      const maxDim = 48; // Leaves 8px padding on all sides
      let w = img.width;
      let h = img.height;
      
      if (w > h) {
        h = (h / w) * maxDim;
        w = maxDim;
      } else {
        w = (w / h) * maxDim;
        h = maxDim;
      }

      const x = (64 - w) / 2;
      const y = (64 - h) / 2;

      ctx.drawImage(img, x, y, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = srcUrl;
  });
};
