import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MKloth — Premium Streetwear",
    template: "%s | MKloth",
  },
  description:
    "MKloth is a premium streetwear e-commerce store. Heavyweight t-shirts in three signature cuts — Drop Shoulder, Crop and Polo. Cash on Delivery across Pakistan.",
  applicationName: "MKloth",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "MKloth — Premium Streetwear",
    description:
      "Premium heavyweight t-shirts in Drop Shoulder, Crop and Polo cuts. Cash on Delivery across Pakistan.",
    siteName: "MKloth",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary",
    title: "MKloth — Premium Streetwear",
    description:
      "Premium heavyweight t-shirts in Drop Shoulder, Crop and Polo cuts. Cash on Delivery across Pakistan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nastaliq.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
