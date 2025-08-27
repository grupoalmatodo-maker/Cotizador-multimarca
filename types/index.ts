// types/index.ts
import type { Database } from "./database";

// Tipos de las tablas principales
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Quote = Database["public"]["Tables"]["quotes"]["Row"];
export type QuoteItem = Database["public"]["Tables"]["quote_items"]["Row"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
export type PriceList = Database["public"]["Tables"]["price_lists"]["Row"];
export type PurchasePrice =
  Database["public"]["Tables"]["purchase_prices"]["Row"];
export type MarginRule = Database["public"]["Tables"]["margin_rules"]["Row"];
export type CommissionRule =
  Database["public"]["Tables"]["commission_rules"]["Row"];

// Tipos para inserción
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type SupplierInsert =
  Database["public"]["Tables"]["suppliers"]["Insert"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type QuoteInsert = Database["public"]["Tables"]["quotes"]["Insert"];
export type QuoteItemInsert =
  Database["public"]["Tables"]["quote_items"]["Insert"];
export type FeedbackInsert = Database["public"]["Tables"]["feedback"]["Insert"];
export type PriceListInsert =
  Database["public"]["Tables"]["price_lists"]["Insert"];
export type PurchasePriceInsert =
  Database["public"]["Tables"]["purchase_prices"]["Insert"];
export type MarginRuleInsert =
  Database["public"]["Tables"]["margin_rules"]["Insert"];
export type CommissionRuleInsert =
  Database["public"]["Tables"]["commission_rules"]["Insert"];

// Tipos para actualización
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type SupplierUpdate =
  Database["public"]["Tables"]["suppliers"]["Update"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type QuoteUpdate = Database["public"]["Tables"]["quotes"]["Update"];
export type QuoteItemUpdate =
  Database["public"]["Tables"]["quote_items"]["Update"];
export type FeedbackUpdate = Database["public"]["Tables"]["feedback"]["Update"];
export type PriceListUpdate =
  Database["public"]["Tables"]["price_lists"]["Update"];
export type PurchasePriceUpdate =
  Database["public"]["Tables"]["purchase_prices"]["Update"];
export type MarginRuleUpdate =
  Database["public"]["Tables"]["margin_rules"]["Update"];
export type CommissionRuleUpdate =
  Database["public"]["Tables"]["commission_rules"]["Update"];

// Enums
export type UserRole = Database["public"]["Enums"]["user_role"];
export type QuoteStatus = Database["public"]["Enums"]["quote_status"];

// Tipos compuestos útiles
export interface QuoteWithDetails extends Quote {
  seller: Profile;
  items: QuoteItem[];
}

export interface ProductWithSupplier extends Product {
  supplier: Supplier;
}

// Tipos para el sistema de cotizaciones
export interface PricingCalculation {
  cost_base: number;
  margin: number;
  commission: number;
  iva: number;
  final_price: number;
  zone: string;
  volume: number;
}

// Tipos para el sistema de archivos
export interface FileUpload {
  file: File;
  type: "pdf" | "excel";
  supplier_id: number;
  processed_at?: string;
  status: "pending" | "processing" | "completed" | "error";
  errors?: string[];
}

// Tipos para el dashboard
export interface DashboardStats {
  total_quotes: number;
  open_quotes: number;
  won_quotes: number;
  lost_quotes: number;
  total_products: number;
  total_suppliers: number;
  total_utility: number;
  total_commission: number;
}
