export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: Json
          description: Json
          slug: string
          price: number
          compare_price?: number
          sku: string
          inventory_quantity: number
          weight: number
          dimensions: Json
          age_min: number
          age_max: number
          material: string
          safety_certifications: string[]
          images: string[]
          category_id: string
          subcategory?: string
          is_active: boolean
          assembly_required: boolean
          care_instructions: string
          shipping_cost_eu: number
          shipping_time: string
          specifications: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description: Json
          slug: string
          price: number
          compare_price?: number
          sku: string
          inventory_quantity?: number
          weight?: number
          dimensions?: Json
          age_min: number
          age_max: number
          material: string
          safety_certifications?: string[]
          images?: string[]
          category_id: string
          subcategory?: string
          is_active?: boolean
          assembly_required?: boolean
          care_instructions: string
          shipping_cost_eu?: number
          shipping_time?: string
          specifications?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json
          slug?: string
          price?: number
          compare_price?: number
          sku?: string
          inventory_quantity?: number
          weight?: number
          dimensions?: Json
          age_min?: number
          age_max?: number
          material?: string
          safety_certifications?: string[]
          images?: string[]
          category_id?: string
          subcategory?: string
          is_active?: boolean
          assembly_required?: boolean
          care_instructions?: string
          shipping_cost_eu?: number
          shipping_time?: string
          specifications?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: Json
          description: Json
          slug: string
          image?: string
          parent_id?: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description: Json
          slug: string
          image?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json
          slug?: string
          image?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_email: string
          customer_id?: string
          status: string
          currency: string
          total_amount: number
          shipping_address: Json
          billing_address: Json
          payment_status: string
          revolut_payment_id?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_email: string
          customer_id?: string
          status: string
          currency: string
          total_amount: number
          shipping_address: Json
          billing_address: Json
          payment_status: string
          revolut_payment_id?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_email?: string
          customer_id?: string
          status?: string
          currency?: string
          total_amount?: number
          shipping_address?: Json
          billing_address?: Json
          payment_status?: string
          revolut_payment_id?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          total?: number
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          accepts_marketing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          accepts_marketing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          accepts_marketing?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          email: string
          first_name?: string
          last_name?: string
          language: string
          source: string
          subscribed_at: string
          unsubscribed_at?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          first_name?: string
          last_name?: string
          language: string
          source: string
          subscribed_at?: string
          unsubscribed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          language?: string
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string
          is_active?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string
          customer_name: string
          rating: number
          title: string
          comment: string
          verified: boolean
          helpful: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          customer_id: string
          customer_name: string
          rating: number
          title: string
          comment: string
          verified?: boolean
          helpful?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string
          customer_name?: string
          rating?: number
          title?: string
          comment?: string
          verified?: boolean
          helpful?: number
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: Json
          slug: string
          excerpt: Json
          content: Json
          cover_image: string
          author_name: string
          author_bio: string
          author_avatar: string
          tags: string[]
          category: string
          published: boolean
          published_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: Json
          slug: string
          excerpt: Json
          content: Json
          cover_image: string
          author_name: string
          author_bio: string
          author_avatar: string
          tags?: string[]
          category: string
          published?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: Json
          slug?: string
          excerpt?: Json
          content?: Json
          cover_image?: string
          author_name?: string
          author_bio?: string
          author_avatar?: string
          tags?: string[]
          category?: string
          published?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
  }
}