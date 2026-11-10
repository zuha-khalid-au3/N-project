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

import { getAssetOrigin } from '../config/apiBase.js';

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = getAssetOrigin();
  const path = url.startsWith('/') ? url : `/${url}`;
  return origin ? `${origin}${path}` : path;
}
