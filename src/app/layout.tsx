import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono"; //not needed for this app.

import "./globals.css";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIOutputProvider } from "./context/AIOutputDataContext";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={cn(GeistSans.variable, "font-sans")}>
        <TooltipProvider>
          <AIOutputProvider>
            <GridPattern width={60} height={60} className="-z-10 opacity-40" />
            {children}
          </AIOutputProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
