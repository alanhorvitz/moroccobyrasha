import { MediaItem } from '../types';

export const mediaGallery: MediaItem[] = [
  // Marrakech & Cultural Images
  {
    id: "media-001",
    title: "Jemaa el-Fnaa at Sunset",
    type: "image",
    url: "/images/gallery/jemaa-el-fnaa-sunset.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/jemaa-el-fnaa-sunset.jpg",
    category: ["cultural", "marrakech", "featured"],
    regionId: "marrakech-safi",
    description: "The famous square comes alive at sunset with food stalls, performers, and locals enjoying the evening.",
    uploadedAt: "2024-04-15T18:30:00Z"
  },
  {
    id: "media-002",
    title: "Bahia Palace Interior",
    type: "image",
    url: "/images/gallery/bahia-palace.jpg",
    thumbnailUrl: "/images/BahiaPalace.jpg",
    category: ["historical", "marrakech", "architecture"],
    regionId: "marrakech-safi",
    description: "Intricate tilework and carved cedar ceilings inside the 19th-century Bahia Palace.",
    uploadedAt: "2024-03-22T14:45:00Z"
  },
  {
    id: "media-003",
    title: "Majorelle Garden Pathways",
    type: "image",
    url: "/images/gallery/majorelle-garden.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/majorelle-garden.jpg",
    category: ["gardens", "marrakech", "featured"],
    regionId: "marrakech-safi",
    description: "Vibrant blue structures contrast with exotic plants in this iconic Marrakech garden.",
    uploadedAt: "2024-02-18T10:20:00Z"
  },
  
  // Desert & Landscape Images
  {
    id: "media-004",
    title: "Sahara Desert Sunset",
    type: "image",
    url: "/images/gallery/sahara-sunset.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/sahara-sunset.jpg",
    category: ["landscape", "desert", "featured"],
    regionId: "draa-tafilalet",
    description: "Golden hour over the stunning sand dunes of Erg Chebbi in the Sahara Desert.",
    uploadedAt: "2024-05-05T18:50:00Z"
  },
  {
    id: "media-005",
    title: "Camel Caravan in Merzouga",
    type: "image",
    url: "/images/gallery/camel-caravan.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/camel-caravan.jpg",
    category: ["desert", "experiences", "featured"],
    regionId: "draa-tafilalet",
    description: "Traditional camel caravan crossing the Sahara Desert near Merzouga.",
    uploadedAt: "2024-01-30T15:15:00Z"
  },
  {
    id: "media-006",
    title: "Todra Gorge Panorama",
    type: "image",
    url: "/images/gallery/todra-gorge.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/todra-gorge.jpg",
    category: ["landscape", "nature", "adventure"],
    regionId: "draa-tafilalet",
    description: "Spectacular rock formations in the Todra Gorge, a popular spot for hiking and rock climbing.",
    uploadedAt: "2024-03-12T12:00:00Z"
  },
  
  // Coastal Images
  {
    id: "media-007",
    title: "Essaouira Ramparts",
    type: "image",
    url: "/images/gallery/essaouira-ramparts.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/essaouira-ramparts.jpg",
    category: ["coastal", "historical", "featured"],
    regionId: "marrakech-safi",
    description: "Historic sea walls of Essaouira with dramatic waves crashing against the fortifications.",
    uploadedAt: "2024-04-28T16:40:00Z"
  },
  {
    id: "media-008",
    title: "Agadir Beach Sunset",
    type: "image",
    url: "/images/gallery/agadir-beach.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/agadir-beach.jpg",
    category: ["coastal", "beaches", "relaxation"],
    regionId: "souss-massa",
    description: "The golden sands and sunset views from Agadir's famous beach resort area.",
    uploadedAt: "2024-05-10T19:25:00Z"
  },
  
  // Northern Morocco Images
  {
    id: "media-009",
    title: "Chefchaouen Blue Streets",
    type: "image",
    url: "/images/gallery/chefchaouen-streets.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/chefchaouen-streets.jpg",
    category: ["cultural", "architecture", "featured"],
    regionId: "tangier-tetouan-al-hoceima",
    description: "The iconic blue-washed streets of Chefchaouen in the Rif Mountains.",
    uploadedAt: "2024-02-05T11:30:00Z"
  },
  {
    id: "media-010",
    title: "Tangier Kasbah View",
    type: "image",
    url: "/images/Tangier.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/tangier-view.jpg",
    category: ["cultural", "cityscape", "historical"],
    regionId: "tangier-tetouan-al-hoceima",
    description: "Panoramic view from the Kasbah in Tangier overlooking the Strait of Gibraltar.",
    uploadedAt: "2024-03-18T14:10:00Z"
  },
  
  // Imperial Cities Images
  {
    id: "media-011",
    title: "Fès El Bali Aerial View",
    type: "image",
    url: "/images/gallery/fes-aerial.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/fes-aerial.jpg",
    category: ["historical", "cityscape", "featured"],
    regionId: "fes-meknes",
    description: "Bird's eye view of the ancient medina of Fès, the world's largest car-free urban area.",
    uploadedAt: "2024-01-15T09:50:00Z"
  },
  {
    id: "media-012",
    title: "Leather Tanneries of Fès",
    type: "image",
    url: "/images/gallery/fes-tanneries.jpg",
    thumbnailUrl: "/images/gallery/thumbnails/fes-tanneries.jpg",
    category: ["cultural", "crafts", "featured"],
    regionId: "fes-meknes",
    description: "The colorful and historic Chouara Tannery in Fès, operating since the 11th century.",
    uploadedAt: "2024-02-22T13:15:00Z"
  },
  
  // Video Content
  {
    id: "media-013",
    title: "Moroccan Cuisine: Making Traditional Tagine",
    type: "video",
    url: "/images/gallery/videos/making-tagine.mp4",
    thumbnailUrl: "/images/gallery/thumbnails/making-tagine.jpg",
    category: ["culinary", "cultural", "experiences"],
    description: "Step-by-step demonstration of preparing a traditional Moroccan lamb tagine with dates and apricots.",
    uploadedAt: "2024-04-05T15:00:00Z"
  },
  {
    id: "media-014",
    title: "Atlas Mountains Journey",
    type: "video",
    url: "/images/gallery/videos/atlas-journey.mp4",
    thumbnailUrl: "/images/gallery/thumbnails/atlas-journey.jpg",
    category: ["landscape", "adventure", "featured"],
    regionId: "marrakech-safi",
    description: "Scenic drive through the High Atlas Mountains showcasing breathtaking landscapes and Berber villages.",
    uploadedAt: "2024-03-30T10:45:00Z"
  },
  {
    id: "media-015",
    title: "Marrakech Medina Walk-through",
    type: "video",
    url: "/images/gallery/videos/marrakech-walk.mp4",
    thumbnailUrl: "/images/Marrakech.jpg",
    category: ["cultural", "experiences", "featured"],
    regionId: "marrakech-safi",
    description: "Immersive walking tour through the winding streets and souks of Marrakech's historic medina.",
    uploadedAt: "2024-05-08T16:20:00Z"
  },
  
  // 360° Experiences
  {
    id: "media-016",
    title: "Hassan II Mosque Interior",
    type: "360",
    url: "/images/gallery/360/hassan-ii-mosque.mp4",
    thumbnailUrl: "/images/HassanIIMosque.jpg",
    category: ["architecture", "religious", "featured"],
    regionId: "casablanca-settat",
    description: "Immersive 360° view inside the spectacular Hassan II Mosque in Casablanca.",
    uploadedAt: "2024-02-28T11:00:00Z"
  },
  {
    id: "media-017",
    title: "Erg Chebbi Sand Dunes",
    type: "360",
    url: "/images/gallery/360/erg-chebbi.mp4",
    thumbnailUrl: "/images/gallery/thumbnails/erg-chebbi-360.jpg",
    category: ["landscape", "desert", "featured"],
    regionId: "draa-tafilalet",
    description: "360° panoramic experience atop the Erg Chebbi sand dunes in the Sahara Desert.",
    uploadedAt: "2024-01-25T17:30:00Z"
  },
  {
    id: "media-018",
    title: "Jemaa el-Fnaa Night Market",
    type: "360",
    url: "/images/gallery/360/jemaa-night.mp4",
    thumbnailUrl: "/images/gallery/thumbnails/jemaa-night-360.jpg",
    category: ["cultural", "experiences", "nightlife"],
    regionId: "marrakech-safi",
    description: "Immersive 360° experience of the lively night market at Jemaa el-Fnaa square.",
    uploadedAt: "2024-04-20T20:00:00Z"
  },
  {
    id: "media-demo-360",
    title: "Demo 360° Video Experience",
    type: "360",
    url: "https://www.w3schools.com/html/mov_bbb.mp4", // Demo 360 video URL
    thumbnailUrl: "/images/gallery/thumbnails/demo-360.jpg", // Placeholder thumbnail
    category: ["demo", "360", "featured"],
    regionId: "marrakech-safi",
    description: "Demo 360° video to showcase immersive experiences in the Morocco gallery.",
    uploadedAt: "2024-07-23T12:00:00Z"
  }
];