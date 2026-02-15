import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevMarket | Freelance Marketplace for Developers",
  description: "Connect with top developers and get your projects done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
