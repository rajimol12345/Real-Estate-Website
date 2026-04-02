/**
 * sliderTypes.ts
 * TypeScript type definitions for the Hero Slider component
 * Use these interfaces for type safety in your React application
 */

/**
 * Individual slider slide data structure
 */
export interface SliderSlide {
  id: number | string;
  image: string;
  price: string;
  title?: string;
  link: string;
  altText?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description?: string;
}

/**
 * Property search filter parameters
 */
export interface PropertyFilters {
  propertyType: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  minPrice: string;
  maxPrice: string;
  [key: string]: string; // Allow additional filters
}

/**
 * Search form field configuration
 */
export interface FormField {
  name: keyof PropertyFilters;
  label: string;
  type: 'select' | 'input' | 'range';
  placeholder?: string;
  className?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

/**
 * Slider configuration options
 */
export interface SliderConfig {
  autoplay?: boolean;
  autoplaySpeed?: number; // milliseconds
  speed?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  touch?: boolean;
  keyboard?: boolean;
  effect?: 'slide' | 'fade';
  preloadImages?: boolean;
  lazyLoad?: boolean;
}

/**
 * Color palette configuration
 */
export interface ColorPalette {
  primary: string; // #1b9bff
  accent: string; // #8bb812
  darkGray: string; // #45515a
  white: string; // #fff
  lightGray: string; // #b2b2b2
  secondaryBlue: string; // #198feb
  buttonGray: string; // #727272
  textGray: string; // #859ab3
}

/**
 * Slider component props
 */
export interface HeroSliderProps {
  slides: SliderSlide[];
  config?: SliderConfig;
  onSearch?: (filters: PropertyFilters) => void;
  colors?: Partial<ColorPalette>;
  loading?: boolean;
  error?: string | null;
}

/**
 * Default slider configuration
 */
export const DEFAULT_SLIDER_CONFIG: SliderConfig = {
  autoplay: true,
  autoplaySpeed: 7000,
  speed: 600,
  pauseOnHover: true,
  loop: true,
  touch: true,
  keyboard: false,
  effect: 'slide',
  preloadImages: false,
  lazyLoad: true
};

/**
 * Default color palette matching the original design
 */
export const DEFAULT_COLORS: ColorPalette = {
  primary: '#1b9bff',
  accent: '#8bb812',
  darkGray: '#45515a',
  white: '#ffffff',
  lightGray: '#b2b2b2',
  secondaryBlue: '#198feb',
  buttonGray: '#727272',
  textGray: '#859ab3'
};

/**
 * Form field configuration for property search
 */
export const SEARCH_FORM_FIELDS: FormField[] = [
  {
    name: 'propertyType',
    label: 'Property Type',
    type: 'select',
    className: 'propertyType',
    options: [
      { value: '', label: 'Any' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'house', label: 'House' },
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'condo', label: 'Condo' },
      { value: 'villa', label: 'Villa' }
    ]
  },
  {
    name: 'location',
    label: 'Location',
    type: 'select',
    className: 'propertyLocation',
    options: [
      { value: '', label: 'Any' },
      { value: 'newyork', label: 'New York' },
      { value: 'losangeles', label: 'Los Angeles' },
      { value: 'chicago', label: 'Chicago' },
      { value: 'houston', label: 'Houston' },
      { value: 'phoenix', label: 'Phoenix' }
    ]
  },
  {
    name: 'beds',
    label: 'Beds',
    type: 'select',
    className: 'beds',
    options: [
      { value: '', label: 'Any' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4+' }
    ]
  },
  {
    name: 'baths',
    label: 'Baths',
    type: 'select',
    className: 'baths',
    options: [
      { value: '', label: 'Any' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3+' }
    ]
  },
  {
    name: 'sqft',
    label: 'Sq Ft',
    type: 'select',
    className: 'sqft',
    options: [
      { value: '', label: 'Any' },
      { value: '1000', label: '1000+' },
      { value: '2000', label: '2000+' },
      { value: '3000', label: '3000+' },
      { value: '5000', label: '5000+' }
    ]
  },
  {
    name: 'minPrice',
    label: 'Min Price',
    type: 'select',
    className: 'minPrice',
    options: [
      { value: '', label: 'Any' },
      { value: '100000', label: '$100,000' },
      { value: '250000', label: '$250,000' },
      { value: '500000', label: '$500,000' },
      { value: '750000', label: '$750,000' }
    ]
  },
  {
    name: 'maxPrice',
    label: 'Max Price',
    type: 'select',
    className: 'maxPrice',
    options: [
      { value: '', label: 'Any' },
      { value: '300000', label: '$300,000' },
      { value: '500000', label: '$500,000' },
      { value: '750000', label: '$750,000' },
      { value: '1000000', label: '$1,000,000' }
    ]
  }
];

/**
 * HTTP request/response types for slider data
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PropertySearchResponse {
  properties: SliderSlide[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'hero_slider_recent_searches',
  SAVED_FILTERS: 'hero_slider_saved_filters',
  USER_PREFERENCES: 'hero_slider_preferences'
} as const;

/**
 * Utility type for form field values
 */
export type FormFieldValue = string | number | boolean;

/**
 * Navigation button configuration
 */
export interface NavigationButton {
  icon: string;
  label: string;
  title: string;
  ariaLabel: string;
  position: 'prev' | 'next';
}

/**
 * Analytics event types
 */
export interface SliderAnalytics {
  eventType: 'slide_change' | 'search_submit' | 'property_click';
  slideId?: string | number;
  filters?: PropertyFilters;
  timestamp: number;
  userAgent?: string;
}

/**
 * Error handling types
 */
export class SliderError extends Error {
  constructor(
    public code: 'INVALID_SLIDES' | 'INVALID_CONFIG' | 'API_ERROR' | 'VALIDATION_ERROR',
    message: string
  ) {
    super(message);
    this.name = 'SliderError';
  }
}
