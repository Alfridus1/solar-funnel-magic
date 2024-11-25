import type { Json } from './base';
import type { Database } from './base';
import type { BaseTables } from './tables/base-tables';
import type { ProductTables } from './tables/product-tables';
import type { ProfileTables } from './tables/profile-tables';
import type { TaskTables } from './tables/task-tables';
import type { EmployeeTables } from './tables/employee-tables';
import type { ProjectTables } from './tables/project-tables';
import type { InventoryTables } from './tables/inventory-tables';
import type { UserPermission } from '@/types/permissions';

export interface Tables extends 
  BaseTables, 
  ProductTables, 
  ProfileTables, 
  TaskTables,
  EmployeeTables,
  ProjectTables,
  InventoryTables {
  affiliates: {
    Row: {
      created_at: string | null;
      email: string;
      first_name: string;
      id: string;
      last_name: string;
      referral_code: string | null;
      referral_count: number | null;
      total_leads: number | null;
      updated_at: string | null;
      user_id: string | null;
    };
    Insert: {
      created_at?: string | null;
      email: string;
      first_name: string;
      id?: string;
      last_name: string;
      referral_code?: string | null;
      referral_count?: number | null;
      total_leads?: number | null;
      updated_at?: string | null;
      user_id?: string | null;
    };
    Update: {
      created_at?: string | null;
      email?: string;
      first_name?: string;
      id?: string;
      last_name?: string;
      referral_code?: string | null;
      referral_count?: number | null;
      total_leads?: number | null;
      updated_at?: string | null;
      user_id?: string | null;
    };
    Relationships: [];
  };
  api_documentation: {
    Row: {
      created_at: string | null;
      file_path: string;
      filename: string;
      id: string;
      updated_at: string | null;
      version: string;
    };
    Insert: {
      created_at?: string | null;
      file_path: string;
      filename: string;
      id?: string;
      updated_at?: string | null;
      version: string;
    };
    Update: {
      created_at?: string | null;
      file_path?: string;
      filename?: string;
      id?: string;
      updated_at?: string | null;
      version?: string;
    };
    Relationships: [];
  };
  company_settings: {
    Row: {
      address: string | null;
      affiliate_bonus: number | null;
      bank_details: string | null;
      company_name: string;
      created_at: string | null;
      default_commission_percentage: number | null;
      id: string;
      letterhead_url: string | null;
      tax_number: string | null;
      updated_at: string | null;
    };
    Insert: {
      address?: string | null;
      affiliate_bonus?: number | null;
      bank_details?: string | null;
      company_name: string;
      created_at?: string | null;
      default_commission_percentage?: number | null;
      id: string;
      letterhead_url?: string | null;
      tax_number?: string | null;
      updated_at?: string | null;
    };
    Update: {
      address?: string | null;
      affiliate_bonus?: number | null;
      bank_details?: string | null;
      company_name?: string;
      created_at?: string | null;
      default_commission_percentage?: number | null;
      id: string;
      letterhead_url?: string | null;
      tax_number?: string | null;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  customers: {
    Row: {
      city: string;
      company_name: string | null;
      created_at: string | null;
      email: string;
      first_name: string;
      house_number: string;
      id: string;
      last_name: string;
      notes: string | null;
      phone: string | null;
      postal_code: string;
      street: string;
      updated_at: string | null;
    };
    Insert: {
      city: string;
      company_name?: string | null;
      created_at?: string | null;
      email: string;
      first_name: string;
      house_number: string;
      id?: string;
      last_name: string;
      notes?: string | null;
      phone?: string;
      postal_code: string;
      street: string;
      updated_at?: string | null;
    };
    Update: {
      city?: string;
      company_name?: string | null;
      created_at?: string | null;
      email: string;
      first_name: string;
      house_number?: string;
      id?: string;
      last_name?: string;
      notes?: string | null;
      phone?: string;
      postal_code?: string;
      street?: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  employee_devices: {
    Row: {
      created_at: string | null;
      device_name: string;
      device_type: string;
      employee_id: string | null;
      id: string;
      issued_date: string | null;
      notes: string | null;
      return_date: string | null;
      serial_number: string | null;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      device_name: string;
      device_type: string;
      employee_id?: string | null;
      id?: string;
      issued_date?: string | null;
      notes?: string | null;
      return_date?: string | null;
      serial_number?: string | null;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      device_name?: string;
      device_type?: string;
      employee_id?: string | null;
      id?: string;
      issued_date?: string | null;
      notes?: string | null;
      return_date?: string | null;
      serial_number?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "employee_devices_employee_id_fkey";
        columns: ["employee_id"];
        isOneToOne: false;
        referencedRelation: "employees";
        referencedColumns: ["id"];
      }
    ];
  };
  employee_permissions: {
    Row: {
      created_at: string | null;
      employee_id: string | null;
      id: string;
      permissions: Json;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      employee_id?: string | null;
      id?: string;
      permissions?: Json;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      employee_id?: string | null;
      id?: string;
      permissions?: Json;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "employee_permissions_employee_id_fkey";
        columns: ["employee_id"];
        isOneToOne: true;
        referencedRelation: "employees";
        referencedColumns: ["id"];
      }
    ];
  };
  employees: {
    Row: {
      address: string | null;
      base_salary: number | null;
      commission_enabled: boolean | null;
      created_at: string | null;
      email: string;
      first_name: string;
      has_company_car: boolean | null;
      hours_per_month: number | null;
      iban: string | null;
      id: string;
      last_name: string;
      location: string | null;
      personio_id: string | null;
      profile_id: string | null;
      role: string;
      team_id: string | null;
      updated_at: string | null;
      vacation_days: number | null;
      ms_calendar_connected: boolean | null;
      ms_refresh_token: string | null;
      ms_calendar_id: string | null;
    };
    Insert: {
      address?: string | null;
      base_salary?: number | null;
      commission_enabled?: boolean | null;
      created_at?: string | null;
      email: string;
      first_name: string;
      has_company_car?: boolean | null;
      hours_per_month?: number | null;
      iban?: string | null;
      id?: string;
      last_name: string;
      location?: string | null;
      personio_id?: string | null;
      profile_id?: string | null;
      role: string;
      team_id?: string | null;
      updated_at?: string | null;
      vacation_days?: number | null;
      ms_calendar_connected?: boolean | null;
      ms_refresh_token?: string | null;
      ms_calendar_id?: string | null;
    };
    Update: {
      address?: string | null;
      base_salary?: number | null;
      commission_enabled?: boolean | null;
      created_at?: string | null;
      email?: string;
      first_name?: string;
      has_company_car?: boolean | null;
      hours_per_month?: number | null;
      iban?: string | null;
      id?: string;
      last_name?: string;
      location?: string | null;
      personio_id?: string | null;
      profile_id?: string | null;
      role?: string;
      team_id?: string | null;
      updated_at?: string | null;
      vacation_days?: number | null;
      ms_calendar_connected?: boolean | null;
      ms_refresh_token?: string | null;
      ms_calendar_id?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "employees_profile_id_fkey";
        columns: ["profile_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "employees_team_id_fkey";
        columns: ["team_id"];
        isOneToOne: false;
        referencedRelation: "teams";
        referencedColumns: ["id"];
      }
    ];
  };
  faqs: {
    Row: {
      answer: string;
      created_at: string | null;
      id: string;
      order_number: number;
      question: string;
      updated_at: string | null;
    };
    Insert: {
      answer: string;
      created_at?: string | null;
      id?: string;
      order_number: number;
      question: string;
      updated_at?: string | null;
    };
    Update: {
      answer?: string;
      created_at?: string | null;
      id?: string;
      order_number?: number;
      question?: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  inventory: {
    Row: {
      id: string;
      warehouse_id: string | null;
      product_id: string | null;
      quantity: number;
      minimum_quantity: number;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      warehouse_id?: string | null;
      product_id?: string | null;
      quantity: number;
      minimum_quantity: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      warehouse_id?: string | null;
      product_id?: string | null;
      quantity?: number;
      minimum_quantity?: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "inventory_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "solar_products";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "inventory_warehouse_id_fkey";
        columns: ["warehouse_id"];
        isOneToOne: false;
        referencedRelation: "warehouses";
        referencedColumns: ["id"];
      }
    ];
  };
  leads: {
    Row: {
      address: string | null;
      affiliate_id: string | null;
      calculation_id: string | null;
      calculation_url: string | null;
      created_at: string | null;
      deleted_at: string | null;
      email: string;
      id: string;
      metrics: Json | null;
      name: string;
      notes: string | null;
      phone: string;
      source: string | null;
      status: string | null;
      type: string;
      updated_at: string | null;
      user_id: string | null;
    };
    Insert: {
      address?: string | null;
      affiliate_id?: string | null;
      calculation_id?: string | null;
      calculation_url?: string | null;
      created_at?: string | null;
      deleted_at?: string | null;
      email: string;
      id?: string;
      metrics?: Json | null;
      name: string;
      notes?: string | null;
      phone: string;
      source?: string | null;
      status?: string | null;
      type: string;
      updated_at?: string | null;
      user_id?: string | null;
    };
    Update: {
      address?: string | null;
      affiliate_id?: string | null;
      calculation_id?: string | null;
      calculation_url?: string | null;
      created_at?: string | null;
      deleted_at?: string | null;
      email: string;
      id?: string;
      metrics?: Json | null;
      name: string;
      notes?: string | null;
      phone: string;
      source?: string | null;
      status?: string | null;
      type?: string;
      updated_at?: string | null;
      user_id?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "leads_affiliate_id_fkey";
        columns: ["affiliate_id"];
        isOneToOne: false;
        referencedRelation: "affiliates";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "leads_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      }
    ];
  };
  opensolar_installations: {
    Row: {
      contract_value: number;
      created_at: string | null;
      customer_name: string;
      estimated_production: number;
      id: string;
      opensolar_id: string;
      sale_date: string;
      status: string;
      system_size: number;
      updated_at: string | null;
    };
    Insert: {
      contract_value: number;
      created_at?: string | null;
      customer_name: string;
      estimated_production: number;
      id?: string;
      opensolar_id: string;
      sale_date: string;
      status: string;
      system_size: number;
      updated_at?: string | null;
    };
    Update: {
      contract_value?: number;
      created_at?: string | null;
      customer_name?: string;
      estimated_production?: number;
      id?: string;
      opensolar_id?: string;
      sale_date?: string;
      status?: string;
      system_size?: number;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  opensolar_projects: {
    Row: {
      address: string;
      annual_usage: number;
      created_at: string | null;
      created_date: string;
      id: string;
      lat: number | null;
      lon: number | null;
      modified_date: string;
      opensolar_id: string;
      project_sold: boolean | null;
      stage: number;
      system_details: Json | null;
      system_id: string | null;
      title: string;
      updated_at: string | null;
    };
    Insert: {
      address: string;
      annual_usage: number;
      created_at?: string | null;
      created_date: string;
      id?: string;
      lat?: number | null;
      lon?: number | null;
      modified_date: string;
      opensolar_id: string;
      project_sold?: boolean | null;
      stage: number;
      system_details?: Json | null;
      system_id?: string | null;
      title: string;
      updated_at?: string | null;
    };
    Update: {
      address?: string;
      annual_usage?: number;
      created_at?: string | null;
      created_date?: string;
      id?: string;
      lat?: number | null;
      lon?: number | null;
      modified_date?: string;
      opensolar_id?: string;
      project_sold?: boolean | null;
      stage: number;
      system_details?: Json | null;
      system_id?: string | null;
      title?: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  premium_products: {
    Row: {
      climate_impact: string;
      created_at: string | null;
      description: string;
      features: string[];
      id: string;
      image_url: string;
      inclusion_type: string;
      name: string;
      order_number: number;
      purchase_options: Json | null;
      updated_at: string | null;
    };
    Insert: {
      climate_impact: string;
      created_at?: string | null;
      description: string;
      features?: string[];
      id?: string;
      image_url: string;
      inclusion_type?: string;
      name: string;
      order_number: number;
      purchase_options?: Json | null;
      updated_at?: string | null;
    };
    Update: {
      climate_impact?: string;
      created_at?: string | null;
      description?: string | null;
      features?: string[];
      id?: string;
      image_url?: string;
      inclusion_type?: string;
      name?: string;
      order_number?: number;
      purchase_options?: Json | null;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  price_settings: {
    Row: {
      created_at: string | null;
      id: string;
      price_per_kwp_max: number;
      price_per_kwp_min: number;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      price_per_kwp_max?: number;
      price_per_kwp_min?: number;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      price_per_kwp_max?: number;
      price_per_kwp_min?: number;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  product_categories: {
    Row: {
      created_at: string | null;
      id: string;
      name: string;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      name: string;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      name: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  product_specifications: {
    Row: {
      created_at: string | null;
      id: string;
      product_id: string | null;
      template_id: string | null;
      updated_at: string | null;
      value: string;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      product_id?: string | null;
      template_id?: string | null;
      updated_at?: string | null;
      value: string;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      product_id?: string | null;
      template_id?: string | null;
      updated_at?: string | null;
      value?: string;
    };
    Relationships: [
      {
        foreignKeyName: "product_specifications_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "solar_products";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "product_specifications_template_id_fkey";
        columns: ["template_id"];
        isOneToOne: false;
        referencedRelation: "specification_templates";
        referencedColumns: ["id"];
      }
    ];
  };
  profiles: {
    Row: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      created_at: string | null;
      updated_at: string | null;
      role: Database["public"]["Enums"]["user_role"] | null;
      street: string | null;
      house_number: string | null;
      postal_code: string | null;
      city: string | null;
      annual_consumption: number | null;
      permissions: UserPermission[] | null;
      simulated_employee_id: string | null;
      simulated_role: string | null;
    };
    Insert: {
      id?: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      created_at?: string | null;
      updated_at?: string | null;
      role?: Database["public"]["Enums"]["user_role"] | null;
      street?: string | null;
      house_number?: string | null;
      postal_code?: string | null;
      city?: string | null;
      annual_consumption?: number | null;
      permissions?: UserPermission[] | null;
      simulated_employee_id?: string | null;
      simulated_role?: string | null;
    };
    Update: {
      id?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      created_at?: string | null;
      updated_at?: string | null;
      role?: Database["public"]["Enums"]["user_role"] | null;
      street?: string | null;
      house_number?: string | null;
      postal_code?: string | null;
      city?: string | null;
      annual_consumption?: number | null;
      permissions?: UserPermission[] | null;
      simulated_employee_id?: string | null;
      simulated_role?: string | null;
    };
    Relationships: [];
  };
  project_documentation: {
    Row: {
      created_at: string | null;
      file_path: string;
      id: string;
      notes: string | null;
      project_id: string | null;
      type: string;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      file_path: string;
      id?: string;
      notes?: string | null;
      project_id?: string | null;
      type: string;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      file_path?: string;
      id?: string;
      notes?: string | null;
      project_id?: string | null;
      type?: string;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "project_documentation_project_id_fkey";
        columns: ["project_id"];
        isOneToOne: false;
        referencedRelation: "projects";
        referencedColumns: ["id"];
      }
    ];
  };
  project_notes: {
    Row: {
      content: string;
      created_at: string | null;
      created_by: string;
      id: string;
      project_id: string;
      updated_at: string | null;
    };
    Insert: {
      content: string;
      created_at?: string | null;
      created_by: string;
      id: string;
      project_id: string;
      updated_at?: string | null;
    };
    Update: {
      content?: string;
      created_at?: string | null;
      created_by?: string;
      id?: string;
      project_id: string;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "project_notes_project_id_fkey";
        columns: ["project_id"];
        isOneToOne: false;
        referencedRelation: "projects";
        referencedColumns: ["id"];
      }
    ];
  };
  projects: {
    Row: {
      address: string;
      completion_date: string | null;
      created_at: string | null;
      customer_email: string | null;
      customer_id: string | null;
      customer_name: string;
      customer_phone: string | null;
      estimated_completion_date: string | null;
      id: string;
      project_type: string;
      site_conditions: string | null;
      special_requirements: string | null;
      start_date: string | null;
      status: string;
      subtype: string | null;
      system_size: number | null;
      team_id: string | null;
      title: string;
      updated_at: string | null;
    };
    Insert: {
      address: string;
      completion_date?: string | null;
      created_at?: string | null;
      customer_email?: string | null;
      customer_id?: string | null;
      customer_name: string;
      customer_phone?: string | null;
      estimated_completion_date?: string | null;
      id?: string;
      project_type: string;
      site_conditions?: string | null;
      special_requirements?: string | null;
      start_date?: string | null;
      status: string;
      subtype?: string | null;
      system_size?: number | null;
      team_id?: string | null;
      title: string;
      updated_at?: string | null;
    };
    Update: {
      address?: string;
      completion_date?: string | null;
      created_at?: string | null;
      customer_email?: string | null;
      customer_id?: string | null;
      customer_name?: string;
      customer_phone?: string | null;
      estimated_completion_date?: string | null;
      id?: string;
      project_type?: string;
      site_conditions?: string | null;
      special_requirements?: string | null;
      start_date?: string | null;
      status?: string;
      subtype?: string | null;
      system_size?: number | null;
      team_id?: string | null;
      title?: string;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "projects_customer_id_fkey";
        columns: ["customer_id"];
        isOneToOne: false;
        referencedRelation: "customers";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "projects_team_id_fkey";
        columns: ["team_id"];
        isOneToOne: false;
        referencedRelation: "teams";
        referencedColumns: ["id"];
      }
    ];
  };
  purchase_order_items: {
    Row: {
      created_at: string | null;
      id: string;
      product_id: string | null;
      purchase_order_id: string | null;
      quantity: number;
      unit_price: number;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      product_id?: string | null;
      purchase_order_id?: string | null;
      quantity: number;
      unit_price: number;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      product_id?: string | null;
      purchase_order_id?: string | null;
      quantity?: number;
      unit_price: number;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "purchase_order_items_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "solar_products";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "purchase_order_items_purchase_order_id_fkey";
        columns: ["purchase_order_id"];
        isOneToOne: false;
        referencedRelation: "purchase_orders";
        referencedColumns: ["id"];
      }
    ];
  };
  purchase_orders: {
    Row: {
      created_at: string | null;
      expected_delivery_date: string | null;
      id: string;
      order_date: string;
      status: string;
      supplier_name: string;
      total_amount: number;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      expected_delivery_date?: string | null;
      id?: string;
      order_date: string;
      status: string;
      supplier_name: string;
      total_amount: number;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      expected_delivery_date?: string | null;
      id?: string;
      order_date?: string;
      status?: string;
      supplier_name?: string;
      total_amount?: number;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  quote_items: {
    Row: {
      created_at: string | null;
      discount_percentage: number | null;
      id: string;
      product_id: string | null;
      quantity: number;
      quote_id: string | null;
      unit_price: number;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      discount_percentage?: number | null;
      id?: string;
      product_id?: string | null;
      quantity: number;
      quote_id?: string | null;
      unit_price: number;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      discount_percentage?: number | null;
      id?: string;
      product_id?: string | null;
      quantity?: number;
      quote_id?: string | null;
      unit_price: number;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "quote_items_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "solar_products";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "quote_items_quote_id_fkey";
        columns: ["quote_id"];
        isOneToOne: false;
        referencedRelation: "quotes";
        referencedColumns: ["id"];
      }
    ];
  };
  quotes: {
    Row: {
      created_at: string | null;
      customer_id: string | null;
      id: string;
      notes: string | null;
      project_id: string | null;
      status: string;
      total_amount: number;
      updated_at: string | null;
      valid_until: string | null;
    };
    Insert: {
      created_at?: string | null;
      customer_id?: string | null;
      id?: string;
      notes?: string | null;
      project_id?: string | null;
      status?: string;
      total_amount?: number;
      updated_at?: string | null;
      valid_until?: string | null;
    };
    Update: {
      created_at?: string | null;
      customer_id?: string | null;
      id?: string;
      notes?: string | null;
      project_id?: string | null;
      status?: string;
      total_amount?: number;
      updated_at?: string | null;
      valid_until?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "quotes_customer_id_fkey";
        columns: ["customer_id"];
        isOneToOne: false;
        referencedRelation: "customers";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "quotes_project_id_fkey";
        columns: ["project_id"];
        isOneToOne: false;
        referencedRelation: "projects";
        referencedColumns: ["id"];
      }
    ];
  };
  roles_permissions: {
    Row: {
      created_at: string | null;
      description: string | null;
      id: string;
      role: Database["public"]["Enums"]["user_role"];
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      description?: string | null;
      id: string;
      role: Database["public"]["Enums"]["user_role"];
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      description?: string | null;
      id?: string;
      role: Database["public"]["Enums"]["user_role"];
      updated_at?: string | null;
    };
    Relationships: [];
  };
  smart_m_config: {
    Row: {
      api_url: string;
      client_id: string;
      client_secret: string;
      created_at: string | null;
      id: number;
      redirect_uri: string;
      updated_at: string | null;
    };
    Insert: {
      api_url?: string;
      client_id: string;
      client_secret: string;
      created_at?: string | null;
      id?: number;
      redirect_uri: string;
      updated_at?: string | null;
    };
    Update: {
      api_url?: string;
      client_id?: string;
      client_secret?: string;
      created_at?: string | null;
      id?: number;
      redirect_uri?: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  solar_products: {
    Row: {
      category: string;
      created_at: string | null;
      datasheet_url: string | null;
      id: string;
      name: string;
      price: number;
      specs: Json;
      updated_at: string | null;
    };
    Insert: {
      category: string;
      created_at?: string | null;
      datasheet_url?: string | null;
      id?: string;
      name: string;
      price: number;
      specs: Json;
      updated_at?: string | null;
    };
    Update: {
      category?: string;
      created_at?: string | null;
      datasheet_url?: string | null;
      id?: string;
      name?: string;
      price?: number;
      specs?: Json;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  specification_templates: {
    Row: {
      category_id: string | null;
      created_at: string | null;
      id: string;
      name: string;
      options: Json | null;
      type: string;
      unit: string | null;
      updated_at: string | null;
    };
    Insert: {
      category_id?: string | null;
      created_at?: string | null;
      id?: string;
      name: string;
      options?: Json | null;
      type: string;
      unit?: string | null;
      updated_at?: string | null;
    };
    Update: {
      category_id?: string | null;
      created_at?: string | null;
      id?: string;
      name: string;
      options?: Json | null;
      type: string;
      unit?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "specification_templates_category_id_fkey";
        columns: ["category_id"];
        isOneToOne: false;
        referencedRelation: "product_categories";
        referencedColumns: ["id"];
      }
    ];
  };
  teams: {
    Row: {
      created_at: string | null;
      id: string;
      name: string;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      name: string;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      name: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  testimonials: {
    Row: {
      created_at: string | null;
      id: string;
      name: string;
      rating: number;
      role: string;
      text: string;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      name: string;
      rating: number;
      role: string;
      text: string;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      name?: string;
      rating?: number;
      role?: string;
      text?: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  time_tracking: {
    Row: {
      created_at: string | null;
      date: string;
      end_time: string;
      id: string;
      notes: string | null;
      project_id: string | null;
      start_time: string;
      team_id: string | null;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      date: string;
      end_time: string;
      id?: string;
      notes?: string | null;
      project_id?: string | null;
      start_time: string;
      team_id?: string | null;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      date?: string;
      end_time?: string;
      id?: string;
      notes?: string | null;
      project_id?: string | null;
      start_time?: string;
      team_id?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "time_tracking_project_id_fkey";
        columns: ["project_id"];
        isOneToOne: false;
        referencedRelation: "projects";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "time_tracking_team_id_fkey";
        columns: ["team_id"];
        isOneToOne: false;
        referencedRelation: "teams";
        referencedColumns: ["id"];
      }
    ];
  };
  tracking_pixels: {
    Row: {
      conversion_label: string | null;
      created_at: string | null;
      id: string;
      is_active: boolean | null;
      pixel_id: string;
      platform: string;
      updated_at: string | null;
    };
    Insert: {
      conversion_label?: string | null;
      created_at?: string | null;
      id?: string;
      is_active?: boolean | null;
      pixel_id: string;
      platform: string;
      updated_at?: string | null;
    };
    Update: {
      conversion_label?: string | null;
      created_at?: string | null;
      id?: string;
      is_active?: boolean | null;
      pixel_id: string;
      platform?: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
  warehouses: {
    Row: {
      created_at: string | null;
      id: string;
      location: string;
      name: string;
      type: string;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      location: string;
      name: string;
      type: string;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      location: string;
      name: string;
      type: string;
      updated_at?: string | null;
    };
    Relationships: [];
  };
}
