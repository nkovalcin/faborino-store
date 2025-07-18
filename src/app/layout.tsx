import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faborino - Montessori nábytok pre deti",
  description: "Prémiový európsky Montessori nábytok a hračky pre podporu prirodzeného vývoja detí. Kvalitné drevené produkty vyrobené z udržateľných materiálov.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className="font-poppins antialiased">
        {children}
      </body>
    </html>
  );
}