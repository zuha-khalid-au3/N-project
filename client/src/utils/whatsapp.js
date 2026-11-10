export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone || '').replace(/[^\d]/g, '');
  const text = encodeURIComponent(message || '');
  return `https://wa.me/${digits}${text ? `?text=${text}` : ''}`;
}

export function productEnquiryMessage(productName) {
  return `Hello, I am interested in "${productName}" from Nemat Gems and Jewellery. Please share availability and quotation details.`;
}

export function generalQuoteMessage() {
  return 'Hello, I would like to request a quote from Nemat Gems and Jewellery.';
}
