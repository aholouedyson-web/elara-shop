// @ts-ignore
import { PrismaClient, Role, OrderStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // ============================================================
  // STORE SETTINGS
  // ============================================================
  await prisma.storeSetting.upsert({
    where: { key: 'store_name' },
    update: {},
    create: { key: 'store_name', value: 'Élara Shop' },
  })
  await prisma.storeSetting.upsert({
    where: { key: 'store_email' },
    update: {},
    create: { key: 'store_email', value: 'contact@elareshop.com' },
  })
  await prisma.storeSetting.upsert({
    where: { key: 'store_currency' },
    update: {},
    create: { key: 'store_currency', value: 'EUR' },
  })

  // ============================================================
  // ADMIN USER
  // ============================================================
  const hashedPassword = await bcrypt.hash('Admin@2024!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@elareshop.com' },
    update: {},
    create: {
      email: 'admin@elareshop.com',
      name: 'Admin Élara',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin user created: admin@elareshop.com / Admin@2024!')

  // ============================================================
  // SHIPPING ZONES
  // ============================================================
  const zoneES = await prisma.shippingZone.upsert({
    where: { id: 'zone-es' },
    update: {},
    create: {
      id: 'zone-es',
      name: 'España',
      countries: ['ES'],
      isActive: true,
    },
  })

  const zoneEU = await prisma.shippingZone.upsert({
    where: { id: 'zone-eu' },
    update: {},
    create: {
      id: 'zone-eu',
      name: 'Europe',
      countries: ['FR', 'DE', 'IT', 'PT', 'BE', 'NL', 'AT', 'PL', 'SE', 'CH'],
      isActive: true,
    },
  })

  const zoneINT = await prisma.shippingZone.upsert({
    where: { id: 'zone-int' },
    update: {},
    create: {
      id: 'zone-int',
      name: 'International',
      countries: ['US', 'CA', 'GB', 'MA', 'DZ', 'TN', 'SN', 'AU', 'JP'],
      isActive: true,
    },
  })

  // Shipping rates - Spain
  await prisma.shippingRate.upsert({
    where: { id: 'rate-es-std' },
    update: {},
    create: {
      id: 'rate-es-std',
      zoneId: zoneES.id,
      name: 'Estándar',
      description: 'Envío estándar a España',
      price: 3.99,
      estimatedDays: '2-4 días',
      minOrderAmount: 0,
    },
  })
  await prisma.shippingRate.upsert({
    where: { id: 'rate-es-free' },
    update: {},
    create: {
      id: 'rate-es-free',
      zoneId: zoneES.id,
      name: 'Envío gratuito',
      description: 'Gratis para pedidos superiores a 50€',
      price: 0,
      estimatedDays: '2-4 días',
      minOrderAmount: 50,
    },
  })

  // Shipping rates - Europe
  await prisma.shippingRate.upsert({
    where: { id: 'rate-eu-std' },
    update: {},
    create: {
      id: 'rate-eu-std',
      zoneId: zoneEU.id,
      name: 'Standard Europe',
      description: 'Livraison standard en Europe',
      price: 8.99,
      estimatedDays: '5-8 jours',
    },
  })
  await prisma.shippingRate.upsert({
    where: { id: 'rate-eu-exp' },
    update: {},
    create: {
      id: 'rate-eu-exp',
      zoneId: zoneEU.id,
      name: 'Express Europe',
      description: 'Livraison express en Europe',
      price: 14.99,
      estimatedDays: '2-3 jours',
    },
  })

  // Shipping rates - International
  await prisma.shippingRate.upsert({
    where: { id: 'rate-int-std' },
    update: {},
    create: {
      id: 'rate-int-std',
      zoneId: zoneINT.id,
      name: 'International Standard',
      description: 'International standard shipping',
      price: 19.99,
      estimatedDays: '10-20 days',
    },
  })

  console.log('✅ Shipping zones and rates created')

  // ============================================================
  // CATEGORIES
  // ============================================================
  const catSmartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Téléphones intelligents dernière génération',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      isActive: true,
      sortOrder: 1,
    },
  })

  const catLaptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops & PC',
      slug: 'laptops',
      description: 'Ordinateurs portables et PC de bureau',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      isActive: true,
      sortOrder: 2,
    },
  })

  const catAudio = await prisma.category.upsert({
    where: { slug: 'audio' },
    update: {},
    create: {
      name: 'Audio & Son',
      slug: 'audio',
      description: 'Casques, écouteurs, enceintes',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      isActive: true,
      sortOrder: 3,
    },
  })

  const catAccessoires = await prisma.category.upsert({
    where: { slug: 'accessoires' },
    update: {},
    create: {
      name: 'Accessoires',
      slug: 'accessoires',
      description: 'Câbles, coques, chargeurs et plus',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      isActive: true,
      sortOrder: 4,
    },
  })

  const catMaison = await prisma.category.upsert({
    where: { slug: 'maison-connectee' },
    update: {},
    create: {
      name: 'Maison Connectée',
      slug: 'maison-connectee',
      description: 'Smart home, objets connectés',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      isActive: true,
      sortOrder: 5,
    },
  })

  console.log('✅ Categories created')

  // ============================================================
  // PRODUCTS
  // ============================================================

  // --- Smartphones ---
  await prisma.product.upsert({
    where: { slug: 'smartphone-pro-x15' },
    update: {},
    create: {
      name: 'Smartphone Pro X15',
      slug: 'smartphone-pro-x15',
      shortDescription: 'Le flagship absolu avec appareil photo révolutionnaire',
      description: `Le Smartphone Pro X15 redéfinit les standards de la photographie mobile. Équipé d'un capteur principal de 200MP avec stabilisation optique de 5ème génération, il capture chaque détail avec une précision extraordinaire.\n\n**Caractéristiques principales :**\n- Processeur Helio Ultra X2 3nm\n- Écran AMOLED 6.8" 120Hz LTPO\n- Batterie 5500mAh charge rapide 100W\n- 5G, Wi-Fi 7, Bluetooth 5.4\n- IP68 résistance eau et poussière\n- Android 15 avec 4 ans de mises à jour`,
      basePrice: 899.99,
      compareAtPrice: 1099.99,
      categoryId: catSmartphones.id,
      brand: 'TechPro',
      weight: 0.215,
      isActive: true,
      isFeatured: true,
      isNew: true,
      tags: ['smartphone', '5G', 'flagship', 'photo'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: 'Smartphone Pro X15 - Face', sortOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800', alt: 'Smartphone Pro X15 - Dos', sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800', alt: 'Smartphone Pro X15 - Détail', sortOrder: 2 },
        ],
      },
      variants: {
        create: [
          { name: '128GB / Noir Minuit', sku: 'SPX15-128-BLK', price: 899.99, stock: 25, attributes: { storage: '128GB', color: 'Noir Minuit' } },
          { name: '256GB / Noir Minuit', sku: 'SPX15-256-BLK', price: 999.99, stock: 18, attributes: { storage: '256GB', color: 'Noir Minuit' } },
          { name: '256GB / Blanc Polaire', sku: 'SPX15-256-WHT', price: 999.99, stock: 12, attributes: { storage: '256GB', color: 'Blanc Polaire' } },
          { name: '512GB / Titane', sku: 'SPX15-512-TIT', price: 1099.99, stock: 8, attributes: { storage: '512GB', color: 'Titane' } },
        ],
      },
    },
  })

  await prisma.product.upsert({
    where: { slug: 'smartphone-lite-s8' },
    update: {},
    create: {
      name: 'Smartphone Lite S8',
      slug: 'smartphone-lite-s8',
      shortDescription: 'Performance et style à prix accessible',
      description: `Le Smartphone Lite S8 offre une expérience premium sans compromettre votre budget. Parfait pour les utilisateurs exigeants qui cherchent un équilibre parfait entre performance, design et autonomie.\n\n**Caractéristiques :**\n- Processeur OctoCore 2.4GHz\n- Écran IPS 6.5" FHD+ 90Hz\n- Triple caméra 64+12+5MP\n- Batterie 4800mAh\n- 4G LTE, Wi-Fi 6`,
      basePrice: 299.99,
      compareAtPrice: 349.99,
      categoryId: catSmartphones.id,
      brand: 'TechPro',
      weight: 0.195,
      isActive: true,
      isFeatured: true,
      tags: ['smartphone', '4G', 'entrée de gamme'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', alt: 'Smartphone Lite S8', sortOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800', alt: 'Smartphone Lite S8 - Dos', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: '64GB / Bleu Saphir', sku: 'SLS8-64-BLU', price: 299.99, stock: 30, attributes: { storage: '64GB', color: 'Bleu Saphir' } },
          { name: '128GB / Bleu Saphir', sku: 'SLS8-128-BLU', price: 329.99, stock: 22, attributes: { storage: '128GB', color: 'Bleu Saphir' } },
          { name: '128GB / Noir', sku: 'SLS8-128-BLK', price: 329.99, stock: 15, attributes: { storage: '128GB', color: 'Noir' } },
        ],
      },
    },
  })

  // --- Laptops ---
  await prisma.product.upsert({
    where: { slug: 'laptop-ultrabook-z14' },
    update: {},
    create: {
      name: 'UltraBook Z14 Pro',
      slug: 'laptop-ultrabook-z14',
      shortDescription: 'Puissance professionnelle en format ultracompact',
      description: `L'UltraBook Z14 Pro est conçu pour les professionnels qui ne font aucun compromis. Avec son processeur de dernière génération et son autonomie exceptionnelle de 18 heures, il vous accompagne partout avec une efficacité redoutable.\n\n**Spécifications :**\n- Intel Core Ultra 9 (185H) 16 cœurs\n- 32GB RAM LPDDR5X\n- SSD NVMe 1TB PCIe 5.0\n- Écran 14" 2.8K OLED 120Hz\n- Poids : 1.2kg\n- Autonomie : 18h\n- Wi-Fi 7, Bluetooth 5.4, Thunderbolt 4`,
      basePrice: 1499.99,
      compareAtPrice: 1799.99,
      categoryId: catLaptops.id,
      brand: 'CompuPro',
      weight: 1.2,
      isActive: true,
      isFeatured: true,
      tags: ['laptop', 'ultrabook', 'professionnel', 'OLED'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', alt: 'UltraBook Z14 Pro', sortOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', alt: 'UltraBook Z14 Pro - Ouvert', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: '32GB / 1TB / Gris Sidéral', sku: 'UBZ14-32-1T-GRY', price: 1499.99, stock: 10, attributes: { ram: '32GB', storage: '1TB', color: 'Gris Sidéral' } },
          { name: '32GB / 2TB / Gris Sidéral', sku: 'UBZ14-32-2T-GRY', price: 1699.99, stock: 6, attributes: { ram: '32GB', storage: '2TB', color: 'Gris Sidéral' } },
          { name: '64GB / 2TB / Noir Carbone', sku: 'UBZ14-64-2T-BLK', price: 1999.99, stock: 4, attributes: { ram: '64GB', storage: '2TB', color: 'Noir Carbone' } },
        ],
      },
    },
  })

  // --- Audio ---
  await prisma.product.upsert({
    where: { slug: 'casque-audio-elite-nc' },
    update: {},
    create: {
      name: 'Casque Elite NC Pro',
      slug: 'casque-audio-elite-nc',
      shortDescription: 'Réduction de bruit active de référence',
      description: `Le Casque Elite NC Pro établit de nouveaux standards dans la réduction de bruit active. Ses transducteurs 40mm premium délivrent un son d'une richesse et d'une précision exceptionnelles, que ce soit pour la musique, les podcasts ou les appels professionnels.\n\n**Caractéristiques :**\n- ANC (Active Noise Cancelling) adaptatif\n- Autonomie 40h avec ANC\n- Charge rapide : 15min = 3h d'écoute\n- Bluetooth 5.3 multipoint (2 appareils)\n- Codecs : AAC, aptX HD, LDAC\n- Micro 6 capsules beamforming\n- Pliable, étui inclus`,
      basePrice: 249.99,
      compareAtPrice: 329.99,
      categoryId: catAudio.id,
      brand: 'SoundMaster',
      weight: 0.285,
      isActive: true,
      isFeatured: true,
      tags: ['casque', 'ANC', 'bluetooth', 'audio premium'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Casque Elite NC Pro', sortOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', alt: 'Casque Elite NC Pro - Détail', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: 'Noir Midnight', sku: 'CENC-BLK', price: 249.99, stock: 20, attributes: { color: 'Noir Midnight' } },
          { name: 'Blanc Nacré', sku: 'CENC-WHT', price: 249.99, stock: 15, attributes: { color: 'Blanc Nacré' } },
          { name: 'Bleu Cobalt', sku: 'CENC-BLU', price: 249.99, stock: 10, attributes: { color: 'Bleu Cobalt' } },
        ],
      },
    },
  })

  await prisma.product.upsert({
    where: { slug: 'ecouteurs-tws-air5' },
    update: {},
    create: {
      name: 'Écouteurs TWS Air5',
      slug: 'ecouteurs-tws-air5',
      shortDescription: 'True Wireless Stereo avec ANC et son spatial',
      description: `Les Écouteurs TWS Air5 combinent technologie de pointe et confort exceptionnel pour une expérience d'écoute immersive. Avec leur ANC adaptatif et leur son spatial, vous êtes plongé dans votre musique comme jamais.\n\n**Caractéristiques :**\n- ANC actif avec mode transparence\n- Son spatial personnalisé\n- Autonomie 8h (32h avec boîtier)\n- IPX5 résistant à l'eau\n- Bluetooth 5.3\n- Contrôles tactiles et détection en oreille`,
      basePrice: 149.99,
      compareAtPrice: 199.99,
      categoryId: catAudio.id,
      brand: 'SoundMaster',
      weight: 0.058,
      isActive: true,
      isNew: true,
      tags: ['écouteurs', 'TWS', 'ANC', 'sans fil'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', alt: 'Écouteurs TWS Air5', sortOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=800', alt: 'Écouteurs TWS Air5 - Boîtier', sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { name: 'Blanc', sku: 'TWSA5-WHT', price: 149.99, stock: 35, attributes: { color: 'Blanc' } },
          { name: 'Noir', sku: 'TWSA5-BLK', price: 149.99, stock: 28, attributes: { color: 'Noir' } },
          { name: 'Lavande', sku: 'TWSA5-LAV', price: 149.99, stock: 12, attributes: { color: 'Lavande' } },
        ],
      },
    },
  })

  // --- Accessoires ---
  await prisma.product.upsert({
    where: { slug: 'chargeur-rapide-100w-gan' },
    update: {},
    create: {
      name: 'Chargeur GaN 100W 4 ports',
      slug: 'chargeur-rapide-100w-gan',
      shortDescription: 'Chargez 4 appareils simultanément à pleine puissance',
      description: `Le Chargeur GaN 100W révolutionne la recharge avec sa technologie Gallium Nitride ultra-compacte. Rechargez simultanément smartphone, laptop, tablette et écouteurs depuis une seule prise.\n\n**Caractéristiques :**\n- 2x USB-C (100W + 45W) + 2x USB-A (18W)\n- Technologie GaN 3ème génération\n- Détection intelligente des appareils\n- Protection surtension, surintensité, température\n- Certifié UE, compatible universel`,
      basePrice: 59.99,
      compareAtPrice: 79.99,
      categoryId: catAccessoires.id,
      brand: 'PowerTech',
      weight: 0.145,
      isActive: true,
      isFeatured: false,
      tags: ['chargeur', 'GaN', '100W', 'accessoire'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', alt: 'Chargeur GaN 100W', sortOrder: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Blanc', sku: 'GAN100-WHT', price: 59.99, stock: 50, attributes: { color: 'Blanc' } },
          { name: 'Noir', sku: 'GAN100-BLK', price: 59.99, stock: 45, attributes: { color: 'Noir' } },
        ],
      },
    },
  })

  // --- Maison Connectée ---
  await prisma.product.upsert({
    where: { slug: 'ampoule-connectee-rgb-pack4' },
    update: {},
    create: {
      name: 'Ampoules Connectées RGB — Pack 4',
      slug: 'ampoule-connectee-rgb-pack4',
      shortDescription: '16 millions de couleurs, contrôle vocal et scènes personnalisées',
      description: `Transformez votre intérieur avec les Ampoules Connectées RGB. Compatible Google Assistant, Amazon Alexa et Apple HomeKit, elles s'intègrent parfaitement dans votre écosystème domotique.\n\n**Caractéristiques :**\n- 16 millions de couleurs RGB + blanc chaud/froid\n- 10W = équivalent 80W incandescent\n- Durée de vie : 25 000 heures\n- Compatible Wi-Fi 2.4GHz (sans hub)\n- Commande vocale et application\n- Programmation horaires et scènes`,
      basePrice: 44.99,
      compareAtPrice: 59.99,
      categoryId: catMaison.id,
      brand: 'SmartHome Pro',
      weight: 0.4,
      isActive: true,
      isFeatured: true,
      tags: ['ampoule', 'connectée', 'RGB', 'domotique'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Ampoules Connectées RGB', sortOrder: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'E27 - Pack 4', sku: 'ARGB-E27-4', price: 44.99, stock: 30, attributes: { culot: 'E27', pack: '4 ampoules' } },
          { name: 'E14 - Pack 4', sku: 'ARGB-E14-4', price: 44.99, stock: 20, attributes: { culot: 'E14', pack: '4 ampoules' } },
        ],
      },
    },
  })

  // --- Coupons de démonstration ---
  await prisma.coupon.upsert({
    where: { code: 'BIENVENUE10' },
    update: {},
    create: {
      code: 'BIENVENUE10',
      description: '10% de réduction pour les nouveaux clients',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 30,
      maxUses: 500,
      isActive: true,
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'ETE20' },
    update: {},
    create: {
      code: 'ETE20',
      description: '20€ de réduction pour les commandes de 100€+',
      discountType: 'FIXED',
      discountValue: 20,
      minOrderAmount: 100,
      maxUses: 200,
      isActive: true,
    },
  })

  console.log('✅ Products and coupons seeded')
  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('📋 Summary:')
  console.log('   Admin: admin@elareshop.com / Admin@2024!')
  console.log('   Coupon test: BIENVENUE10 (10%)')
  console.log('   Coupon test: ETE20 (20€ off 100€+)')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
