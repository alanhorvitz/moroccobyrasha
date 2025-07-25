import { TourPackage } from '../types';

export const tourPackages: TourPackage[] = [
  {
    id: "imperial-cities-tour",
    title: "Imperial Cities Tour",
    description: "Explore Morocco's historic imperial cities and their rich cultural heritage. Visit grand palaces, ancient medinas, and vibrant souks while experiencing the royal history of Morocco.",
    regionId: "fes-meknes",
    duration: 7,
    price: 899,
    inclusions: [
      "6 nights accommodation in 4-star riads and hotels",
      "Daily breakfast and 3 dinners",
      "Private transportation",
      "English-speaking guide",
      "Entrance fees to monuments",
      "Local experiences and demonstrations"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Lunches and some dinners",
      "Tips and gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Casablanca & Transfer to Rabat",
        description: "Welcome to Morocco! Upon arrival at Casablanca's Mohammed V Airport, visit the impressive Hassan II Mosque before continuing to Rabat, the capital city.",
        activities: ["Hassan II Mosque visit", "Transfer to Rabat", "Welcome dinner"]
      },
      {
        day: 2,
        title: "Rabat & Transfer to Fès",
        description: "Explore Rabat's highlights including the Kasbah of the Udayas and Hassan Tower before traveling to Fès, stopping at the Roman ruins of Volubilis en route.",
        activities: ["Kasbah of the Udayas", "Hassan Tower", "Volubilis archaeological site", "Arrival in Fès"]
      },
      {
        day: 3,
        title: "Fès Exploration",
        description: "Full day exploring the medieval medina of Fès, visiting historic madrasas, the tanneries, and artisan workshops with a specialized local guide.",
        activities: ["Fès el Bali medina tour", "Bou Inania Madrasa", "Tanneries visit", "Artisan workshops"]
      },
      {
        day: 4,
        title: "Fès to Meknès",
        description: "Journey to Meknès, the 'Versailles of Morocco', to explore its monumental gates, royal stables, and historic medina.",
        activities: ["Bab Mansour gate", "Royal stables", "Meknès medina", "Mausoleum of Moulay Ismail"]
      },
      {
        day: 5,
        title: "Meknès to Marrakech",
        description: "Travel through the Middle Atlas mountains and Berber villages to reach the 'Red City' of Marrakech.",
        activities: ["Scenic mountain drive", "Berber village visit", "Arrival in Marrakech"]
      },
      {
        day: 6,
        title: "Marrakech Discovery",
        description: "Explore the vibrant city of Marrakech, including the Koutoubia Mosque, Bahia Palace, the medina, and the famous Jemaa el-Fnaa square.",
        activities: ["Bahia Palace", "Saadian Tombs", "Medina shopping", "Jemaa el-Fnaa evening experience"]
      },
      {
        day: 7,
        title: "Departure from Marrakech",
        description: "Final morning at leisure before transferring to Marrakech Menara Airport for your departure flight.",
        activities: ["Free time for last-minute shopping", "Airport transfer"]
      }
    ],
    images: ["/images/tours/imperial-cities-1.jpg", "/images/tours/imperial-cities-2.jpg", "/images/tours/imperial-cities-3.jpg"],
    maxParticipants: 16,
    featured: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "sahara-adventure",
    title: "Sahara Desert Adventure",
    description: "Experience the magic of the Moroccan Sahara with this desert adventure tour. Trek on camels across golden dunes, sleep under the stars in a traditional camp, and explore ancient kasbahs.",
    regionId: "draa-tafilalet",
    duration: 4,
    price: 549,
    inclusions: [
      "3 nights accommodation (1 in desert camp, 2 in hotels/kasbahs)",
      "Daily breakfast and dinner",
      "4x4 transportation",
      "Camel trek",
      "English-speaking guide",
      "Desert camp experience"
    ],
    exclusions: [
      "Flights to/from Morocco",
      "Travel insurance",
      "Personal expenses",
      "Lunches",
      "Tips for guides and drivers"
    ],
    itinerary: [
      {
        day: 1,
        title: "Marrakech to Dades Valley",
        description: "Depart from Marrakech crossing the High Atlas Mountains via the spectacular Tizi n'Tichka Pass. Visit Ait Benhaddou Kasbah before reaching Dades Valley.",
        activities: ["Atlas Mountains crossing", "Ait Benhaddou UNESCO site visit", "Overnight in Dades Valley"]
      },
      {
        day: 2,
        title: "Dades Valley to Merzouga Desert",
        description: "Journey through Todra Gorge and the Valley of a Thousand Kasbahs to reach the Sahara Desert at Merzouga. Ride camels into the dunes for a night at a desert camp.",
        activities: ["Todra Gorge visit", "Camel trekking", "Sunset in the dunes", "Traditional music by campfire", "Night in desert camp"]
      },
      {
        day: 3,
        title: "Merzouga to Ouarzazate",
        description: "Wake early for the desert sunrise, then journey to Ouarzazate, visiting Berber villages and the Draa Valley along the way.",
        activities: ["Desert sunrise", "Rissani market visit", "Draa Valley scenic drive", "Overnight in Ouarzazate"]
      },
      {
        day: 4,
        title: "Ouarzazate to Marrakech",
        description: "Visit the Ouarzazate Film Studios before returning to Marrakech, crossing back over the Atlas Mountains.",
        activities: ["Ouarzazate Film Studios", "Atlas Mountains crossing", "Return to Marrakech"]
      }
    ],
    images: ["/images/tours/sahara-1.jpg", "/images/tours/sahara-2.jpg", "/images/tours/sahara-3.jpg"],
    maxParticipants: 12,
    featured: true,
    rating: 4.9,
    reviewCount: 86
  },
  {
    id: "coastal-explorer",
    title: "Atlantic Coast Explorer",
    description: "Discover Morocco's stunning Atlantic coastline from Casablanca to Agadir. Enjoy beautiful beaches, historic ports, fresh seafood, and the relaxed coastal lifestyle.",
    regionId: "souss-massa",
    duration: 8,
    price: 1099,
    inclusions: [
      "7 nights accommodation in seaside hotels",
      "Daily breakfast",
      "Private transportation",
      "English-speaking guide",
      "City tours and entrance fees",
      "Boat excursion in Essaouira"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Most meals",
      "Optional activities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Casablanca",
        description: "Arrive in Casablanca and enjoy a welcome dinner overlooking the Atlantic Ocean after visiting the Hassan II Mosque.",
        activities: ["Airport pickup", "Hassan II Mosque visit", "Corniche walk", "Welcome dinner"]
      },
      {
        day: 2,
        title: "Casablanca to Rabat",
        description: "Morning exploration of Casablanca before traveling along the coast to Rabat, with its beautiful beaches and historic medina.",
        activities: ["Mohamed V Square", "Habous Quarter", "Rabat Beach visit"]
      },
      {
        day: 3,
        title: "Rabat to Asilah",
        description: "Travel to the charming whitewashed coastal town of Asilah, known for its Portuguese fortifications and vibrant art scene.",
        activities: ["Asilah medina walk", "Ramparts visit", "Beach time", "Sunset dinner"]
      },
      {
        day: 4,
        title: "Asilah to Essaouira",
        description: "Long but scenic journey down the Atlantic coast to the bohemian town of Essaouira, with stops at beautiful beaches along the way.",
        activities: ["Coastal drive", "Beach stops", "Arrival in Essaouira"]
      },
      {
        day: 5,
        title: "Essaouira Exploration",
        description: "Full day exploring the UNESCO-listed medina of Essaouira, its working harbor, and enjoying a seafood feast.",
        activities: ["Medina tour", "Boat excursion", "Seafood lunch at the port", "Free time for shopping"]
      },
      {
        day: 6,
        title: "Essaouira to Taghazout",
        description: "Continue south to the laid-back surfing village of Taghazout, enjoying beach time and optional surf lessons.",
        activities: ["Scenic coastal drive", "Beach time", "Optional surf lesson", "Sunset yoga"]
      },
      {
        day: 7,
        title: "Taghazout & Paradise Valley",
        description: "Morning at leisure before an excursion to Paradise Valley with its natural pools and waterfalls.",
        activities: ["Free morning", "Paradise Valley hike", "Swimming in natural pools", "Farewell dinner"]
      },
      {
        day: 8,
        title: "Departure from Agadir",
        description: "Transfer to Agadir Airport for your departure flight, or extend your stay at the beach.",
        activities: ["Airport transfer", "Optional Agadir city tour if time permits"]
      }
    ],
    images: ["/images/tours/coastal-1.jpg", "/images/Beach.jpg", "/images/beach.jpg"],
    maxParticipants: 14,
    featured: false,
    rating: 4.6,
    reviewCount: 52
  },
  {
    id: "morocco-highlights",
    title: "Morocco Highlights",
    description: "The perfect introduction to Morocco, covering the must-see destinations from imperial cities to the Sahara Desert and coastal towns in this comprehensive tour.",
    regionId: "marrakech-safi",
    duration: 10,
    price: 1299,
    inclusions: [
      "9 nights accommodation",
      "Daily breakfast and 5 dinners",
      "Private transportation",
      "English-speaking guide",
      "Entrance fees",
      "Desert camel trek",
      "Cooking class in Marrakech"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Some meals",
      "Tips and gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Casablanca",
        description: "Welcome to Morocco! Arrive in Casablanca and begin with a visit to the magnificent Hassan II Mosque.",
        activities: ["Airport pickup", "Hassan II Mosque", "Welcome dinner"]
      },
      {
        day: 2,
        title: "Casablanca to Fès",
        description: "Travel to Rabat for a brief tour of the capital before continuing to the imperial city of Fès.",
        activities: ["Rabat city tour", "Hassan Tower", "Travel to Fès"]
      },
      {
        day: 3,
        title: "Fès Exploration",
        description: "Full day exploring the medieval medina of Fès with its madrasas, fondouks, and artisan quarters.",
        activities: ["Guided tour of Fès el Bali", "Al-Qarawiyyin University", "Tanneries visit"]
      },
      {
        day: 4,
        title: "Fès to Merzouga",
        description: "Journey south through the Middle Atlas mountains, passing Berber villages and cedar forests en route to the Sahara.",
        activities: ["Ifrane visit", "Cedar forest", "Ziz Valley", "Arrival at desert gateway"]
      },
      {
        day: 5,
        title: "Merzouga Desert Experience",
        description: "Morning at leisure before a sunset camel trek into the Erg Chebbi dunes for a night in a desert camp.",
        activities: ["Camel trek", "Sunset in dunes", "Traditional dinner", "Overnight in desert camp"]
      },
      {
        day: 6,
        title: "Merzouga to Dades Valley",
        description: "Return from the desert and travel through Todra Gorge to the spectacular Dades Valley.",
        activities: ["Desert sunrise", "Todra Gorge hike", "Dades Valley scenic drive"]
      },
      {
        day: 7,
        title: "Dades Valley to Marrakech",
        description: "Travel the Road of a Thousand Kasbahs, visiting Ait Benhaddou before crossing the High Atlas to Marrakech.",
        activities: ["Ait Benhaddou visit", "Tizi n'Tichka Pass", "Arrival in Marrakech"]
      },
      {
        day: 8,
        title: "Marrakech Exploration",
        description: "Discover the wonders of Marrakech, from historic sites to the bustling Jemaa el-Fnaa square.",
        activities: ["Bahia Palace", "Saadian Tombs", "Majorelle Gardens", "Jemaa el-Fnaa evening visit"]
      },
      {
        day: 9,
        title: "Marrakech to Essaouira",
        description: "Day trip to the coastal town of Essaouira with its Portuguese fortifications and artistic atmosphere.",
        activities: ["Argan oil cooperative", "Essaouira guided tour", "Free time at the beach", "Return to Marrakech"]
      },
      {
        day: 10,
        title: "Departure from Marrakech",
        description: "Cooking class in the morning to learn Moroccan cuisine before transferring to the airport for departure.",
        activities: ["Moroccan cooking class", "Lunch with your own creations", "Airport transfer"]
      }
    ],
    images: ["/images/tours/highlights-1.jpg", "/images/tours/highlights-2.jpg", "/images/tours/highlights-3.jpg"],
    maxParticipants: 16,
    featured: true,
    rating: 4.9,
    reviewCount: 197
  },
  {
    id: "northern-morocco",
    title: "Northern Morocco Explorer",
    description: "Discover the less-visited northern regions of Morocco, including the blue city of Chefchaouen, historic Tangier, and the beautiful Mediterranean coast.",
    regionId: "tangier-tetouan-al-hoceima",
    duration: 6,
    price: 849,
    inclusions: [
      "5 nights accommodation",
      "Daily breakfast",
      "Private transportation",
      "English-speaking guide",
      "Entrance fees",
      "Ferry excursion (seasonal)"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Most meals",
      "Tips and gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Tangier",
        description: "Welcome to Tangier! Explore this fascinating port city where Europe meets Africa, visiting the kasbah and historic medina.",
        activities: ["Airport pickup", "Tangier Kasbah", "Medina walking tour", "Welcome dinner"]
      },
      {
        day: 2,
        title: "Tangier and Cap Spartel",
        description: "Visit the Cave of Hercules and Cap Spartel where the Mediterranean meets the Atlantic, then enjoy Tangier's international districts.",
        activities: ["Cave of Hercules", "Cap Spartel lighthouse", "American Legation", "Café culture experience"]
      },
      {
        day: 3,
        title: "Tangier to Chefchaouen",
        description: "Journey to the famous 'Blue Pearl' of Chefchaouen nestled in the Rif Mountains, with its picturesque blue-washed streets.",
        activities: ["Scenic mountain drive", "Chefchaouen walking tour", "Sunset viewpoint hike", "Free time for photography"]
      },
      {
        day: 4,
        title: "Chefchaouen to Tetouan",
        description: "After a morning in Chefchaouen, travel to Tetouan with its UNESCO-listed medina and strong Spanish influence.",
        activities: ["Free time in Chefchaouen", "Tetouan Royal Palace", "Medina guided tour", "Ensemble Artisanal visit"]
      },
      {
        day: 5,
        title: "Tetouan and the Mediterranean Coast",
        description: "Explore the beautiful Mediterranean coastline, visiting Martil beach and optionally taking a boat trip (weather permitting).",
        activities: ["Mediterranean beaches", "Optional boat excursion", "Seafood lunch", "Coastal drive"]
      },
      {
        day: 6,
        title: "Return to Tangier and Departure",
        description: "Morning at leisure before returning to Tangier for your departure flight.",
        activities: ["Free time", "Return to Tangier", "Airport transfer"]
      }
    ],
    images: ["/images/tours/northern-1.jpg", "/images/Relaxation.jpg", "/images/tours/northern-3.jpg"],
    maxParticipants: 12,
    featured: false,
    rating: 4.7,
    reviewCount: 43
  }
];