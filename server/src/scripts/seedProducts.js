import { connectDatabase } from '../config/database.js';
import { Product } from '../models/Product.js';

const samples = [
  {
    name: 'Sample Crystal Round Cut — Ruby Tone',
    slug: 'sample-crystal-round-cut-ruby-tone',
    sku: 'SAMPLE-RUBY-01',
    category: 'Artificial Gems',
    material: 'Crystal glass',
    color: 'Ruby',
    shape: 'Round',
    size: '6 mm',
    finish: 'Faceted',
    description:
      'SAMPLE PRODUCT — clearly marked for demonstration only. Not real business inventory. Replace or delete before launch.',
    moq: '50 pieces',
    priceLabel: 'Contact for quotation',
    stockStatus: 'made_to_order',
    status: 'published',
    featured: true,
    images: [],
    seo: {
      title: 'Sample Ruby Tone Crystal Round Cut',
      description: 'Demonstration product for the Nemat Gems catalogue.',
    },
    publishedAt: new Date(),
  },
  {
    name: 'Sample Decorative Stone — Emerald Tone',
    slug: 'sample-decorative-stone-emerald-tone',
    sku: 'SAMPLE-EMERALD-01',
    category: 'Decorative Stones',
    material: 'Acrylic',
    color: 'Emerald',
    shape: 'Oval',
    size: '10 x 8 mm',
    finish: 'Polished',
    description:
      'SAMPLE PRODUCT — clearly marked for demonstration only. Not real business inventory. Replace or delete before launch.',
    moq: '100 pieces',
    priceLabel: 'Contact for quotation',
    stockStatus: 'in_stock',
    status: 'published',
    featured: true,
    images: [],
    seo: {
      title: 'Sample Emerald Tone Decorative Stone',
      description: 'Demonstration product for the Nemat Gems catalogue.',
    },
    publishedAt: new Date(),
  },
  {
    name: 'Sample Crystal Bead Strand — Sapphire Tone',
    slug: 'sample-crystal-bead-strand-sapphire-tone',
    sku: 'SAMPLE-SAPPHIRE-01',
    category: 'Beads and Crystals',
    material: 'Crystal glass',
    color: 'Sapphire',
    shape: 'Round bead',
    size: '4 mm',
    finish: 'Faceted',
    description:
      'SAMPLE PRODUCT — clearly marked for demonstration only. Not real business inventory. Replace or delete before launch.',
    moq: '10 strands',
    priceLabel: 'Contact for quotation',
    stockStatus: 'made_to_order',
    status: 'published',
    featured: false,
    images: [],
    seo: {
      title: 'Sample Sapphire Tone Crystal Beads',
      description: 'Demonstration product for the Nemat Gems catalogue.',
    },
    publishedAt: new Date(),
  },
];

async function main() {
  await connectDatabase();

  for (const sample of samples) {
    await Product.findOneAndUpdate({ slug: sample.slug }, sample, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  console.log(`Seeded ${samples.length} sample products (easy to delete; marked as SAMPLE).`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
