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
    display: '+91 821 485 2604',
    tel: '+918214852604',
  },
  hours: {
    summary: 'Open daily · 12 — 23',
    detail: 'Tuesday — Sunday · 12 PM – 11 PM',
  },
  established: 2014,
  /* TODO — replace # with real Swiggy / Zomato restaurant URLs */
  order: {
    swiggy: '#',
    zomato: '#',
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
 * Signature dishes — coastal Indian seafood.
 * Swap `image` with `/images/your-file.jpg` after dropping your photo
 * into /public/images/.
 */
export const dishes = [
  {
    name: 'Tandoori Pomfret',
    description:
      'Whole pomfret marinated overnight in yogurt, kashmiri chilli and ajwain, finished in the clay oven and served with green chutney and burnt lime.',
    image:
      'https://images.unsplash.com/photo-1626777553635-94e9d2add9bb?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Mangalorean Fish Curry',
    description:
      'Day-boat seer fish in a coconut-and-kokum gravy fired with byadgi chilli and curry leaf, served with steamed neer dosa.',
    image:
      'https://images.unsplash.com/photo-1631292784640-2b24eea8aaad?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Meen Pollichathu',
    description:
      'Karimeen wrapped in banana leaf with a Keralan masala of shallot, ginger and black pepper, slow-grilled over coconut wood embers.',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Prawn Ghee Roast',
    description:
      'Mangalore tiger prawns tossed in a hand-pounded byadgi-and-coriander masala finished with country ghee — sweet, smoky, restrained heat.',
    image:
      'https://images.unsplash.com/photo-1633237308525-cd587cf71926?auto=format&fit=crop&w=1600&q=80',
  },
];

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
