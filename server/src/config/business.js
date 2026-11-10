export const businessConfig = {
  name: process.env.BUSINESS_NAME || 'Nemat Gems and Jewellery',
  tagline: 'Artificial gems and stones for your next creation',
  phone: process.env.BUSINESS_PHONE || '+00 0000000000',
  whatsapp: process.env.BUSINESS_WHATSAPP || '+00 0000000000',
  email: process.env.BUSINESS_EMAIL || 'info@example.com',
  address: process.env.BUSINESS_ADDRESS || 'Your business address',
  mapUrl: process.env.BUSINESS_MAP_URL || '',
  hours: process.env.BUSINESS_HOURS || 'Monday – Saturday, 10:00 AM – 6:00 PM',
  socialLinks: {
    instagram: process.env.BUSINESS_INSTAGRAM || '',
    facebook: process.env.BUSINESS_FACEBOOK || '',
    linkedin: process.env.BUSINESS_LINKEDIN || '',
  },
  categories: [
    'Artificial Gems',
    'Decorative Stones',
    'Beads and Crystals',
    'Custom Designs',
  ],
  manufacturingClaims: [
    'Precision-cut artificial gems for jewellery and design applications',
    'Consistent colour matching across wholesale orders',
    'Custom shapes and finishes available on request',
    'Support for manufacturers, designers, and wholesale buyers',
  ],
};
