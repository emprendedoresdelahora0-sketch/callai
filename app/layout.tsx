import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVA — Asistente de Llamadas con IA | Vantage AI Systems",
  description:
    "NOVA responde llamadas, califica prospectos y agenda reuniones automáticamente. No pierdas más clientes. Prueba gratis 7 días.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
