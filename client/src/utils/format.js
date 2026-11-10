export function formatStockStatus(status) {
  switch (status) {
    case 'in_stock':
      return 'In stock';
    case 'out_of_stock':
      return 'Out of stock';
    case 'made_to_order':
    default:
      return 'Made to order';
  }
}

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
  const origin = apiBase.replace(/\/api\/?$/, '');
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}
