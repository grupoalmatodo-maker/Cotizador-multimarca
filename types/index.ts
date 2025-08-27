// types/index.ts
import type { Database } from "./database";

// Tipos de las tablas principales
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Supplier = Database["public"]["Tables"]["proveedores"]["Row"];
export type Product = Database["public"]["Tables"]["productos"]["Row"];
export type Quote = Database["public"]["Tables"]["cotizaciones"]["Row"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];

// Tipos para inserción
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type SupplierInsert =
  Database["public"]["Tables"]["proveedores"]["Insert"];
export type ProductInsert = Database["public"]["Tables"]["productos"]["Insert"];
export type QuoteInsert =
  Database["public"]["Tables"]["cotizaciones"]["Insert"];
export type FeedbackInsert = Database["public"]["Tables"]["feedback"]["Insert"];

// Tipos para actualización
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type SupplierUpdate =
  Database["public"]["Tables"]["proveedores"]["Update"];
export type ProductUpdate = Database["public"]["Tables"]["productos"]["Update"];
export type QuoteUpdate =
  Database["public"]["Tables"]["cotizaciones"]["Update"];
export type FeedbackUpdate = Database["public"]["Tables"]["feedback"]["Update"];

// Enums
export type UserRole = Database["public"]["Enums"]["user_role"];
export type QuoteStatus = Database["public"]["Enums"]["quote_status"];

// Tipos compuestos útiles
export interface QuoteWithDetails extends Quote {
  vendedor: User;
  producto_info: Product;
  proveedor_info: Supplier;
}

export interface ProductWithSupplier extends Product {
  proveedor_info: Supplier;
}

// Tipos para el sistema de cotizaciones
export interface PricingCalculation {
  costo_base: number;
  utilidad: number;
  comision: number;
  iva: number;
  precio_final: number;
  zona: string;
  volumen: number;
}

// Tipos para el sistema de archivos
export interface FileUpload {
  file: File;
  tipo: "pdf" | "excel";
  proveedor_id: string;
  fecha_procesamiento?: string;
  estado: "pending" | "processing" | "completed" | "error";
  errores?: string[];
}

// Tipos para el dashboard
export interface DashboardStats {
  total_cotizaciones: number;
  cotizaciones_abiertas: number;
  cotizaciones_cerradas: number;
  cotizaciones_perdidas: number;
  total_productos: number;
  total_proveedores: number;
  utilidad_total: number;
  comision_total: number;
}
