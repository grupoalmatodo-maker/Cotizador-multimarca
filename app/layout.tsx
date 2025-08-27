import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CotizAI - Sistema de Cotización Inteligente",
  description: "Cotizador Multimarca para Grupo Almatodo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
