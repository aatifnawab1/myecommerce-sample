// Mock data for Zaylux Store

export const perfumes = [
  {
    id: 'perf-1',
    name: 'Essence Noir',
    category: 'perfume',
    price: 450,
    originalPrice: 550,
    currency: 'SAR',
    description: 'A sophisticated blend of oud and amber, crafted for the modern connoisseur. Long-lasting fragrance with notes of sandalwood and vanilla.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fHx8MTc2NjU5Nzc1MHww&ixlib=rb-4.1.0&q=85',
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'perf-2',
    name: 'Royal Velvet',
    category: 'perfume',
    price: 520,
    originalPrice: 620,
    currency: 'SAR',
    description: 'Luxurious oriental fragrance with rich black pepper, musk, and leather accords. A statement of elegance and power.',
    image: 'https://images.unsplash.com/photo-1585218334450-afcf929da36e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fHx8MTc2NjU5Nzc1MHww&ixlib=rb-4.1.0&q=85',
    inStock: true,
    rating: 4.9,
    reviews: 98
  },
  {
    id: 'perf-3',
    name: 'Luxe Éternelle',
    category: 'perfume',
    price: 680,
    originalPrice: 780,
    currency: 'SAR',
    description: 'The epitome of timeless elegance. A classic floral bouquet with jasmine, rose, and ylang-ylang, finished with powdery aldehydes.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fHx8MTc2NjU5Nzc1MHww&ixlib=rb-4.1.0&q=85',
    inStock: true,
    rating: 5.0,
    reviews: 156
  },
  {
    id: 'perf-4',
    name: 'Aqua Mystique',
    category: 'perfume',
    price: 380,
    originalPrice: 480,
    currency: 'SAR',
    description: 'Fresh and invigorating aquatic fragrance with citrus top notes, marine accord, and woody base. Perfect for everyday luxury.',
    image: 'https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw0fHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fHx8MTc2NjU5Nzc1MHww&ixlib=rb-4.1.0&q=85',
    inStock: true,
    rating: 4.6,
    reviews: 87
  },
  {
    id: 'perf-5',
    name: 'Desert Rose',
    category: 'perfume',
    price: 590,
    originalPrice: 690,
    currency: 'SAR',
    description: 'An exotic blend inspired by Arabian nights. Rich saffron, warm amber, and delicate rose petals create an unforgettable aura.',
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg',
    inStock: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: 'perf-6',
    name: 'Midnight Oud',
    category: 'perfume',
    price: 750,
    originalPrice: 850,
    currency: 'SAR',
    description: 'Intense and captivating oud fragrance with dark chocolate, coffee, and patchouli. For those who dare to be different.',
    image: 'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg',
    inStock: true,
    rating: 4.9,
    reviews: 143
  },
  {
    id: 'perf-7',
    name: 'Golden Sands',
    category: 'perfume',
    price: 420,
    originalPrice: 520,
    currency: 'SAR',
    description: 'Warm and sensual fragrance with honey, vanilla, and amber. A golden embrace of desert luxury and sophistication.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fHx8MTc2NjU5Nzc1MHww&ixlib=rb-4.1.0&q=85',
    inStock: true,
    rating: 4.5,
    reviews: 76
  },
  {
    id: 'perf-8',
    name: 'Opulence Premier',
    category: 'perfume',
    price: 890,
    originalPrice: 990,
    currency: 'SAR',
    description: 'The pinnacle of luxury perfumery. Rare ingredients including iris, vetiver, and aged oud create an extraordinary signature scent.',
    image: 'https://images.unsplash.com/photo-1585218334450-afcf929da36e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fHx8MTc2NjU5Nzc1MHww&ixlib=rb-4.1.0&q=85',
    inStock: false,
    rating: 5.0,
    reviews: 201
  }
];

export const drones = [
  {
    id: 'drone-1',
    name: 'SkyMaster Pro X',
    category: 'drone',
    price: 3200,
    originalPrice: 3800,
    currency: 'SAR',
    description: 'Professional-grade quadcopter with 4K camera, 30-minute flight time, and intelligent flight modes. Perfect for aerial photography and videography.',
    image: 'https://images.pexels.com/photos/319968/pexels-photo-319968.jpeg',
    inStock: true,
    rating: 4.8,
    reviews: 89,
    specs: {
      camera: '4K 60fps',
      flightTime: '30 minutes',
      range: '7 km',
      weight: '900g'
    }
  },
  {
    id: 'drone-2',
    name: 'Phantom Elite 4',
    category: 'drone',
    price: 4500,
    originalPrice: 5200,
    currency: 'SAR',
    description: 'Advanced drone with omnidirectional obstacle sensing, 6K camera, and cinema-grade color profiles. The ultimate tool for content creators.',
    image: 'https://images.unsplash.com/photo-1541943201372-99066ec6a5c5',
    inStock: true,
    rating: 4.9,
    reviews: 134,
    specs: {
      camera: '6K 30fps',
      flightTime: '34 minutes',
      range: '10 km',
      weight: '1.2 kg'
    }
  },
  {
    id: 'drone-3',
    name: 'Mavic Voyager',
    category: 'drone',
    price: 2800,
    originalPrice: 3400,
    currency: 'SAR',
    description: 'Compact and portable drone with professional features. Folding design makes it perfect for travelers and adventure seekers.',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9',
    inStock: true,
    rating: 4.7,
    reviews: 112,
    specs: {
      camera: '4K 30fps',
      flightTime: '25 minutes',
      range: '6 km',
      weight: '570g'
    }
  },
  {
    id: 'drone-4',
    name: 'AeroVision Ultra',
    category: 'drone',
    price: 5800,
    originalPrice: 6500,
    currency: 'SAR',
    description: 'Premium flagship drone with 8K camera, advanced tracking, and cinema-grade stabilization. For professionals who demand perfection.',
    image: 'https://images.pexels.com/photos/2044044/pexels-photo-2044044.jpeg',
    inStock: true,
    rating: 5.0,
    reviews: 67,
    specs: {
      camera: '8K 24fps',
      flightTime: '40 minutes',
      range: '15 km',
      weight: '1.5 kg'
    }
  },
  {
    id: 'drone-5',
    name: 'Precision Mini',
    category: 'drone',
    price: 1800,
    originalPrice: 2200,
    currency: 'SAR',
    description: 'Lightweight drone with impressive capabilities. Great for beginners and hobbyists looking for quality without breaking the bank.',
    image: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60',
    inStock: true,
    rating: 4.5,
    reviews: 98,
    specs: {
      camera: '2.7K 30fps',
      flightTime: '20 minutes',
      range: '4 km',
      weight: '249g'
    }
  }
];

export const allProducts = [...perfumes, ...drones];

export const heroImage = 'https://images.unsplash.com/photo-1615540732776-ed0a2145e8f1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwbGlmZXN0eWxlfGVufDB8fHx8MTc2NjY3MDAyMXww&ixlib=rb-4.1.0&q=85';
