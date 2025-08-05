import { ClothingItem } from '../types';

// Sample data for Moroccan traditional clothing
export const clothingItems: ClothingItem[] = [
  {
    id: "djellaba",
    name: "Djellaba",
    description: "A loose-fitting unisex outer robe with full sleeves and a hood called a qob. Traditionally woven from wool or cotton, modern djellabas may be made from a variety of fabrics. Men's djellabas often use more muted colors while women's versions feature vibrant colors and ornate embroidery.",
    gender: "unisex",
    regionIds: ["all"],
    materials: ["wool", "cotton", "synthetic", "silk"],
    occasions: ["daily-wear", "special-occasions", "religious-events"],
    images: ["/images/clothing/djellaba.jpg", "/images/clothing/djellaba-women.jpg", "/images/clothing/djellaba-men.jpg"],
    historicalNotes: "The djellaba has been a traditional garment in Morocco for centuries, with its distinctive hood designed to provide protection from the sun, sand, and cold."
  },
  {
    id: "caftan",
    name: "Caftan",
    description: "An elegant, flowing overdress or robe with long, wide sleeves. Moroccan caftans are known for their luxurious fabrics, intricate embroidery, and detailed handwork. They are often worn with a matching belt called a mdamma.",
    gender: "female",
    regionIds: ["fes-meknes", "marrakech-safi", "rabat-sale-kenitra"],
    materials: ["silk", "satin", "brocade", "velvet"],
    occasions: ["weddings", "formal-events", "celebrations"],
    images: ["/images/clothing/caftan.jpg", "/images/clothing/caftan-modern.jpg", "/images/clothing/caftan-traditional.jpg"],
    historicalNotes: "The Moroccan caftan evolved from Ottoman and Andalusian influences. While historically reserved for royalty and nobility, today caftans are popular formal wear for women across all social classes."
  },
  {
    id: "selham",
    name: "Selham",
    description: "A traditional Moroccan cape or cloak made of fine wool, often worn over a djellaba during colder weather or for ceremonial occasions. The selham typically has no sleeves and features a distinctive tassel on the hood.",
    gender: "male",
    regionIds: ["fes-meknes", "marrakech-safi", "tangier-tetouan-al-hoceima"],
    materials: ["wool", "cashmere"],
    occasions: ["ceremonies", "cold-weather", "official-events"],
    images: ["/images/clothing/selham.jpg"],
    historicalNotes: "The selham has been traditionally associated with status and dignity, often worn by officials, scholars, and community leaders."
  },
  {
    id: "takchita",
    name: "Takchita",
    description: "A formal women's ensemble consisting of two pieces: an inner caftan and a transparent overdress called a dfina. The takchita is elaborately decorated with embroidery, beading, and sequins, and is cinched at the waist with a decorative belt.",
    gender: "female",
    regionIds: ["fes-meknes", "rabat-sale-kenitra", "marrakech-safi"],
    materials: ["silk", "brocade", "velvet", "chiffon"],
    occasions: ["weddings", "engagement-parties", "special-celebrations"],
    images: ["/images/clothing/takchita.jpg"],
    historicalNotes: "The takchita is the preferred formal attire for Moroccan brides during their wedding celebrations, particularly during the henna ceremony."
  },
  {
    id: "fez",
    name: "Fez (Tarboosh)",
    description: "A cylindrical, brimless hat made of felt, usually red in color with a tassel attached to the top. The fez is named after the Moroccan city of Fez, which was a center for hat-making.",
    gender: "male",
    regionIds: ["fes-meknes", "marrakech-safi", "rabat-sale-kenitra"],
    materials: ["felt"],
    occasions: ["traditional-ceremonies", "cultural-events"],
    images: ["/images/clothing/fez-hat.jpg"],
    historicalNotes: "While its use has declined in modern times, the fez was once the official headwear throughout the Ottoman Empire and remains a symbol of Moroccan heritage."
  },
  {
    id: "berber-dress",
    name: "Amazigh (Berber) Dress",
    description: "Traditional Berber women's clothing features vibrant colors, geometric patterns, and distinctive silver jewelry. The styles vary by region but typically include handwoven textiles with symbolic patterns and motifs.",
    gender: "female",
    regionIds: ["souss-massa", "draa-tafilalet", "beni-mellal-khenifra"],
    materials: ["wool", "cotton", "silver-accessories"],
    occasions: ["festivals", "daily-wear", "ceremonies"],
    images: ["/images/clothing/berber-dress.jpg", "/images/clothing/amazigh-jewelry.jpg"],
    historicalNotes: "Berber dress styles and designs often indicate tribal affiliation, marital status, and wealth. The distinctive silver jewelry serves both decorative and protective (spiritual) functions."
  },
  {
    id: "sahrawi-clothing",
    name: "Sahrawi Clothing",
    description: "Traditional clothing of Southern Morocco's Sahrawi people, including the daraa (men's robe) and melhfa (women's wraparound garment). These flowing garments are designed for the desert climate and feature distinctive blue dyes.",
    gender: "unisex",
    regionIds: ["laayoune-sakia-el-hamra", "dakhla-oued-ed-dahab", "guelmim-oued-noun"],
    materials: ["cotton", "lightweight-fabrics"],
    occasions: ["daily-wear", "ceremonies"],
    images: ["/images/clothing/sahrawi-clothing.jpg", "/images/clothing/melhfa.jpg"],
    historicalNotes: "The indigo dye used in traditional Sahrawi clothing sometimes transfers to the skin, leading to the term 'Blue Men of the Desert' for Tuareg and Sahrawi people."
  },
  {
    id: "jabador",
    name: "Jabador",
    description: "A two-piece outfit for men consisting of a long-sleeved tunic and matching pants. The tunic typically features a high collar with buttons and embroidery details around the neckline and sleeves.",
    gender: "male",
    regionIds: ["casablanca-settat", "rabat-sale-kenitra", "tangier-tetouan-al-hoceima"],
    materials: ["cotton", "linen", "synthetic-fabrics"],
    occasions: ["festivals", "religious-celebrations", "semi-formal-events"],
    images: ["/images/clothing/jabador.jpg"],
    historicalNotes: "The jabador is increasingly popular for Friday prayers and religious celebrations like Eid, offering a balance between traditional styling and comfort."
  },
  {
    id: "handira",
    name: "Handira (Wedding Blanket)",
    description: "Though primarily a textile rather than clothing, the handira is a significant ceremonial garment worn by Berber brides. These hand-woven wool blankets are decorated with sequins and metal discs that jingle with movement, believed to ward off evil spirits.",
    gender: "female",
    regionIds: ["middle-atlas", "beni-mellal-khenifra"],
    materials: ["wool", "cotton", "sequins", "metal"],
    occasions: ["weddings"],
    images: ["/images/clothing/handira.jpg"],
    historicalNotes: "Traditionally, handiras are woven by female relatives as a gift for the bride, and the process can take months. After the wedding, the handira becomes a treasured household item."
  },
  {
    id: "sheshia",
    name: "Sheshia",
    description: "A traditional knitted cap worn by Moroccan men, often under a turban or as everyday headwear. The sheshia comes in various colors but is commonly white or red.",
    gender: "male",
    regionIds: ["marrakech-safi", "fes-meknes", "tangier-tetouan-al-hoceima"],
    materials: ["wool", "cotton"],
    occasions: ["daily-wear", "religious-events"],
    images: ["/images/clothing/sheshia.jpg"],
    historicalNotes: "The sheshia has been a common head covering for men across North Africa for centuries, providing protection from the sun while adhering to cultural modesty traditions."
  }
];