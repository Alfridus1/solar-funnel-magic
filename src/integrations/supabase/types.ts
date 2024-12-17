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
      accounting_settings: {
        Row: {
          accounting_standard: string | null
          available_payment_methods: Json | null
          created_at: string | null
          current_number_credit_note: number | null
          current_number_customer: number | null
          current_number_delivery_note: number | null
          current_number_invoice: number | null
          current_number_order: number | null
          current_number_quote: number | null
          current_number_supplier: number | null
          document_number_prefix_credit_note: string | null
          document_number_prefix_customer: string | null
          document_number_prefix_delivery_note: string | null
          document_number_prefix_invoice: string | null
          document_number_prefix_order: string | null
          document_number_prefix_quote: string | null
          document_number_prefix_supplier: string | null
          id: string
          letterhead_url: string | null
          updated_at: string | null
        }
        Insert: {
          accounting_standard?: string | null
          available_payment_methods?: Json | null
          created_at?: string | null
          current_number_credit_note?: number | null
          current_number_customer?: number | null
          current_number_delivery_note?: number | null
          current_number_invoice?: number | null
          current_number_order?: number | null
          current_number_quote?: number | null
          current_number_supplier?: number | null
          document_number_prefix_credit_note?: string | null
          document_number_prefix_customer?: string | null
          document_number_prefix_delivery_note?: string | null
          document_number_prefix_invoice?: string | null
          document_number_prefix_order?: string | null
          document_number_prefix_quote?: string | null
          document_number_prefix_supplier?: string | null
          id?: string
          letterhead_url?: string | null
          updated_at?: string | null
        }
        Update: {
          accounting_standard?: string | null
          available_payment_methods?: Json | null
          created_at?: string | null
          current_number_credit_note?: number | null
          current_number_customer?: number | null
          current_number_delivery_note?: number | null
          current_number_invoice?: number | null
          current_number_order?: number | null
          current_number_quote?: number | null
          current_number_supplier?: number | null
          document_number_prefix_credit_note?: string | null
          document_number_prefix_customer?: string | null
          document_number_prefix_delivery_note?: string | null
          document_number_prefix_invoice?: string | null
          document_number_prefix_order?: string | null
          document_number_prefix_quote?: string | null
          document_number_prefix_supplier?: string | null
          id?: string
          letterhead_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliate_bonuses: {
        Row: {
          affiliate_id: string | null
          amount: number
          commission_percentage: number | null
          commission_type: string
          created_at: string | null
          id: string
          lead_id: string | null
          purchase_amount: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          commission_percentage?: number | null
          commission_type?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          purchase_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          commission_percentage?: number | null
          commission_type?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          purchase_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_bonuses_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_bonuses_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          lifetime_earnings: number | null
          payment_info: Json | null
          referral_code: string | null
          referral_count: number | null
          total_leads: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          lifetime_earnings?: number | null
          payment_info?: Json | null
          referral_code?: string | null
          referral_count?: number | null
          total_leads?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          lifetime_earnings?: number | null
          payment_info?: Json | null
          referral_code?: string | null
          referral_count?: number | null
          total_leads?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      calendar_events: {
        Row: {
          attendees: Json | null
          created_at: string | null
          description: string | null
          employee_id: string | null
          end_time: string
          event_id: string
          id: string
          location: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          end_time: string
          event_id: string
          id?: string
          location?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          end_time?: string
          event_id?: string
          id?: string
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          reward: number
          target: number
          title: string
          type: Database["public"]["Enums"]["challenge_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          reward: number
          target: number
          title: string
          type: Database["public"]["Enums"]["challenge_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          reward?: number
          target?: number
          title?: string
          type?: Database["public"]["Enums"]["challenge_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      christmas_games: {
        Row: {
          correct_value: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          points: number
          updated_at: string | null
        }
        Insert: {
          correct_value?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points?: number
          updated_at?: string | null
        }
        Update: {
          correct_value?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      christmas_participants: {
        Row: {
          created_at: string | null
          device_fingerprint: string
          id: string
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint: string
          id?: string
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string
          id?: string
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      christmas_users: {
        Row: {
          created_at: string | null
          device_fingerprint: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      commission_settings: {
        Row: {
          active: boolean | null
          created_at: string | null
          default_rate: number | null
          id: string
          max_commission: number | null
          min_commission: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          default_rate?: number | null
          id?: string
          max_commission?: number | null
          min_commission?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          default_rate?: number | null
          id?: string
          max_commission?: number | null
          min_commission?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          affiliate_bonus: number | null
          bank_details: string | null
          company_name: string
          created_at: string | null
          default_commission_percentage: number | null
          id: string
          letterhead_url: string | null
          tax_number: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          affiliate_bonus?: number | null
          bank_details?: string | null
          company_name: string
          created_at?: string | null
          default_commission_percentage?: number | null
          id?: string
          letterhead_url?: string | null
          tax_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          affiliate_bonus?: number | null
          bank_details?: string | null
          company_name?: string
          created_at?: string | null
          default_commission_percentage?: number | null
          id?: string
          letterhead_url?: string | null
          tax_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      competition_participants: {
        Row: {
          competition_id: string
          created_at: string | null
          employee_id: string
          id: string
          rank: number | null
          score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          employee_id: string
          id?: string
          rank?: number | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          rank?: number | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_participants_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_participants_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string | null
          duration: string
          end_date: string
          id: string
          prize: string
          start_date: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration: string
          end_date: string
          id?: string
          prize: string
          start_date: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: string
          end_date?: string
          id?: string
          prize?: string
          start_date?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_relationships: {
        Row: {
          contact_id: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_relationships_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"] | null
          created_at: string | null
          customer_id: string | null
          document_status: string | null
          document_type: string
          file_name: string
          file_path: string
          id: string
          metadata: Json | null
          status: string | null
          updated_at: string | null
          uploaded_at: string | null
          verification_date: string | null
          verified_by: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"] | null
          created_at?: string | null
          customer_id?: string | null
          document_status?: string | null
          document_type: string
          file_name: string
          file_path: string
          id?: string
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"] | null
          created_at?: string | null
          customer_id?: string | null
          document_status?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          city: string
          company_name: string | null
          created_at: string | null
          customer_number: number
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
          customer_number?: number
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
          customer_number?: number
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
      daily_quests: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string
          description: string
          employee_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_template: boolean | null
          progress: number | null
          reward: number
          target: number
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          description: string
          employee_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_template?: boolean | null
          progress?: number | null
          reward: number
          target: number
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          description?: string
          employee_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_template?: boolean | null
          progress?: number | null
          reward?: number
          target?: number
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_quests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          additional_notes: string | null
          briefing_notes: string | null
          commission: string
          created_at: string | null
          customer_feedback: string | null
          daily_tasks: string | null
          date: string
          difficulties: string | null
          employee_id: string | null
          employees_absent: string | null
          employees_present: string[]
          end_of_day: string | null
          equipment_used: string | null
          external_workers: string | null
          id: string
          latitude: number | null
          longitude: number | null
          lunch_break_end: string | null
          lunch_break_notes: string | null
          lunch_break_start: string | null
          material_delivered: boolean | null
          material_details: string | null
          material_notes: string | null
          progress_notes: string | null
          quality_checks: string | null
          remaining_time: number | null
          scaffold_external: boolean | null
          scaffold_safety_check: string | null
          scaffold_type: string | null
          site_completed: boolean | null
          site_location: string | null
          site_securing_notes: string | null
          site_start_time: string | null
          team_code: string
          team_id: string | null
          todo_for_tomorrow: string | null
          travel_time_minutes: number | null
          updated_at: string | null
          weather_conditions: string | null
          work_start_time: string | null
        }
        Insert: {
          additional_notes?: string | null
          briefing_notes?: string | null
          commission: string
          created_at?: string | null
          customer_feedback?: string | null
          daily_tasks?: string | null
          date: string
          difficulties?: string | null
          employee_id?: string | null
          employees_absent?: string | null
          employees_present: string[]
          end_of_day?: string | null
          equipment_used?: string | null
          external_workers?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          lunch_break_end?: string | null
          lunch_break_notes?: string | null
          lunch_break_start?: string | null
          material_delivered?: boolean | null
          material_details?: string | null
          material_notes?: string | null
          progress_notes?: string | null
          quality_checks?: string | null
          remaining_time?: number | null
          scaffold_external?: boolean | null
          scaffold_safety_check?: string | null
          scaffold_type?: string | null
          site_completed?: boolean | null
          site_location?: string | null
          site_securing_notes?: string | null
          site_start_time?: string | null
          team_code: string
          team_id?: string | null
          todo_for_tomorrow?: string | null
          travel_time_minutes?: number | null
          updated_at?: string | null
          weather_conditions?: string | null
          work_start_time?: string | null
        }
        Update: {
          additional_notes?: string | null
          briefing_notes?: string | null
          commission?: string
          created_at?: string | null
          customer_feedback?: string | null
          daily_tasks?: string | null
          date?: string
          difficulties?: string | null
          employee_id?: string | null
          employees_absent?: string | null
          employees_present?: string[]
          end_of_day?: string | null
          equipment_used?: string | null
          external_workers?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          lunch_break_end?: string | null
          lunch_break_notes?: string | null
          lunch_break_start?: string | null
          material_delivered?: boolean | null
          material_details?: string | null
          material_notes?: string | null
          progress_notes?: string | null
          quality_checks?: string | null
          remaining_time?: number | null
          scaffold_external?: boolean | null
          scaffold_safety_check?: string | null
          scaffold_type?: string | null
          site_completed?: boolean | null
          site_location?: string | null
          site_securing_notes?: string | null
          site_start_time?: string | null
          team_code?: string
          team_id?: string | null
          todo_for_tomorrow?: string | null
          travel_time_minutes?: number | null
          updated_at?: string | null
          weather_conditions?: string | null
          work_start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "installation_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_documents: {
        Row: {
          created_at: string | null
          deal_id: string | null
          document_type: Database["public"]["Enums"]["deal_document_type"]
          file_name: string
          file_path: string
          id: string
          required: boolean | null
          status: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          document_type: Database["public"]["Enums"]["deal_document_type"]
          file_name: string
          file_path: string
          id?: string
          required?: boolean | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          document_type?: Database["public"]["Enums"]["deal_document_type"]
          file_name?: string
          file_path?: string
          id?: string
          required?: boolean | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_notes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_photos: {
        Row: {
          category: string
          created_at: string | null
          deal_id: string | null
          file_name: string
          file_path: string
          id: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          deal_id?: string | null
          file_name: string
          file_path: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          deal_id?: string | null
          file_name?: string
          file_path?: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_photos_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_sales_reps: {
        Row: {
          created_at: string | null
          deal_id: string | null
          employee_id: string | null
          id: string
          share_percentage: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          employee_id?: string | null
          id?: string
          share_percentage?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          employee_id?: string | null
          id?: string
          share_percentage?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_sales_reps_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_sales_reps_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          addons: Database["public"]["Enums"]["deal_addon"][] | null
          address: string | null
          battery_kwh: number | null
          city: string | null
          contact_id: string | null
          contract_data: Json | null
          created_at: string | null
          deal_name: string | null
          heatpump_kw: number | null
          id: string
          lead_id: string | null
          meeting_date: string | null
          notes: string | null
          payment_type: Database["public"]["Enums"]["deal_payment_type"] | null
          postal_code: string | null
          potential_value: number | null
          sales_rep_id: string | null
          solar_kwp: number | null
          sold_products: Json | null
          special_tasks: Json | null
          status: Database["public"]["Enums"]["deal_status"]
          updated_at: string | null
        }
        Insert: {
          addons?: Database["public"]["Enums"]["deal_addon"][] | null
          address?: string | null
          battery_kwh?: number | null
          city?: string | null
          contact_id?: string | null
          contract_data?: Json | null
          created_at?: string | null
          deal_name?: string | null
          heatpump_kw?: number | null
          id?: string
          lead_id?: string | null
          meeting_date?: string | null
          notes?: string | null
          payment_type?: Database["public"]["Enums"]["deal_payment_type"] | null
          postal_code?: string | null
          potential_value?: number | null
          sales_rep_id?: string | null
          solar_kwp?: number | null
          sold_products?: Json | null
          special_tasks?: Json | null
          status?: Database["public"]["Enums"]["deal_status"]
          updated_at?: string | null
        }
        Update: {
          addons?: Database["public"]["Enums"]["deal_addon"][] | null
          address?: string | null
          battery_kwh?: number | null
          city?: string | null
          contact_id?: string | null
          contract_data?: Json | null
          created_at?: string | null
          deal_name?: string | null
          heatpump_kw?: number | null
          id?: string
          lead_id?: string | null
          meeting_date?: string | null
          notes?: string | null
          payment_type?: Database["public"]["Enums"]["deal_payment_type"] | null
          postal_code?: string | null
          potential_value?: number | null
          sales_rep_id?: string | null
          solar_kwp?: number | null
          sold_products?: Json | null
          special_tasks?: Json | null
          status?: Database["public"]["Enums"]["deal_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      email_history: {
        Row: {
          body: string
          created_at: string | null
          employee_id: string | null
          id: string
          lead_id: string | null
          recipient: string
          sent_at: string | null
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          lead_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          lead_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_achievements: {
        Row: {
          awarded_at: string | null
          created_at: string | null
          description: string | null
          employee_id: string | null
          icon: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          awarded_at?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          icon?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          awarded_at?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          icon?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_achievements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_attribute_assignments: {
        Row: {
          attribute_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          attribute_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          attribute_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_attribute_assignments_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "employee_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_attribute_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_attributes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_availability: {
        Row: {
          availability_type: string
          created_at: string | null
          employee_id: string | null
          end_date: string
          id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          availability_type?: string
          created_at?: string | null
          employee_id?: string | null
          end_date: string
          id?: string
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          availability_type?: string
          created_at?: string | null
          employee_id?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_availability_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_challenges: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          progress: number | null
          updated_at: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          progress?: number | null
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          progress?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_challenges_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_devices: {
        Row: {
          created_at: string | null
          device_name: string
          device_type: string
          employee_id: string | null
          id: string
          issued_date: string | null
          notes: string | null
          return_date: string | null
          serial_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_name: string
          device_type: string
          employee_id?: string | null
          id?: string
          issued_date?: string | null
          notes?: string | null
          return_date?: string | null
          serial_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_name?: string
          device_type?: string
          employee_id?: string | null
          id?: string
          issued_date?: string | null
          notes?: string | null
          return_date?: string | null
          serial_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_devices_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_levels: {
        Row: {
          coins: number | null
          created_at: string | null
          current_level: number | null
          current_xp: number | null
          employee_id: string | null
          id: string
          next_level_xp: number | null
          updated_at: string | null
        }
        Insert: {
          coins?: number | null
          created_at?: string | null
          current_level?: number | null
          current_xp?: number | null
          employee_id?: string | null
          id?: string
          next_level_xp?: number | null
          updated_at?: string | null
        }
        Update: {
          coins?: number | null
          created_at?: string | null
          current_level?: number | null
          current_xp?: number | null
          employee_id?: string | null
          id?: string
          next_level_xp?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_levels_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_permissions: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_permissions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          base_salary: number | null
          commission_enabled: boolean | null
          created_at: string | null
          email: string
          first_name: string
          gross_salary: number | null
          has_company_car: boolean | null
          hours_per_month: number | null
          iban: string | null
          id: string
          last_name: string
          location: string | null
          location_id: string | null
          ms_calendar_connected: boolean | null
          ms_calendar_id: string | null
          ms_refresh_token: string | null
          opensolar_id: string | null
          personio_id: string | null
          profile_id: string | null
          project_role: Database["public"]["Enums"]["project_role"] | null
          role: string
          status: string
          team_id: string | null
          total_sales: number | null
          updated_at: string | null
          vacation_days: number | null
          vehicle_assigned: string | null
          vehicle_plate: string | null
          vehicle_type: string | null
        }
        Insert: {
          address?: string | null
          base_salary?: number | null
          commission_enabled?: boolean | null
          created_at?: string | null
          email: string
          first_name: string
          gross_salary?: number | null
          has_company_car?: boolean | null
          hours_per_month?: number | null
          iban?: string | null
          id?: string
          last_name: string
          location?: string | null
          location_id?: string | null
          ms_calendar_connected?: boolean | null
          ms_calendar_id?: string | null
          ms_refresh_token?: string | null
          opensolar_id?: string | null
          personio_id?: string | null
          profile_id?: string | null
          project_role?: Database["public"]["Enums"]["project_role"] | null
          role: string
          status?: string
          team_id?: string | null
          total_sales?: number | null
          updated_at?: string | null
          vacation_days?: number | null
          vehicle_assigned?: string | null
          vehicle_plate?: string | null
          vehicle_type?: string | null
        }
        Update: {
          address?: string | null
          base_salary?: number | null
          commission_enabled?: boolean | null
          created_at?: string | null
          email?: string
          first_name?: string
          gross_salary?: number | null
          has_company_car?: boolean | null
          hours_per_month?: number | null
          iban?: string | null
          id?: string
          last_name?: string
          location?: string | null
          location_id?: string | null
          ms_calendar_connected?: boolean | null
          ms_calendar_id?: string | null
          ms_refresh_token?: string | null
          opensolar_id?: string | null
          personio_id?: string | null
          profile_id?: string | null
          project_role?: Database["public"]["Enums"]["project_role"] | null
          role?: string
          status?: string
          team_id?: string | null
          total_sales?: number | null
          updated_at?: string | null
          vacation_days?: number | null
          vehicle_assigned?: string | null
          vehicle_plate?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      installation_order_photos: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          photo_url: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          photo_url: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          photo_url?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_order_photos_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "installation_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installation_order_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_order_reports: {
        Row: {
          break_duration: number | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          order_id: string | null
          report_date: string
          updated_at: string | null
          weather_conditions: string | null
          work_end_time: string | null
          work_start_time: string | null
        }
        Insert: {
          break_duration?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          report_date: string
          updated_at?: string | null
          weather_conditions?: string | null
          work_end_time?: string | null
          work_start_time?: string | null
        }
        Update: {
          break_duration?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          report_date?: string
          updated_at?: string | null
          weather_conditions?: string | null
          work_end_time?: string | null
          work_start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_order_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installation_order_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "installation_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_orders: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          name: string
          notes: string | null
          order_type:
            | Database["public"]["Enums"]["installation_team_type"]
            | null
          project_id: string | null
          start_date: string
          status:
            | Database["public"]["Enums"]["installation_order_status"]
            | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          name: string
          notes?: string | null
          order_type?:
            | Database["public"]["Enums"]["installation_team_type"]
            | null
          project_id?: string | null
          start_date: string
          status?:
            | Database["public"]["Enums"]["installation_order_status"]
            | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          name?: string
          notes?: string | null
          order_type?:
            | Database["public"]["Enums"]["installation_team_type"]
            | null
          project_id?: string | null
          start_date?: string
          status?:
            | Database["public"]["Enums"]["installation_order_status"]
            | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installation_orders_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "installation_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_team_members: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          is_active: boolean | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_team_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installation_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "installation_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      installation_teams: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          team_code: string
          team_type: Database["public"]["Enums"]["installation_team_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          team_code: string
          team_type: Database["public"]["Enums"]["installation_team_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          team_code?: string
          team_type?: Database["public"]["Enums"]["installation_team_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          created_at: string | null
          credentials: Json
          id: string
          is_active: boolean | null
          service: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json
          id?: string
          is_active?: boolean | null
          service: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json
          id?: string
          is_active?: boolean | null
          service?: string
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
      invoice_documents: {
        Row: {
          created_at: string | null
          extracted_data: Json | null
          hash: string
          id: string
          invoice_id: string | null
          invoice_number: string
          pdf_data: string
          processing_status: string | null
          raw_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          extracted_data?: Json | null
          hash: string
          id?: string
          invoice_id?: string | null
          invoice_number: string
          pdf_data: string
          processing_status?: string | null
          raw_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          extracted_data?: Json | null
          hash?: string
          id?: string
          invoice_id?: string | null
          invoice_number?: string
          pdf_data?: string
          processing_status?: string | null
          raw_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_documents_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          customer_id: string | null
          due_date: string | null
          extracted_data: Json | null
          id: string
          invoice_number: string
          issued_date: string | null
          last_reminder_date: string | null
          notes: string | null
          payment_method: string | null
          processing_status: string | null
          raw_text: string | null
          reminder_level: number | null
          reminder_stop: boolean | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          total_amount: number
          total_interest_charges: number | null
          total_reminder_fees: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          extracted_data?: Json | null
          id?: string
          invoice_number: string
          issued_date?: string | null
          last_reminder_date?: string | null
          notes?: string | null
          payment_method?: string | null
          processing_status?: string | null
          raw_text?: string | null
          reminder_level?: number | null
          reminder_stop?: boolean | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          total_amount?: number
          total_interest_charges?: number | null
          total_reminder_fees?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          extracted_data?: Json | null
          id?: string
          invoice_number?: string
          issued_date?: string | null
          last_reminder_date?: string | null
          notes?: string | null
          payment_method?: string | null
          processing_status?: string | null
          raw_text?: string | null
          reminder_level?: number | null
          reminder_stop?: boolean | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          total_amount?: number
          total_interest_charges?: number | null
          total_reminder_fees?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_content: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          order_number: number | null
          section: string
          section_type:
            | Database["public"]["Enums"]["landing_page_section_type"]
            | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          order_number?: number | null
          section: string
          section_type?:
            | Database["public"]["Enums"]["landing_page_section_type"]
            | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          order_number?: number | null
          section?: string
          section_type?:
            | Database["public"]["Enums"]["landing_page_section_type"]
            | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_page_products: {
        Row: {
          created_at: string | null
          id: string
          landing_page_type: string
          order_number: number
          product_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          landing_page_type: string
          order_number?: number
          product_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          landing_page_type?: string
          order_number?: number
          product_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "solar_products"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_settings: {
        Row: {
          battery_size_ratio: number
          created_at: string | null
          id: string
          landing_page_type: string
          max_kwp: number
          max_products: number
          min_kwp: number
          price_per_kwp_max: number
          price_per_kwp_min: number
          price_per_kwp_tier1: number | null
          price_per_kwp_tier2: number | null
          price_per_kwp_tier3: number | null
          price_per_kwp_tier4: number | null
          updated_at: string | null
        }
        Insert: {
          battery_size_ratio?: number
          created_at?: string | null
          id?: string
          landing_page_type: string
          max_kwp?: number
          max_products?: number
          min_kwp?: number
          price_per_kwp_max?: number
          price_per_kwp_min?: number
          price_per_kwp_tier1?: number | null
          price_per_kwp_tier2?: number | null
          price_per_kwp_tier3?: number | null
          price_per_kwp_tier4?: number | null
          updated_at?: string | null
        }
        Update: {
          battery_size_ratio?: number
          created_at?: string | null
          id?: string
          landing_page_type?: string
          max_kwp?: number
          max_products?: number
          min_kwp?: number
          price_per_kwp_max?: number
          price_per_kwp_min?: number
          price_per_kwp_tier1?: number | null
          price_per_kwp_tier2?: number | null
          price_per_kwp_tier3?: number | null
          price_per_kwp_tier4?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_assignment_history: {
        Row: {
          assigned_at: string | null
          assignment_type: string
          created_at: string | null
          employee_id: string | null
          id: string
          lead_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assignment_type: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          lead_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assignment_type?: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          lead_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignment_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_assignment_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_assignment_queue: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          is_active: boolean | null
          last_assignment_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          last_assignment_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          last_assignment_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignment_queue_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_dates: {
        Row: {
          created_at: string | null
          first_contact_date: string | null
          id: string
          last_contact_date: string | null
          lead_id: string | null
          meeting_date: string | null
          offer_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_contact_date?: string | null
          id?: string
          last_contact_date?: string | null
          lead_id?: string | null
          meeting_date?: string | null
          offer_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_contact_date?: string | null
          id?: string
          last_contact_date?: string | null
          lead_id?: string | null
          meeting_date?: string | null
          offer_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_dates_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_metrics: {
        Row: {
          annual_consumption: number | null
          created_at: string | null
          electricity_price: number | null
          heating_load: number | null
          id: string
          last_score_update: string | null
          lead_id: string | null
          potential_value: number | null
          score: number | null
          score_factors: Json | null
          updated_at: string | null
        }
        Insert: {
          annual_consumption?: number | null
          created_at?: string | null
          electricity_price?: number | null
          heating_load?: number | null
          id?: string
          last_score_update?: string | null
          lead_id?: string | null
          potential_value?: number | null
          score?: number | null
          score_factors?: Json | null
          updated_at?: string | null
        }
        Update: {
          annual_consumption?: number | null
          created_at?: string | null
          electricity_price?: number | null
          heating_load?: number | null
          id?: string
          last_score_update?: string | null
          lead_id?: string | null
          potential_value?: number | null
          score?: number | null
          score_factors?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_metrics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scoring_rules: {
        Row: {
          condition_field: string
          condition_operator: string
          condition_value: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          score_value: number
          updated_at: string | null
        }
        Insert: {
          condition_field: string
          condition_operator: string
          condition_value: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          score_value: number
          updated_at?: string | null
        }
        Update: {
          condition_field?: string
          condition_operator?: string
          condition_value?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          score_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_service_assignments: {
        Row: {
          created_at: string | null
          external_service_id: string | null
          id: string
          internal_service_id: string | null
          lead_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          external_service_id?: string | null
          id?: string
          internal_service_id?: string | null
          lead_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          external_service_id?: string | null
          id?: string
          internal_service_id?: string | null
          lead_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_service_assignments_external_service_id_fkey"
            columns: ["external_service_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_service_assignments_internal_service_id_fkey"
            columns: ["internal_service_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_service_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_status_definitions: {
        Row: {
          category: Database["public"]["Enums"]["lead_status_category"]
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          order_number: number
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["lead_status_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_number: number
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["lead_status_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_number?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          affiliate_id: string | null
          calculation_id: string | null
          calculation_url: string | null
          company_name: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          first_name: string
          google_form_address: string | null
          id: string
          last_name: string
          location_id: string | null
          lost_reason: string | null
          metrics: Json | null
          notes: string | null
          object_address: string
          phone: string
          potential_value: number | null
          project_type: Database["public"]["Enums"]["project_type"] | null
          rejection_reason: string | null
          score: number | null
          score_factors: Json | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          affiliate_id?: string | null
          calculation_id?: string | null
          calculation_url?: string | null
          company_name?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          first_name: string
          google_form_address?: string | null
          id?: string
          last_name: string
          location_id?: string | null
          lost_reason?: string | null
          metrics?: Json | null
          notes?: string | null
          object_address: string
          phone: string
          potential_value?: number | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          rejection_reason?: string | null
          score?: number | null
          score_factors?: Json | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          affiliate_id?: string | null
          calculation_id?: string | null
          calculation_url?: string | null
          company_name?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          first_name?: string
          google_form_address?: string | null
          id?: string
          last_name?: string
          location_id?: string | null
          lost_reason?: string | null
          metrics?: Json | null
          notes?: string | null
          object_address?: string
          phone?: string
          potential_value?: number | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          rejection_reason?: string | null
          score?: number | null
          score_factors?: Json | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      level_reward_settings: {
        Row: {
          coins_per_euro: number | null
          created_at: string | null
          id: string
          project_type: Database["public"]["Enums"]["project_type"] | null
          updated_at: string | null
          xp_electrical_plan: number | null
          xp_first_sale: number | null
          xp_monthly_goal_reached: number | null
          xp_per_kwh_battery: number | null
          xp_per_kwp: number | null
          xp_per_photo: number | null
          xp_per_referral: number | null
          xp_per_review: number | null
          xp_per_training: number | null
        }
        Insert: {
          coins_per_euro?: number | null
          created_at?: string | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"] | null
          updated_at?: string | null
          xp_electrical_plan?: number | null
          xp_first_sale?: number | null
          xp_monthly_goal_reached?: number | null
          xp_per_kwh_battery?: number | null
          xp_per_kwp?: number | null
          xp_per_photo?: number | null
          xp_per_referral?: number | null
          xp_per_review?: number | null
          xp_per_training?: number | null
        }
        Update: {
          coins_per_euro?: number | null
          created_at?: string | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"] | null
          updated_at?: string | null
          xp_electrical_plan?: number | null
          xp_first_sale?: number | null
          xp_monthly_goal_reached?: number | null
          xp_per_kwh_battery?: number | null
          xp_per_kwp?: number | null
          xp_per_photo?: number | null
          xp_per_referral?: number | null
          xp_per_review?: number | null
          xp_per_training?: number | null
        }
        Relationships: []
      }
      level_settings: {
        Row: {
          coin_factor: number | null
          created_at: string | null
          icon: string | null
          id: string
          level: number
          max_xp: number
          min_xp: number
          name: string
          paragon_enabled: boolean | null
          paragon_step_xp: number | null
          reward: string | null
          updated_at: string | null
        }
        Insert: {
          coin_factor?: number | null
          created_at?: string | null
          icon?: string | null
          id?: string
          level: number
          max_xp: number
          min_xp: number
          name: string
          paragon_enabled?: boolean | null
          paragon_step_xp?: number | null
          reward?: string | null
          updated_at?: string | null
        }
        Update: {
          coin_factor?: number | null
          created_at?: string | null
          icon?: string | null
          id?: string
          level?: number
          max_xp?: number
          min_xp?: number
          name?: string
          paragon_enabled?: boolean | null
          paragon_step_xp?: number | null
          reward?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          id: string
          is_active: boolean | null
          lat: number | null
          lng: number | null
          name: string
          postal_code: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          country?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name: string
          postal_code: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string
          postal_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meeting_type_definitions: {
        Row: {
          buffer_minutes: number
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          name: string
          type: Database["public"]["Enums"]["meeting_type"]
          updated_at: string | null
        }
        Insert: {
          buffer_minutes?: number
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          name: string
          type: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string | null
        }
        Update: {
          buffer_minutes?: number
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string | null
          deal_id: string | null
          end_time: string
          external_employee_id: string | null
          id: string
          internal_employee_id: string | null
          lead_id: string | null
          location: string | null
          notes: string | null
          project_id: string | null
          start_time: string
          status: string | null
          type: Database["public"]["Enums"]["meeting_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          end_time: string
          external_employee_id?: string | null
          id?: string
          internal_employee_id?: string | null
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          project_id?: string | null
          start_time: string
          status?: string | null
          type: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          end_time?: string
          external_employee_id?: string | null
          id?: string
          internal_employee_id?: string | null
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          project_id?: string | null
          start_time?: string
          status?: string | null
          type?: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_external_employee_id_fkey"
            columns: ["external_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_internal_employee_id_fkey"
            columns: ["internal_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      microsoft_auth_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          employee_id: string | null
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          employee_id?: string | null
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "microsoft_auth_tokens_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_goals: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          month: number
          project_type: Database["public"]["Enums"]["project_type"] | null
          quantity_goal: number | null
          revenue_goal: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          month: number
          project_type?: Database["public"]["Enums"]["project_type"] | null
          quantity_goal?: number | null
          revenue_goal?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          month?: number
          project_type?: Database["public"]["Enums"]["project_type"] | null
          quantity_goal?: number | null
          revenue_goal?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_goals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      opensolar_users: {
        Row: {
          created_at: string | null
          email: string
          family_name: string | null
          first_name: string | null
          has_logged_in: boolean | null
          id: string
          is_admin: boolean | null
          job_title: string | null
          name: string | null
          opensolar_id: string
          phone: string | null
          role: string | null
          schedule_meeting_label: string | null
          schedule_meeting_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          family_name?: string | null
          first_name?: string | null
          has_logged_in?: boolean | null
          id?: string
          is_admin?: boolean | null
          job_title?: string | null
          name?: string | null
          opensolar_id: string
          phone?: string | null
          role?: string | null
          schedule_meeting_label?: string | null
          schedule_meeting_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          family_name?: string | null
          first_name?: string | null
          has_logged_in?: boolean | null
          id?: string
          is_admin?: boolean | null
          job_title?: string | null
          name?: string | null
          opensolar_id?: string
          phone?: string | null
          role?: string | null
          schedule_meeting_label?: string | null
          schedule_meeting_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      participant_games: {
        Row: {
          completed_at: string | null
          game_id: string | null
          id: string
          participant_id: string | null
          photo_url: string | null
          points_earned: number
          status: string | null
          user_guess: number | null
        }
        Insert: {
          completed_at?: string | null
          game_id?: string | null
          id?: string
          participant_id?: string | null
          photo_url?: string | null
          points_earned?: number
          status?: string | null
          user_guess?: number | null
        }
        Update: {
          completed_at?: string | null
          game_id?: string | null
          id?: string
          participant_id?: string | null
          photo_url?: string | null
          points_earned?: number
          status?: string | null
          user_guess?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "christmas_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_games_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "christmas_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      personio_employees: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          office: string | null
          personio_id: number
          position: string | null
          raw_data: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          office?: string | null
          personio_id: number
          position?: string | null
          raw_data?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          office?: string | null
          personio_id?: number
          position?: string | null
          raw_data?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      phase_handovers: {
        Row: {
          accepted_by: string | null
          created_at: string | null
          from_phase_id: string | null
          handed_over_by: string | null
          handover_date: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string | null
          to_phase_id: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_by?: string | null
          created_at?: string | null
          from_phase_id?: string | null
          handed_over_by?: string | null
          handover_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          to_phase_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_by?: string | null
          created_at?: string | null
          from_phase_id?: string | null
          handed_over_by?: string | null
          handover_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          to_phase_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phase_handovers_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phase_handovers_from_phase_id_fkey"
            columns: ["from_phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phase_handovers_handed_over_by_fkey"
            columns: ["handed_over_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phase_handovers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phase_handovers_to_phase_id_fkey"
            columns: ["to_phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          phase_id: string | null
          read: boolean | null
          recipient_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          phase_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          phase_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phase_notifications_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phase_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      predefined_special_tasks: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_products: {
        Row: {
          climate_impact: string
          created_at: string | null
          description: string
          features: string[]
          id: string
          image_url: string
          inclusion_type: string
          name: string
          order_number: number
          purchase_options: Json | null
          updated_at: string | null
        }
        Insert: {
          climate_impact: string
          created_at?: string | null
          description: string
          features?: string[]
          id?: string
          image_url: string
          inclusion_type?: string
          name: string
          order_number: number
          purchase_options?: Json | null
          updated_at?: string | null
        }
        Update: {
          climate_impact?: string
          created_at?: string | null
          description?: string
          features?: string[]
          id?: string
          image_url?: string
          inclusion_type?: string
          name?: string
          order_number?: number
          purchase_options?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      price_settings: {
        Row: {
          created_at: string | null
          id: string
          price_per_kwp_max: number
          price_per_kwp_min: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          price_per_kwp_max?: number
          price_per_kwp_min?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          price_per_kwp_max?: number
          price_per_kwp_min?: number
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
      profiles: {
        Row: {
          annual_consumption: number | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          customer_number: string | null
          deleted_at: string | null
          email: string
          first_name: string
          house_number: string | null
          iban: string | null
          id: string
          is_subcontractor_admin: boolean | null
          last_name: string
          permissions: Database["public"]["Enums"]["user_permission"][] | null
          phone: string
          postal_code: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          simulated_employee_id: string | null
          simulated_role: string | null
          status: string
          street: string | null
          subcontractor_id: string | null
          updated_at: string | null
        }
        Insert: {
          annual_consumption?: number | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          customer_number?: string | null
          deleted_at?: string | null
          email: string
          first_name: string
          house_number?: string | null
          iban?: string | null
          id?: string
          is_subcontractor_admin?: boolean | null
          last_name: string
          permissions?: Database["public"]["Enums"]["user_permission"][] | null
          phone: string
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          simulated_employee_id?: string | null
          simulated_role?: string | null
          status?: string
          street?: string | null
          subcontractor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_consumption?: number | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          customer_number?: string | null
          deleted_at?: string | null
          email?: string
          first_name?: string
          house_number?: string | null
          iban?: string | null
          id?: string
          is_subcontractor_admin?: boolean | null
          last_name?: string
          permissions?: Database["public"]["Enums"]["user_permission"][] | null
          phone?: string
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          simulated_employee_id?: string | null
          simulated_role?: string | null
          status?: string
          street?: string | null
          subcontractor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractor_companies"
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
      project_phase_templates: {
        Row: {
          checklist_items: Json | null
          created_at: string | null
          description: string | null
          estimated_duration: unknown | null
          id: string
          order_number: number
          phase: Database["public"]["Enums"]["project_phase"]
          required_documents: Json | null
          required_role: Database["public"]["Enums"]["project_role"]
          updated_at: string | null
        }
        Insert: {
          checklist_items?: Json | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          order_number: number
          phase: Database["public"]["Enums"]["project_phase"]
          required_documents?: Json | null
          required_role: Database["public"]["Enums"]["project_role"]
          updated_at?: string | null
        }
        Update: {
          checklist_items?: Json | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          order_number?: number
          phase?: Database["public"]["Enums"]["project_phase"]
          required_documents?: Json | null
          required_role?: Database["public"]["Enums"]["project_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      project_phases: {
        Row: {
          accepted_by: string | null
          assigned_to: string | null
          checklist_status: Json | null
          completed_at: string | null
          created_at: string | null
          due_date: string | null
          handover_by: string | null
          handover_date: string | null
          handover_notes: string | null
          id: string
          notes: string | null
          phase: Database["public"]["Enums"]["project_phase"]
          project_id: string | null
          rejection_reason: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_by?: string | null
          assigned_to?: string | null
          checklist_status?: Json | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          handover_by?: string | null
          handover_date?: string | null
          handover_notes?: string | null
          id?: string
          notes?: string | null
          phase: Database["public"]["Enums"]["project_phase"]
          project_id?: string | null
          rejection_reason?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_by?: string | null
          assigned_to?: string | null
          checklist_status?: Json | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          handover_by?: string | null
          handover_date?: string | null
          handover_notes?: string | null
          id?: string
          notes?: string | null
          phase?: Database["public"]["Enums"]["project_phase"]
          project_id?: string | null
          rejection_reason?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_handover_by_fkey"
            columns: ["handover_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_type_translations: {
        Row: {
          created_at: string | null
          description: string | null
          max_size: number | null
          min_size: number | null
          name: string
          type: Database["public"]["Enums"]["project_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          max_size?: number | null
          min_size?: number | null
          name: string
          type: Database["public"]["Enums"]["project_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          max_size?: number | null
          min_size?: number | null
          name?: string
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string | null
        }
        Relationships: []
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
          location_id: string | null
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
          location_id?: string | null
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
          location_id?: string | null
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
            foreignKeyName: "projects_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
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
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          device_fingerprint: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
        }
        Insert: {
          auth: string
          created_at?: string | null
          device_fingerprint: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
        }
        Update: {
          auth?: string
          created_at?: string | null
          device_fingerprint?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quest_generation_settings: {
        Row: {
          created_at: string | null
          generation_time: string
          id: string
          quests_per_day: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          generation_time?: string
          id?: string
          quests_per_day?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          generation_time?: string
          id?: string
          quests_per_day?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      quest_templates: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          opensolar_metric: string | null
          opensolar_type: string | null
          reward: number
          target: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          opensolar_metric?: string | null
          opensolar_type?: string | null
          reward: number
          target: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          opensolar_metric?: string | null
          opensolar_type?: string | null
          reward?: number
          target?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          id: string
          product_id: string | null
          quantity: number
          quote_id: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          quantity: number
          quote_id?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          quote_id?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "solar_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string
          total_amount: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_settings: {
        Row: {
          created_at: string | null
          days_until_reminder: number
          fee: number
          id: string
          interest_rate: number
          level: Database["public"]["Enums"]["reminder_level"]
          template_body: string
          template_subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_until_reminder: number
          fee?: number
          id?: string
          interest_rate?: number
          level: Database["public"]["Enums"]["reminder_level"]
          template_body: string
          template_subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_until_reminder?: number
          fee?: number
          id?: string
          interest_rate?: number
          level?: Database["public"]["Enums"]["reminder_level"]
          template_body?: string
          template_subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          fee: number
          id: string
          interest: number
          invoice_id: string
          level: Database["public"]["Enums"]["reminder_level"]
          pdf_url: string | null
          sent_at: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          fee?: number
          id?: string
          interest?: number
          invoice_id: string
          level: Database["public"]["Enums"]["reminder_level"]
          pdf_url?: string | null
          sent_at?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          fee?: number
          id?: string
          interest?: number
          invoice_id?: string
          level?: Database["public"]["Enums"]["reminder_level"]
          pdf_url?: string | null
          sent_at?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      role_translations: {
        Row: {
          created_at: string | null
          department: string | null
          display_name: string
          id: string
          role_name: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          display_name: string
          id?: string
          role_name: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          display_name?: string
          id?: string
          role_name?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      roles_permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_statistics: {
        Row: {
          created_at: string | null
          date: string | null
          deal_count: number | null
          id: string
          project_type: Database["public"]["Enums"]["project_type"] | null
          sales_rep_id: string | null
          sales_rep_name: string | null
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          deal_count?: number | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"] | null
          sales_rep_id?: string | null
          sales_rep_name?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          deal_count?: number | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"] | null
          sales_rep_id?: string | null
          sales_rep_name?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_statistics_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_territories: {
        Row: {
          center_lat: number | null
          center_lng: number | null
          created_at: string | null
          geometry: Json | null
          id: string
          name: string
          postal_code_ranges: Json
          radius: number | null
          updated_at: string | null
        }
        Insert: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          geometry?: Json | null
          id?: string
          name: string
          postal_code_ranges: Json
          radius?: number | null
          updated_at?: string | null
        }
        Update: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          geometry?: Json | null
          id?: string
          name?: string
          postal_code_ranges?: Json
          radius?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_territory_assignments: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          is_primary: boolean | null
          territory_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_primary?: boolean | null
          territory_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_primary?: boolean | null
          territory_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_territory_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_territory_assignments_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "sales_territories"
            referencedColumns: ["id"]
          },
        ]
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
          average_purchase_price: number | null
          category: string
          created_at: string | null
          datasheet_url: string | null
          ean: string | null
          id: string
          image_url: string | null
          name: string
          notes: string | null
          price: number
          specs: Json
          stock: number | null
          supplier: string | null
          updated_at: string | null
        }
        Insert: {
          average_purchase_price?: number | null
          category: string
          created_at?: string | null
          datasheet_url?: string | null
          ean?: string | null
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          price: number
          specs: Json
          stock?: number | null
          supplier?: string | null
          updated_at?: string | null
        }
        Update: {
          average_purchase_price?: number | null
          category?: string
          created_at?: string | null
          datasheet_url?: string | null
          ean?: string | null
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          price?: number
          specs?: Json
          stock?: number | null
          supplier?: string | null
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
      stage_templates: {
        Row: {
          created_at: string | null
          default_duration: unknown | null
          description: string | null
          id: string
          name: string
          order_number: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_duration?: unknown | null
          description?: string | null
          id?: string
          name: string
          order_number: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_duration?: unknown | null
          description?: string | null
          id?: string
          name?: string
          order_number?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      stages: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          deal_id: string | null
          end_time: string | null
          expected_duration: unknown | null
          id: string
          name: string
          start_time: string | null
          status: Database["public"]["Enums"]["stage_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          deal_id?: string | null
          end_time?: string | null
          expected_duration?: unknown | null
          id?: string
          name: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["stage_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          deal_id?: string | null
          end_time?: string | null
          expected_duration?: unknown | null
          id?: string
          name?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["stage_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stages_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractor_assignments: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          subcontractor_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          subcontractor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          subcontractor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcontractor_assignments_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractor_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractor_companies: {
        Row: {
          address: string | null
          company_number: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_number?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_number?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_documents: {
        Row: {
          amount: number | null
          created_at: string | null
          document_number: string | null
          due_date: string | null
          file_path: string | null
          id: string
          paid_date: string | null
          status: string | null
          supplier_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          document_number?: string | null
          due_date?: string | null
          file_path?: string | null
          id?: string
          paid_date?: string | null
          status?: string | null
          supplier_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          document_number?: string | null
          due_date?: string | null
          file_path?: string | null
          id?: string
          paid_date?: string | null
          status?: string | null
          supplier_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company_number: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_terms: number | null
          phone: string | null
          status: string | null
          tax_number: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_number?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          status?: string | null
          tax_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_number?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          status?: string | null
          tax_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      task_types: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          document_name: string | null
          document_url: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          type_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "task_types"
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
      territory_assignments: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          territory_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          territory_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          territory_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "territory_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_assignments_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "sales_territories"
            referencedColumns: ["id"]
          },
        ]
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
      tracking_pixels: {
        Row: {
          conversion_label: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          pixel_id: string
          platform: string
          updated_at: string | null
        }
        Insert: {
          conversion_label?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pixel_id: string
          platform: string
          updated_at?: string | null
        }
        Update: {
          conversion_label?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pixel_id?: string
          platform?: string
          updated_at?: string | null
        }
        Relationships: []
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
      workflow_conditions: {
        Row: {
          created_at: string | null
          field: string
          id: string
          next_step_id: string | null
          operator: string
          step_id: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          field: string
          id?: string
          next_step_id?: string | null
          operator: string
          step_id?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          field?: string
          id?: string
          next_step_id?: string | null
          operator?: string
          step_id?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_conditions_next_step_id_fkey"
            columns: ["next_step_id"]
            isOneToOne: false
            referencedRelation: "workflow_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_conditions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "workflow_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          name: string
          next_step_id: string | null
          position: number
          type: string
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          name: string
          next_step_id?: string | null
          position: number
          type: string
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          name?: string
          next_step_id?: string | null
          position?: number
          type?: string
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_next_step_id_fkey"
            columns: ["next_step_id"]
            isOneToOne: false
            referencedRelation: "workflow_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_participant_view: {
        Row: {
          device_fingerprint: string | null
          name: string | null
          registered_at: string | null
          total_points: number | null
        }
        Relationships: []
      }
      dashboard_kpis: {
        Row: {
          new_leads: number | null
          total_affiliates: number | null
          total_customers: number | null
          total_leads: number | null
          total_projects: number | null
        }
        Relationships: []
      }
      lead_sources_stats: {
        Row: {
          count: number | null
          month: string | null
          source: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_employee_xp: {
        Args: {
          p_employee_id: string
          p_xp_amount: number
        }
        Returns: undefined
      }
      calculate_commission: {
        Args: {
          purchase_amount: number
          commission_percentage: number
        }
        Returns: number
      }
      cleanup_inactive_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_employee: {
        Args: {
          p_profile_id: string
          p_personio_id: string
          p_first_name: string
          p_last_name: string
          p_email: string
          p_role: string
        }
        Returns: undefined
      }
      generate_daily_quests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_daily_quests_scheduled: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_next_available_employee: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_simulated_employee: {
        Args: {
          user_id: string
          employee_id: string
        }
        Returns: undefined
      }
      set_simulated_role: {
        Args: {
          user_id: string
          new_role: string
        }
        Returns: undefined
      }
      update_sales_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      challenge_type:
        | "solar_sales"
        | "heatpump_sales"
        | "battery_sales"
        | "total_sales"
        | "sales_value"
      deal_addon:
        | "maintenance_contract"
        | "wallbox"
        | "optimizer"
        | "energy_management"
        | "infrared_heating"
        | "pv_cleaning"
      deal_document_type:
        | "contract"
        | "site_photos"
        | "roof_plan"
        | "electrical_plan"
        | "customer_id"
        | "property_documents"
        | "string_plan"
      deal_payment_type: "purchase" | "zero_cost" | "flexx"
      deal_status:
        | "new"
        | "onsite_meeting"
        | "closing_meeting"
        | "contract_negotiation"
        | "won"
        | "lost"
      document_category:
        | "power_of_attorney"
        | "contract"
        | "technical"
        | "permit"
        | "general"
      installation_order_status:
        | "planned"
        | "in_progress"
        | "completed"
        | "cancelled"
      installation_team_type:
        | "roof_installation"
        | "electrical"
        | "heat_pump"
        | "commissioning"
      invoice_status: "open" | "partially_paid" | "paid"
      landing_page_section_type:
        | "hero"
        | "features"
        | "benefits"
        | "testimonials"
        | "cta"
        | "faq"
        | "contact"
      lead_status:
        | "new"
        | "contacted"
        | "create_offer"
        | "phone_consultation"
        | "rejected"
        | "phone_scheduled"
        | "phone_completed"
        | "onsite_scheduled"
        | "deal_created"
        | "offer_created"
        | "contract_negotiation"
        | "closing_scheduled"
        | "won"
        | "lost"
      lead_status_category:
        | "initial"
        | "contact"
        | "meeting"
        | "offer"
        | "closing"
      meeting_type:
        | "phone_call"
        | "onsite_consultation"
        | "online_meeting"
        | "follow_up"
      project_phase:
        | "order_confirmation"
        | "power_of_attorney"
        | "grid_application"
        | "installation_planning"
        | "installation_execution"
        | "invoicing"
        | "market_master_data"
        | "accounting_handover"
        | "completed"
      project_role:
        | "project_manager"
        | "project_coordinator"
        | "project_processor"
      project_type:
        | "private_house"
        | "apartment_building"
        | "commercial"
        | "open_space"
        | "large_battery"
        | "heat_pump"
        | "agricultural"
      quest_type: "sales" | "training" | "social" | "referral"
      reminder_level: "first" | "second" | "final" | "legal"
      stage_status: "not_started" | "in_progress" | "completed"
      user_permission:
        | "customer_access"
        | "employee_access"
        | "admin_access"
        | "leads_management"
        | "customer_management"
        | "project_management"
        | "inventory_management"
        | "financial_access"
        | "employee_management"
        | "reporting"
      user_role:
        | "customer"
        | "sales_employee"
        | "external_sales"
        | "customer_service"
        | "planning"
        | "accountant"
        | "construction_manager"
        | "installation_manager"
        | "installer"
        | "executive"
        | "admin"
        | "sales_team_leader"
        | "sales_director"
        | "internal_sales"
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
