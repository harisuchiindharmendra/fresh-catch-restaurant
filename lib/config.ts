export const siteConfig = {
  name: 'Fresh Catch',
  tagline: 'Fresh From The Ocean. Crafted Into Art.',
  description:
    'An elevated seafood dining experience designed for unforgettable nights.',
  address: '12 Harbour Lane, Coastal District',
  phone: '+1 (555) 247-FISH',
  hours: 'Tuesday — Sunday · 18:00 — 23:30',
  established: 2014,
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
    caption: 'Twenty years at the pass',
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
 * Signature dishes — swap `image` with `/images/your-file.jpg`
 * after dropping your photo into /public/images/.
 */
export const dishes = [
  {
    name: 'Hokkaido Scallop',
    description:
      'Hand-dived, seared rare, finished with brown butter, dashi reduction and a single ribbon of yuzu kosho.',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=80',
    pairing: 'Domaine Leflaive Puligny-Montrachet',
  },
  {
    name: 'Atlantic Sea Bass',
    description:
      'Salt-baked whole over kelp embers, deboned tableside, finished with herb oil and bone marrow.',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&q=80',
    pairing: 'Krug Grande Cuvée, 171ème Édition',
  },
  {
    name: 'Octopus, Charred',
    description:
      'Galician octopus over wood fire, smoked paprika, confit fennel, citrus pearls, and aged sherry vinegar.',
    image:
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1600&q=80',
    pairing: 'Tinto Pesquera Crianza, 2019',
  },
  {
    name: 'Bluefin Toro',
    description:
      'Otoro nigiri on aged shari, brushed with a single drop of barrel-aged tamari and finished with wasabi root.',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80',
    pairing: 'Hibiki 21 Year',
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
    src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Plating',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crudo',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=1200&q=80',
    caption: 'Dining Room',
    span: 'wide' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cellar',
    span: 'tall' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Bar',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=1200&q=80',
    caption: 'Detail',
    span: 'normal' as const,
  },
];
