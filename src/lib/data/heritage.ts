import { HeritageItem } from '../types';

// Sample data for Moroccan heritage and traditions
export const heritageItems: HeritageItem[] = [
  {
    id: "fantasias",
    name: "Fantasia (Tbourida)",
    description: "A traditional exhibition of horsemanship in the Maghreb performed during cultural festivals. Fantasia is a synchronized cavalry charge that simulates a wartime attack, ending with riders firing their guns into the air.",
    type: "cultural-performance",
    regionIds: ["marrakech-safi", "fes-meknes", "draa-tafilalet"],
    images: ["/images/Fantasia.jpg"],
    videoUrl: "/videos/fantasia-performance.mp4",
    importance: "Fantasia represents the strong bond between Moroccans and horses, showcasing equestrian skills passed down through generations."
  },
  {
    id: "gnaoua",
    name: "Gnaoua Music and Rituals",
    description: "A rich repertoire of ancient African Islamic spiritual songs and rhythms combined with ritual poetry and dancing. The music is performed at 'lila' ceremonies where the mystical leaders (masters) guide the participants through various spiritual states.",
    type: "music-dance",
    regionIds: ["marrakech-safi", "souss-massa"],
    images: ["/images/Gnaoua.jpg"],
    videoUrl: "/videos/gnaoua-music.mp4",
    importance: "UNESCO recognized Gnaoua as Intangible Cultural Heritage in 2019. It represents a unique blend of African, Berber, and Arabic influences."
  },
  {
    id: "storytelling",
    name: "Hikayat (Storytelling)",
    description: "The ancient art of storytelling is a cornerstone of Moroccan oral tradition. Storytellers (Hakawatis) traditionally performed in public squares like Jemaa el-Fnaa, recounting folk tales, myths, religious stories, and historical events.",
    type: "oral-tradition",
    regionIds: ["marrakech-safi", "fes-meknes", "draa-tafilalet"],
    images: ["/images/heritage/storytelling.jpg"],
    importance: "Storytelling has been the primary way of preserving Moroccan history, values, and wisdom across generations before widespread literacy."
  },
  {
    id: "berber-dance",
    name: "Ahwach (Berber Dance)",
    description: "A collective dance performed by Amazigh (Berber) communities, particularly in the Atlas Mountains. Men and women form lines or circles, accompanied by drums and singing, moving rhythmically in synchronized patterns.",
    type: "music-dance",
    regionIds: ["draa-tafilalet", "souss-massa", "marrakech-safi"],
    images: ["/images/AhwachDance.jpg"],
    videoUrl: "/videos/ahwach-dance.mp4",
    importance: "Ahwach celebrates community solidarity and is performed during important life events and festivals."
  },
  {
    id: "henna-art",
    name: "Henna Art",
    description: "The application of henna paste in intricate patterns on the hands and feet. This temporary body art is traditionally applied during celebrations, particularly weddings, Eid, and other special occasions.",
    type: "craft",
    regionIds: ["marrakech-safi", "fes-meknes", "souss-massa"],
    images: ["/images/Henna.jpg"],
    importance: "Henna designs are believed to bring good luck and joy. Each region has distinctive patterns, with Fes known for its precision and Marrakech for its bold designs."
  },
  {
    id: "carpet-weaving",
    name: "Carpet Weaving",
    description: "A centuries-old tradition, Moroccan carpet weaving is typically performed by women who pass down unique patterns and techniques through generations. Each region has distinctive styles, colors, and symbols.",
    type: "craft",
    regionIds: ["fes-meknes", "marrakech-safi", "oriental"],
    images: ["/images/CarpetWeaving.jpg"],
    videoUrl: "/videos/carpet-weaving.mp4",
    importance: "Carpets tell stories through their symbols and patterns, reflecting tribal histories, fertility symbols, and protection against evil."
  },
  {
    id: "pottery",
    name: "Pottery and Ceramics",
    description: "Moroccan pottery combines Berber, Arab, and Andalusian influences. Each region has its characteristic style: Fes with its blue ceramics, Safi with its intricate pottery, and Tamegroute with its green-glazed pottery.",
    type: "craft",
    regionIds: ["fes-meknes", "marrakech-safi", "souss-massa"],
    images: ["/images/Pottery.jpg"],
    importance: "Pottery reflects Morocco's diverse cultural influences and has been a vital utilitarian and artistic tradition for centuries."
  },
  {
    id: "water-sellers",
    name: "Water Sellers (Guerrab)",
    description: "Traditionally dressed in colorful costumes with wide-brimmed hats adorned with brass cups, water sellers were once essential for distributing water in medinas. Today, they mainly serve as cultural icons and for tourist photographs.",
    type: "traditional-occupation",
    regionIds: ["marrakech-safi", "fes-meknes"],
    images: ["/images/heritage/water-sellers.jpg"],
    importance: "Water sellers represent Morocco's historical response to water scarcity and continue as living heritage in cities like Marrakech."
  },
  {
    id: "calligraphy",
    name: "Islamic Calligraphy",
    description: "The artistic practice of handwriting Arabic script, often featuring verses from the Quran, poetry, or proverbs. Moroccan calligraphy is characterized by the elegant Maghrebi script used across North Africa.",
    type: "art",
    regionIds: ["fes-meknes", "rabat-sale-kenitra", "marrakech-safi"],
    images: ["/images/heritage/calligraphy.jpg"],
    importance: "Calligraphy has been revered as the highest art form for centuries, adorning mosques, palaces, and homes with spiritual and aesthetic significance."
  },
  {
    id: "tea-ceremony",
    name: "Moroccan Tea Ceremony",
    description: "The ritualistic preparation and serving of Moroccan mint tea (atay) is a symbol of hospitality and friendship. The tea is traditionally prepared by the head of the household and served three times to guests, with each serving having different flavor characteristics.",
    type: "daily-tradition",
    regionIds: ["marrakech-safi", "fes-meknes", "rabat-sale-kenitra", "casablanca-settat"],
    images: ["/images/heritage/tea-ceremony.jpg"],
    videoUrl: "/videos/tea-ceremony.mp4",
    importance: "There's a saying: 'The first glass is as gentle as life, the second is as strong as love, the third is as bitter as death.' The ceremony embodies Moroccan hospitality."
  }
];