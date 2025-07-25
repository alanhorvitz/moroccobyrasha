// Utility to generate placeholder images for cities
export const getPlaceholderImage = (cityName: string, width = 1200, height = 800) => {
  // Using Unsplash source with city-related keywords
  getCityKeywords(cityName.toLowerCase()) // Get keywords for potential future use
  return `https://images.unsplash.com/photo-1539650116574-75c0c6d4d6d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

// Get specific keywords for different cities to get better placeholder images
const getCityKeywords = (cityName: string): string => {
  const cityKeywords: Record<string, string> = {
    casablanca: 'morocco-mosque-architecture',
    marrakech: 'morocco-marrakech-market',
    fes: 'morocco-fes-medina',
    rabat: 'morocco-rabat-architecture',
    tangier: 'morocco-tangier-coast',
    agadir: 'morocco-beach-coast',
    meknes: 'morocco-imperial-city',
    ouarzazate: 'morocco-desert-kasbah',
    chefchaouen: 'morocco-blue-city',
    essaouira: 'morocco-coastal-city'
  }
  
  return cityKeywords[cityName] || 'morocco-city'
}

// Specific city images from Unsplash
export const cityImages: Record<string, string> = {
  casablanca: 'https://images.unsplash.com/photo-1539650116574-75c0c6d4d6d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  marrakech: 'https://images.unsplash.com/photo-1548630826-2ec01a41f48f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  fes: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  rabat: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  tangier: 'https://images.unsplash.com/photo-1570939274851-b6e3b7d5d7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  agadir: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  meknes: 'https://images.unsplash.com/photo-1570939274851-b6e3b7d5d7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ouarzazate: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  chefchaouen: 'https://images.unsplash.com/photo-1570939274851-b6e3b7d5d7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  essaouira: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
}

export const getCityImage = (cityId: string): string => {
  return cityImages[cityId] || getPlaceholderImage(cityId)
}