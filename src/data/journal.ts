import { JournalArticle } from '../types';

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'journal-01',
    slug: 'the-architecture-of-normandy-flax',
    title: 'The Architecture of Normandy Flax: From Field to Garment',
    subtitle: 'An examination into how northern coastal humidity cultivates the world’s most resilient linen fibers.',
    category: 'Materiality',
    date: 'May 18, 2025',
    readTime: '6 min read',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Textile Research',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_6.jpg?v=1787463484',
    excerpt: 'True luxury lies in botanical patience. We trace the three-month journey of our certified raw flax from coastal French soil through gentle dew-retting to our weaving mills in Porto.',
    content: [
      {
        type: 'paragraph',
        text: 'Linen is not merely a fabric; it is an organic archive of climate. Unlike high-yield industrial fibres that require excessive irrigation and petroleum derivatives, flax thrives exclusively along a narrow Atlantic coastal strip spanning Normandy to the Netherlands. Here, ocean mists, temperate rain, and mineral-dense soil combine to produce extra-long cellulose strands that defy synthetic replication.',
      },
      {
        type: 'quote',
        text: 'A garment crafted from pure unbleached linen remembers the atmosphere of its origin. It cools in fierce sunlight and shelters against nocturnal breezes.',
      },
      {
        type: 'image',
        image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_3.jpg?v=1787463484',
        caption: 'The raw 260gsm Normandy slub linen cut with relaxed dropped shoulders in our Porto studio.',
      },
      {
        type: 'heading',
        text: 'Dew-Retting: Working with the Elements',
      },
      {
        type: 'paragraph',
        text: 'After pulling the mature stalks in late July, they are laid across the soil for "teillage" or dew-retting. Microorganisms, dew, and sunlight naturally dissolve the pectose binding the fibers, without the use of caustic chemicals or synthetic surfactants. This deliberate three-week process imparts our signature Almond White colorway with its organic, non-uniform mineral tones.',
      },
      {
        type: 'paragraph',
        text: 'When you put on our Almond White Linen Cropped Overshirt, you feel the structural presence of fiber that has retained its natural strength. With each subsequent wash, the flax softens while its internal crystalline structure crystallizes further, ensuring the garment outlives fleeting seasonal cycles.',
      }
    ]
  },
  {
    id: 'journal-02',
    slug: 'conversations-on-unstructured-tailoring',
    title: 'Conversations on Unstructured Tailoring with Master Artisan Marco Vieri',
    subtitle: 'Deconstructing the suit: why removing pads and stiff canvassing requires twice the cutting precision.',
    category: 'Conversations',
    date: 'April 29, 2025',
    readTime: '8 min read',
    author: {
      name: 'Julian Vance',
      role: 'Creative Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050',
    excerpt: 'In our Neapolitan workshop, tailor Marco Vieri explains why the absence of padding exposes every seam to scrutiny, and how floating canvas allows a garment to breathe with the wearer.',
    content: [
      {
        type: 'paragraph',
        text: 'For more than a century, European tailoring was defined by armor. Stiff horsehair canvas, thick felt shoulder rolls, and rigid chest pieces were engineered to impose a synthetic silhouette onto the human frame. At Dukaan, we chose an inverted philosophy: tailoring should liberate movement, not constrain it.',
      },
      {
        type: 'quote',
        text: 'When there is no padding to mask an error, your cut must be mathematically flawless. The seam must follow the clavicle like a gentle shadow.',
      },
      {
        type: 'image',
        image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050',
        caption: 'Hand-basting the pleat lines on our Beige Corduroy Trousers using silk thread.',
      },
      {
        type: 'heading',
        text: 'The Weightless Sensation',
      },
      {
        type: 'paragraph',
        text: 'By pairing relaxed straight silhouettes with tactile corduroy and washed linen, we achieve a textile with high resilience and natural drape. Marco shapes the waist with flexible internal curtaining, allowing the trouser to sit effortlessly at the waist without constriction.',
      }
    ]
  },
  {
    id: 'journal-03',
    slug: 'mediterranean-light-and-shadow',
    title: 'Mediterranean Light & Architectural Form: Campaign 04 Location Study',
    subtitle: 'Notes from our visual shoot across the limestone cliffs and minimalist sanctuaries of Menorca.',
    category: 'Campaign',
    date: 'April 14, 2025',
    readTime: '5 min read',
    author: {
      name: 'Sofia Lindqvist',
      role: 'Art Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze5.jpg?v=1780592855',
    excerpt: 'Exploring the geometry of raw limestone, harsh midday shadows, and the gentle drape of double-gauze holiday textiles along the Balearic coastline.',
    content: [
      {
        type: 'paragraph',
        text: 'The Solstice collection required an environment stripped of ornament. Menorca’s whitewashed stone quarries and modernist coastal dwellings provided the ideal backdrop: severe rectilinear planes softened only by salt air, olive trees, and the shifting angles of the afternoon sun.',
      },
      {
        type: 'quote',
        text: 'We sought imagery that prioritised texture over glamour, where shadows act as structural lines across the fabric.',
      },
      {
        type: 'image',
        image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze5.jpg?v=1780592855',
        caption: 'The Almond White Gauze Holiday Shirt caught in 3 PM cross-breeze against raw sandstone.',
      },
      {
        type: 'paragraph',
        text: 'Our photography approach intentionally avoids synthetic flash or clinical studio setups. Every shot was taken during natural sunlight transitions, capturing the true luminosity of natural raw fibres.',
      }
    ]
  }
];
