import { JournalArticle } from '../types';

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'journal-01',
    slug: 'the-architecture-of-normandy-flax',
    title: 'The Architecture of Normandy Flax: From Coastal Field to Garment',
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
    tags: ['Normandy Flax', 'European Linen', 'Sustainable Luxury', 'Fabric Botany', 'Summer Tailoring'],
    keyFacts: [
      { label: 'Fiber Composition', value: '100% Certified European Flax®' },
      { label: 'Fiber Origin', value: 'Normandy Coastal Strip, France' },
      { label: 'Fabric Density', value: '260 GSM Architectural Slub' },
      { label: 'Retting Process', value: 'Natural Outdoor Dew-Retting (Teillage)' },
      { label: 'Climate Suitability', value: '22°C to 45°C High Humidity & Heat' }
    ],
    faqs: [
      {
        question: 'What makes Normandy flax superior to ordinary linen?',
        answer: 'Normandy possesses a unique oceanic microclimate with gentle thermal swings and morning mists. This allows flax stalks to grow up to one meter high with extra-long cellulose strands that provide twice the tensile strength of conventional short-staple linen.'
      },
      {
        question: 'Does DUKAAN pure linen shrink after home laundering?',
        answer: 'All DUKAAN linen fabrics undergo pre-washing and mechanical tumbler softening prior to tailoring. Residual shrinkage is strictly under 2% when washed in cold water (30°C) and hung to dry.'
      },
      {
        question: 'How does pure linen perform in humid tropical weather?',
        answer: 'Flax fibers possess a hollow polygonal core that conducts heat away from the skin up to 5 times faster than wool and 18 times faster than silk, while absorbing up to 20% of its weight in moisture before feeling wet to the touch.'
      }
    ],
    relatedProductSlugs: [
      'almond-white-linen-cropped-shirt',
      'beige-irish-linen-shirt'
    ],
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
        text: 'When you put on our Almond White Linen Cropped Shirt, you feel the structural presence of fiber that has retained its natural strength. With each subsequent wash, the flax softens while its internal crystalline structure crystallizes further, ensuring the garment outlives fleeting seasonal cycles.',
      }
    ]
  },
  {
    id: 'journal-02',
    slug: 'european-linen-vs-cotton-indian-summers',
    title: 'European Linen vs Conventional Cotton: The Definitive Guide for Tropical Climates',
    subtitle: 'Thermal conductivity, moisture-wicking physics, and why hollow flax fibers outperform cotton in 40°C heat.',
    category: 'Style Guide',
    date: 'May 10, 2025',
    readTime: '7 min read',
    author: {
      name: 'Julian Vance',
      role: 'Creative Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE1118_1de102c2-2879-4d49-97d8-172066acae36.jpg?v=1763799127',
    excerpt: 'When humidity rises above 70%, conventional cotton tends to saturate and cling. We analyze the molecular difference that makes pure European linen the superior textile for Indian summers.',
    tags: ['Linen vs Cotton', 'Summer Fabrics', 'Breathability', 'Thermal Regulation', 'Men Summer Style'],
    keyFacts: [
      { label: 'Thermal Dissipation', value: 'Linen cools skin by 3°C to 4°C relative to cotton' },
      { label: 'Moisture Capacity', value: 'Absorbs 20% moisture before damp sensation' },
      { label: 'Air Permeability', value: 'High due to wide yarn spacing & low thread density' },
      { label: 'Antibacterial Quality', value: 'Naturally resistant to bacterial odor & fungus' }
    ],
    faqs: [
      {
        question: 'Why does linen feel cooler than cotton in high humidity?',
        answer: 'Linen fibers are hollow tubes with high thermal conductivity. They absorb perspiration quickly and release it into the atmosphere almost instantaneously, creating a constant natural evaporative cooling effect.'
      },
      {
        question: 'Is linen suitable for everyday office wear?',
        answer: 'Yes. Structured linen shirts in heavier weights (200-260 GSM) hold their collar shape and drapery crisply. Subtle organic creases indicate high-grade natural yarn and relaxed contemporary elegance.'
      }
    ],
    relatedProductSlugs: [
      'beige-irish-linen-shirt',
      'almond-white-linen-cropped-shirt'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'During peak Indian summer months, humidity combined with soaring temperatures presents an engineering challenge for apparel. Conventional cotton, while soft, consists of twisted flat ribbon fibers that absorb perspiration but retain water within the weave. As a result, cotton becomes wet, heavy, and adheres uncomfortably to the skin.',
      },
      {
        type: 'quote',
        text: 'True comfort in tropical heat requires textiles that actively breathe with your body rather than insulating it.',
      },
      {
        type: 'heading',
        text: 'The Physics of Hollow Flax Fibers',
      },
      {
        type: 'paragraph',
        text: 'Flax fibers possess a wide, hollow polygonal lumen. This microscopic channel allows air and moisture vapor to travel freely through each individual strand. Independent thermal imaging confirms that skin temperature beneath pure European flax sits between 3°C and 4°C lower than beneath standard cotton twill in ambient 38°C temperatures.',
      },
      {
        type: 'paragraph',
        text: 'Furthermore, linen contains natural silica and lignins that prevent the proliferation of odor-causing bacteria, keeping you fresh throughout prolonged commutes and outdoor events.',
      }
    ]
  },
  {
    id: 'journal-03',
    slug: 'double-gauze-cotton-breathability-guide',
    title: 'Why Double Gauze Cotton is the Ultimate Humidity-Resistant Fabric',
    subtitle: 'Exploring the two-ply air-cushion architecture that prevents garment clinging in coastal climates.',
    category: 'Materiality',
    date: 'May 02, 2025',
    readTime: '5 min read',
    author: {
      name: 'Sofia Lindqvist',
      role: 'Art Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855',
    excerpt: 'Double gauze connects two micro-fine plies with invisible tacking points, creating an insulating air buffer that lifts fabric off the body. Learn why it is the definitive resort wear textile.',
    tags: ['Double Gauze', 'Organic Cotton', 'Resort Wear', 'Humidity Shield', 'Effortless Drape'],
    keyFacts: [
      { label: 'Weave Architecture', value: 'Dual-layer open plain weave with invisible tie-threads' },
      { label: 'Skin Contact Area', value: '40% less direct skin surface contact than poplin' },
      { label: 'Ironing Requirement', value: 'Zero ironing required; crinkled texture is intended' },
      { label: 'Yarn Count', value: '60s extra-long staple combed organic cotton' }
    ],
    faqs: [
      {
        question: 'What is double gauze cotton?',
        answer: 'Double gauze is made of two individual plies of lightweight cotton muslin woven simultaneously and linked together by microscopic structural stitches at regular intervals.'
      },
      {
        question: 'Does double gauze cotton require ironing?',
        answer: 'Double gauze is inherently crinkled and textured. It is engineered to be worn un-ironed directly after washing and line drying, making it the premier fabric for travel.'
      }
    ],
    relatedProductSlugs: [
      'almond-white-gauze-holiday-shirt',
      'black-gauze-holiday-shirt'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'The fundamental drawback of lightweight summer cotton is transparency and lack of structural drape. If you weave cotton thin enough to be airy, it becomes translucent. If you weave it dense enough for opacity, it traps heat. Double gauze solves this paradox through architectural ingenuity.',
      },
      {
        type: 'quote',
        text: 'Double gauze traps a layer of cooling air between two cloud-soft cotton skins, creating an organic personal micro-climate.',
      },
      {
        type: 'image',
        image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze5.jpg?v=1780592855',
        caption: 'The Almond White Gauze Holiday Shirt in natural sunlight, showing the subtle undulating surface.',
      },
      {
        type: 'heading',
        text: 'The Floating Air Pocket',
      },
      {
        type: 'paragraph',
        text: 'By tethering two sheer layers at precise five-millimeter intervals, an internal air chamber is formed. When you move, this pocket gently pumps air across the surface of your skin. The characteristic puckered surface also means only a fraction of the garment actually touches your body, preventing clinginess even during intense monsoonal humidity.',
      }
    ]
  },
  {
    id: 'journal-04',
    slug: 'capsule-wardrobe-slow-fashion-guide',
    title: 'How to Build a 10-Garment Minimalist Capsule Wardrobe for 2026',
    subtitle: 'Cost-per-wear arithmetic, modular neutral palettes, and architectural unisex versatility.',
    category: 'Style Guide',
    date: 'April 20, 2025',
    readTime: '8 min read',
    author: {
      name: 'Julian Vance',
      role: 'Creative Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/BeigeBaggyFitTrousers_1.jpg?v=1790961467',
    excerpt: 'Eliminate closet fatigue and consumerist clutter. Discover how ten thoughtfully tailored garments in neutral earthy tones unlock thirty-six interchangeable outfits.',
    tags: ['Capsule Wardrobe', 'Minimalism', 'Slow Fashion', 'Sustainable Wardrobe', 'Unisex Tailoring'],
    keyFacts: [
      { label: 'Wardrobe Size', value: '10 Core foundational garments' },
      { label: 'Outfit Combinations', value: '36+ distinct casual and elevated looks' },
      { label: 'Color Hierarchy', value: 'Almond White, Clay Sand, Moss Sepia, Obsidian Dark' },
      { label: 'Target Lifespan', value: '5+ years of continuous rotational wear' }
    ],
    faqs: [
      {
        question: 'What are the 10 essential pieces in a warm-climate capsule?',
        answer: '1 white linen overshirt, 1 beige linen button-down, 1 black gauze shirt, 1 relaxed corduroy trouser, 1 wide-leg pleated linen pant, 2 boxy organic cotton tees, 1 unlined blazer or shacket, and 2 modular co-ord sets.'
      },
      {
        question: 'How do I choose colors that always match?',
        answer: 'Stick to tonal earthen pigments derived from nature: unbleached mineral whites, terracotta, raw umber, and charcoal obsidian. These palettes harmonize naturally without visual clashes.'
      }
    ],
    relatedProductSlugs: [
      'beige-corduroy-trousers',
      'beige-baggy-fit-trousers',
      'amethyst-drape-shirt'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Fast fashion conditions consumers to seek novelty through quantity, resulting in closets packed with synthetic garments that pill after three washes and cannot be harmoniously combined. A minimalist capsule wardrobe inverts this logic: fewer garments, superior fiber provenance, and meticulous architectural silhouettes.',
      },
      {
        type: 'quote',
        text: 'Simplicity is not a lack of options; it is the freedom of having only choices that work effortlessly.',
      },
      {
        type: 'heading',
        text: 'The Modular Neutral Matrix',
      },
      {
        type: 'paragraph',
        text: 'When every garment adheres to a consistent chromatic scale (Almond White, Clay Sand, Moss Taupe, and Deep Obsidian), dressing becomes frictionless. A relaxed cropped linen overshirt pairs with pleated trousers for an evening gallery opening, or slips over loose shorts for morning espresso.',
      },
      {
        type: 'paragraph',
        text: 'Invest in longevity. Over three years, a ₹4,100 high-tensile Normandy linen shirt worn twice weekly yields a cost-per-wear of under ₹14, outperforming cheap polyester equivalents that end up in landfills within six months.',
      }
    ]
  },
  {
    id: 'journal-05',
    slug: 'how-to-care-for-pure-linen',
    title: 'The Caretaker’s Manual: How to Wash, Dry, and Preserve Pure Linen',
    subtitle: 'Preserving cellulose tensile integrity, embracing organic drape, and extending garment longevity past a decade.',
    category: 'Care Guide',
    date: 'April 10, 2025',
    readTime: '6 min read',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Textile Research',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_1.jpg?v=1787463484',
    excerpt: 'Pure linen is one of the few textiles that becomes softer, stronger, and more luminous with every wash cycle. Follow our master guide to ensure your garments last for decades.',
    tags: ['Linen Care', 'Garment Longevity', 'Washing Guide', 'Sustainable Living', 'Fabric Care'],
    keyFacts: [
      { label: 'Recommended Temperature', value: 'Cold water (30°C / 85°F) or hand wash' },
      { label: 'Detergent Preference', value: 'pH-neutral mild liquid detergent; no chlorine bleach' },
      { label: 'Drying Recommendation', value: 'Air dry on wide wooden hanger in natural shade' },
      { label: 'Ironing Recommendation', value: 'Steam lightly while damp or wear un-ironed' }
    ],
    faqs: [
      {
        question: 'Can I machine wash pure linen shirts?',
        answer: 'Yes. Use a gentle cycle with cold water and gentle spin speed. Wash with similar light colors and do not overload the drum to prevent unnecessary abrasive friction.'
      },
      {
        question: 'How do I soften stiff new linen naturally?',
        answer: 'Linen softens naturally with use and washing. To accelerate softness, add half a cup of distilled white vinegar into the final rinse compartment. Avoid chemical fabric softeners as they coat the hollow fibers and reduce breathability.'
      }
    ],
    relatedProductSlugs: [
      'almond-white-linen-cropped-shirt',
      'beige-irish-linen-shirt'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Flax is an exceptionally durable botanical fiber. Unlike synthetic yarns that break down and shed microplastics under wash agitation, linen actually gains 20% tensile strength when wet. With proper handling, your DUKAAN garments will remain in your primary wardrobe rotation for ten to fifteen years.',
      },
      {
        type: 'quote',
        text: 'Caring for linen is an act of mindfulness. Wash gently, dry naturally, and embrace the unforced beauty of raw fiber.',
      },
      {
        type: 'heading',
        text: 'Three Golden Rules of Linen Maintenance',
      },
      {
        type: 'paragraph',
        text: 'Rule 1: Always wash with cold water. High water temperatures can shock natural fibers and cause uneven tightening of the weave. Rule 2: Never use chlorine bleach or enzyme-heavy detergents, which break down plant cellulose. Rule 3: Never tumble dry on high heat. Tumble drying weakens the flax yarn and causes artificial stiffness.',
      },
      {
        type: 'paragraph',
        text: 'After washing, give the garment a firm snap while wet, smooth out the collar and placket with your palms, and hang it on a contoured wooden hanger in shade. It will dry with an elegant, natural undulating drape.',
      }
    ]
  },
  {
    id: 'journal-06',
    slug: 'conversations-on-unstructured-tailoring',
    title: 'Conversations on Unstructured Tailoring: Deconstructing Floating Canvases',
    subtitle: 'Deconstructing the suit: why removing pads and stiff canvassing requires twice the cutting precision.',
    category: 'Conversations',
    date: 'March 28, 2025',
    readTime: '8 min read',
    author: {
      name: 'Julian Vance',
      role: 'Creative Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050',
    excerpt: 'In our Neapolitan workshop, tailor Marco Vieri explains why the absence of padding exposes every seam to scrutiny, and how floating canvas allows a garment to breathe with the wearer.',
    tags: ['Unstructured Tailoring', 'Artisanal Craft', 'Neapolitan Cut', 'Slow Tailoring', 'Menswear'],
    keyFacts: [
      { label: 'Shoulder Construction', value: 'Spalla camicia shirt-sleeve shoulder without padding' },
      { label: 'Canvassing', value: 'Unlined floating chest canvas for maximum airflow' },
      { label: 'Seam Finishing', value: 'Bound French seams with pure silk thread' },
      { label: 'Range of Motion', value: 'Unrestricted natural scapular and arm articulation' }
    ],
    faqs: [
      {
        question: 'What is unstructured tailoring?',
        answer: 'Unstructured tailoring strips away heavy horsehair padding, stiff interfacings, and rigid shoulder rolls, crafting a blazer or trouser that relies solely on three-dimensional pattern cutting to hold its form.'
      },
      {
        question: 'Why is unstructured tailoring superior for modern daily wear?',
        answer: 'It moves naturally with the body, packs into a travel duffle without creasing rigidly, and feels as lightweight as a shirt while maintaining the sharp silhouette of tailored suiting.'
      }
    ],
    relatedProductSlugs: [
      'beige-corduroy-trousers',
      'a-day-in-tulum-printed-cropped-shirt'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'For more than a century, European tailoring was defined by armor. Stiff horsehair canvas, thick felt shoulder rolls, and rigid chest pieces were engineered to impose a synthetic silhouette onto the human frame. At DUKAAN, we chose an inverted philosophy: tailoring should liberate movement, not constrain it.',
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
    id: 'journal-07',
    slug: 'mediterranean-light-and-shadow',
    title: 'Mediterranean Light & Architectural Form: Campaign 04 Location Study',
    subtitle: 'Notes from our visual shoot across the limestone cliffs and minimalist sanctuaries of Menorca.',
    category: 'Campaign',
    date: 'March 14, 2025',
    readTime: '5 min read',
    author: {
      name: 'Sofia Lindqvist',
      role: 'Art Director',
    },
    coverImage: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze5.jpg?v=1780592855',
    excerpt: 'Exploring the geometry of raw limestone, harsh midday shadows, and the gentle drape of double-gauze holiday textiles along the Balearic coastline.',
    tags: ['Location Study', 'Campaign 04', 'Architecture', 'Solstice Edition', 'Balearic Light'],
    keyFacts: [
      { label: 'Shooting Location', value: 'Menorca & Ciutadella, Balearic Islands' },
      { label: 'Lighting Source', value: '100% Natural ambient coastal sunlight' },
      { label: 'Featured Textiles', value: 'Double-gauze holiday cotton & Normandy raw flax' }
    ],
    faqs: [
      {
        question: 'What inspired the Solstice Edition campaign?',
        answer: 'The collection was inspired by Brutalist limestone architecture interacting with coastal sea air and long afternoon shadows, celebrating the natural texture of plant fibers in harsh daylight.'
      }
    ],
    relatedProductSlugs: [
      'almond-white-gauze-holiday-shirt',
      'black-gauze-holiday-shirt'
    ],
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
