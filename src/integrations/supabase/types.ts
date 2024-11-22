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
      customers: {
        Row: {
          city: string
          company_name: string | null
          created_at: string | null
          email: string
          first_name: string
          house_number: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          postal_code: string
          street: string
          updated_at: string | null
        }
        Insert: {
          city: string
          company_name?: string | null
          created_at?: string | null
          email: string
          first_name: string
          house_number: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          postal_code: string
          street: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          company_name?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          house_number?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string
          street?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          personio_id: string | null
          role: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          personio_id?: string | null
          role: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          personio_id?: string | null
          role?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          order_number: number
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          order_number: number
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          order_number?: number
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string | null
          id: string
          minimum_quantity: number
          product_id: string | null
          quantity: number
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          minimum_quantity?: number
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          minimum_quantity?: number
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "solar_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          source: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          source?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          source?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
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
          project_sold: boolean | null
          stage: number
          system_details: Json | null
          system_id: string | null
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
          project_sold?: boolean | null
          stage: number
          system_details?: Json | null
          system_id?: string | null
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
          project_sold?: boolean | null
          stage?: number
          system_details?: Json | null
          system_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_specifications: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          template_id: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "solar_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "specification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documentation: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          notes: string | null
          project_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          notes?: string | null
          project_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documentation_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string
          completion_date: string | null
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          estimated_completion_date: string | null
          id: string
          project_type: string
          site_conditions: string | null
          special_requirements: string | null
          start_date: string | null
          status: string
          subtype: string | null
          system_size: number | null
          team_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          completion_date?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          estimated_completion_date?: string | null
          id?: string
          project_type: string
          site_conditions?: string | null
          special_requirements?: string | null
          start_date?: string | null
          status: string
          subtype?: string | null
          system_size?: number | null
          team_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          completion_date?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          estimated_completion_date?: string | null
          id?: string
          project_type?: string
          site_conditions?: string | null
          special_requirements?: string | null
          start_date?: string | null
          status?: string
          subtype?: string | null
          system_size?: number | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          purchase_order_id: string | null
          quantity: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          purchase_order_id?: string | null
          quantity: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          purchase_order_id?: string | null
          quantity?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "solar_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          order_date: string
          status: string
          supplier_name: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date: string
          status: string
          supplier_name: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          status?: string
          supplier_name?: string
          total_amount?: number
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
      specification_templates: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          name: string
          options: Json | null
          type: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          options?: Json | null
          type: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          options?: Json | null
          type?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specification_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          name: string
          rating: number
          role: string
          text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          rating: number
          role: string
          text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          rating?: number
          role?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      time_tracking: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          notes: string | null
          project_id: string | null
          start_time: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          notes?: string | null
          project_id?: string | null
          start_time: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          start_time?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_tracking_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          created_at: string | null
          id: string
          location: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          type?: string
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
