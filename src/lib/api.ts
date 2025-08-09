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
  title_ar: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  title_it: string;
  description_ar?: string;
  description_en?: string;
  description_es?: string;
  description_fr?: string;
  description_it?: string;
  difficulty_ar?: string;
  difficulty_en?: string;
  difficulty_es?: string;
  difficulty_fr?: string;
  difficulty_it?: string;
  duration: number;
  price: number;
  currency: string;
  imageUrls: string[];
  included: string[];
  excluded: string[];
  regionId: string;
  maxParticipants?: number;
  featured: boolean;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  regions?: any[];
  itinerary?: {
    id: string;
    tourPackageId: string;
    days: Array<{
      id: string;
      itineraryId: string;
      dayNumber: number;
      activities: string[];
      title_en?: string | null;
      title_ar?: string | null;
      title_fr?: string | null;
      title_it?: string | null;
      title_es?: string | null;
      description_en?: string | null;
      description_ar?: string | null;
      description_fr?: string | null;
      description_it?: string | null;
      description_es?: string | null;
      accommodation?: any | null;
      meals?: any[];
    }>;
  } | null;
}

export interface ApiTravelGuide {
  id: string;
  title_ar: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  title_it: string;
  description_ar?: string;
  description_en?: string;
  description_es?: string;
  description_fr?: string;
  description_it?: string;
  regionIds: string[];
  content_ar?: string;
  content_en?: string;
  content_es?: string;
  content_fr?: string;
  content_it?: string;
  author: string;
  publishedDate: string;
  type: string;
  tags: string[];
  imageUrls: string[];
  featuredImageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// API functions
export const apiService = {
  // Regions
  async getRegions(): Promise<ApiRegion[]> {
    try {
      console.log('Making API call to /regions...');
      const response = await api.get('/regions');
      console.log('API response received:', response.status, response.data);
      return response.data;
    } catch (error: any) {
      console.error('API call failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        throw new Error(`API Error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Check if the backend is running.');
      } else {
        console.error('Request setup error:', error.message);
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  async getRegion(id: string): Promise<ApiRegion> {
    const response = await api.get(`/regions/${id}`);
    return response.data;
  },

  async createRegion(data: Partial<ApiRegion>): Promise<ApiRegion> {
    const response = await api.post('/regions', data);
    return response.data;
  },

  async updateRegion(id: string, data: Partial<ApiRegion>): Promise<ApiRegion> {
    const response = await api.put(`/regions/${id}`, data);
    return response.data;
  },

  async deleteRegion(id: string): Promise<void> {
    await api.delete(`/regions/${id}`);
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

  async createAttraction(data: Partial<ApiAttraction>): Promise<ApiAttraction> {
    console.log('Creating attraction with data:', data);
    const response = await api.post('/attractions', data);
    console.log('Create attraction response:', response.data);
    return response.data;
  },

  async updateAttraction(id: string, data: Partial<ApiAttraction>): Promise<ApiAttraction> {
    const response = await api.put(`/attractions/${id}`, data);
    return response.data;
  },

  async deleteAttraction(id: string): Promise<void> {
    await api.delete(`/attractions/${id}`);
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

  async createFestival(data: Partial<ApiFestival>): Promise<ApiFestival> {
    console.log('Creating festival with data:', data);
    try {
      const response = await api.post('/festivals', data);
      console.log('Create festival response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Festival creation error:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateFestival(id: string, data: Partial<ApiFestival>): Promise<ApiFestival> {
    const response = await api.put(`/festivals/${id}`, data);
    return response.data;
  },

  async deleteFestival(id: string): Promise<void> {
    await api.delete(`/festivals/${id}`);
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

  async createCuisine(data: Partial<ApiCuisine>): Promise<ApiCuisine> {
    console.log('Creating cuisine with data:', data);
    try {
      const response = await api.post('/cuisines', data);
      console.log('Create cuisine response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Cuisine creation error:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateCuisine(id: string, data: Partial<ApiCuisine>): Promise<ApiCuisine> {
    const response = await api.put(`/cuisines/${id}`, data);
    return response.data;
  },

  async deleteCuisine(id: string): Promise<void> {
    await api.delete(`/cuisines/${id}`);
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

  async createHeritage(data: Partial<ApiHeritage>): Promise<ApiHeritage> {
    console.log('Creating heritage with data:', data);
    try {
      const response = await api.post('/heritages', data);
      console.log('Create heritage response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Heritage creation error:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateHeritage(id: string, data: Partial<ApiHeritage>): Promise<ApiHeritage> {
    const response = await api.put(`/heritages/${id}`, data);
    return response.data;
  },

  async deleteHeritage(id: string): Promise<void> {
    await api.delete(`/heritages/${id}`);
  },

  // Clothing
  async getClothingList(): Promise<ApiClothing[]> {
    const response = await api.get('/clothing');
    return response.data;
  },

  async getClothingById(id: string): Promise<ApiClothing> {
    const response = await api.get(`/clothing/${id}`);
    return response.data;
  },

  async createClothing(data: Partial<ApiClothing>): Promise<ApiClothing> {
    console.log('Creating clothing with data:', data);
    try {
      const response = await api.post('/clothing', data);
      console.log('Create clothing response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Clothing creation error:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateClothing(id: string, data: Partial<ApiClothing>): Promise<ApiClothing> {
    const response = await api.put(`/clothing/${id}`, data);
    return response.data;
  },

  async deleteClothing(id: string): Promise<void> {
    await api.delete(`/clothing/${id}`);
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

  async createTourPackage(data: Partial<ApiTourPackage>): Promise<ApiTourPackage> {
    const response = await api.post('/tour-packages', data);
    return response.data;
  },

  async updateTourPackage(id: string, data: Partial<ApiTourPackage>): Promise<ApiTourPackage> {
    const response = await api.put(`/tour-packages/${id}`, data);
    return response.data;
  },

  async deleteTourPackage(id: string): Promise<void> {
    await api.delete(`/tour-packages/${id}`);
  },

  // Travel Guides
  async getTravelGuides(): Promise<ApiTravelGuide[]> {
    const response = await api.get('/travel-guides');
    return response.data;
  },

  async getTravelGuide(id: string): Promise<ApiTravelGuide> {
    const response = await api.get(`/travel-guides/${id}`);
    return response.data;
  },

  async createTravelGuide(data: Partial<ApiTravelGuide>): Promise<ApiTravelGuide> {
    const response = await api.post('/travel-guides', data);
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
  region(apiRegion: ApiRegion, language: string = 'en') {
    const getLocalizedField = (baseField: string) => {
      const field = `${baseField}_${language}` as keyof ApiRegion;
      return (apiRegion[field] as string) || (apiRegion[`${baseField}_en` as keyof ApiRegion] as string) || '';
    };
    const keyFacts = getLocalizedField('keyFacts');
    const capitalMatch = keyFacts.match(/Capital:\s*([^,]+)/);
    const capital = capitalMatch ? capitalMatch[1].trim() : getLocalizedField('name');
    return {
      id: apiRegion.id,
      name: getLocalizedField('name'),
      nameAr: apiRegion.name_ar,
      nameFr: apiRegion.name_fr,
      capital: capital,
      description: getLocalizedField('description'),
      population: '',
      attractions: apiRegion.attractions?.map(a => a.id) || [],
      bestTimeToVisit: getLocalizedField('bestTimeToVisit'),
      climate: getLocalizedField('climate'),
      coordinates: {
        lat: apiRegion.latitude || 31.7917,
        lng: apiRegion.longitude || -7.0926,
      },
      imageUrl: Array.isArray(apiRegion.imageUrls) ? apiRegion.imageUrls[0] || '' : '',
    };
  },

  // Transform API attraction to frontend attraction format
  attraction(apiAttraction: ApiAttraction, language: string = 'en') {
    const getLocalizedField = (baseField: string) => {
      const field = `${baseField}_${language}` as keyof ApiAttraction;
      return (apiAttraction[field] as string) || (apiAttraction[`${baseField}_en` as keyof ApiAttraction] as string) || '';
    };

    return {
      id: apiAttraction.id,
      name: getLocalizedField('name'),
      description: getLocalizedField('description'),
      regionId: apiAttraction.regionId,
      type: (getLocalizedField('category') as any) || 'cultural',
      images: Array.isArray(apiAttraction.imageUrls) ? apiAttraction.imageUrls : [],
      location: {
        lat: apiAttraction.latitude || 31.7917,
        lng: apiAttraction.longitude || -7.0926,
      },
    };
  },

  // Transform API festival to frontend festival format
  festival(apiFestival: ApiFestival, language: string = 'en') {
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
  cuisine(apiCuisine: ApiCuisine, language: string = 'en') {
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
  heritage(apiHeritage: ApiHeritage, language: string = 'en') {
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
  clothing(apiClothing: ApiClothing, language: string = 'en') {
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
  tourPackage(apiTourPackage: ApiTourPackage, language: string = 'en') {
    const getLocalizedField = (baseField: string) => {
      const field = `${baseField}_${language}` as keyof ApiTourPackage;
      return (apiTourPackage[field] as string) || (apiTourPackage[`${baseField}_en` as keyof ApiTourPackage] as string) || '';
    };

    return {
      id: apiTourPackage.id,
      title: getLocalizedField('title'),
      description: getLocalizedField('description'),
      regionId: apiTourPackage.regionId,
      duration: apiTourPackage.duration,
      price: apiTourPackage.price,
      inclusions: Array.isArray(apiTourPackage.included) ? apiTourPackage.included : [],
      exclusions: Array.isArray(apiTourPackage.excluded) ? apiTourPackage.excluded : [],
      itinerary: Array.isArray(apiTourPackage.itinerary?.days)
        ? apiTourPackage.itinerary!.days.map((d) => ({
            day: d.dayNumber,
            title: (d as any)[`title_${language}`] || (d as any).title_en || '',
            description: (d as any)[`description_${language}`] || (d as any).description_en || '',
            activities: Array.isArray(d.activities) ? (d.activities as any) : [],
          }))
        : [],
      images: Array.isArray(apiTourPackage.imageUrls) ? apiTourPackage.imageUrls : [],
      maxParticipants: apiTourPackage.maxParticipants || 0,
      featured: apiTourPackage.featured,
      rating: apiTourPackage.rating || 0,
      reviewCount: apiTourPackage.reviewCount || 0,
    };
  },

  // Transform API travel guide to frontend travel guide format
  travelGuide(apiGuide: ApiTravelGuide, language: string = 'en') {
    const getLocalizedField = (baseField: string) => {
      const field = `${baseField}_${language}` as keyof ApiTravelGuide;
      return (apiGuide[field] as string) || (apiGuide[`${baseField}_en` as keyof ApiTravelGuide] as string) || '';
    };

    return {
      id: apiGuide.id,
      title: getLocalizedField('title'),
      description: getLocalizedField('description'),
      regionIds: Array.isArray(apiGuide.regionIds) ? apiGuide.regionIds : [],
      content: getLocalizedField('content'),
      author: apiGuide.author,
      publishedDate: apiGuide.publishedDate,
      type: apiGuide.type as any,
      tags: Array.isArray(apiGuide.tags) ? apiGuide.tags : [],
      images: Array.isArray(apiGuide.imageUrls) ? apiGuide.imageUrls : [],
      featuredImage: apiGuide.featuredImageUrl || '',
      videoUrl: apiGuide.videoUrl,
    };
  },
};

export default apiService; 