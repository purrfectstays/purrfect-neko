export interface User {
  name: string;
  email: string;
  userType: 'cat-parent' | 'cattery-owner';
  isVerified: boolean;
  quizCompleted: boolean;
  waitlistPosition?: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number;
}

export interface QuizData {
  answers: QuizAnswer[];
  completedAt: Date;
}

export type AppStep = 'landing' | 'registration' | 'verification' | 'quiz' | 'success' | 'explore-catteries' | 'privacy' | 'terms' | 'cookies' | 'testing';

export interface Cattery {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  capacity: number;
  price_per_night: number | null;
  amenities: string[];
  images: string[];
  is_active: boolean;
  is_verified: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  distance_miles?: number;
}

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radius: number;
  address?: string;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}