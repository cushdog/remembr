import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remembr",
  description: "A tool to help you vent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" reverseOrder={false} />
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
