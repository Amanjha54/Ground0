import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/data-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "GROUND0 — AI-Powered Proof of Physical Work",
  description:
    "Verify the Work. Reveal the Reality. A production-grade multi-sensor AI verification platform for municipal and civil infrastructure remediation.",
  keywords: [
    "Ground0",
    "Proof of Work",
    "Computer Vision",
    "Multimodal AI",
    "Agentic AI",
    "Municipal Inspection",
    "Civic Tech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-obsidian-900 text-platinum min-h-screen flex flex-col antialiased selection:bg-gold-500/30 selection:text-gold-200`}
      >
        <DataProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
