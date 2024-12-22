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
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          venue_id: string
          date: string
          category: string
          subcategory: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          venue_id: string
          date: string
          category: string
          subcategory: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          venue_id?: string
          date?: string
          category?: string
          subcategory?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          event_id: string
          section: string
          row: string
          seat: string
          price: number
          status: string
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          section: string
          row: string
          seat: string
          price: number
          status?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          section?: string
          row?: string
          seat?: string
          price?: number
          status?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total: number
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          created_at?: string
          expires_at?: string
        }
      }
      order_tickets: {
        Row: {
          order_id: string
          ticket_id: string
        }
        Insert: {
          order_id: string
          ticket_id: string
        }
        Update: {
          order_id?: string
          ticket_id?: string
        }
      }
    }
  }
}