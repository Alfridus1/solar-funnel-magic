export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_documentation: {
        Row: {
          created_at: string | null
          file_path: string
          filename: string
          id: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          filename: string
          id?: string
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          filename?: string
          id?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      opensolar_installations: {
        Row: {
          contract_value: number
          created_at: string | null
          customer_name: string
          estimated_production: number
          id: string
          opensolar_id: string
          sale_date: string
          status: string
          system_size: number
          updated_at: string | null
        }
        Insert: {
          contract_value: number
          created_at?: string | null
          customer_name: string
          estimated_production: number
          id?: string
          opensolar_id: string
          sale_date: string
          status: string
          system_size: number
          updated_at?: string | null
        }
        Update: {
          contract_value?: number
          created_at?: string | null
          customer_name?: string
          estimated_production?: number
          id?: string
          opensolar_id?: string
          sale_date?: string
          status?: string
          system_size?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      opensolar_projects: {
        Row: {
          address: string
          annual_usage: number
          created_at: string | null
          created_date: string
          id: string
          lat: number | null
          lon: number | null
          modified_date: string
          opensolar_id: string
          stage: number
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          annual_usage: number
          created_at?: string | null
          created_date: string
          id?: string
          lat?: number | null
          lon?: number | null
          modified_date: string
          opensolar_id: string
          stage: number
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          annual_usage?: number
          created_at?: string | null
          created_date?: string
          id?: string
          lat?: number | null
          lon?: number | null
          modified_date?: string
          opensolar_id?: string
          stage?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      smart_m_config: {
        Row: {
          api_url: string
          client_id: string
          client_secret: string
          created_at: string | null
          id: number
          redirect_uri: string
          updated_at: string | null
        }
        Insert: {
          api_url?: string
          client_id: string
          client_secret: string
          created_at?: string | null
          id?: number
          redirect_uri: string
          updated_at?: string | null
        }
        Update: {
          api_url?: string
          client_id?: string
          client_secret?: string
          created_at?: string | null
          id?: number
          redirect_uri?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      solar_products: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          price: number
          specs: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          price: number
          specs: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          specs?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
