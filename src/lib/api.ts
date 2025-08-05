import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response types
export interface ApiRegion {
  id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  name_it: string;
  name_es: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  description_it?: string;
  description_es?: string;
  climate_en?: string;
  climate_ar?: string;
  climate_fr?: string;
  climate_it?: string;
  climate_es?: string;
  bestTimeToVisit_en?: string;
  bestTimeToVisit_ar?: string;
  bestTimeToVisit_fr?: string;
  bestTimeToVisit_it?: string;
  bestTimeToVisit_es?: string;
  keyFacts_en?: string;
  keyFacts_ar?: string;
  keyFacts_fr?: string;
  keyFacts_it?: string;
  keyFacts_es?: string;
  latitude?: number;
  longitude?: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  attractions?: ApiAttraction[];
  mediaItems?: any[];
  contentItems?: any[];
}

export interface ApiAttraction {
  id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  name_it: string;
  name_es: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  description_it?: string;
  description_es?: string;
  category_en?: string;
  category_ar?: string;
  category_fr?: string;
  category_it?: string;
  category_es?: string;
  regionId: string;
  latitude?: number;
  longitude?: number;
  imageUrls: string[];
  rating?: number;
  tags: string[];
  entryFee?: number;
  currency?: string;
  openingHours?: any;
  createdAt: string;
  updatedAt: string;
  region?: ApiRegion;
  reviews?: any[];
}

export interface ApiFestival {
  id: string;
  name: string;
  description?: string;
  type: string;
  location: string;
  regionId?: string;
  timeOfYear: string;
  duration: number;
  images: string[];
  videoUrl?: string;
  established?: string;
  historicalSignificance?: string;
  createdAt: string;
  updatedAt: string;
  region?: ApiRegion;
}

export interface ApiCuisine {
  id: string;
  name: string;
  description?: string;
  type: string;
  regionIds: string[];
  ingredients: string[];
  spiceLevel: string;
  images: string[];
  videoUrl?: string;
  popularVariants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiHeritage {
  id: string;
  name: string;
  description?: string;
  type: string;
  regionIds: string[];
  images: string[];
  videoUrl?: string;
  importance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiClothing {
  id: string;
  name: string;
  description?: string;
  gender: string;
  regionIds: string[];
  materials: string[];
  occasions: string[];
  images: string[];
  historicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTourPackage {
  id: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  title_it: string;
  title_es: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  description_it?: string;
  description_es?: string;
  difficulty_en?: string;
  difficulty_ar?: string;
  difficulty_fr?: string;
  difficulty_it?: string;
  difficulty_es?: string;
  duration: number;
  price: number;
  currency: string;
  imageUrls: string[];
  included: string[];
  excluded: string[];
  createdAt: string;
  updatedAt: string;
  regions?: any[];
  itinerary?: any;
  reviews?: any[];
}

// API functions
export const apiService = {
  // Regions
  async getRegions(): Promise<ApiRegion[]> {
    const response = await api.get('/regions');
    return response.data;
  },

  async getRegion(id: string): Promise<ApiRegion> {
    const response = await api.get(`/regions/${id}`);
    return response.data;
  },

  // Attractions
  async getAttractions(): Promise<ApiAttraction[]> {
    const response = await api.get('/attractions');
    return response.data;
  },

  async getAttraction(id: string): Promise<ApiAttraction> {
    const response = await api.get(`/attractions/${id}`);
    return response.data;
  },

  // Festivals
  async getFestivals(): Promise<ApiFestival[]> {
    const response = await api.get('/festivals');
    return response.data;
  },

  async getFestival(id: string): Promise<ApiFestival> {
    const response = await api.get(`/festivals/${id}`);
    return response.data;
  },

  // Cuisines
  async getCuisines(): Promise<ApiCuisine[]> {
    const response = await api.get('/cuisines');
    return response.data;
  },

  async getCuisine(id: string): Promise<ApiCuisine> {
    const response = await api.get(`/cuisines/${id}`);
    return response.data;
  },

  // Heritage
  async getHeritages(): Promise<ApiHeritage[]> {
    const response = await api.get('/heritages');
    return response.data;
  },

  async getHeritage(id: string): Promise<ApiHeritage> {
    const response = await api.get(`/heritages/${id}`);
    return response.data;
  },

  // Clothing
  async getClothing(): Promise<ApiClothing[]> {
    const response = await api.get('/clothing');
    return response.data;
  },

  async getClothingItem(id: string): Promise<ApiClothing> {
    const response = await api.get(`/clothing/${id}`);
    return response.data;
  },

  // Tour Packages
  async getTourPackages(): Promise<ApiTourPackage[]> {
    const response = await api.get('/tour-packages');
    return response.data;
  },

  async getTourPackage(id: string): Promise<ApiTourPackage> {
    const response = await api.get(`/tour-packages/${id}`);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};

// Utility functions to transform API data to frontend format
export const transformApiData = {
  // Transform API region to frontend region format
  region(apiRegion: ApiRegion) {
    // Extract capital from keyFacts if available
    const keyFacts = apiRegion.keyFacts_en || '';
    const capitalMatch = keyFacts.match(/Capital:\s*([^,]+)/);
    const capital = capitalMatch ? capitalMatch[1].trim() : apiRegion.name_en;
    
    return {
      id: apiRegion.id,
      name: apiRegion.name_en,
      nameAr: apiRegion.name_ar,
      nameFr: apiRegion.name_fr,
      capital: capital,
      description: apiRegion.description_en || '',
      population: '', // Not in API, would need to be added
      attractions: apiRegion.attractions?.map(a => a.id) || [],
      bestTimeToVisit: apiRegion.bestTimeToVisit_en || '',
      climate: apiRegion.climate_en || '',
      coordinates: {
        lat: apiRegion.latitude || 31.7917, // Default to Morocco center if no coordinates
        lng: apiRegion.longitude || -7.0926,
      },
      imageUrl: Array.isArray(apiRegion.imageUrls) ? apiRegion.imageUrls[0] || '' : '',
    };
  },

  // Transform API attraction to frontend attraction format
  attraction(apiAttraction: ApiAttraction) {
    return {
      id: apiAttraction.id,
      name: apiAttraction.name_en,
      description: apiAttraction.description_en || '',
      regionId: apiAttraction.regionId,
      type: (apiAttraction.category_en as any) || 'cultural',
      images: Array.isArray(apiAttraction.imageUrls) ? apiAttraction.imageUrls : [],
      location: {
        lat: apiAttraction.latitude || 31.7917, // Default to Morocco center if no coordinates
        lng: apiAttraction.longitude || -7.0926,
      },
    };
  },

  // Transform API festival to frontend festival format
  festival(apiFestival: ApiFestival) {
    return {
      id: apiFestival.id,
      name: apiFestival.name,
      description: apiFestival.description || '',
      type: apiFestival.type,
      location: apiFestival.location,
      regionId: apiFestival.regionId || 'all',
      timeOfYear: apiFestival.timeOfYear,
      duration: apiFestival.duration,
      images: Array.isArray(apiFestival.images) ? apiFestival.images : [],
      videoUrl: apiFestival.videoUrl,
      established: apiFestival.established,
      historicalSignificance: apiFestival.historicalSignificance,
    };
  },

  // Transform API cuisine to frontend cuisine format
  cuisine(apiCuisine: ApiCuisine) {
    return {
      id: apiCuisine.id,
      name: apiCuisine.name,
      description: apiCuisine.description || '',
      type: apiCuisine.type,
      regionIds: Array.isArray(apiCuisine.regionIds) ? apiCuisine.regionIds : [],
      ingredients: Array.isArray(apiCuisine.ingredients) ? apiCuisine.ingredients : [],
      spiceLevel: apiCuisine.spiceLevel as any,
      images: Array.isArray(apiCuisine.images) ? apiCuisine.images : [],
      videoUrl: apiCuisine.videoUrl,
      popularVariants: Array.isArray(apiCuisine.popularVariants) ? apiCuisine.popularVariants : [],
    };
  },

  // Transform API heritage to frontend heritage format
  heritage(apiHeritage: ApiHeritage) {
    return {
      id: apiHeritage.id,
      name: apiHeritage.name,
      description: apiHeritage.description || '',
      type: apiHeritage.type,
      regionIds: Array.isArray(apiHeritage.regionIds) ? apiHeritage.regionIds : [],
      images: Array.isArray(apiHeritage.images) ? apiHeritage.images : [],
      videoUrl: apiHeritage.videoUrl,
      importance: apiHeritage.importance || '',
    };
  },

  // Transform API clothing to frontend clothing format
  clothing(apiClothing: ApiClothing) {
    return {
      id: apiClothing.id,
      name: apiClothing.name,
      description: apiClothing.description || '',
      gender: apiClothing.gender as any,
      regionIds: Array.isArray(apiClothing.regionIds) ? apiClothing.regionIds : [],
      materials: Array.isArray(apiClothing.materials) ? apiClothing.materials : [],
      occasions: Array.isArray(apiClothing.occasions) ? apiClothing.occasions : [],
      images: Array.isArray(apiClothing.images) ? apiClothing.images : [],
      historicalNotes: apiClothing.historicalNotes,
    };
  },

  // Transform API tour package to frontend tour package format
  tourPackage(apiTourPackage: ApiTourPackage) {
    return {
      id: apiTourPackage.id,
      title: apiTourPackage.title_en,
      description: apiTourPackage.description_en || '',
      regionId: apiTourPackage.regions?.[0]?.regionId || '',
      duration: apiTourPackage.duration,
      price: apiTourPackage.price,
      currency: apiTourPackage.currency,
      inclusions: Array.isArray(apiTourPackage.included) ? apiTourPackage.included : [],
      exclusions: Array.isArray(apiTourPackage.excluded) ? apiTourPackage.excluded : [],
      itinerary: apiTourPackage.itinerary || [],
      images: Array.isArray(apiTourPackage.imageUrls) ? apiTourPackage.imageUrls : [],
      maxParticipants: 12, // Default value since not in API
      featured: false, // Default value since not in API
      rating: 4.5, // Default value since not in API
      reviewCount: 0, // Default value since not in API
      type: apiTourPackage.difficulty_en || 'cultural',
    };
  },
};

export default apiService; 