import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({subsets:["latin"]})

export const metadata = {
  title: "WealthMind",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* header */}
          <Header/>
          <main className="min-h-screen">{children}</main>
          <Toaster/>
          {/* footer */}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              Made By Bhargav Maru
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
