// lib/roles.ts
import { getServerClient } from "./supabaseServer";
import type { UserRole } from "../types";

export async function getUserRole(): Promise<UserRole | null> {
  try {
    const supabase = await getServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return (profile as any)?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export async function requireRole(allowedRoles: UserRole[]): Promise<UserRole> {
  const role = await getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    throw new Error(
      `Access denied. Required roles: ${allowedRoles.join(", ")}`
    );
  }

  return role;
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

export async function isCompras(): Promise<boolean> {
  const role = await getUserRole();
  return role === "compras" || role === "admin";
}

export async function isVentas(): Promise<boolean> {
  const role = await getUserRole();
  return role === "ventas" || role === "compras" || role === "admin";
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    admin: "Administrador",
    compras: "Compras",
    ventas: "Ventas",
  };
  return roleNames[role];
}
