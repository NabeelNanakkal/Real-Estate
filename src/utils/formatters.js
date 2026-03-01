export const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString()}`;

export const formatDate = (dateString, options) =>
  new Date(dateString).toLocaleDateString('en-US', options || {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });

export const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().charAt(0).toUpperCase() || '?';
};
