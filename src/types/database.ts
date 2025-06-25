export interface Database {
  public: {
    Tables: {
      waitlist_users: {
        Row: {
          id: string;
          name: string;
          email: string;
          user_type: 'cat-parent' | 'cattery-owner';
          is_verified: boolean;
          quiz_completed: boolean;
          waitlist_position: number | null;
          verification_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          user_type: 'cat-parent' | 'cattery-owner';
          is_verified?: boolean;
          quiz_completed?: boolean;
          waitlist_position?: number | null;
          verification_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          user_type?: 'cat-parent' | 'cattery-owner';
          is_verified?: boolean;
          quiz_completed?: boolean;
          waitlist_position?: number | null;
          verification_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_responses: {
        Row: {
          id: string;
          user_id: string | null;
          question_id: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          question_id: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          question_id?: string;
          answer?: string;
          created_at?: string;
        };
      };
      catteries: {
        Row: {
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
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          description?: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          latitude: number;
          longitude: number;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          capacity?: number;
          price_per_night?: number | null;
          amenities?: string[];
          images?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          name?: string;
          description?: string | null;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          latitude?: number;
          longitude?: number;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          capacity?: number;
          price_per_night?: number | null;
          amenities?: string[];
          images?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      find_catteries_within_radius: {
        Args: {
          search_lat: number;
          search_lon: number;
          radius_miles?: number;
        };
        Returns: {
          id: string;
          name: string;
          description: string;
          address: string;
          city: string;
          state: string;
          latitude: number;
          longitude: number;
          phone: string;
          email: string;
          website: string;
          capacity: number;
          price_per_night: number;
          amenities: string[];
          images: string[];
          rating: number;
          review_count: number;
          distance_miles: number;
        }[];
      };
      calculate_distance_miles: {
        Args: {
          lat1: number;
          lon1: number;
          lat2: number;
          lon2: number;
        };
        Returns: number;
      };
    };
    Enums: {
      user_type: 'cat-parent' | 'cattery-owner';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}