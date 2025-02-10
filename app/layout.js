import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({subsets:["latin"]})

export const metadata = {
  title: "WealthMind",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* header */}
        <Header></Header>
        <main className="min-h-screen">{children}</main>
        {/* footer */}
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            Made By Bhargav Maru
          </div>
        </footer>
      </body>
    </html>
  );
}
