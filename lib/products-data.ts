export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: Record<string, string>
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  categorySlug: string
  basePrice: number
  compareAtPrice?: number
  shortDescription: {
    es: string
    fr: string
    en: string
  }
  description: {
    es: string
    fr: string
    en: string
  }
  features: {
    es: string[]
    fr: string[]
    en: string[]
  }
  images: string[]
  variants: ProductVariant[]
  rating: number
  reviewCount: number
  isFeatured: boolean
  isNew: boolean
  badge?: string
  stock: number
}

export interface Category {
  id: string
  slug: string
  name: {
    es: string
    fr: string
    en: string
  }
  description: {
    es: string
    fr: string
    en: string
  }
  image: string
  productCount: number
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'smartphones',
    name: {
      es: 'Smartphones y Móviles',
      fr: 'Smartphones & Téléphonie',
      en: 'Smartphones & Mobile',
    },
    description: {
      es: 'Flagships, fotografía profesional y tecnología 5G de vanguardia.',
      fr: 'Flagships, photographie haute résolution et technologie 5G de pointe.',
      en: 'Flagships, professional cameras, and cutting-edge 5G power.',
    },
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    productCount: 4,
  },
  {
    id: 'cat-2',
    slug: 'laptops',
    name: {
      es: 'Laptops y Ordenadores',
      fr: 'Laptops & Ordinateurs',
      en: 'Laptops & Computers',
    },
    description: {
      es: 'Ultrabooks ultraligeros, estaciones de trabajo y rendimiento sin límites.',
      fr: 'Ultrabooks ultra-légers, stations de travail et puissance sans compromis.',
      en: 'Featherlight ultrabooks, creative powerhouses, and supreme performance.',
    },
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    productCount: 3,
  },
  {
    id: 'cat-3',
    slug: 'audio',
    name: {
      es: 'Audio, Auriculares y Sonido',
      fr: 'Audio, Casques & Enceintes',
      en: 'Audio, Headphones & Sound',
    },
    description: {
      es: 'Cancelación activa de ruido, sonido Hi-Res y diseño ergonómico.',
      fr: 'Réduction active de bruit, son haute fidélité Hi-Res et confort supérieur.',
      en: 'Active noise cancellation, spatial Hi-Res acoustics, and pure immersion.',
    },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    productCount: 3,
  },
  {
    id: 'cat-4',
    slug: 'accessoires',
    name: {
      es: 'Accesorios y Carga Rápida',
      fr: 'Accessoires & Charge Rapide',
      en: 'Accessories & Fast Charging',
    },
    description: {
      es: 'Cargadores GaN ultracompactos, cables blindados y fundas magnéticas.',
      fr: 'Chargeurs GaN nouvelle génération, câbles renforcés et protections MagSafe.',
      en: 'Next-gen GaN fast chargers, braided cables, and precision cases.',
    },
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    productCount: 2,
  },
  {
    id: 'cat-5',
    slug: 'maison-connectee',
    name: {
      es: 'Maison Connectée y Smart Home',
      fr: 'Maison Connectée & Domotique',
      en: 'Smart Home & Connected Living',
    },
    description: {
      es: 'Iluminación ambiental RGB, sensores inteligentes y automatización.',
      fr: 'Éclairage d\'ambiance intelligent, ampoules connectées et contrôle vocal.',
      en: 'Atmospheric smart lighting, voice-controlled tech, and smart sensors.',
    },
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    productCount: 2,
  },
]

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'smartphone-pro-x15',
    name: 'Smartphone Pro X15 Ultra Titanium',
    brand: 'TechPro',
    categorySlug: 'smartphones',
    basePrice: 899.99,
    compareAtPrice: 1099.99,
    shortDescription: {
      es: 'El flagship definitivo con sensor óptico de 200MP, pantalla LTPO de 120Hz y carga ultrarrápida de 100W.',
      fr: 'Le smartphone d\'élite avec capteur 200MP, dalle AMOLED LTPO 120Hz et recharge fulgurante 100W.',
      en: 'The ultimate flagship featuring a 200MP sensor, 120Hz LTPO display, and 100W ultra-fast charging.',
    },
    description: {
      es: 'El Smartphone Pro X15 Ultra es el estandarte de la ingeniería moderna. Fabricado en titanio aeroespacial y cristal cerámico ultra-resistente, combina una potencia descomunal con una elegancia minimalista.',
      fr: 'Le Smartphone Pro X15 Ultra repousse les limites de la technologie mobile. Conçu avec un châssis en titane brossé de qualité aérospatiale, il offre une prise en main soyeuse et une fluidité remarquable.',
      en: 'Crafted with precision aerospace-grade titanium and ultra-durable ceramic glass, the Pro X15 Ultra delivers flagship speed and timeless design.',
    },
    features: {
      es: [
        'Processeur Octa-Core 3nm de dernière génération',
        'Écran 6.8" AMOLED LTPO 1-120Hz adaptatif',
        'Appareil photo quadruple capteur 200MP + Téléobjectif Périscope 10x',
        'Batterie 5 500 mAh avec charge filaire 100W et sans fil 50W',
        'Certification IP68 étanchéité eau & poussière',
      ],
      fr: [
        'Processeur Octo-Cœur gravé en 3nm nouvelle génération',
        'Écran 6.8" AMOLED LTPO 1-120Hz ultra-lumineux (3000 nits)',
        'Système photo quadri-capteur 200MP + Zoom optique 10x périscopique',
        'Batterie 5 500 mAh avec recharge rapide 100W (0 à 100% en 24min)',
        'Certification IP68 étanchéité totale eau & poussière',
      ],
      en: [
        'Next-generation 3nm Octa-Core flagship processor',
        '6.8" AMOLED LTPO 1-120Hz adaptive high-brightness screen',
        'Quad-camera array with 200MP main and 10x optical periscope',
        '5,500 mAh battery with 100W rapid wired charging',
        'IP68 certified water and dust resistance',
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v1-1', name: '256GB / Noir Minuit', sku: 'SPX15-256-BLK', price: 899.99, stock: 15, attributes: { storage: '256GB', color: 'Noir Minuit' } },
      { id: 'v1-2', name: '512GB / Titane Naturel', sku: 'SPX15-512-TIT', price: 999.99, stock: 8, attributes: { storage: '512GB', color: 'Titane Naturel' } },
      { id: 'v1-3', name: '1TB / Blanc Céramique', sku: 'SPX15-1TB-WHT', price: 1149.99, stock: 5, attributes: { storage: '1TB', color: 'Blanc Céramique' } },
    ],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNew: true,
    badge: 'Flagship',
    stock: 28,
  },
  {
    id: 'prod-2',
    slug: 'laptop-ultrabook-z14',
    name: 'UltraBook Z14 Pro OLED',
    brand: 'CompuPro',
    categorySlug: 'laptops',
    basePrice: 1499.99,
    compareAtPrice: 1799.99,
    shortDescription: {
      es: 'Portátil profesional de 1.2kg con pantalla OLED 2.8K, Intel Ultra 9 y 18 horas de batería.',
      fr: 'PC portable professionnel ultra-léger (1.2kg), écran OLED 2.8K, Intel Ultra 9 et 18h d\'autonomie.',
      en: 'Professional 1.2kg laptop featuring a 2.8K OLED panel, Intel Ultra 9, and 18-hour battery.',
    },
    description: {
      es: 'L\'UltraBook Z14 Pro est le compagnon parfait pour les créatifs, développeurs et nomades exigeants. Son châssis unibody en aluminium usiné CNC abrite une puissance de calcul colossale tout en restant silencieux.',
      fr: 'L\'UltraBook Z14 Pro allie compacité absolue et vélocité brute. Son écran OLED calibré d\'usine affiche 100% de l\'espace DCI-P3 pour une fidélité colorimétrique parfaite.',
      en: 'CNC unibody aerospace aluminum body. High-performance computing, silent vapor chamber cooling, and rich studio-grade audio.',
    },
    features: {
      es: [
        'Procesador Intel Core Ultra 9 185H (16 núcleos / 22 hilos)',
        'Pantalla 14" OLED 2.8K (2880x1800) 120Hz 500 nits HDR',
        'Memoria 32GB LPDDR5X 7467MHz + 1TB NVMe PCIe Gen 4',
        'Batería 75Wh con hasta 18 horas de autonomía real',
        'Conectividad Wi-Fi 7, Bluetooth 5.4, 2x Thunderbolt 4',
      ],
      fr: [
        'Processeur Intel Core Ultra 9 185H avec puce NPU IA dédiée',
        'Écran 14" OLED 2.8K (2880x1800) 120Hz 100% DCI-P3',
        'Mémoire vive 32GB LPDDR5X + SSD 1To NVMe PCIe Gen 4',
        'Autonomie marathon de 18 heures avec charge USB-C 100W',
        'Double port Thunderbolt 4, sortie HDMI 2.1, lecteur microSD',
      ],
      en: [
        'Intel Core Ultra 9 185H with integrated AI NPU accelerator',
        '14" 2.8K (2880x1800) 120Hz OLED, 100% DCI-P3 color gamut',
        '32GB high-speed LPDDR5X RAM + 1TB PCIe 4.0 NVMe SSD',
        'All-day 18-hour battery with compact 100W USB-C GaN charger',
        'Dual Thunderbolt 4 ports, HDMI 2.1, Wi-Fi 7',
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v2-1', name: '32GB / 1TB / Gris Sidéral', sku: 'UBZ14-32-1TB-GRY', price: 1499.99, stock: 10, attributes: { ram: '32GB', storage: '1TB', color: 'Gris Sidéral' } },
      { id: 'v2-2', name: '64GB / 2TB / Noir Carbone', sku: 'UBZ14-64-2TB-BLK', price: 1899.99, stock: 4, attributes: { ram: '64GB', storage: '2TB', color: 'Noir Carbone' } },
    ],
    rating: 5.0,
    reviewCount: 24,
    isFeatured: true,
    isNew: false,
    badge: 'Top Pro',
    stock: 14,
  },
  {
    id: 'prod-3',
    slug: 'casque-audio-elite-nc',
    name: 'Casque Sans-Fil Elite NC Pro',
    brand: 'SoundMaster',
    categorySlug: 'audio',
    basePrice: 249.99,
    compareAtPrice: 329.99,
    shortDescription: {
      es: 'Cancelación de ruido adaptativa de referencia, audio espacial Hi-Res y 40 horas de autonomía.',
      fr: 'Réduction de bruit active adaptative de référence, son spatial Hi-Res et 40h d\'autonomie.',
      en: 'Benchmark adaptive noise cancellation, Hi-Res spatial audio, and 40 hours of playtime.',
    },
    description: {
      es: 'Sumérgete en tu música con el Casque Elite NC Pro. Diseñado con transductores de bio-celulosa de 40mm y 6 micrófonos beamforming para una claridad cristalina en llamadas.',
      fr: 'Redécouvrez vos morceaux préférés avec une précision chirurgicale. Les coussinets en mousse à mémoire de forme et cuir vegan assurent un confort absolu tout au long de la journée.',
      en: 'Engineered with custom 40mm bio-cellulose drivers, 6 beamforming microphones, and plush cloud-soft memory foam cushions.',
    },
    features: {
      es: [
        'Cancelación activa de ruido inteligente con modo transparencia',
        'Transductores acústicos de 40mm certificados Hi-Res Audio Wireless',
        'Batería de 40 horas (30h con ANC) + carga rápida de 15 min = 5 horas',
        'Bluetooth 5.3 multipunto para conectar teléfono y ordenador a la vez',
        'Incluye estuche rígido de transporte y cable jack de 3.5mm bañado en oro',
      ],
      fr: [
        'ANC adaptatif en temps réel avec mode transparence naturel',
        'Transducteurs 40mm certifiés Hi-Res Audio et codecs LDAC/AAC',
        'Autonomie 40 heures (15min de charge = 5 heures d\'écoute)',
        'Connexion Bluetooth 5.3 multipoint (2 appareils simultanés)',
        'Étui de voyage rigide premium inclus et finitions aluminium',
      ],
      en: [
        'Real-time adaptive active noise cancellation with natural transparency',
        '40mm acoustic drivers with LDAC and Hi-Res wireless audio certification',
        '40-hour battery life with 15-minute quick charge for 5 hours of music',
        'Multipoint Bluetooth 5.3 enables seamless dual-device switching',
        'Includes magnetic travel case and braided gold-plated audio cable',
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v3-1', name: 'Noir Matte', sku: 'CENC-MAT-BLK', price: 249.99, stock: 20, attributes: { color: 'Noir Matte' } },
      { id: 'v3-2', name: 'Blanc Ivoire', sku: 'CENC-IVR-WHT', price: 249.99, stock: 15, attributes: { color: 'Blanc Ivoire' } },
      { id: 'v3-3', name: 'Bleu Marine', sku: 'CENC-NVY-BLU', price: 249.99, stock: 8, attributes: { color: 'Bleu Marine' } },
    ],
    rating: 4.8,
    reviewCount: 45,
    isFeatured: true,
    isNew: false,
    badge: '-24%',
    stock: 43,
  },
  {
    id: 'prod-4',
    slug: 'ecouteurs-tws-air5',
    name: 'Écouteurs Sans Fil TWS Air5 Pro',
    brand: 'SoundMaster',
    categorySlug: 'audio',
    basePrice: 149.99,
    compareAtPrice: 199.99,
    shortDescription: {
      es: 'Auriculares intrauditivos True Wireless con audio espacial 360°, ANC y estuche de carga MagSafe.',
      fr: 'Écouteurs sans fil True Wireless avec son spatial 360°, ANC et boîtier MagSafe sans fil.',
      en: 'True Wireless earbuds with 360° spatial audio, ANC, and wireless MagSafe case.',
    },
    description: {
      es: 'Compactos, potentes e increíblemente cómodos. Los TWS Air5 Pro aíslan los ruidos del metro, avión o la oficina gracias a su chip de reducción de ruido dual.',
      fr: 'La perfection au creux de votre oreille. Les TWS Air5 Pro bénéficient d\'un calibrage acoustique sur mesure et résistent à la sueur et à la pluie (norme IPX5).',
      en: 'Featherlight earbuds with dual-mic active isolation, personalized spatial tuning, and IPX5 weatherproofing.',
    },
    features: {
      es: [
        'ANC híbrido de hasta 48dB de atenuación sonora',
        'Audio espacial con seguimiento dinámico de la cabeza',
        '8 horas continuas por carga (34 horas con el estuche)',
        'Carga rápida inalámbrica compatible con Qi y MagSafe',
        'Resistencia al sudor y salpicaduras IPX5',
      ],
      fr: [
        'Réduction de bruit hybride ultra-profonde jusqu\'à 48dB',
        'Son spatialisé 3D immersif avec détection de mouvements',
        'Autonomie 8h d\'écoute (34h au total avec le boîtier)',
        'Boîtier compatible recharge sans fil Qi et MagSafe',
        'Résistance à l\'eau et à la transpiration certifiée IPX5',
      ],
      en: [
        'Hybrid ANC reducing ambient noise by up to 48dB',
        'Dynamic 3D spatial acoustics with motion tracking',
        '8-hour playback per charge (up to 34 hours with charging case)',
        'Compatible with Qi wireless and MagSafe magnetic pads',
        'IPX5 sweat and splash resistance',
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v4-1', name: 'Blanc Pur', sku: 'TWSA5-WHT', price: 149.99, stock: 30, attributes: { color: 'Blanc Pur' } },
      { id: 'v4-2', name: 'Noir Onyx', sku: 'TWSA5-BLK', price: 149.99, stock: 25, attributes: { color: 'Noir Onyx' } },
    ],
    rating: 4.7,
    reviewCount: 31,
    isFeatured: true,
    isNew: true,
    badge: 'Nouveau',
    stock: 55,
  },
  {
    id: 'prod-5',
    slug: 'chargeur-rapide-100w-gan',
    name: 'Chargeur GaN 100W Multi-Ports Fast Power',
    brand: 'PowerTech',
    categorySlug: 'accessoires',
    basePrice: 59.99,
    compareAtPrice: 79.99,
    shortDescription: {
      es: 'Cargador ultracompacto con tecnología GaN III de 100W con 3 puertos USB-C y 1 USB-A.',
      fr: 'Station de charge GaN III ultra-compacte 100W avec 3x USB-C et 1x USB-A.',
      en: 'Ultra-compact 100W GaN III fast charger equipped with 3x USB-C and 1x USB-A ports.',
    },
    description: {
      es: 'Carga simultáneamente tu portátil, teléfono y tablet a máxima velocidad desde un único enchufe europeo compacto.',
      fr: 'Dites adieu aux multiples blocs de charge. La technologie Nitrure de Gallium (GaN) délivre une puissance colossale dans un boîtier tenant dans la poche.',
      en: 'Power your laptop, smartphone, tablet, and smart watch all at once with intelligent dynamic power allocation.',
    },
    features: {
      es: [
        'Potencia total combinada de hasta 100W Power Delivery 3.0',
        'Tecnología GaN III : un 45% más pequeño y 30% más frío',
        'Reparto de energía inteligente entre los 4 dispositivos conectados',
        'Protección multinivel contra sobretensión y sobrecalentamiento',
        'Enchufe europeo estándar para España y la Unión Europea',
      ],
      fr: [
        'Puissance totale 100W compatible Power Delivery 3.0 & PPS',
        'Composants GaN III de dernière génération : format 45% plus petit',
        'Distribution intelligente de l\'énergie selon les appareils branchés',
        'Multiples sécurités contre les courts-circuits et surchauffes',
        'Prise européenne compacte idéale pour la maison et les voyages',
      ],
      en: [
        '100W max output with Power Delivery 3.0 & PPS support',
        'GaN III architecture is 45% smaller and runs noticeably cooler',
        'Dynamic power distribution automatically matches your connected gear',
        'Full safety protection matrix against surge, heat, and shorts',
        'Standard European plug format for Spain and EU countries',
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v5-1', name: 'Blanc Glacé', sku: 'GAN100-WHT', price: 59.99, stock: 45, attributes: { color: 'Blanc Glacé' } },
      { id: 'v5-2', name: 'Gris Sidéral', sku: 'GAN100-GRY', price: 59.99, stock: 40, attributes: { color: 'Gris Sidéral' } },
    ],
    rating: 4.9,
    reviewCount: 52,
    isFeatured: false,
    isNew: false,
    badge: 'Essentiel',
    stock: 85,
  },
  {
    id: 'prod-6',
    slug: 'ampoule-connectee-rgb-pack4',
    name: 'Kit 4 Ampoules Connectées RGB Smart Home',
    brand: 'SmartHome Pro',
    categorySlug: 'maison-connectee',
    basePrice: 44.99,
    compareAtPrice: 59.99,
    shortDescription: {
      es: 'Pack de 4 bombillas LED inteligentes RGBW (16 millones de colores), Wi-Fi sin necesidad de puente.',
      fr: 'Pack de 4 ampoules LED intelligentes RGBW (16 millions de couleurs), Wi-Fi direct sans pont.',
      en: 'Pack of 4 smart RGBW LED bulbs (16 million colors), direct Wi-Fi control with no hub needed.',
    },
    description: {
      es: 'Crea el ambiente perfecto para ver películas, trabajar o relajarte. Compatibles con Google Assistant, Amazon Alexa y Apple Siri.',
      fr: 'Transformez chaque pièce de votre maison en un clic ou à la voix. Synchronisation avec la musique et programmation horaire personnalisée.',
      en: 'Set the perfect lighting mood for cinema nights, focus sessions, or parties. Syncs with music and responds to voice commands.',
    },
    features: {
      es: [
        '16 millones de colores + blanco cálido y blanco frío regulables (2700K - 6500K)',
        'Equivalente a 80W incandescentes con solo 9W de consumo eléctrico (Clase A+)',
        'Conexión Wi-Fi directa a 2.4GHz sin necesidad de bridge adicional',
        'Compatible con Alexa, Asistente de Google y escenas programadas',
        'Casquillo estándar E27 universal',
      ],
      fr: [
        '16 millions de couleurs et nuances de blanc du chaud au froid (2700K à 6500K)',
        'Luminosité de 850 lumens (équivalent 80W) pour seulement 9W consommés',
        'Connexion directe au Wi-Fi de la maison sans boîtier supplémentaire',
        'Contrôle vocal compatible avec Alexa, Google Home et Siri',
        'Culot à vis standard universel E27',
      ],
      en: [
        '16 million colors plus tunable white spectrum from warm to cool (2700K-6500K)',
        '850 lumens brightness (80W incandescent equivalent) using only 9W',
        'Direct 2.4GHz Wi-Fi connection with no extra bridge required',
        'Works with Alexa, Google Home, and smart automation routines',
        'Standard E27 screw base for effortless fixture compatibility',
      ],
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v6-1', name: 'Culot E27 (Pack 4)', sku: 'RGB-E27-P4', price: 44.99, stock: 35, attributes: { socket: 'E27', pack: '4' } },
    ],
    rating: 4.6,
    reviewCount: 19,
    isFeatured: true,
    isNew: false,
    stock: 35,
  },
]

export const SHIPPING_RATES = [
  {
    id: 'rate-es-std',
    country: 'ES',
    name: { es: 'Envío Estándar España (Península)', fr: 'Livraison Standard Espagne', en: 'Spain Standard Delivery' },
    price: 3.99,
    freeOver: 50,
    estimatedDays: '2 - 4 días laborables',
  },
  {
    id: 'rate-eu-std',
    country: 'EU',
    name: { es: 'Envío Estándar Europa (UE)', fr: 'Livraison Standard Europe (UE)', en: 'EU Standard Tracked Delivery' },
    price: 7.99,
    freeOver: 120,
    estimatedDays: '3 - 6 jours ouvrés',
  },
  {
    id: 'rate-int-exp',
    country: 'INT',
    name: { es: 'Envío Internacional Express', fr: 'Livraison Internationale Express', en: 'International Express Shipping' },
    price: 18.99,
    freeOver: 200,
    estimatedDays: '5 - 10 business days',
  },
]

export function getProducts(options?: { category?: string; query?: string; sort?: string }): Product[] {
  let list = [...PRODUCTS]

  if (options?.category) {
    list = list.filter((p) => p.categorySlug === options.category)
  }

  if (options?.query) {
    const q = options.query.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.fr.toLowerCase().includes(q) ||
        p.shortDescription.es.toLowerCase().includes(q) ||
        p.shortDescription.en.toLowerCase().includes(q)
    )
  }

  if (options?.sort) {
    if (options.sort === 'priceAsc') list.sort((a, b) => a.basePrice - b.basePrice)
    else if (options.sort === 'priceDesc') list.sort((a, b) => b.basePrice - a.basePrice)
    else if (options.sort === 'popular') list.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (options.sort === 'newest') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
  }

  return list
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured)
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNew)
}

export function getPromotions(): Product[] {
  return PRODUCTS.filter((p) => p.compareAtPrice && p.compareAtPrice > p.basePrice)
}
