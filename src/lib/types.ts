// Data types for Morocco Tourism Platform

// Region data model
export interface Region {
  id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  capital: string;
  description: string;
  population: string;
  attractions: string[];
  bestTimeToVisit: string;
  climate: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
}

// Attraction data model
export interface Attraction {
  id: string;
  name: string;
  description: string;
  regionId: string;
  type: 'historical' | 'natural' | 'cultural' | 'entertainment';
  images: string[];
  location: { lat: number; lng: number };
}

// Tour package data model
export interface TourPackage {
  id: string;
  title: string;
  description: string;
  regionId: string;
  duration: number; // in days
  price: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
  images: string[];
  maxParticipants: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

// Media item data model
export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | '360';
  url: string;
  thumbnailUrl: string;
  category: string[];
  regionId?: string;
  description?: string;
  uploadedAt: string;
}

// Content item data model
export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'podcast';
  content?: string;
  imageUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  category: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
}

// Guide profile data model
export interface Guide {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  languages: string[];
  specialties: string[];
  regions: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  contactEmail: string;
  contactPhone: string;
  available: boolean;
}

// Transportation service data model
export interface TransportService {
  id: string;
  name: string;
  type: 'car' | '4x4' | 'bus' | 'airport';
  description: string;
  pricePerDay: number;
  features: string[];
  imageUrl: string;
  capacity: number;
  available: boolean;
}

// Review data model
export interface Review {
  id: string;
  targetId: string;
  targetType: 'guide' | 'tour' | 'attraction';
  rating: number;
  comment: string;
  userName: string;
  userImage?: string;
  date: string;
}

// User preferences data model
export interface UserPreferences {
  language: 'en' | 'fr' | 'ar';
  currency: 'USD' | 'EUR' | 'MAD';
  savedItems: string[];
  viewedItems: string[];
}

// LocalStorage schema
export interface LocalStorageSchema {
  // Application metadata
  appVersion: string;
  lastUpdated: string;
  
  // Core data
  regions: Region[];
  attractions: Attraction[];
  tourPackages: TourPackage[];
  
  // Media content
  mediaItems: MediaItem[];
  contentItems: ContentItem[];
  
  // Services
  guides: Guide[];
  transportServices: TransportService[];
  
  // User data
  userPreferences: UserPreferences;
  savedItems: string[];
  reviews: Review[];
}

// Heritage and traditions data model
export interface HeritageItem {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., 'cultural-performance', 'craft', 'music-dance', 'oral-tradition', etc.
  regionIds: string[]; // Which regions this heritage item is prevalent in
  images: string[];
  videoUrl?: string;
  importance: string; // Cultural significance
}

// Traditional clothing data model
export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'unisex';
  regionIds: string[]; // Which regions this clothing is typical for
  materials: string[];
  occasions: string[]; // When this clothing is typically worn
  images: string[];
  historicalNotes?: string;
}

// Moroccan cuisine data model
export interface CuisineItem {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., 'main-dish', 'appetizer', 'dessert', 'beverage', etc.
  regionIds: string[]; // Which regions this dish is typical for
  ingredients: string[];
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot';
  images: string[];
  videoUrl?: string;
  popularVariants?: string[];
}

// Cultural festivals and events data model
export interface FestivalEvent {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., 'music-festival', 'religious-festival', 'cultural-festival', etc.
  location: string;
  regionId: string | 'all'; // Which region or nationwide
  timeOfYear: string; // Month or season
  duration: number; // In days
  images: string[];
  videoUrl?: string;
  established?: number | string; // When the festival was first celebrated
  historicalSignificance?: string;
}

// Travel guide data model
export interface TravelGuide {
  id: string;
  title: string;
  description: string;
  regionIds: string[];
  content: string; // Rich text content or HTML
  author: string;
  publishedDate: string;
  type: 'general' | 'specialized' | 'thematic';
  tags: string[];
  images: string[];
  featuredImage: string;
  videoUrl?: string;
}

// Virtual tour data model
export interface VirtualTour {
  id: string;
  title: string;
  description: string;
  regionId: string;
  attractionId?: string;
  tourUrl: string; // URL to the 360° tour
  thumbnailUrl: string;
  hotspots?: VirtualTourHotspot[];
  duration: number; // Estimated viewing time in minutes
  createdDate: string;
}

export interface VirtualTourHotspot {
  id: string;
  title: string;
  description: string;
  coordinates: { x: number; y: number; z: number }; // 3D coordinates in the panorama
  type: 'info' | 'link' | 'audio' | 'video';
  content?: string;
  linkedTourId?: string;
  mediaUrl?: string;
}