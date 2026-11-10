export const businessConfig = {
  name: 'Nemat Gems and Jewellery',
  tagline: 'Artificial gems and stones for your next creation',
  phone: '+00 0000000000',
  whatsapp: '+00 0000000000',
  email: 'info@example.com',
  address: 'Your business address',
  mapUrl: '',
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
