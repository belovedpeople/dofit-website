import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/shared/AppProviders";

export const metadata: Metadata = {
  title: { default: "Dofit Wears — Premium Activewear & Fashion", template: "%s | Dofit Wears" },
  description: "Dofit Wears — premium activewear and Àṣà by Dofit, bold Afrocentric streetwear. Where performance meets culture.",
  keywords: ["dofit wears", "activewear", "asa by dofit", "nigerian fashion", "premium streetwear", "african fashion"],
  metadataBase: new URL("https://dofit.fit"),
  manifest: "/manifest.json",
  themeColor: "#0A0A0C",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dofit Wears",
  },
  openGraph: {
    title: "Dofit Wears — Premium Activewear & Fashion",
    description: "Premium activewear and Afrocentric streetwear. Shop Dofit Wears and Àṣà by Dofit.",
    url: "https://dofit.fit",
    siteName: "Dofit Wears & Àṣà",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://dofit.fit/images/dofit-wears/2-Piece%20Biker%20Short%20Set.png",
        secureUrl: "https://dofit.fit/images/dofit-wears/2-Piece%20Biker%20Short%20Set.png",
        width: 1200,
        height: 630,
        alt: "Dofit Wears Luxury Activewear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dofit Wears — Premium Activewear & Fashion",
    description: "Premium activewear and Afrocentric streetwear. Shop Dofit Wears and Àṣà by Dofit.",
    images: ["https://dofit.fit/images/dofit-wears/2-Piece%20Biker%20Short%20Set.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="theme-color" content="#0A0A0C" />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
