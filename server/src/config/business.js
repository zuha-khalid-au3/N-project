export const businessConfig = {
  name: process.env.BUSINESS_NAME || 'Nemat Gems and Jewellery',
  tagline: 'Artificial gems and stones for your next creation',
  phone: process.env.BUSINESS_PHONE || '+917877609474',
  whatsapp: process.env.BUSINESS_WHATSAPP || '+917877609474',
  email: process.env.BUSINESS_EMAIL || 'avikhan7891@gmail.com',
  address:
    process.env.BUSINESS_ADDRESS ||
    'Plot No 2778, Mohalla Chabuk Sawaran, Ramganj, Jaipur, Rajasthan 302003',
  mapUrl:
    process.env.BUSINESS_MAP_URL ||
    'https://www.google.com/maps/search/?api=1&query=Plot%20No%202778%20Mohalla%20Chabuk%20Sawaran%20Ramganj%20Jaipur%20Rajasthan%20302003',

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
