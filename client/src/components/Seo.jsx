import { useEffect } from 'react';

export default function Seo({
  title,
  description,
  image,
  path = '',
  type = 'website',
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Nemat Gems and Jewellery`
      : 'Nemat Gems and Jewellery';
    document.title = fullTitle;

    const ensureMeta = (selector, attr, value) => {
      if (!value) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [key, keyValue] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(key, keyValue.replace(/"/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    ensureMeta('meta[name="description"]', 'content', description);
    ensureMeta('meta[property="og:title"]', 'content', fullTitle);
    ensureMeta('meta[property="og:description"]', 'content', description);
    ensureMeta('meta[property="og:type"]', 'content', type);
    if (image) ensureMeta('meta[property="og:image"]', 'content', image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const origin = window.location.origin;
    canonical.setAttribute('href', `${origin}${path || window.location.pathname}`);
  }, [title, description, image, path, type]);

  return null;
}
