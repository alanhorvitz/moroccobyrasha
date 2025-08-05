import { Attraction } from '../types';

export const touristAttractions: Attraction[] = [
  // Marrakech-Safi Region
  {
    id: "jemaa-el-fnaa",
    name: "Jemaa el-Fnaa",
    description: "The main square and marketplace of Marrakech, a UNESCO World Heritage site filled with food stalls, street performers, and snake charmers that becomes especially lively at night.",
    regionId: "marrakech-safi",
    type: "cultural",
    images: ["/images/attractions/jemaa-el-fnaa-1.jpg", "/images/attractions/jemaa-el-fnaa-2.jpg"],
    location: { lat: 31.6258, lng: -7.9891 },
  },
  {
    id: "majorelle-garden",
    name: "Jardin Majorelle",
    description: "A two-and-half-acre botanical garden designed by French artist Jacques Majorelle, later owned by Yves Saint Laurent. Features vibrant blue buildings, exotic plants, and the Berber Museum.",
    regionId: "marrakech-safi",
    type: "cultural",
    images: ["/images/attractions/majorelle-1.jpg", "/images/attractions/majorelle-2.jpg"],
    location: { lat: 31.6417, lng: -8.0035 },
  },
  {
    id: "bahia-palace",
    name: "Bahia Palace",
    description: "A 19th-century palace with beautiful gardens and Moroccan architecture featuring intricate tile work, carved cedar ceilings, and tranquil courtyards.",
    regionId: "marrakech-safi",
    type: "historical",
    images: ["/images/BahiaPalace.jpg", "/images/BahiaPalace.jpg"],
    location: { lat: 31.6219, lng: -7.9833 },
  },

  // Casablanca-Settat Region
  {
    id: "hassan-ii-mosque",
    name: "Hassan II Mosque",
    description: "One of the largest mosques in the world with a 210-meter minaret. Built partly on the Atlantic Ocean with a glass floor, intricate decorations, and stunning craftsmanship.",
    regionId: "casablanca-settat",
    type: "historical",
    images: ["/images/HassanIIMosque.jpg", "/images/HassanIIMosque.jpg"],
    location: { lat: 33.6086, lng: -7.6327 },
  },
  {
    id: "casablanca-corniche",
    name: "Casablanca Corniche",
    description: "A scenic beachfront district with restaurants, swimming pools, beach clubs, and a beautiful promenade along the Atlantic Ocean.",
    regionId: "casablanca-settat",
    type: "entertainment",
    images: ["/images/attractions/corniche-1.jpg", "/images/attractions/corniche-2.jpg"],
    location: { lat: 33.6048, lng: -7.6647 },
  },

  // Fès-Meknès Region
  {
    id: "fes-el-bali",
    name: "Fès el Bali (Old Medina)",
    description: "The world's largest car-free urban area and a UNESCO World Heritage site with nearly 10,000 narrow streets, historic buildings, madrasas, fondouks, and artisan workshops.",
    regionId: "fes-meknes",
    type: "historical",
    images: ["/images/attractions/fes-medina-1.jpg", "/images/attractions/fes-medina-2.jpg"],
    location: { lat: 34.0639, lng: -4.9794 },
  },
  {
    id: "bou-inania-madrasa",
    name: "Bou Inania Madrasa",
    description: "A 14th-century educational institution featuring some of the finest examples of Merenid architecture with detailed zellige tilework, carved wood, and calligraphy.",
    regionId: "fes-meknes",
    type: "historical",
    images: ["/images/MerenidArchitecture.jpg", "/images/attractions/bou-inania-2.jpg"],
    location: { lat: 34.0673, lng: -4.9735 },
  },
  {
    id: "volubilis",
    name: "Volubilis Roman Ruins",
    description: "Exceptionally well-preserved Roman ruins dating from the 3rd century BC, featuring stunning mosaics, triumphal arches, and columns set against a beautiful countryside backdrop.",
    regionId: "fes-meknes",
    type: "historical",
    images: ["/images/attractions/volubilis-1.jpg", "/images/attractions/volubilis-2.jpg"],
    location: { lat: 34.0727, lng: -5.5549 },
  },

  // Tangier-Tetouan-Al Hoceima Region
  {
    id: "chefchaouen-medina",
    name: "Chefchaouen Blue City",
    description: "A stunning mountain town famous for its blue-painted buildings, charming medina, and relaxed atmosphere. Offers beautiful views, handicraft shopping, and unique photo opportunities.",
    regionId: "tangier-tetouan-al-hoceima",
    type: "cultural",
    images: ["/images/attractions/chefchaouen-1.jpg", "/images/attractions/chefchaouen-2.jpg"],
    location: { lat: 35.1713, lng: -5.2697 },
  },
  {
    id: "hercules-cave",
    name: "Cave of Hercules",
    description: "A natural sea cave with an opening resembling the map of Africa. Associated with the legend of Hercules, it features both natural and man-made sections and stunning ocean views.",
    regionId: "tangier-tetouan-al-hoceima",
    type: "natural",
    images: ["/images/attractions/hercules-cave-1.jpg", "/images/attractions/hercules-cave-2.jpg"],
    location: { lat: 35.7686, lng: -5.9386 },
  },

  // Drâa-Tafilalet Region
  {
    id: "merzouga-desert",
    name: "Merzouga Desert & Erg Chebbi Dunes",
    description: "Spectacular orange-hued sand dunes reaching up to 150 meters high. Popular for camel treks, overnight desert camps, stargazing, and experiencing traditional Berber culture.",
    regionId: "draa-tafilalet",
    type: "natural",
    images: ["/images/attractions/merzouga-1.jpg", "/images/attractions/merzouga-2.jpg"],
    location: { lat: 31.1021, lng: -3.9778 },
  },
  {
    id: "todgha-gorge",
    name: "Todgha Gorge",
    description: "A spectacular canyon with limestone cliffs rising up to 400 meters. Popular for hiking, rock climbing, and experiencing traditional Berber villages nestled along the river.",
    regionId: "draa-tafilalet",
    type: "natural",
    images: ["/images/Hiking.jpg", "/images/Beach.jpg"],
    location: { lat: 31.5897, lng: -5.5933 },
  },

  // Souss-Massa Region
  {
    id: "agadir-beach",
    name: "Agadir Beach",
    description: "A 10-kilometer crescent-shaped beach with golden sands, crystal-clear waters, and modern facilities. Popular for sunbathing, water sports, and beachfront dining.",
    regionId: "souss-massa",
    type: "natural",
    images: ["/images/attractions/agadir-beach-1.jpg", "/images/Beach.jpg"],
    location: { lat: 30.4138, lng: -9.6057 },
  },
  {
    id: "paradise-valley",
    name: "Paradise Valley",
    description: "A palm-fringed oasis in the High Atlas foothills with natural rock pools, waterfalls, and stunning landscapes. Perfect for hiking, swimming, and cliff jumping.",
    regionId: "souss-massa",
    type: "natural",
    images: ["/images/ParadiseValley.jpg", "/images/attractions/paradise-valley-2.jpg"],
    location: { lat: 30.5881, lng: -9.3773 },
  },

  // Béni Mellal-Khénifra Region
  {
    id: "ouzoud-falls",
    name: "Ouzoud Waterfalls",
    description: "Morocco's highest waterfalls, plunging 110 meters through a lush valley. Offers boat rides, rainbow views, resident monkeys, and traditional oil mills ('ouzoud' means olive in Berber).",
    regionId: "beni-mellal-khenifra",
    type: "natural",
    images: ["/images/attractions/ouzoud-1.jpg", "/images/attractions/ouzoud-2.jpg"],
    location: { lat: 32.0187, lng: -6.7198 },
  },

  // Rabat-Salé-Kénitra Region
  {
    id: "udayas-kasbah",
    name: "Kasbah of the Udayas",
    description: "A historic fortification overlooking the Atlantic Ocean and Bou Regreg River, featuring white and blue houses, Andalusian gardens, and impressive gates.",
    regionId: "rabat-sale-kenitra",
    type: "historical",
    images: ["/images/attractions/udayas-1.jpg", "/images/HassanTower.jpg"],
    location: { lat: 34.0241, lng: -6.8371 },
  },
  {
    id: "hassan-tower",
    name: "Hassan Tower",
    description: "An incomplete 12th-century minaret of what was intended to be the world's largest mosque. Now stands alongside the Mausoleum of Mohammed V in a vast esplanade.",
    regionId: "rabat-sale-kenitra",
    type: "historical",
    images: ["/images/HassanTower.jpg", "/images/HassanTower.jpg"],
    location: { lat: 34.0241, lng: -6.8222 },
  }
];