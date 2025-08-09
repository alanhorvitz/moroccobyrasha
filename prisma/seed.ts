import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (respect dependency order: children first)
  await prisma.review.deleteMany();
  await prisma.vehicleOption.deleteMany();
  await prisma.transportServiceRegion.deleteMany();
  await prisma.transportService.deleteMany();
  await prisma.guideRegion.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.tourPackageRegion.deleteMany();
  await prisma.tourPackage.deleteMany();
  await prisma.travelGuide.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.cuisine.deleteMany();
  await prisma.heritage.deleteMany();
  await prisma.clothing.deleteMany();
  await prisma.region.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create regions
  const regions = await Promise.all([
    prisma.region.create({
      data: {
        name_en: 'Marrakech',
        name_ar: 'مراكش',
        name_fr: 'Marrakech',
        name_it: 'Marrakech',
        name_es: 'Marrakech',
        description_en: "The Red City, known for its bustling souks, historic medina, and vibrant culture.",
        description_ar: 'المدينة الحمراء، معروفة بأسواقها الصاخبة والمدينة القديمة وثقافتها النابضة بالحياة.',
        description_fr: 'La Ville Rouge, connue pour ses souks animés, sa médina historique et sa culture vibrante.',
        description_it: 'La Città Rossa, nota per i suoi souk animati, la medina storica e la cultura vibrante.',
        description_es: 'La Ciudad Roja, conocida por sus bulliciosos zocos, medina histórica y cultura vibrante.',
        climate_en: 'Semi-arid',
        climate_ar: 'شبه جاف',
        climate_fr: 'Semi-aride',
        climate_it: 'Semi-arido',
        climate_es: 'Semiárido',
        bestTimeToVisit_en: 'March to May, September to November',
        bestTimeToVisit_ar: 'مارس إلى مايو، سبتمبر إلى نوفمبر',
        bestTimeToVisit_fr: 'Mars à mai, septembre à novembre',
        bestTimeToVisit_it: 'Marzo a maggio, settembre a novembre',
        bestTimeToVisit_es: 'Marzo a mayo, septiembre a noviembre',
        keyFacts_en: "UNESCO World Heritage Site, Founded in 1062, Population: ~1 million, Capital: Marrakech",
        keyFacts_ar: 'موقع تراث عالمي لليونسكو، تأسست في 1062، عدد السكان: ~1 مليون، العاصمة: مراكش',
        keyFacts_fr: "Site du patrimoine mondial de l'UNESCO, Fondée en 1062, Population: ~1 million, Capitale: Marrakech",
        keyFacts_it: "Sito del patrimonio mondiale dell'UNESCO, Fondata nel 1062, Popolazione: ~1 milione, Capitale: Marrakech",
        keyFacts_es: 'Patrimonio de la Humanidad de la UNESCO, Fundada en 1062, Población: ~1 millón, Capital: Marrakech',
        latitude: 31.6295,
        longitude: -7.9811,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
      },
    }),
    prisma.region.create({
      data: {
        name_en: 'Fez',
        name_ar: 'فاس',
        name_fr: 'Fès',
        name_it: 'Fez',
        name_es: 'Fez',
        description_en: "The spiritual and cultural capital of Morocco, home to the world's largest car-free urban area.",
        description_ar: 'العاصمة الروحية والثقافية للمغرب، موطن أكبر منطقة حضرية خالية من السيارات في العالم.',
        description_fr: "La capitale spirituelle et culturelle du Maroc, abritant la plus grande zone urbaine piétonne du monde.",
        description_it: 'La capitale spirituale e culturale del Marocco, sede della più grande area urbana pedonale del mondo.',
        description_es: 'La capital espiritual y cultural de Marruecos, hogar de la zona urbana peatonal más grande del mundo.',
        climate_en: 'Mediterranean',
        climate_ar: 'متوسطي',
        climate_fr: 'Méditerranéen',
        climate_it: 'Mediterraneo',
        climate_es: 'Mediterráneo',
        bestTimeToVisit_en: 'March to June, September to November',
        bestTimeToVisit_ar: 'مارس إلى يونيو، سبتمبر إلى نوفمبر',
        bestTimeToVisit_fr: 'Mars à juin, septembre à novembre',
        bestTimeToVisit_it: 'Marzo a giugno, settembre a novembre',
        bestTimeToVisit_es: 'Marzo a junio, septiembre a noviembre',
        keyFacts_en: "UNESCO World Heritage Site, Founded in 789, Home to Al-Qarawiyyin University, Capital: Fez",
        keyFacts_ar: 'موقع تراث عالمي لليونسكو، تأسست في 789، موطن جامعة القرويين، العاصمة: فاس',
        keyFacts_fr: "Site du patrimoine mondial de l'UNESCO, Fondée en 789, Abrite l'université Al-Qarawiyyin, Capitale: Fès",
        keyFacts_it: "Sito del patrimonio mondiale dell'UNESCO, Fondata nel 789, Sede dell'università Al-Qarawiyyin, Capitale: Fez",
        keyFacts_es: 'Patrimonio de la Humanidad de la UNESCO, Fundada en 789, Hogar de la Universidad Al-Qarawiyyin, Capital: Fez',
        latitude: 34.0181,
        longitude: -5.0078,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
      },
    }),
    prisma.region.create({
      data: {
        name_en: 'Casablanca',
        name_ar: 'الدار البيضاء',
        name_fr: 'Casablanca',
        name_it: 'Casablanca',
        name_es: 'Casablanca',
        description_en: "Morocco's largest city and economic hub, known for its modern architecture and coastal charm.",
        description_ar: 'أكبر مدينة في المغرب ومركز اقتصادي، معروفة بهندستها المعمارية الحديثة وسحرها الساحلي.',
        description_fr: 'La plus grande ville du Maroc et centre économique, connue pour son architecture moderne et son charme côtier.',
        description_it: 'La più grande città del Marocco e centro economico, nota per la sua architettura moderna e il fascino costiero.',
        description_es: 'La ciudad más grande de Marruecos y centro económico, conocida por su arquitectura moderna y encanto costero.',
        climate_en: 'Mediterranean',
        climate_ar: 'متوسطي',
        climate_fr: 'Méditerranéen',
        climate_it: 'Mediterraneo',
        climate_es: 'Mediterráneo',
        bestTimeToVisit_en: 'Year-round',
        bestTimeToVisit_ar: 'على مدار السنة',
        bestTimeToVisit_fr: "Toute l'année",
        bestTimeToVisit_it: "Tutto l'anno",
        bestTimeToVisit_es: 'Todo el año',
        keyFacts_en: 'Largest city in Morocco, Economic capital, Home to Hassan II Mosque, Population: ~3.4 million',
        keyFacts_ar: 'أكبر مدينة في المغرب، العاصمة الاقتصادية، موطن مسجد الحسن الثاني، عدد السكان: ~3.4 مليون',
        keyFacts_fr: 'Plus grande ville du Maroc, Capitale économique, Abrite la mosquée Hassan II, Population: ~3.4 millions',
        keyFacts_it: 'Più grande città del Marocco, Capitale economica, Sede della moschea Hassan II, Popolazione: ~3.4 milioni',
        keyFacts_es: 'Ciudad más grande de Marruecos, Capital económica, Hogar de la Mezquita Hassan II, Población: ~3.4 millones',
        latitude: 33.5731,
        longitude: -7.5898,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
      },
    }),
  ]);

  console.log('🗺️  Created regions');

  // Create attractions
  const attractions = await Promise.all([
    prisma.attraction.create({
      data: {
        name_en: 'Jemaa el-Fnaa',
        name_ar: 'ساحة جامع الفنا',
        name_fr: 'Jemaa el-Fnaa',
        name_it: 'Jemaa el-Fnaa',
        name_es: 'Jemaa el-Fnaa',
        description_en: "The main square and market place in Marrakech's medina quarter, a UNESCO World Heritage site.",
        description_ar: 'الميدان الرئيسي وسوق في حي المدينة القديمة في مراكش، موقع تراث عالمي لليونسكو.',
        description_fr: "La place principale et le marché du quartier de la médina de Marrakech, site du patrimoine mondial de l'UNESCO.",
        description_it: "La piazza principale e il mercato del quartiere della medina di Marrakech, sito del patrimonio mondiale dell'UNESCO.",
        description_es: 'La plaza principal y mercado del barrio de la medina de Marrakech, patrimonio de la humanidad de la UNESCO.',
        category_en: 'cultural',
        category_ar: 'ثقافي',
        category_fr: 'culturel',
        category_it: 'culturale',
        category_es: 'cultural',
        regionId: regions[0].id,
        latitude: 31.6258,
        longitude: -7.9891,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        rating: 4.8,
        tags: JSON.stringify(['market', 'square', 'street-food', 'entertainment']),
        entryFee: 0,
        currency: 'MAD',
      },
    }),
    prisma.attraction.create({
      data: {
        name_en: 'Fez El Bali',
        name_ar: 'فاس البالي',
        name_fr: 'Fès el-Bali',
        name_it: 'Fez el-Bali',
        name_es: 'Fez el-Bali',
        description_en: 'The oldest walled part of Fez, a UNESCO World Heritage site with over 9,000 narrow alleys.',
        description_ar: 'أقدم جزء مسور في فاس، موقع تراث عالمي لليونسكو مع أكثر من 9000 زقاق ضيق.',
        description_fr: "La plus ancienne partie fortifiée de Fès, site du patrimoine mondial de l'UNESCO avec plus de 9 000 ruelles étroites.",
        description_it: 'La parte più antica fortificata di Fez, sito del patrimonio mondiale dell\'UNESCO con oltre 9.000 vicoli stretti.',
        description_es: 'La parte más antigua amurallada de Fez, patrimonio de la humanidad de la UNESCO con más de 9.000 callejones estrechos.',
        category_en: 'historical',
        category_ar: 'تاريخي',
        category_fr: 'historique',
        category_it: 'storico',
        category_es: 'histórico',
        regionId: regions[1].id,
        latitude: 34.0181,
        longitude: -5.0078,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        rating: 4.9,
        tags: JSON.stringify(['medina', 'unesco', 'architecture', 'culture']),
        entryFee: 0,
        currency: 'MAD',
      },
    }),
    prisma.attraction.create({
      data: {
        name_en: 'Hassan II Mosque',
        name_ar: 'مسجد الحسن الثاني',
        name_fr: 'Mosquée Hassan II',
        name_it: 'Moschea Hassan II',
        name_es: 'Mezquita Hassan II',
        description_en: 'The largest mosque in Morocco and the 7th largest in the world, located on the Atlantic coast.',
        description_ar: 'أكبر مسجد في المغرب والسابع في العالم، يقع على ساحل المحيط الأطلسي.',
        description_fr: 'La plus grande mosquée du Maroc et la 7ème plus grande au monde, située sur la côte atlantique.',
        description_it: 'La più grande moschea del Marocco e la 7ª più grande al mondo, situata sulla costa atlantica.',
        description_es: 'La mezquita más grande de Marruecos y la 7ª más grande del mundo, ubicada en la costa atlántica.',
        category_en: 'religious',
        category_ar: 'ديني',
        category_fr: 'religieux',
        category_it: 'religioso',
        category_es: 'religioso',
        regionId: regions[2].id,
        latitude: 33.6083,
        longitude: -7.6328,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        rating: 4.7,
        tags: JSON.stringify(['mosque', 'architecture', 'religious', 'coastal']),
        entryFee: 120,
        currency: 'MAD',
      },
    }),
    prisma.attraction.create({
      data: {
        name_en: 'Bahia Palace',
        name_ar: 'قصر الباهية',
        name_fr: 'Palais de la Bahia',
        name_it: 'Palazzo della Bahia',
        name_es: 'Palacio de la Bahia',
        description_en: 'A stunning 19th-century palace showcasing the best of Moroccan architecture and craftsmanship.',
        description_ar: 'قصر مذهل من القرن التاسع عشر يعرض أفضل ما في العمارة والحرفية المغربية.',
        description_fr: "Un magnifique palais du XIXe siècle présentant le meilleur de l'architecture et de l'artisanat marocains.",
        description_it: "Un magnifico palazzo del XIX secolo che mostra il meglio dell'architettura e dell'artigianato marocchino.",
        description_es: 'Un impresionante palacio del siglo XIX que muestra lo mejor de la arquitectura y artesanía marroquí.',
        category_en: 'historical',
        category_ar: 'تاريخي',
        category_fr: 'historique',
        category_it: 'storico',
        category_es: 'histórico',
        regionId: regions[0].id,
        latitude: 31.6189,
        longitude: -7.9811,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        rating: 4.6,
        tags: JSON.stringify(['palace', 'architecture', 'history', 'garden']),
        entryFee: 70,
        currency: 'MAD',
      },
    }),
  ]);

  console.log('🏛️  Created attractions');

  // Create festivals
  const festivals = await Promise.all([
    prisma.festival.create({
      data: {
        name: 'Marrakech International Film Festival',
        description: 'One of the most prestigious film festivals in Africa and the Arab world.',
        type: 'film-festival',
        location: 'Marrakech',
        regionId: regions[0].id,
        timeOfYear: 'November',
        duration: 10,
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        established: '2001',
        historicalSignificance: 'Showcases the best of international cinema and promotes cultural exchange.',
      },
    }),
    prisma.festival.create({
      data: {
        name: 'Fez Festival of World Sacred Music',
        description: 'A celebration of spiritual music from around the world.',
        type: 'music-festival',
        location: 'Fez',
        regionId: regions[1].id,
        timeOfYear: 'June',
        duration: 9,
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        established: '1994',
        historicalSignificance: 'Promotes peace and understanding through sacred music traditions.',
      },
    }),
  ]);

  console.log('🎉 Created festivals');

  // Create cuisines
  const cuisines = await Promise.all([
    prisma.cuisine.create({
      data: {
        name: 'Tagine',
        description: 'A slow-cooked stew made in a distinctive clay pot, the national dish of Morocco.',
        type: 'main-dish',
        regionIds: JSON.stringify([regions[0].id, regions[1].id, regions[2].id]),
        ingredients: JSON.stringify(['lamb', 'chicken', 'vegetables', 'spices', 'olive-oil']),
        spiceLevel: 'medium',
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        popularVariants: JSON.stringify(['Lamb Tagine', 'Chicken Tagine', 'Vegetable Tagine']),
      },
    }),
    prisma.cuisine.create({
      data: {
        name: 'Couscous',
        description: 'Steamed semolina grains served with meat and vegetables, a Friday tradition.',
        type: 'main-dish',
        regionIds: JSON.stringify([regions[0].id, regions[1].id, regions[2].id]),
        ingredients: JSON.stringify(['semolina', 'lamb', 'vegetables', 'chickpeas', 'raisins']),
        spiceLevel: 'mild',
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        popularVariants: JSON.stringify(['Seven Vegetable Couscous', 'Lamb Couscous', 'Fish Couscous']),
      },
    }),
  ]);

  console.log('🍽️  Created cuisines');

  // Create heritage items
  const heritages = await Promise.all([
    prisma.heritage.create({
      data: {
        name: 'Gnawa Music',
        description: 'Traditional spiritual music and dance originating from sub-Saharan Africa.',
        type: 'music-dance',
        regionIds: JSON.stringify([regions[0].id, regions[1].id]),
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        importance: 'Represents the cultural fusion of African and Moroccan traditions, recognized by UNESCO.',
      },
    }),
    prisma.heritage.create({
      data: {
        name: 'Berber Carpets',
        description: 'Hand-woven carpets made by Berber women using traditional techniques.',
        type: 'craft',
        regionIds: JSON.stringify([regions[0].id, regions[1].id]),
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        importance: 'Preserves ancient weaving techniques and tells stories through symbolic patterns.',
      },
    }),
  ]);

  console.log('🏺 Created heritage items');

  // Create clothing items
  const clothing = await Promise.all([
    prisma.clothing.create({
      data: {
        name: 'Djellaba',
        description: 'A long, loose-fitting outer robe with a hood, worn by both men and women.',
        gender: 'unisex',
        regionIds: JSON.stringify([regions[0].id, regions[1].id, regions[2].id]),
        materials: JSON.stringify(['wool', 'cotton', 'silk']),
        occasions: JSON.stringify(['daily-wear', 'religious-ceremonies', 'formal-events']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        historicalNotes: 'Traditional garment dating back to the 12th century, adapted for modern wear.',
      },
    }),
    prisma.clothing.create({
      data: {
        name: 'Kaftan',
        description: 'An elegant, long-sleeved robe traditionally worn by women for special occasions.',
        gender: 'female',
        regionIds: JSON.stringify([regions[0].id, regions[1].id, regions[2].id]),
        materials: JSON.stringify(['silk', 'brocade', 'embroidery']),
        occasions: JSON.stringify(['weddings', 'religious-celebrations', 'formal-events']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1553603228-0f7053e3279e?w=800']),
        historicalNotes: 'Originally worn by Ottoman sultans, adapted by Moroccan women as formal wear.',
      },
    }),
  ]);

  console.log('👕 Created clothing items');

  // Create tour packages (with itinerary, days, accommodation, meals)
  const tourPackages = await Promise.all([
    prisma.tourPackage.create({
      data: {
        title_en: 'Sahara Desert Adventure',
        title_ar: 'مغامرة صحراء الصحراء',
        title_fr: 'Aventure dans le désert du Sahara',
        title_it: 'Avventura nel deserto del Sahara',
        title_es: 'Aventura en el desierto del Sahara',
        description_en: 'Experience dunes, camel treks, and starry nights in Merzouga.',
        description_ar: 'اكتشف الكثبان الرملية وركوب الجمال والليالي المرصعة بالنجوم في مرزوكة.',
        description_fr: 'Découvrez les dunes, les balades à dos de chameau et les nuits étoilées à Merzouga.',
        description_it: 'Vivi le dune, i trekking in cammello e le notti stellate a Merzouga.',
        description_es: 'Vive las dunas, paseos en camello y noches estrelladas en Merzouga.',
        duration: 3,
        price: 2500,
        currency: 'MAD',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1518684079798-675f0ddb6308?w=800']),
        included: JSON.stringify(['camel trek', 'desert camp', 'breakfasts']),
        excluded: JSON.stringify(['flights', 'personal expenses']),
        regionId: regions[0].id,
        maxParticipants: 10,
        featured: true,
        rating: 4.7,
        reviewCount: 124,
        itinerary: {
          create: {},
        },
        regions: {
          create: [
            { regionId: regions[0].id },
            { regionId: regions[1].id },
          ],
        },
      },
      include: { itinerary: true },
    }),
    prisma.tourPackage.create({
      data: {
        title_en: 'Imperial Cities Highlights',
        title_ar: 'أبرز المدن الإمبراطورية',
        title_fr: 'Points forts des villes impériales',
        title_it: 'Punti salienti delle città imperiali',
        title_es: 'Lo mejor de las ciudades imperiales',
        description_en: 'Explore Marrakech, Fez, and Casablanca with guided tours.',
        description_ar: 'استكشف مراكش وفاس والدار البيضاء بجولات إرشادية.',
        description_fr: 'Explorez Marrakech, Fès et Casablanca avec des visites guidées.',
        description_it: 'Esplora Marrakech, Fez e Casablanca con tour guidati.',
        description_es: 'Explora Marrakech, Fez y Casablanca con visitas guiadas.',
        duration: 5,
        price: 4200,
        currency: 'MAD',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800']),
        included: JSON.stringify(['city tours', 'hotel stays', 'breakfasts']),
        excluded: JSON.stringify(['lunch', 'dinners']),
        regionId: regions[2].id,
        maxParticipants: 20,
        featured: false,
        rating: 4.6,
        reviewCount: 89,
        itinerary: {
          create: {},
        },
        regions: {
          create: [
            { regionId: regions[0].id },
            { regionId: regions[1].id },
            { regionId: regions[2].id },
          ],
        },
      },
      include: { itinerary: true },
    }),
  ]);

  // Create itinerary days for each package
  const itineraryDaysPackage1 = await Promise.all([
    prisma.itineraryDay.create({
      data: {
        itineraryId: tourPackages[0].itinerary!.id,
        dayNumber: 1,
        title_en: 'Arrival and camel trek',
        title_ar: 'الوصول وركوب الجمال',
        title_fr: "Arrivée et trek à dos de chameau",
        title_it: 'Arrivo e trekking in cammello',
        title_es: 'Llegada y paseo en camello',
        description_en: 'Drive to Merzouga, sunset camel ride to desert camp.',
        description_ar: 'القيادة إلى مرزوكة، جولة غروب الشمس على الجمال إلى مخيم الصحراء.',
        description_fr: "Route vers Merzouga, balade en chameau au coucher du soleil jusqu'au camp du désert.",
        description_it: 'Guida verso Merzouga, giro in cammello al tramonto fino al campo nel deserto.',
        description_es: 'Conduce a Merzouga, paseo en camello al atardecer hasta el campamento del desierto.',
        activities: JSON.stringify(['transfer', 'camel-ride', 'desert-camp']),
      },
    }),
    prisma.itineraryDay.create({
      data: {
        itineraryId: tourPackages[0].itinerary!.id,
        dayNumber: 2,
        title_en: 'Erg Chebbi exploration',
        title_ar: 'اكتشاف عرق الشبي',
        title_fr: 'Exploration d’Erg Chebbi',
        title_it: 'Esplorazione di Erg Chebbi',
        title_es: 'Exploración de Erg Chebbi',
        description_en: '4x4 tour across dunes, visit nomad village.',
        description_ar: 'جولة بسيارة دفع رباعي عبر الكثبان الرملية وزيارة قرية بدوية.',
        description_fr: 'Tour en 4x4 à travers les dunes, visite d’un village nomade.',
        description_it: 'Tour in 4x4 tra le dune, visita al villaggio nomade.',
        description_es: 'Tour en 4x4 por las dunas, visita a un pueblo nómada.',
        activities: JSON.stringify(['4x4', 'cultural-visit']),
      },
    }),
    prisma.itineraryDay.create({
      data: {
        itineraryId: tourPackages[0].itinerary!.id,
        dayNumber: 3,
        title_en: 'Sunrise and return',
        title_ar: 'شروق الشمس والعودة',
        title_fr: 'Lever du soleil et retour',
        title_it: 'Alba e rientro',
        title_es: 'Amanecer y regreso',
        description_en: 'Sunrise over dunes, return to Marrakech.',
        description_ar: 'شروق الشمس فوق الكثبان الرملية، العودة إلى مراكش.',
        description_fr: 'Lever du soleil sur les dunes, retour à Marrakech.',
        description_it: 'Alba sulle dune, rientro a Marrakech.',
        description_es: 'Amanecer sobre las dunas, regreso a Marrakech.',
        activities: JSON.stringify(['sunrise', 'drive-back']),
      },
    }),
  ]);

  // Accommodation for Day 1
  const accommodationDay1 = await prisma.accommodation.create({
    data: {
      itineraryDayId: itineraryDaysPackage1[0].id,
      name_en: 'Berber Desert Camp',
      name_ar: 'مخيم صحراوي أمازيغي',
      name_fr: 'Campement berbère du désert',
      name_it: 'Campo nel deserto berbero',
      name_es: 'Campamento bereber en el desierto',
      stars: 4,
      type_en: 'camp',
      type_ar: 'مخيم',
      type_fr: 'camp',
      type_it: 'campo',
      type_es: 'campamento',
      address: 'Merzouga Desert, Morocco',
      description_en: 'Comfortable tents with local dinner and music.',
      description_ar: 'خيام مريحة مع عشاء محلي وموسيقى.',
      description_fr: 'Tentes confortables avec dîner local et musique.',
      description_it: 'Tende confortevoli con cena locale e musica.',
      description_es: 'Tiendas cómodas con cena local y música.',
    },
  });

  // Meals for Day 1
  const mealsDay1 = await Promise.all([
    prisma.meal.create({
      data: {
        itineraryDayId: itineraryDaysPackage1[0].id,
        type: 'breakfast',
        included: true,
        description_en: 'Tea, bread, olives, and omelette.',
      },
    }),
    prisma.meal.create({
      data: {
        itineraryDayId: itineraryDaysPackage1[0].id,
        type: 'dinner',
        included: true,
        description_en: 'Traditional tagine under the stars.',
      },
    }),
  ]);

  // Simple itinerary for second package
  const itineraryDaysPackage2 = await Promise.all([
    prisma.itineraryDay.create({
      data: {
        itineraryId: tourPackages[1].itinerary!.id,
        dayNumber: 1,
        title_en: 'Marrakech city tour',
        description_en: 'Visit Bahia Palace and Jemaa el-Fnaa.',
        activities: JSON.stringify(['city-tour', 'market']),
      },
    }),
    prisma.itineraryDay.create({
      data: {
        itineraryId: tourPackages[1].itinerary!.id,
        dayNumber: 2,
        title_en: 'Fez medina exploration',
        description_en: 'Discover Fez El Bali and tanneries.',
        activities: JSON.stringify(['medina', 'culture']),
      },
    }),
  ]);

  // Create guides and assign regions
  const guides = await Promise.all([
    prisma.guide.create({
      data: {
        name_en: 'Youssef Benali',
        name_ar: 'يوسف بنعلي',
        name_fr: 'Youssef Benali',
        name_it: 'Youssef Benali',
        name_es: 'Youssef Benali',
        description_en: 'Expert desert guide specialized in Sahara expeditions.',
        languages: JSON.stringify(['ar', 'fr', 'en']),
        specialties: JSON.stringify(['sahara', 'camel-trekking', 'camping']),
        certifications: JSON.stringify(['First Aid', 'Tourism License']),
        yearsOfExperience: 8,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800']),
        hourlyRate: 150,
        currency: 'MAD',
        email: 'youssef@example.com',
        phone: '+212600000001',
        website: 'https://example.com/youssef',
        rating: 4.8,
        reviewCount: 64,
        available: true,
        regions: {
          create: [{ regionId: regions[0].id }],
        },
      },
    }),
    prisma.guide.create({
      data: {
        name_en: 'Sara El Idrissi',
        name_ar: 'سارة الإدريسي',
        name_fr: 'Sara El Idrissi',
        name_it: 'Sara El Idrissi',
        name_es: 'Sara El Idrissi',
        description_en: 'Cultural guide for imperial cities and museums.',
        languages: JSON.stringify(['ar', 'fr', 'en', 'es']),
        specialties: JSON.stringify(['culture', 'history', 'museums']),
        certifications: JSON.stringify(['Tourism License']),
        yearsOfExperience: 5,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800']),
        hourlyRate: 120,
        currency: 'MAD',
        email: 'sara@example.com',
        phone: '+212600000002',
        website: 'https://example.com/sara',
        rating: 4.6,
        reviewCount: 41,
        available: true,
        regions: {
          create: [
            { regionId: regions[0].id },
            { regionId: regions[1].id },
            { regionId: regions[2].id },
          ],
        },
      },
    }),
  ]);

  console.log('🧭 Created guides');

  // Create transport services with vehicle options and regions
  const transportServices = await Promise.all([
    prisma.transportService.create({
      data: {
        name_en: 'Atlas Car Rentals',
        name_ar: 'أطلس لتأجير السيارات',
        name_fr: 'Atlas Location de Voitures',
        name_it: 'Atlas Noleggio Auto',
        name_es: 'Atlas Alquiler de Coches',
        description_en: 'Reliable car rentals with airport pickup in Marrakech.',
        description_ar: 'تأجير سيارات موثوق مع الاستلام من المطار في مراكش.',
        description_fr: 'Location de voitures fiable avec prise en charge à l’aéroport à Marrakech.',
        description_it: 'Noleggio auto affidabile con ritiro in aeroporto a Marrakech.',
        description_es: 'Alquiler de coches fiable con recogida en el aeropuerto en Marrakech.',
        type: 'car',
        type_en: 'car',
        type_ar: 'سيارة',
        type_fr: 'voiture',
        type_it: 'auto',
        type_es: 'coche',
        airportTransfer: true,
        available: true,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1493238792000-8113da705763?w=800']),
        email: 'contact@atlascar.ma',
        phone: '+212600000010',
        website: 'https://atlascar.ma',
        serviceArea: JSON.stringify(['Marrakech', 'Airport']),
        regions: {
          create: [{ regionId: regions[0].id }],
        },
        vehicleOptions: {
          create: [
            {
              type: 'economy',
              capacity: 4,
              pricePerDay: 350,
              features: JSON.stringify(['AC', 'manual']),
              imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800']),
            },
            {
              type: 'SUV',
              capacity: 5,
              pricePerDay: 650,
              features: JSON.stringify(['AC', 'automatic', '4x4']),
              imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800']),
            },
          ],
        },
      },
      include: { vehicleOptions: true },
    }),
    prisma.transportService.create({
      data: {
        name_en: 'Sahara 4x4 Transfers',
        name_ar: 'نقل الصحراء 4x4',
        name_fr: 'Transferts Sahara 4x4',
        name_it: 'Trasferimenti Sahara 4x4',
        name_es: 'Traslados Sahara 4x4',
        description_en: '4x4 transfers between Marrakech and Merzouga.',
        description_ar: 'نقل بسيارات الدفع الرباعي بين مراكش ومرزوكة.',
        description_fr: 'Transferts en 4x4 entre Marrakech et Merzouga.',
        description_it: 'Trasferimenti in 4x4 tra Marrakech e Merzouga.',
        description_es: 'Traslados en 4x4 entre Marrakech y Merzouga.',
        type: '4x4',
        type_en: '4x4',
        type_ar: 'دفع رباعي',
        type_fr: '4x4',
        type_it: '4x4',
        type_es: '4x4',
        airportTransfer: false,
        available: true,
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1617460585985-55e16cf3ccec?w=800']),
        email: 'book@sahara4x4.ma',
        phone: '+212600000011',
        website: 'https://sahara4x4.ma',
        serviceArea: JSON.stringify(['Marrakech', 'Merzouga']),
        regions: {
          create: [
            { regionId: regions[0].id },
            { regionId: regions[1].id },
          ],
        },
        vehicleOptions: {
          create: [
            {
              type: 'Land Cruiser',
              capacity: 6,
              pricePerDay: 1200,
              features: JSON.stringify(['AC', '4x4', 'experienced-driver']),
              imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800']),
            },
          ],
        },
      },
      include: { vehicleOptions: true },
    }),
  ]);

  console.log('🚐 Created transport services');

  // Create travel guides (content articles)
  const travelGuides = await Promise.all([
    prisma.travelGuide.create({
      data: {
        title_en: 'Ultimate Guide to Marrakech',
        title_ar: 'الدليل الشامل إلى مراكش',
        title_fr: 'Guide ultime de Marrakech',
        title_it: 'Guida definitiva a Marrakech',
        title_es: 'Guía definitiva de Marrakech',
        description_en: 'Top attractions, where to stay, and how to get around.',
        description_ar: 'أفضل المعالم، أماكن الإقامة، وكيفية التنقل.',
        description_fr: 'Principales attractions, où séjourner et comment se déplacer.',
        description_it: 'Le principali attrazioni, dove alloggiare e come muoversi.',
        description_es: 'Principales atracciones, dónde alojarse y cómo moverse.',
        content_en: 'Detailed content about Marrakech travel planning...',
        author: 'Admin',
        publishedDate: new Date('2024-06-01'),
        type: 'general',
        tags: JSON.stringify(['marrakech', 'city-guide', 'tips']),
        regionIds: JSON.stringify([regions[0].id]),
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800']),
        featuredImageUrl: 'https://images.unsplash.com/photo-1504610926078-a1611febcad3?w=1200',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    }),
    prisma.travelGuide.create({
      data: {
        title_en: 'Sahara Desert Travel Tips',
        title_ar: 'نصائح السفر إلى الصحراء',
        title_fr: 'Conseils de voyage dans le désert du Sahara',
        title_it: 'Consigli di viaggio nel deserto del Sahara',
        title_es: 'Consejos para viajar al desierto del Sahara',
        description_en: 'What to pack, safety, best routes, and seasons.',
        description_ar: 'ماذا تحزم، السلامة، أفضل الطرق والمواسم.',
        description_fr: 'Que mettre dans sa valise, sécurité, meilleurs itinéraires et saisons.',
        description_it: 'Cosa mettere in valigia, sicurezza, migliori itinerari e stagioni.',
        description_es: 'Qué llevar, seguridad, mejores rutas y estaciones.',
        content_en: 'Comprehensive tips for a safe and enjoyable desert trip...',
        author: 'Travel Team',
        publishedDate: new Date('2024-07-15'),
        type: 'thematic',
        tags: JSON.stringify(['sahara', 'packing', 'safety']),
        regionIds: JSON.stringify([regions[0].id, regions[1].id]),
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800']),
      },
    }),
  ]);

  console.log('📖 Created travel guides');

  console.log('✅ Database seeding completed successfully!');
  console.log(
    `📊 Created ${regions.length} regions, ${attractions.length} attractions, ${festivals.length} festivals, ${cuisines.length} cuisines, ${heritages.length} heritage items, ${clothing.length} clothing items, ${tourPackages.length} tour packages, ${guides.length} guides, ${transportServices.length} transport services, ${travelGuides.length} travel guides`
  );
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 