import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/toaster"
import { StoreProvider } from "../store/storeProvider"
export const metadata: Metadata = {
  title: "EventManager - Discover and Manage Events",
  description: "A full-stack event management platform to explore, filter, and register for events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
