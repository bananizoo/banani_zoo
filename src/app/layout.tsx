import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-main",
});

export const metadata = {
  title: "BaNaNi — Зоомагазин",
  description: "Яскравий зоомагазин з турботою про твоїх хвостиків 🐾",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={nunito.variable}>
      <body className="min-h-screen bg-[#fffaf0] font-main">
        <Navbar />

        <main className="pt-4 pb-12 px-4 max-w-7xl mx-auto relative z-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}