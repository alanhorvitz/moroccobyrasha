import { TravelGuide } from '../types';

// Sample data for Moroccan travel guides
export const travelGuides: TravelGuide[] = [
  {
    id: "marrakech-essentials",
    title: "Essential Guide to Marrakech",
    description: "Everything you need to know for a perfect visit to the Red City, from navigating the medina to finding the best riads and hidden restaurants.",
    regionIds: ["marrakech-safi"],
    content: `
      <h2>Introduction to Marrakech</h2>
      <p>Founded in 1062, Marrakech is one of Morocco's imperial cities and has been a cultural, religious, and trading center for centuries. Today, it's a vibrant blend of ancient traditions and modern cosmopolitan life.</p>
      
      <h2>Navigating the Medina</h2>
      <p>The historic medina of Marrakech is a UNESCO World Heritage site and can seem like a labyrinth to first-time visitors. Here are some tips:</p>
      <ul>
        <li>Use Jemaa el-Fnaa or Koutoubia Mosque as landmarks for orientation</li>
        <li>Download an offline map application</li>
        <li>Don't be afraid to get lost – some of the best discoveries happen this way</li>
        <li>If you need directions, ask shopkeepers rather than people on the street</li>
      </ul>
      
      <h2>Must-Visit Attractions</h2>
      <ol>
        <li><strong>Jemaa el-Fnaa Square</strong> - The heart of the medina, bustling with performers, food stalls, and vendors</li>
        <li><strong>Koutoubia Mosque</strong> - The largest mosque in Marrakech with its iconic 77-meter minaret</li>
        <li><strong>Bahia Palace</strong> - An exceptional example of Moroccan architecture with beautiful gardens</li>
        <li><strong>Majorelle Garden</strong> - A botanical masterpiece and memorial to Yves Saint Laurent</li>
        <li><strong>Saadian Tombs</strong> - Royal necropolis showcasing exquisite Moroccan craftsmanship</li>
      </ol>
      
      <h2>Where to Stay</h2>
      <p>For an authentic experience, stay in a traditional riad within the medina. These historic homes with interior courtyards offer a peaceful retreat from the bustling streets.</p>
      
      <h2>Local Cuisine</h2>
      <p>Don't miss trying tangia, a Marrakech specialty slow-cooked in clay pots, or sampling street food at Jemaa el-Fnaa in the evening.</p>
      
      <h2>Shopping Guide</h2>
      <p>Marrakech is famous for its souks (markets). Best buys include leather goods, lanterns, carpets, spices, and argan oil products.</p>
      
      <h2>Day Trips</h2>
      <p>Consider excursions to the Atlas Mountains, Essaouira, or Ouzoud Falls - all accessible within a few hours from the city.</p>
    `,
    author: "Travel Morocco Editorial Team",
    publishedDate: "2023-06-15",
    type: "general",
    tags: ["marrakech", "medina", "attractions", "travel-tips", "city-guide"],
    images: [
      "/images/travel-guides/marrakech-medina.jpg",
      "/images/travel-guides/marrakech-koutoubia.jpg",
      "/images/travel-guides/marrakech-jemaa-el-fna.jpg"
    ],
    featuredImage: "/images/Marrakech.jpg",
    videoUrl: "/videos/marrakech-city-guide.mp4"
  },
  {
    id: "sahara-adventure",
    title: "Sahara Desert Adventure Guide",
    description: "Plan your journey into the magnificent Sahara Desert, from camel treks and overnight camps to the best routes and seasons to visit.",
    regionIds: ["draa-tafilalet"],
    content: `
      <h2>The Magic of the Sahara</h2>
      <p>The Sahara Desert offers one of Morocco's most unforgettable experiences. Vast golden dunes, star-filled night skies, and the profound silence of the desert create an almost mystical experience for visitors.</p>
      
      <h2>Best Entry Points</h2>
      <p>The two main gateways to the Moroccan Sahara are:</p>
      <ul>
        <li><strong>Merzouga</strong> - Home to the famous Erg Chebbi dunes, rising dramatically from the desert floor</li>
        <li><strong>M'Hamid</strong> - Gateway to Erg Chigaga, more remote and less visited than Erg Chebbi</li>
      </ul>
      
      <h2>When to Visit</h2>
      <p>The ideal times to visit the Sahara are during spring (March-May) and fall (September-November) when temperatures are moderate. Summer temperatures regularly exceed 40°C (104°F), while winter nights can drop below freezing.</p>
      
      <h2>Desert Experiences</h2>
      <ul>
        <li><strong>Camel Trekking</strong> - The traditional way to traverse the dunes</li>
        <li><strong>Desert Camps</strong> - From basic Berber tents to luxury glamping experiences</li>
        <li><strong>Stargazing</strong> - The Sahara offers some of the clearest night skies in the world</li>
        <li><strong>Sandboarding</strong> - Surf the dunes on a sand board</li>
        <li><strong>4x4 Excursions</strong> - For more distant explorations</li>
      </ul>
      
      <h2>What to Pack</h2>
      <p>Essential items include:</p>
      <ul>
        <li>Headscarf or hat for sun protection</li>
        <li>Sunglasses and high SPF sunscreen</li>
        <li>Layers of clothing (for temperature fluctuations)</li>
        <li>Closed shoes for walking in sand</li>
        <li>Flashlight or headlamp</li>
        <li>Camera with extra batteries</li>
      </ul>
      
      <h2>Cultural Encounters</h2>
      <p>The desert is home to Berber nomads who have traversed these lands for centuries. Many tours include visits to nomadic families or desert settlements, offering insight into traditional desert life.</p>
      
      <h2>Responsible Tourism</h2>
      <p>Help preserve the fragile desert ecosystem by taking all trash with you, using water sparingly, and respecting local customs and traditions.</p>
    `,
    author: "Mohammed El Fassi",
    publishedDate: "2023-04-20",
    type: "specialized",
    tags: ["sahara", "desert", "adventure", "camel-trekking", "erg-chebbi", "merzouga"],
    images: [
      "/images/travel-guides/sahara-camels.jpg",
      "/images/travel-guides/sahara-camp.jpg",
      "/images/travel-guides/sahara-dunes.jpg"
    ],
    featuredImage: "/images/travel-guides/sahara-featured.jpg"
  },
  {
    id: "moroccan-cuisine-journey",
    title: "A Culinary Journey Through Morocco",
    description: "Discover the rich and diverse flavors of Moroccan cuisine, from tagines and couscous to street food and pastries, with recipes and recommendations.",
    regionIds: ["all"],
    content: `
      <h2>Introduction to Moroccan Cuisine</h2>
      <p>Moroccan cuisine is a culinary journey of diverse influences from Berber, Arabic, Andalusian, and Mediterranean cultures. It's known for its rich flavors, aromatic spices, and unique cooking techniques.</p>
      
      <h2>Essential Spices</h2>
      <p>The foundation of Moroccan cooking lies in its spice blends:</p>
      <ul>
        <li><strong>Ras el Hanout</strong> - A complex blend that can include up to 30 different spices</li>
        <li><strong>Cumin</strong> - Used in many Moroccan dishes for its earthy flavor</li>
        <li><strong>Saffron</strong> - The world's most expensive spice, used in special dishes</li>
        <li><strong>Cinnamon</strong> - Often used in both savory and sweet dishes</li>
        <li><strong>Paprika</strong> - Adds color and mild heat</li>
      </ul>
      
      <h2>Iconic Dishes</h2>
      <h3>Tagine</h3>
      <p>Named after the conical clay pot it's cooked in, tagine is a slow-cooked stew with meat (typically lamb or chicken), vegetables, fruits, and aromatic spices. Regional variations abound.</p>
      
      <h3>Couscous</h3>
      <p>The national dish of Morocco, traditionally served on Fridays. Steamed semolina grains topped with vegetables and meat in a flavorful broth.</p>
      
      <h3>Pastilla</h3>
      <p>A sweet-savory pie originating from Fes, traditionally made with pigeon (now often chicken) wrapped in paper-thin warqa dough, flavored with almonds, eggs, and cinnamon.</p>
      
      <h2>Street Food Experiences</h2>
      <p>Some must-try street foods include:</p>
      <ul>
        <li><strong>Bessara</strong> - Fava bean soup, especially popular for breakfast</li>
        <li><strong>Msemen</strong> - Flaky square pancakes, served plain or with honey</li>
        <li><strong>Brochettes</strong> - Grilled meat skewers</li>
        <li><strong>Snail Soup</strong> - A popular delicacy in Marrakech</li>
      </ul>
      
      <h2>Moroccan Tea Culture</h2>
      <p>Mint tea is more than a beverage in Morocco—it's a symbol of hospitality and friendship. The ceremonial preparation and serving of this sweet green tea infused with fresh mint is an art form.</p>
      
      <h2>Regional Specialties</h2>
      <ul>
        <li><strong>Fes</strong> - Known for pastilla and complex flavored dishes</li>
        <li><strong>Marrakech</strong> - Famous for tangia, a meat dish slow-cooked in urn-shaped clay pots</li>
        <li><strong>Essaouira</strong> - Renowned for its fresh seafood</li>
        <li><strong>Atlas Mountains</strong> - Home to hearty meat and vegetable stews</li>
      </ul>
      
      <h2>Cooking Classes</h2>
      <p>Taking a cooking class is one of the best ways to learn about Moroccan cuisine. Many riads and cultural centers offer classes that begin with a visit to local markets to select ingredients.</p>
    `,
    author: "Chef Fatima Benhaddou",
    publishedDate: "2023-07-10",
    type: "thematic",
    tags: ["food", "cuisine", "recipes", "culinary-tourism", "tagine", "couscous"],
    images: [
      "/images/travel-guides/moroccan-tagine.jpg",
      "/images/travel-guides/moroccan-spices.jpg",
      "/images/travel-guides/moroccan-tea.jpg"
    ],
    featuredImage: "/images/travel-guides/moroccan-cuisine-featured.jpg",
    videoUrl: "/videos/moroccan-cooking-class.mp4"
  },
  {
    id: "northern-morocco",
    title: "Northern Morocco: From Tangier to Chefchaouen",
    description: "Explore Morocco's northern treasures, including the blue city of Chefchaouen, cosmopolitan Tangier, historic Tetouan, and the rugged Rif Mountains.",
    regionIds: ["tangier-tetouan-al-hoceima"],
    content: `
      <h2>Gateway to Africa: Tangier</h2>
      <p>Sitting at the crossroads of Europe and Africa, Tangier has long been a city of intrigue, inspiration, and international influence. Once a haven for artists, writers, and spies, modern Tangier combines its colorful past with contemporary development.</p>
      
      <h2>What to See in Tangier</h2>
      <ul>
        <li><strong>Kasbah</strong> - Historic fortress with panoramic views of the Strait of Gibraltar</li>
        <li><strong>Medina</strong> - Smaller and more navigable than other Moroccan medinas</li>
        <li><strong>American Legation Museum</strong> - The only U.S. National Historic Landmark on foreign soil</li>
        <li><strong>Caves of Hercules</strong> - Natural sea caves with a fascinating opening shaped like Africa</li>
        <li><strong>Cap Spartel</strong> - Where the Mediterranean meets the Atlantic</li>
      </ul>
      
      <h2>The Blue Pearl: Chefchaouen</h2>
      <p>Nestled in the Rif Mountains, Chefchaouen is famous for its striking blue-washed buildings. This charming town offers a more relaxed pace than Morocco's larger cities.</p>
      
      <h2>Exploring Chefchaouen</h2>
      <ul>
        <li><strong>Blue Medina</strong> - Wander the picturesque blue streets and alleyways</li>
        <li><strong>Plaza Uta el-Hammam</strong> - The main square, perfect for people-watching</li>
        <li><strong>Kasbah Museum</strong> - Offers insights into the region's history</li>
        <li><strong>Ras El Maa</strong> - Refreshing waterfall just outside the medina</li>
        <li><strong>Spanish Mosque</strong> - Short hike offering panoramic views of the town</li>
      </ul>
      
      <h2>Historic Tetouan</h2>
      <p>With strong Spanish influences, Tetouan's UNESCO-listed medina showcases well-preserved Andalusian architecture and crafts.</p>
      
      <h2>Natural Beauty of Al Hoceima</h2>
      <p>This coastal region features some of Morocco's most beautiful Mediterranean beaches and the stunning Al Hoceima National Park.</p>
      
      <h2>Practical Tips</h2>
      <ul>
        <li>Regular buses connect Tangier, Tetouan, and Chefchaouen</li>
        <li>Spring and fall offer the most pleasant weather for exploring</li>
        <li>The region is more conservative than some other parts of Morocco - dress respectfully</li>
        <li>While Spanish is widely understood in the north, learning a few phrases in Arabic or French is appreciated</li>
      </ul>
      
      <h2>Unique Shopping</h2>
      <p>Northern Morocco is known for distinctive handicrafts including woolen blankets from the Rif Mountains, leather goods from Tetouan, and unique blue-themed souvenirs from Chefchaouen.</p>
    `,
    author: "Ahmed Torres",
    publishedDate: "2023-05-05",
    type: "general",
    tags: ["chefchaouen", "tangier", "tetouan", "northern-morocco", "rif-mountains"],
    images: [
      "/images/travel-guides/chefchaouen-blue-streets.jpg",
      "/images/travel-guides/tangier-kasbah.jpg",
      "/images/travel-guides/tetouan-medina.jpg"
    ],
    featuredImage: "/images/travel-guides/chefchaouen-featured.jpg"
  },
  {
    id: "imperial-cities",
    title: "Morocco's Imperial Cities: A Historical Journey",
    description: "Discover the rich history and cultural heritage of Morocco's four imperial cities: Fes, Marrakech, Meknes, and Rabat.",
    regionIds: ["fes-meknes", "marrakech-safi", "rabat-sale-kenitra"],
    content: `
      <h2>The Legacy of Imperial Morocco</h2>
      <p>Morocco's imperial cities—Fes, Marrakech, Meknes, and Rabat—have each served as the country's capital at various points in history. Each city preserves unique aspects of Morocco's rich dynastic history.</p>
      
      <h2>Fes: The Cultural Capital</h2>
      <p>Founded in the 9th century, Fes reached its height under the Marinid dynasty (13th-14th centuries). It's home to the world's oldest continuously operating university, Al-Qarawiyyin, established in 859.</p>
      
      <h3>Must-See in Fes</h3>
      <ul>
        <li><strong>Fes el Bali</strong> - The world's largest car-free urban area with over 9,000 narrow streets and alleyways</li>
        <li><strong>Al-Qarawiyyin Mosque and University</strong> - The oldest existing, continually operating university in the world</li>
        <li><strong>Bou Inania Madrasa</strong> - Exquisite example of Marinid architecture</li>
        <li><strong>Chouara Tannery</strong> - Traditional leather tanning using methods unchanged since medieval times</li>
      </ul>
      
      <h2>Marrakech: The Red City</h2>
      <p>Founded in 1062 by the Almoravid dynasty, Marrakech became a major Islamic cultural center. Its red walls and buildings give it the nickname "The Red City."</p>
      
      <h3>Must-See in Marrakech</h3>
      <ul>
        <li><strong>Jemaa el-Fnaa Square</strong> - The bustling heart of the city</li>
        <li><strong>Koutoubia Mosque</strong> - The city's largest mosque and an architectural landmark</li>
        <li><strong>El Badi Palace</strong> - Once one of the most beautiful palaces in the world</li>
        <li><strong>Bahia Palace</strong> - A stunning example of Moroccan architecture</li>
      </ul>
      
      <h2>Meknes: The Moroccan Versailles</h2>
      <p>Sultan Moulay Ismail made Meknes his capital in the 17th century, creating grand architecture inspired by Versailles. Less visited than other imperial cities, it offers a more relaxed experience.</p>
      
      <h3>Must-See in Meknes</h3>
      <ul>
        <li><strong>Bab Mansour</strong> - One of the most beautiful gates in Morocco</li>
        <li><strong>Royal Stables</strong> - Built to house 12,000 horses</li>
        <li><strong>Mausoleum of Moulay Ismail</strong> - The final resting place of the sultan who made Meknes great</li>
        <li><strong>Volubilis</strong> - Nearby Roman ruins, one of the best-preserved archaeological sites in North Africa</li>
      </ul>
      
      <h2>Rabat: The Modern Capital</h2>
      <p>Morocco's current capital combines historic sites with modern administrative districts. Founded in the 12th century, it became the capital under French rule and remained so after independence.</p>
      
      <h3>Must-See in Rabat</h3>
      <ul>
        <li><strong>Kasbah of the Udayas</strong> - Fortress overlooking the Atlantic Ocean</li>
        <li><strong>Hassan Tower</strong> - The unfinished minaret of what would have been the world's largest mosque</li>
        <li><strong>Chellah Necropolis</strong> - Roman ruins and medieval Muslim necropolis</li>
        <li><strong>Royal Palace</strong> - Official residence of the King of Morocco</li>
      </ul>
      
      <h2>Imperial Cities Circuit</h2>
      <p>The four imperial cities form a popular tourist circuit. The ideal order is:</p>
      <ol>
        <li>Start in Rabat (where most international flights arrive)</li>
        <li>Continue to Meknes (with a side trip to Volubilis)</li>
        <li>Then to Fes</li>
        <li>Finally to Marrakech</li>
      </ol>
      <p>Allow at least 10 days for this circuit to properly experience each city.</p>
    `,
    author: "Dr. Leila Benali",
    publishedDate: "2023-03-12",
    type: "thematic",
    tags: ["imperial-cities", "history", "architecture", "fes", "marrakech", "meknes", "rabat"],
    images: [
      "/images/travel-guides/fes-medina.jpg",
      "/images/travel-guides/meknes-bab-mansour.jpg",
      "/images/travel-guides/rabat-kasbah.jpg"
    ],
    featuredImage: "/images/travel-guides/imperial-cities-featured.jpg"
  }
];