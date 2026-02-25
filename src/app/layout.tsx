import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "BaNaNi",
  description: "Зоомагазин BaNaNi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <Navbar />
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}