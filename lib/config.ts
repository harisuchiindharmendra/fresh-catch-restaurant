export const siteConfig = {
  name: 'Fresh Catch',
  legalName: 'Fresh Catch Seafood Restaurant',
  tagline: 'Fresh From The Ocean. Crafted Into Art.',
  description:
    'An elevated coastal Indian seafood experience in Gokulam, Mysuru.',
  address: {
    line1: '2955/3, 5th Main Road',
    line2: 'Vani Vilas Mohalla, Gokulam',
    city: 'Mysuru',
    state: 'Karnataka',
    postal: '570002',
  },
  phone: {
    display: '0821 485 2604',
    tel: '+918214852604',
  },
  hours: {
    summary: '12 PM — 11 PM',
    detail: 'Open daily · 12 PM to 11 PM',
  },
  established: 2014,
  order: {
    swiggy:
      'https://www.swiggy.com/city/mysore/fresh-catch-sea-food-restaurant-m-g-road-mysore-city-rest69184',
    zomato:
      'https://www.zomato.com/mysore/fresh-catch-seafood-restaurant-gokulam',
  },
};

export const scenes = [
  {
    id: 'hero',
    index: '01',
    title: 'Arrival',
    caption: 'From sea to silence',
    chapter: 'Opening',
  },
  {
    id: 'dishes',
    index: '02',
    title: 'Signature',
    caption: 'A study in restraint',
    chapter: 'The Menu',
  },
  {
    id: 'chef',
    index: '03',
    title: 'The Chef',
    caption: 'In conversation',
    chapter: 'Craft',
  },
  {
    id: 'dining',
    index: '04',
    title: 'The Room',
    caption: 'Designed for the evening',
    chapter: 'Atmosphere',
  },
  {
    id: 'gallery',
    index: '05',
    title: 'Moments',
    caption: 'Quiet pleasures',
    chapter: 'Memory',
  },
  {
    id: 'reserve',
    index: '06',
    title: 'Reserve',
    caption: 'Take your seat',
    chapter: 'Tonight',
  },
] as const;

/**
 * Homepage signature dishes — curated to four iconic plates.
 * Photography sourced from the restaurant's own dossier (Mysuru).
 *
 * The full menu lives at /menu and pulls from `menuExtended` below.
 */
export const dishes = [
  {
    name: 'Tandoori Pomfret',
    description:
      'Whole pomfret marinated overnight in yogurt, kashmiri chilli and ajwain — finished in the clay oven and served with green chutney and burnt lime.',
    image: '/images/dishes/tandoori-pomfret.jpg',
  },
  {
    name: 'Mangalorean Fish Curry',
    description:
      'Day-boat seer fish in a coconut-and-kokum gravy fired with byadgi chilli and curry leaf, served with steamed neer dosa and rice.',
    image: '/images/dishes/mangalorean-fish-curry.jpg',
  },
  {
    name: 'Meen Pollichathu',
    description:
      'Karimeen wrapped in banana leaf with a Keralan masala of shallot, ginger and black pepper — slow-grilled over coconut wood embers.',
    image: '/images/dishes/meen-pollichathu.jpg',
  },
  {
    name: 'Prawn Ghee Roast',
    description:
      'Mangalore tiger prawns tossed in a hand-pounded byadgi-and-coriander masala finished with country ghee — sweet, smoky, restrained heat.',
    image: '/images/dishes/prawn-ghee-roast.jpg',
  },
];

/**
 * Full menu — additional dishes shown on the dedicated /menu page only.
 * Group by course for the editorial menu layout.
 */
export type MenuItem = {
  name: string;
  description: string;
  image?: string;
};

export type MenuCourse = {
  course: string;
  caption: string;
  items: MenuItem[];
};

export const menuExtended: MenuCourse[] = [
  {
    course: 'From the Coast',
    caption: 'Plates that arrive whole, opened at the table.',
    items: [
      {
        name: 'Tandoori Pomfret',
        description:
          'Whole pomfret, overnight yogurt marinade, kashmiri chilli, ajwain. Clay oven. Burnt lime, green chutney.',
        image: '/images/dishes/tandoori-pomfret.jpg',
      },
      {
        name: 'Coastal Grilled Lobster',
        description:
          'Whole Karwar lobster split tableside — masala butter, coconut-wood smoke, finished with curry leaf oil.',
        image: '/images/dishes/coastal-lobster.jpg',
      },
      {
        name: 'Meen Pollichathu',
        description:
          'Karimeen in banana leaf — shallot, ginger, black pepper, slow-grilled over coconut embers.',
        image: '/images/dishes/meen-pollichathu.jpg',
      },
    ],
  },
  {
    course: 'From the Roast',
    caption: 'Slow heat. Country ghee. Restraint.',
    items: [
      {
        name: 'Prawn Ghee Roast',
        description:
          'Mangalore tiger prawns, hand-pounded byadgi masala, country ghee. Sweet smoke, low burn.',
        image: '/images/dishes/prawn-ghee-roast.jpg',
      },
      {
        name: 'Crab Pepper Fry',
        description:
          'Lady crab from the Mangalore beaches, tellicherry pepper, mustard, fresh curry leaf — finished tawa-side.',
        image: '/images/dishes/crab-pepper-fry.jpg',
      },
    ],
  },
  {
    course: 'From the Curry Pot',
    caption: 'Each pot built from a different sea.',
    items: [
      {
        name: 'Mangalorean Fish Curry',
        description:
          'Day-boat seer, coconut and kokum, byadgi chilli, curry leaf. Served with neer dosa and rice.',
        image: '/images/dishes/mangalorean-fish-curry.jpg',
      },
    ],
  },
];

export const gallery = [
  {
    src: '/images/gallery/03-kitchen-prep.jpg',
    caption: 'The Prep',
    span: 'tall' as const,
  },
  {
    src: '/images/gallery/01-storefront-day.jpg',
    caption: 'Gokulam',
    span: 'wide' as const,
  },
  {
    src: '/images/gallery/04-market-workers.jpg',
    caption: 'The Market',
    span: 'normal' as const,
  },
  {
    src: '/images/gallery/05-ghee-detail.jpg',
    caption: 'Ghee Roast',
    span: 'normal' as const,
  },
  {
    src: '/images/gallery/08-octopus-sesame.jpg',
    caption: 'Finishing',
    span: 'wide' as const,
  },
  {
    src: '/images/gallery/02-storefront-night.jpg',
    caption: 'After dark',
    span: 'tall' as const,
  },
  {
    src: '/images/gallery/07-fish-on-ice.jpg',
    caption: 'On ice',
    span: 'normal' as const,
  },
  {
    src: '/images/gallery/06-full-meal.jpg',
    caption: 'Service',
    span: 'normal' as const,
  },
];
