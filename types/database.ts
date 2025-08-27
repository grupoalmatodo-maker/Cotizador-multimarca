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
      // Tabla de usuarios con roles
      users: {
        Row: {
          id: string;
          email: string;
          rol: "admin" | "compras" | "ventas";
          created_at?: string;
        };
        Insert: {
          id?: string;
          email: string;
          rol: "admin" | "compras" | "ventas";
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          email: string;
          rol: "admin" | "compras" | "ventas";
          created_at: string;
        }>;
      };

      // Tabla de proveedores
      proveedores: {
        Row: {
          id: string;
          nombre: string;
          contacto: string | null;
          condiciones: string | null;
        };
        Insert: {
          id?: string;
          nombre: string;
          contacto?: string | null;
          condiciones?: string | null;
        };
        Update: Partial<{
          id: string;
          nombre: string;
          contacto: string | null;
          condiciones: string | null;
        }>;
      };

      // Tabla de productos
      productos: {
        Row: {
          id: string;
          nombre: string;
          marca: string;
          proveedor: string;
          costo_actual: number;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          marca: string;
          proveedor: string;
          costo_actual: number;
          fecha_actualizacion?: string;
        };
        Update: Partial<{
          id: string;
          nombre: string;
          marca: string;
          proveedor: string;
          costo_actual: number;
          fecha_actualizacion: string;
        }>;
      };

      // Tabla de cotizaciones
      cotizaciones: {
        Row: {
          id: string;
          vendedor_id: string;
          cliente: string;
          producto: string;
          precio: number;
          zona: string;
          utilidad: number;
          comision: number;
          iva: number;
          status: "draft" | "sent" | "closed" | "lost";
          created_at: string;
        };
        Insert: {
          id?: string;
          vendedor_id: string;
          cliente: string;
          producto: string;
          precio: number;
          zona: string;
          utilidad: number;
          comision: number;
          iva: number;
          status?: "draft" | "sent" | "closed" | "lost";
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          vendedor_id: string;
          cliente: string;
          producto: string;
          precio: number;
          zona: string;
          utilidad: number;
          comision: number;
          iva: number;
          status: "draft" | "sent" | "closed" | "lost";
          created_at: string;
        }>;
      };

      // Tabla de feedback
      feedback: {
        Row: {
          id: string;
          cotizacion_id: string;
          motivo_no_cierre: string;
          comentario: string | null;
        };
        Insert: {
          id?: string;
          cotizacion_id: string;
          motivo_no_cierre: string;
          comentario?: string | null;
        };
        Update: Partial<{
          id: string;
          cotizacion_id: string;
          motivo_no_cierre: string;
          comentario: string | null;
        }>;
      };
    };

    Views: Record<string, never>;

    Functions: Record<string, never>;

    Enums: {
      user_role: "admin" | "compras" | "ventas";
      quote_status: "draft" | "sent" | "closed" | "lost";
    };
  };
}
