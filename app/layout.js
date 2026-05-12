import { Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/lib/auth";

const kalam = Kalam({ weight: ["700"], subsets: ["latin"], variable: "--font-kalam" });
const patrickHand = Patrick_Hand({ weight: ["400"], subsets: ["latin"], variable: "--font-patrick" });

export const metadata = {
  title: "GullyGuide | Real streets. Real stories.",
  description: "Explore India beyond the tourist map with local student guides.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kalam.variable} ${patrickHand.variable} font-body min-h-screen bg-background text-foreground flex flex-col`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
            <Navbar />
            <main className="flex-1">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
