import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      revenus: {
        Row: {
          id: string
          date: string
          organisme: string
          type_revenu: string
          montant: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          organisme: string
          type_revenu: string
          montant: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          organisme?: string
          type_revenu?: string
          montant?: number
          created_at?: string
        }
      }
      dons: {
        Row: {
          id: string
          date: string
          organisme: string
          montant: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          organisme: string
          montant: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          organisme?: string
          montant?: number
          created_at?: string
        }
      }
    }
  }
}