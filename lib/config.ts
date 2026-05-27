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
    // Local format only — no +91 anywhere per spec. Works for click-to-call
    // on Indian devices (0821 is the Mysuru STD code).
    tel: '08214852604',
  },
  hours: {
    summary: '12 PM – 11 PM',
    summaryFull: 'Open daily · 12 PM – 11 PM',
    detail: 'Monday — Sunday · 12 PM – 11 PM',
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
 * Homepage — only the 4 most iconic signature dishes (curated, not
 * a full menu). The dedicated /menu page carries the expanded list.
 *
 * Swap `image` with `/images/your-file.jpg` after dropping a real
 * photo into /public/images/.
 */
/**
 * Each dish image is configured as a primary path (you can swap with your
 * own /images/dishes/*.jpg after dropping files into /public/images/dishes/)
 * and a fallback URL that always renders so the page can never go black.
 *
 * To use your real Fresh Catch photos: drop them at the noted paths
 * and the page picks them up automatically.
 */
const ph = (label: string) =>
  `https://placehold.co/1600x2000/07111f/c8a86a/jpeg?text=${encodeURIComponent(
    label
  )}&font=playfair`;

export const dishes = [
  {
    name: 'Tandoori Pomfret',
    description:
      'Whole pomfret marinated overnight in yogurt, kashmiri chilli and ajwain, finished in the clay oven and served with green chutney and burnt lime.',
    // Drop a real photo at /public/images/dishes/tandoori-pomfret.jpg and
    // change this to '/images/dishes/tandoori-pomfret.jpg' to use it.
    image: ph('Tandoori Pomfret'),
  },
  {
    name: 'Mangalorean Fish Curry',
    description:
      'Day-boat seer fish in a coconut-and-kokum gravy fired with byadgi chilli and curry leaf, served with steamed neer dosa.',
    image: ph('Mangalorean Fish Curry'),
  },
  {
    name: 'Meen Pollichathu',
    description:
      'Karimeen wrapped in banana leaf with a Keralan masala of shallot, ginger and black pepper, slow-grilled over coconut wood embers.',
    image: ph('Meen Pollichathu'),
  },
  {
    name: 'Prawn Ghee Roast',
    description:
      'Mangalore tiger prawns tossed in a hand-pounded byadgi-and-coriander masala finished with country ghee — sweet, smoky, restrained heat.',
    image: ph('Prawn Ghee Roast'),
  },
];

/**
 * Full menu — used by /menu route. Editorial layout, no prices online.
 * Categorised by preparation, not by protein, so the kitchen leads.
 */
export const fullMenu = [
  {
    section: 'From the Tandoor',
    intro:
      'Marinated overnight in yogurt and coastal spices, finished over live charcoal until the edges blacken and the centre stays silken.',
    items: [
      {
        name: 'Tandoori Pomfret',
        description:
          'Whole pomfret with kashmiri chilli, ajwain and lime — served with green chutney and burnt onion.',
      },
      {
        name: 'Tandoori Prawn',
        description:
          'Mangalore tigers marinated in hung curd, ginger and red chilli; finished with chaat masala.',
      },
      {
        name: 'Tandoori Crab Claws',
        description:
          'Cracked claws lacquered in coastal masala, finished over an open flame.',
      },
    ],
  },
  {
    section: 'Coastal Curries',
    intro:
      'Slow-cooked gravies built on fresh-pressed coconut, kokum and curry leaf — eaten with neer dosa, appam, or steamed rice.',
    items: [
      {
        name: 'Mangalorean Fish Curry',
        description:
          'Day-boat seer fish in coconut and kokum, fired with byadgi chilli.',
      },
      {
        name: 'Meen Moilee',
        description:
          'Kerala-style stew of king fish in coconut milk, ginger and green chilli — quiet, fragrant, restrained.',
      },
      {
        name: 'Prawn Gassi',
        description:
          'Tiger prawns in a thick coconut-and-coriander gravy with tamarind and curry leaf.',
      },
      {
        name: 'Crab Sukka',
        description:
          'Half-shell crab in a dry roasted masala of coconut, garlic and red chilli.',
      },
    ],
  },
  {
    section: 'Banana Leaf',
    intro:
      'Wrapped in fresh leaf with a layer of masala, set over coconut-wood embers — the leaf imparts a sweetness you cannot buy.',
    items: [
      {
        name: 'Meen Pollichathu',
        description:
          'Karimeen with Keralan shallot-and-pepper masala, slow grilled over embers.',
      },
      {
        name: 'Banana-leaf Prawn Roast',
        description:
          'Marinated prawns folded into the leaf with curry leaf, mustard and green chilli.',
      },
    ],
  },
  {
    section: 'Dry Preparations',
    intro:
      'Hand-pounded masalas finished with country ghee. Eaten alone, slowly, or with a glass of something cold.',
    items: [
      {
        name: 'Prawn Ghee Roast',
        description:
          'Mangalore tigers in hand-pounded byadgi-and-coriander masala, finished with country ghee — sweet, smoky, restrained heat.',
      },
      {
        name: 'Squid Pepper Fry',
        description:
          'Tender rings tossed with crushed black pepper, curry leaf and shallot.',
      },
      {
        name: 'Anchovy Fry',
        description:
          'Tiny anchovies dressed in coastal masala and fried crisp on the banana leaf.',
      },
    ],
  },
  {
    section: 'Of the Day',
    intro:
      'What the boats bring in. The list is short when the sea is rough — long when it is kind.',
    items: [
      {
        name: 'Coastal Lobster Roast',
        description:
          'Whole lobster split and roasted with garlic, curry leaf and pepper — restrained.',
      },
      {
        name: 'Whole Red Snapper',
        description:
          'Salt-rubbed and grilled whole, finished with lime and ghee. Carved at the pass.',
      },
    ],
  },
] as const;

export const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Pass',
    span: 'tall' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Service',
    span: 'wide' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1631292784640-2b24eea8aaad?auto=format&fit=crop&w=1200&q=80',
    caption: 'Coconut & kokum',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1633237308525-cd587cf71926?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ghee roast',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Room',
    span: 'wide' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1626777553635-94e9d2add9bb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Tandoor',
    span: 'tall' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Banana leaf',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=1200&q=80',
    caption: 'Detail',
    span: 'normal' as const,
  },
];
