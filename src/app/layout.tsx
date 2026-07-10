import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veka Homemade Products — Traditional South Indian Homemade Foods",
  description:
    "Authentic homemade pickles, thokku, podis, and snacks crafted with love — the taste of Ammamma's kitchen, delivered to your door.",
  keywords: "homemade pickles, thokku, podi, South Indian snacks, traditional food, Tamil Nadu",
  openGraph: {
    title: "Veka Homemade Products",
    description: "Authentic South Indian homemade foods",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins bg-cream-50 text-brown-800 antialiased">{children}</body>
    </html>
  );
}
