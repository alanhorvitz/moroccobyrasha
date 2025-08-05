import { LocalStorageSchema } from './types';
import { moroccanRegions } from './data/regions';
import { touristAttractions } from './data/attractions';
import { tourPackages } from './data/tour-packages';
import { mediaGallery } from './data/media';
import { contentItems } from './data/content';
import { tourGuides } from './data/guides';
import { transportServices } from './data/transport';

// Default app version
const APP_VERSION = '1.0.0';

// Storage keys
const STORAGE_KEY = 'morocco-tourism-platform';

// Initialize with default data
const defaultData: LocalStorageSchema = {
  appVersion: APP_VERSION,
  lastUpdated: new Date().toISOString(),
  regions: moroccanRegions,
  attractions: touristAttractions,
  tourPackages: tourPackages,
  mediaItems: mediaGallery,
  contentItems: contentItems,
  guides: tourGuides,
  transportServices: transportServices,
  userPreferences: {
    language: 'en',
    currency: 'USD',
    savedItems: [],
    viewedItems: [],
  },
  savedItems: [],
  reviews: [],
};

// Initialize local storage with default data if not exists
export const initializeStorage = (): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      console.log('Local storage initialized with default data');
    } else {
      // Check for version updates and merge if needed
      const parsedData = JSON.parse(existingData) as Partial<LocalStorageSchema>;
      if (parsedData.appVersion !== APP_VERSION) {
        const updatedData = {
          ...defaultData,
          ...parsedData,
          appVersion: APP_VERSION,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        console.log('Local storage updated to new version');
      }
    }
  } catch (error) {
    console.error('Failed to initialize local storage:', error);
  }
};

// Get all data from local storage
export const getAllData = (): LocalStorageSchema => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as LocalStorageSchema;
    }
  } catch (error) {
    console.error('Failed to get data from local storage:', error);
  }
  return defaultData;
};

// Generic get function for specific data type
export function getData<K extends keyof LocalStorageSchema>(
  key: K
): LocalStorageSchema[K] {
  const allData = getAllData();
  return allData[key];
}

// Generic update function for specific data type
export function updateData<K extends keyof LocalStorageSchema>(
  key: K,
  data: LocalStorageSchema[K]
): void {
  try {
    const allData = getAllData();
    const updatedData = {
      ...allData,
      [key]: data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error(`Failed to update ${String(key)} in local storage:`, error);
  }
}

// Get item by ID from a specific collection
export function getItemById<T extends { id: string }>(
  collection: T[],
  id: string
): T | undefined {
  return collection.find((item) => item.id === id);
}

// Save user preferences
export const saveUserPreferences = (
  preferences: Partial<LocalStorageSchema['userPreferences']>
): void => {
  try {
    const allData = getAllData();
    const updatedPreferences = {
      ...allData.userPreferences,
      ...preferences,
    };
    updateData('userPreferences', updatedPreferences);
  } catch (error) {
    console.error('Failed to save user preferences:', error);
  }
};

// Add item to saved items
export const addToSavedItems = (itemId: string): void => {
  try {
    const allData = getAllData();
    if (!allData.savedItems.includes(itemId)) {
      const updatedItems = [...allData.savedItems, itemId];
      updateData('savedItems', updatedItems);
    }
  } catch (error) {
    console.error('Failed to add item to saved items:', error);
  }
};

// Remove item from saved items
export const removeFromSavedItems = (itemId: string): void => {
  try {
    const allData = getAllData();
    const updatedItems = allData.savedItems.filter((id) => id !== itemId);
    updateData('savedItems', updatedItems);
  } catch (error) {
    console.error('Failed to remove item from saved items:', error);
  }
};

// Add a review
export const addReview = (review: Omit<LocalStorageSchema['reviews'][number], 'id'>): void => {
  try {
    const allData = getAllData();
    const newReview = {
      ...review,
      id: `review-${Date.now()}`,
    };
    const updatedReviews = [...allData.reviews, newReview];
    updateData('reviews', updatedReviews);
  } catch (error) {
    console.error('Failed to add review:', error);
  }
};

// Get reviews by target ID and type
export const getReviewsByTarget = (
  targetId: string,
  targetType: 'guide' | 'tour' | 'attraction'
): LocalStorageSchema['reviews'] => {
  try {
    const allData = getAllData();
    return allData.reviews.filter(
      (review) => review.targetId === targetId && review.targetType === targetType
    );
  } catch (error) {
    console.error('Failed to get reviews by target:', error);
    return [];
  }
};

// Clear all data (for testing/development)
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('All data cleared from local storage');
  } catch (error) {
    console.error('Failed to clear data from local storage:', error);
  }
};

// Export the storage initialization
export default initializeStorage;