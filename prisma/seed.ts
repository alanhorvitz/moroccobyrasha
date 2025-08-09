import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.region.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.cuisine.deleteMany();
  await prisma.heritage.deleteMany();
  await prisma.clothing.deleteMany();

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
        description_en: 'The Red City, known for its bustling souks, historic medina, and vibrant culture.',
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
        keyFacts_en: 'UNESCO World Heritage Site, Founded in 1062, Population: ~1 million, Capital: Marrakech',
        keyFacts_ar: 'موقع تراث عالمي لليونسكو، تأسست في 1062، عدد السكان: ~1 مليون، العاصمة: مراكش',
        keyFacts_fr: 'Site du patrimoine mondial de l\'UNESCO, Fondée en 1062, Population: ~1 million, Capitale: Marrakech',
        keyFacts_it: 'Sito del patrimonio mondiale dell\'UNESCO, Fondata nel 1062, Popolazione: ~1 milione, Capitale: Marrakech',
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
        description_en: 'The spiritual and cultural capital of Morocco, home to the world\'s largest car-free urban area.',
        description_ar: 'العاصمة الروحية والثقافية للمغرب، موطن أكبر منطقة حضرية خالية من السيارات في العالم.',
        description_fr: 'La capitale spirituelle et culturelle du Maroc, abritant la plus grande zone urbaine piétonne du monde.',
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
        keyFacts_en: 'UNESCO World Heritage Site, Founded in 789, Home to Al-Qarawiyyin University, Capital: Fez',
        keyFacts_ar: 'موقع تراث عالمي لليونسكو، تأسست في 789، موطن جامعة القرويين، العاصمة: فاس',
        keyFacts_fr: 'Site du patrimoine mondial de l\'UNESCO, Fondée en 789, Abrite l\'université Al-Qarawiyyin, Capitale: Fès',
        keyFacts_it: 'Sito del patrimonio mondiale dell\'UNESCO, Fondata nel 789, Sede dell\'università Al-Qarawiyyin, Capitale: Fez',
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
        description_en: 'Morocco\'s largest city and economic hub, known for its modern architecture and coastal charm.',
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
        bestTimeToVisit_fr: 'Toute l\'année',
        bestTimeToVisit_it: 'Tutto l\'anno',
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
        description_en: 'The main square and market place in Marrakech\'s medina quarter, a UNESCO World Heritage site.',
        description_ar: 'الميدان الرئيسي وسوق في حي المدينة القديمة في مراكش، موقع تراث عالمي لليونسكو.',
        description_fr: 'La place principale et le marché du quartier de la médina de Marrakech, site du patrimoine mondial de l\'UNESCO.',
        description_it: 'La piazza principale e il mercato del quartiere della medina di Marrakech, sito del patrimonio mondiale dell\'UNESCO.',
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
        description_fr: 'La plus ancienne partie fortifiée de Fès, site du patrimoine mondial de l\'UNESCO avec plus de 9 000 ruelles étroites.',
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
        description_fr: 'Un magnifique palais du XIXe siècle présentant le meilleur de l\'architecture et de l\'artisanat marocains.',
        description_it: 'Un magnifico palazzo del XIX secolo che mostra il meglio dell\'architettura e dell\'artigianato marocchino.',
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

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${regions.length} regions, ${attractions.length} attractions, ${festivals.length} festivals, ${cuisines.length} cuisines, ${heritages.length} heritage items, and ${clothing.length} clothing items`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 