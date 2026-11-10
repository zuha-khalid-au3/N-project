export const businessConfig = {
  name: 'Nemat Gems and Jewellery',
  tagline: 'Artificial gems and stones for your next creation',
  phone: '+917877609474',
  whatsapp: '+917877609474',
  email: 'avikhan7891@gmail.com',
  address: 'Plot No 2778, Mohalla Chabuk Sawaran, Ramganj, Jaipur, Rajasthan 302003',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Plot%20No%202778%20Mohalla%20Chabuk%20Sawaran%20Ramganj%20Jaipur%20Rajasthan%20302003',
  hours: 'Monday – Saturday, 10:00 AM – 6:00 PM',
  socialLinks: {
    instagram: '',
    facebook: '',
    linkedin: '',
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

export function mergeBusinessConfig(remote) {
  if (!remote) return businessConfig;
  return {
    ...businessConfig,
    ...remote,
    socialLinks: {
      ...businessConfig.socialLinks,
      ...(remote.socialLinks || {}),
    },
    categories: remote.categories?.length ? remote.categories : businessConfig.categories,
    manufacturingClaims: remote.manufacturingClaims?.length
      ? remote.manufacturingClaims
      : businessConfig.manufacturingClaims,
  };
}
