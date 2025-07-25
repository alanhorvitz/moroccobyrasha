import { CuisineItem } from '../types';

// Sample data for Moroccan cuisine
export const cuisineItems: CuisineItem[] = [
  {
    id: "tagine",
    name: "Tagine",
    description: "A slow-cooked stew named after the distinctive conical earthenware pot in which it is cooked. Tagines typically combine meat (lamb, chicken, beef) with fruits, vegetables, and aromatic spices to create a tender, flavorful dish.",
    type: "main-dish",
    regionIds: ["all"],
    ingredients: ["meat", "vegetables", "fruits", "spices", "olive-oil"],
    spiceLevel: "medium",
    images: ["/images/cuisine/tagine.jpg", "/images/cuisine/tagine-cooking.jpg"],
    videoUrl: "/videos/tagine-preparation.mp4",
    popularVariants: ["Lamb with prunes and almonds", "Chicken with preserved lemon and olives", "Kefta (meatball) with eggs", "Fish tagine with vegetables"]
  },
  {
    id: "couscous",
    name: "Couscous",
    description: "Morocco's national dish traditionally served on Fridays. Couscous consists of tiny steamed semolina granules topped with a hearty stew of meat and vegetables. The dish is typically served communally from a large plate.",
    type: "main-dish",
    regionIds: ["all"],
    ingredients: ["semolina", "meat", "vegetables", "chickpeas", "spices"],
    spiceLevel: "mild",
    images: ["/images/cuisine/couscous.jpg", "/images/cuisine/couscous-preparation.jpg"],
    videoUrl: "/videos/couscous-preparation.mp4",
    popularVariants: ["Seven-vegetable couscous", "Couscous tfaya with caramelized onions and raisins", "Seafood couscous", "Dessert couscous with cinnamon and sugar"]
  },
  {
    id: "pastilla",
    name: "Pastilla (Bastilla)",
    description: "A savory-sweet pie consisting of thin layers of crispy warqa dough filled traditionally with pigeon (now commonly chicken), almonds, eggs, and spices, then dusted with powdered sugar and cinnamon.",
    type: "appetizer-main",
    regionIds: ["fes-meknes", "tangier-tetouan-al-hoceima", "rabat-sale-kenitra"],
    ingredients: ["warqa-dough", "meat", "almonds", "eggs", "cinnamon", "sugar", "saffron"],
    spiceLevel: "mild",
    images: ["/images/cuisine/pastilla.jpg"],
    popularVariants: ["Chicken pastilla", "Seafood pastilla", "Vegetable pastilla", "Individual pastilla"]
  },
  {
    id: "harira",
    name: "Harira",
    description: "A hearty soup traditionally served during Ramadan to break the fast. Harira contains a rich blend of tomatoes, lentils, chickpeas, and herbs, often with small pieces of meat, finished with lemon juice and sometimes thickened with flour or eggs.",
    type: "soup",
    regionIds: ["all"],
    ingredients: ["tomatoes", "lentils", "chickpeas", "herbs", "meat", "flour", "eggs", "lemon"],
    spiceLevel: "medium",
    images: ["/images/cuisine/harira.jpg"],
    videoUrl: "/videos/harira-cooking.mp4",
    popularVariants: ["Vegetarian harira", "Beef harira", "Lamb harira", "Harira with vermicelli"]
  },
  {
    id: "rfissa",
    name: "Rfissa",
    description: "A festive dish often served after childbirth or special celebrations. Rfissa consists of shredded msemen (Moroccan flatbread) or day-old bread topped with chicken, lentils, and a rich broth fragrant with fenugreek, saffron, and ras el hanout.",
    type: "main-dish",
    regionIds: ["casablanca-settat", "rabat-sale-kenitra", "marrakech-safi"],
    ingredients: ["msemen", "chicken", "lentils", "fenugreek", "saffron", "ras-el-hanout"],
    spiceLevel: "medium",
    images: ["/images/cuisine/rfissa.jpg"],
    popularVariants: ["Traditional chicken rfissa", "Lamb rfissa", "Vegetarian rfissa"]
  },
  {
    id: "moroccan-bread",
    name: "Moroccan Bread (Khobz)",
    description: "Moroccan bread is a staple at every meal, with a round, flattish shape and a slightly coarse texture perfect for scooping up tagines and dips. It's traditionally baked in community ovens and has a distinctive chewy interior with a crisp crust.",
    type: "bread",
    regionIds: ["all"],
    ingredients: ["wheat-flour", "semolina", "yeast", "salt", "water"],
    spiceLevel: "none",
    images: ["/images/cuisine/moroccan-bread.jpg", "/images/cuisine/bread-baking.jpg"],
    videoUrl: "/videos/bread-making.mp4",
    popularVariants: ["White flour khobz", "Semolina khobz", "Barley khobz", "Herb-infused khobz"]
  },
  {
    id: "mint-tea",
    name: "Moroccan Mint Tea",
    description: "More than just a beverage, Moroccan mint tea is a symbol of hospitality and friendship. This sweet green tea infused with fresh mint leaves is traditionally prepared with a dramatic pouring technique from height to create a frothy top.",
    type: "beverage",
    regionIds: ["all"],
    ingredients: ["green-tea", "mint-leaves", "sugar"],
    spiceLevel: "none",
    images: ["/images/cuisine/mint-tea.jpg", "/images/cuisine/tea-pouring.jpg"],
    videoUrl: "/videos/tea-preparation.mp4",
    popularVariants: ["Classic mint tea", "Mint tea with wormwood", "Mint tea with sage", "Lightly sweetened tea"]
  },
  {
    id: "zaalouk",
    name: "Zaalouk",
    description: "A cooked salad made primarily from eggplants and tomatoes, seasoned with garlic, olive oil, and spices. Zaalouk is typically served as a cold dip with bread at the beginning of a meal.",
    type: "appetizer",
    regionIds: ["marrakech-safi", "souss-massa", "draa-tafilalet"],
    ingredients: ["eggplant", "tomatoes", "garlic", "olive-oil", "paprika", "cumin"],
    spiceLevel: "mild",
    images: ["/images/cuisine/zaalouk.jpg"],
    popularVariants: ["Classic zaalouk", "Spicy zaalouk", "Zaalouk with roasted peppers"]
  },
  {
    id: "tangia",
    name: "Tangia",
    description: "A Marrakchi specialty, tangia is a meat dish slow-cooked in an urn-shaped clay pot. Traditionally prepared by bachelor workers, the meat (usually lamb or beef) is combined with preserved lemon, garlic, cumin, and olive oil then cooked overnight in the ashes of a hammam (public bath) fire.",
    type: "main-dish",
    regionIds: ["marrakech-safi"],
    ingredients: ["meat", "preserved-lemon", "garlic", "cumin", "olive-oil", "saffron"],
    spiceLevel: "medium",
    images: ["/images/cuisine/tangia.jpg", "/images/cuisine/tangia-pot.jpg"],
    popularVariants: ["Lamb tangia", "Beef tangia", "Chicken tangia"]
  },
  {
    id: "chebakia",
    name: "Chebakia",
    description: "A flower-shaped sesame cookie folded to resemble a rose, deep-fried, and then soaked in honey and rosewater syrup. Chebakia is especially popular during Ramadan and is often served with harira soup.",
    type: "dessert",
    regionIds: ["fes-meknes", "marrakech-safi", "rabat-sale-kenitra"],
    ingredients: ["flour", "sesame-seeds", "anise", "cinnamon", "honey", "rosewater"],
    spiceLevel: "none",
    images: ["/images/cuisine/chebakia.jpg"],
    videoUrl: "/videos/chebakia-making.mp4",
    popularVariants: ["Traditional chebakia", "Almond-flavored chebakia", "Mini chebakia"]
  },
  {
    id: "chermoula",
    name: "Chermoula",
    description: "A versatile marinade and sauce used extensively in Moroccan cooking, particularly with fish and seafood. Chermoula is made from a blend of herbs (primarily cilantro and parsley), garlic, olive oil, lemon juice, and spices like cumin and paprika.",
    type: "sauce",
    regionIds: ["souss-massa", "tangier-tetouan-al-hoceima", "casablanca-settat"],
    ingredients: ["cilantro", "parsley", "garlic", "olive-oil", "lemon", "cumin", "paprika"],
    spiceLevel: "medium",
    images: ["/images/cuisine/chermoula.jpg"],
    popularVariants: ["Classic chermoula", "Spicy chermoula with harissa", "Red chermoula with tomato"]
  }
];