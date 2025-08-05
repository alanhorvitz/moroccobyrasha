import { VirtualTour, VirtualTourHotspot } from '../types';

// Sample data for Moroccan virtual tours
export const virtualTours: VirtualTour[] = [
  {
    id: "jemaa-el-fnaa-360",
    title: "Jemaa el-Fnaa Square 360° Experience",
    description: "Immerse yourself in the bustling heart of Marrakech with this 360° tour of the famous Jemaa el-Fnaa square. Experience the sights and sounds of this UNESCO cultural heritage site with its food stalls, performers, and vibrant atmosphere.",
    regionId: "marrakech-safi",
    attractionId: "jemaa-el-fnaa",
    tourUrl: "/virtual-tours/jemaa-el-fnaa/index.html",
    thumbnailUrl: "/images/virtual-tours/jemaa-el-fnaa-thumb.jpg",
    hotspots: [
      {
        id: "snake-charmers",
        title: "Snake Charmers",
        description: "Watch traditional snake charmers performing with cobras and other snakes, a centuries-old tradition in Moroccan public squares.",
        coordinates: { x: 15, y: -10, z: 30 },
        type: "info"
      },
      {
        id: "food-stalls",
        title: "Evening Food Market",
        description: "Each evening, the square transforms into a massive open-air dining area with dozens of food stalls serving traditional Moroccan dishes.",
        coordinates: { x: -25, y: 0, z: 20 },
        type: "info"
      },
      {
        id: "storytellers",
        title: "Halqa - Storytelling Circles",
        description: "Traditional storytellers (Hakawatis) gather crowds to share folk tales and legends, continuing an oral tradition that dates back centuries.",
        coordinates: { x: 5, y: 0, z: -30 },
        type: "video",
        mediaUrl: "/videos/jemaa-storytellers.mp4"
      },
      {
        id: "koutoubia",
        title: "View of Koutoubia Mosque",
        description: "From here you can see the towering minaret of the Koutoubia Mosque, the largest mosque in Marrakech.",
        coordinates: { x: -20, y: 15, z: -25 },
        type: "link",
        linkedTourId: "koutoubia-mosque-360"
      }
    ],
    duration: 15,
    createdDate: "2023-06-12"
  },
  {
    id: "fes-medina-360",
    title: "Fes El Bali Medina Virtual Tour",
    description: "Explore the ancient medina of Fes, the world's largest car-free urban area and a UNESCO World Heritage site. Navigate through the labyrinthine streets with over 9,000 alleys and discover the historic heart of Morocco's cultural capital.",
    regionId: "fes-meknes",
    attractionId: "fes-el-bali",
    tourUrl: "/virtual-tours/fes-medina/index.html",
    thumbnailUrl: "/images/virtual-tours/fes-medina-thumb.jpg",
    hotspots: [
      {
        id: "tanneries",
        title: "Chouara Tanneries",
        description: "View the famous leather tanneries where hides are still processed using methods unchanged since medieval times. The circular stone vessels filled with dye create a unique, colorful sight.",
        coordinates: { x: 10, y: 0, z: 25 },
        type: "info"
      },
      {
        id: "qarawiyyin",
        title: "Al-Qarawiyyin University and Mosque",
        description: "Founded in 859 CE by Fatima al-Fihri, this is considered the oldest continually operating university in the world.",
        coordinates: { x: -15, y: 5, z: 30 },
        type: "video",
        mediaUrl: "/videos/qarawiyyin-mosque.mp4"
      },
      {
        id: "bab-boujloud",
        title: "Bab Boujloud (Blue Gate)",
        description: "The ornate main western entrance to the medina, known for its distinctive blue tilework on the exterior and green tilework on the interior.",
        coordinates: { x: -30, y: 0, z: -10 },
        type: "info"
      },
      {
        id: "artisans",
        title: "Artisan Workshops",
        description: "Watch master craftsmen at work using traditional techniques to create pottery, textiles, and metalwork.",
        coordinates: { x: 25, y: -5, z: -15 },
        type: "audio",
        mediaUrl: "/audio/fes-artisans-explanation.mp3"
      }
    ],
    duration: 20,
    createdDate: "2023-04-28"
  },
  {
    id: "chefchaouen-360",
    title: "Chefchaouen: The Blue City in 360°",
    description: "Wander through the striking blue streets of Chefchaouen, Morocco's famous 'Blue Pearl' nestled in the Rif Mountains. This immersive 360° tour lets you experience the unique atmosphere and stunning photo opportunities of this picturesque town.",
    regionId: "tangier-tetouan-al-hoceima",
    attractionId: "chefchaouen-medina",
    tourUrl: "/virtual-tours/chefchaouen/index.html",
    thumbnailUrl: "/images/virtual-tours/chefchaouen-thumb.jpg",
    hotspots: [
      {
        id: "main-square",
        title: "Plaza Uta el-Hammam",
        description: "The main square of Chefchaouen, surrounded by cafes and restaurants, with the kasbah and the Great Mosque.",
        coordinates: { x: 0, y: 0, z: 30 },
        type: "info"
      },
      {
        id: "blue-alleys",
        title: "Blue Alleyways",
        description: "Explore the famously photogenic blue-washed streets that give Chefchaouen its distinctive character.",
        coordinates: { x: -20, y: 0, z: 20 },
        type: "info"
      },
      {
        id: "kasbah",
        title: "Kasbah Museum",
        description: "The restored kasbah in the center of town houses a small museum and garden with views from its tower.",
        coordinates: { x: 15, y: 5, z: 25 },
        type: "link",
        linkedTourId: "chefchaouen-kasbah-360"
      },
      {
        id: "artisans",
        title: "Local Artisans",
        description: "Watch local craftspeople creating traditional woolen garments and other handicrafts unique to the Rif Mountain region.",
        coordinates: { x: 25, y: -5, z: -10 },
        type: "video",
        mediaUrl: "/videos/chefchaouen-weaving.mp4"
      }
    ],
    duration: 15,
    createdDate: "2023-07-14"
  },
  {
    id: "ait-benhaddou-360",
    title: "Ait Benhaddou Ksar 360° Tour",
    description: "Step into a fairytale setting with this virtual tour of Ait Benhaddou, a spectacular fortified village (ksar) and UNESCO World Heritage site. Famous as a backdrop for numerous films including Gladiator and Game of Thrones.",
    regionId: "draa-tafilalet",
    attractionId: "ait-benhaddou",
    tourUrl: "/virtual-tours/ait-benhaddou/index.html",
    thumbnailUrl: "/images/virtual-tours/ait-benhaddou-thumb.jpg",
    hotspots: [
      {
        id: "panoramic-view",
        title: "Panoramic Viewpoint",
        description: "Take in the breathtaking view of the entire ksar from this elevated position, perfect for understanding the scale and layout of this ancient fortified village.",
        coordinates: { x: 0, y: 20, z: -30 },
        type: "info"
      },
      {
        id: "main-gate",
        title: "Main Entrance Gate",
        description: "The impressive main gate that has welcomed travelers along the caravan route for centuries.",
        coordinates: { x: -10, y: 0, z: 30 },
        type: "info"
      },
      {
        id: "kasbah-interior",
        title: "Interior Courtyard",
        description: "Explore the interior of one of the larger kasbahs, with its traditional earthen architecture.",
        coordinates: { x: 25, y: 0, z: 10 },
        type: "video",
        mediaUrl: "/videos/ait-benhaddou-interior.mp4"
      },
      {
        id: "film-history",
        title: "Film History",
        description: "Learn about the many famous films and TV shows that have used Ait Benhaddou as a spectacular backdrop.",
        coordinates: { x: -20, y: 5, z: -15 },
        type: "audio",
        mediaUrl: "/audio/ait-benhaddou-film-history.mp3"
      }
    ],
    duration: 15,
    createdDate: "2023-05-19"
  },
  {
    id: "majorelle-garden-360",
    title: "Jardin Majorelle 360° Experience",
    description: "Immerse yourself in the vibrant colors of Jardin Majorelle in Marrakech, the stunning garden created by French painter Jacques Majorelle and later owned and restored by Yves Saint Laurent. Experience the famous cobalt 'Majorelle Blue' buildings, exotic plants, and serene pools.",
    regionId: "marrakech-safi",
    attractionId: "majorelle-garden",
    tourUrl: "/virtual-tours/majorelle-garden/index.html",
    thumbnailUrl: "/images/virtual-tours/majorelle-garden-thumb.jpg",
    hotspots: [
      {
        id: "blue-villa",
        title: "The Blue Villa",
        description: "The striking cobalt blue villa that houses the Berber Museum, painted in the distinctive 'Majorelle Blue' color that the artist created and patented.",
        coordinates: { x: 0, y: 0, z: 25 },
        type: "info"
      },
      {
        id: "cactus-garden",
        title: "Cactus Garden",
        description: "A spectacular collection of cacti from around the world, artistically arranged throughout the garden.",
        coordinates: { x: -20, y: 0, z: 15 },
        type: "info"
      },
      {
        id: "memorial",
        title: "Yves Saint Laurent Memorial",
        description: "A memorial to fashion designer Yves Saint Laurent, whose ashes were scattered in the garden after his death in 2008.",
        coordinates: { x: 15, y: 0, z: -20 },
        type: "info"
      },
      {
        id: "water-features",
        title: "Reflecting Pools",
        description: "The tranquil water features that provide both beauty and a cooling effect in the garden.",
        coordinates: { x: 10, y: -5, z: 15 },
        type: "video",
        mediaUrl: "/videos/majorelle-fountains.mp4"
      }
    ],
    duration: 10,
    createdDate: "2023-02-18"
  },
  {
    id: "sahara-desert-360",
    title: "Sahara Desert 360° Virtual Tour",
    description: "Experience the magic of the Moroccan Sahara with this immersive 360° tour of the Erg Chebbi dunes near Merzouga. Witness the otherworldly landscape of golden sand dunes stretching as far as the eye can see, traditional desert camps, and the unique desert lifestyle.",
    regionId: "draa-tafilalet",
    attractionId: "merzouga-desert",
    tourUrl: "/virtual-tours/sahara-desert/index.html",
    thumbnailUrl: "/images/virtual-tours/sahara-desert-thumb.jpg",
    hotspots: [
      {
        id: "dune-sunrise",
        title: "Sunrise on the Dunes",
        description: "Experience the breathtaking sight of sunrise over the Sahara, when the dunes are bathed in golden light and long shadows create dramatic patterns across the landscape.",
        coordinates: { x: 0, y: 10, z: 30 },
        type: "video",
        mediaUrl: "/videos/sahara-sunrise.mp4"
      },
      {
        id: "berber-camp",
        title: "Traditional Berber Camp",
        description: "Explore a traditional desert camp with its nomadic-style tents, central campfire area, and basic but comfortable accommodations.",
        coordinates: { x: -25, y: 0, z: 10 },
        type: "info"
      },
      {
        id: "camel-trek",
        title: "Camel Caravan",
        description: "Join a traditional camel caravan as it makes its way across the dunes, the same way travelers have crossed the desert for centuries.",
        coordinates: { x: 20, y: -5, z: 15 },
        type: "info"
      },
      {
        id: "night-sky",
        title: "Desert Night Sky",
        description: "The Sahara is one of the best places on Earth for stargazing, with minimal light pollution revealing millions of stars and the full glory of the Milky Way.",
        coordinates: { x: 5, y: 20, z: -20 },
        type: "video",
        mediaUrl: "/videos/sahara-night-sky.mp4"
      }
    ],
    duration: 15,
    createdDate: "2023-09-01"
  }
];