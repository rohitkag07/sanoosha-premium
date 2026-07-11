import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanoosha – Authentic Rudraksha & Crystal Jewellery",
  description:
    "Sanoosha offers 100% authentic, certified Nepal-origin Rudraksha beads and energy-cleansed crystal bracelets. Bring divine energy and positivity into your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
