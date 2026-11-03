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
    siteName: "Dofit Wears",
    locale: "en_NG",
    type: "website",
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
