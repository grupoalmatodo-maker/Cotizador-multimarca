// types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Tabla de perfiles de usuario
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "compras" | "ventas";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "admin" | "compras" | "ventas";
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          email: string;
          role: "admin" | "compras" | "ventas";
          created_at: string;
        }>;
      };

      // Tabla de proveedores
      suppliers: {
        Row: {
          id: number;
          name: string;
          contact: string | null;
          brand: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          contact?: string | null;
          brand?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          name: string;
          contact: string | null;
          brand: string | null;
          is_active: boolean;
          created_at: string;
        }>;
      };

      // Tabla de productos
      products: {
        Row: {
          id: number;
          sku: string;
          name: string;
          brand: string | null;
          unit: string | null;
          category: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          sku: string;
          name: string;
          brand?: string | null;
          unit?: string | null;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          sku: string;
          name: string;
          brand: string | null;
          unit: string | null;
          category: string | null;
          is_active: boolean;
          created_at: string;
        }>;
      };

      // Tabla de listas de precios
      price_lists: {
        Row: {
          id: number;
          supplier_id: number;
          file_url: string | null;
          uploaded_by: string;
          uploaded_at: string;
          status: string;
        };
        Insert: {
          id?: number;
          supplier_id: number;
          file_url?: string | null;
          uploaded_by: string;
          uploaded_at?: string;
          status?: string;
        };
        Update: Partial<{
          id: number;
          supplier_id: number;
          file_url: string | null;
          uploaded_by: string;
          uploaded_at: string;
          status: string;
        }>;
      };

      // Tabla de precios de compra
      purchase_prices: {
        Row: {
          id: number;
          product_id: number;
          supplier_id: number;
          cost: number;
          currency: string;
          source_list_id: number | null;
          valid_from: string;
          valid_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          supplier_id: number;
          cost: number;
          currency?: string;
          source_list_id?: number | null;
          valid_from?: string;
          valid_to?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          product_id: number;
          supplier_id: number;
          cost: number;
          currency: string;
          source_list_id: number | null;
          valid_from: string;
          valid_to: string | null;
          created_at: string;
        }>;
      };

      // Tabla de reglas de margen
      margin_rules: {
        Row: {
          id: number;
          brand: string;
          zone: string;
          volume_min: number;
          volume_max: number;
          base_margin_percent: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          brand: string;
          zone: string;
          volume_min: number;
          volume_max: number;
          base_margin_percent: number;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          brand: string;
          zone: string;
          volume_min: number;
          volume_max: number;
          base_margin_percent: number;
          created_at: string;
        }>;
      };

      // Tabla de reglas de comisión
      commission_rules: {
        Row: {
          id: number;
          seller_email: string;
          role: string;
          percent: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          seller_email: string;
          role: string;
          percent: number;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          seller_email: string;
          role: string;
          percent: number;
          created_at: string;
        }>;
      };

      // Tabla de cotizaciones
      quotes: {
        Row: {
          id: number;
          seller_id: string;
          customer_name: string;
          brand: string;
          zone: string;
          volume: number;
          subtotal: number;
          iva: number;
          total: number;
          commission_amount: number;
          utility_amount: number;
          status: "draft" | "sent" | "won" | "lost";
          lost_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          seller_id: string;
          customer_name: string;
          brand: string;
          zone: string;
          volume: number;
          subtotal: number;
          iva: number;
          total: number;
          commission_amount: number;
          utility_amount: number;
          status?: "draft" | "sent" | "won" | "lost";
          lost_reason?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          seller_id: string;
          customer_name: string;
          brand: string;
          zone: string;
          volume: number;
          subtotal: number;
          iva: number;
          total: number;
          commission_amount: number;
          utility_amount: number;
          status: "draft" | "sent" | "won" | "lost";
          lost_reason: string | null;
          created_at: string;
        }>;
      };

      // Tabla de items de cotización
      quote_items: {
        Row: {
          id: number;
          quote_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          quote_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
          line_total: number;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          quote_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
          line_total: number;
          created_at: string;
        }>;
      };

      // Tabla de feedback
      feedback: {
        Row: {
          id: number;
          quote_id: number;
          reason: string;
          comment: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          quote_id: number;
          reason: string;
          comment?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<{
          id: number;
          quote_id: number;
          reason: string;
          comment: string | null;
          created_by: string;
          created_at: string;
        }>;
      };
    };

    Views: {
      v_quotes_sales: {
        Row: {
          id: number;
          seller_id: string;
          customer_name: string;
          brand: string;
          zone: string;
          volume: number;
          subtotal: number;
          iva: number;
          total: number;
          commission_amount: number;
          utility_amount: number;
          status: string;
          created_at: string;
        };
      };
      v_purchase_prices_secure: {
        Row: {
          id: number;
          product_id: number;
          supplier_id: number;
          cost: number;
          currency: string;
          valid_from: string;
          valid_to: string | null;
        };
      };
    };

    Functions: Record<string, never>;

    Enums: {
      user_role: "admin" | "compras" | "ventas";
      quote_status: "draft" | "sent" | "won" | "lost";
    };
  };
}
