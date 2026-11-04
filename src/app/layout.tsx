import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/shared/AppProviders";
import StoreSettingsGate from "@/components/shared/StoreSettingsGate";

export const metadata: Metadata = {
  title: { default: "Dofit Wears — Premium Activewear & Fashion", template: "%s | Dofit Wears" },
  description: "Dofit Wears — premium activewear and Àṣà by Dofit, bold Afrocentric streetwear. Where performance meets culture.",
  keywords: ["dofit wears", "activewear", "asa by dofit", "nigerian fashion", "premium streetwear", "african fashion"],
  metadataBase: new URL("https://dofit.fit"),
  manifest: "/manifest.json",
  themeColor: "#0A0A0C",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dofit Wears",
  },
  openGraph: {
    title: "Dofit Wears — Premium Activewear & Fashion",
    description: "Official Dofit Wears & Àṣà by Dofit. Luxury high-performance activewear and cultural Adire couture made in Lagos, Nigeria.",
    url: "https://dofit.fit",
    siteName: "Dofit Wears & Àṣà",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://dofit.fit/images/logo.png",
        secureUrl: "https://dofit.fit/images/logo.png",
        width: 800,
        height: 800,
        alt: "Dofit Wears Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dofit Wears — Premium Activewear & Fashion",
    description: "Official Dofit Wears & Àṣà by Dofit. Luxury high-performance activewear and cultural Adire couture.",
    images: ["https://dofit.fit/images/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="theme-color" content="#0A0A0C" />
      </head>
      <body>
        <AppProviders>
          <StoreSettingsGate>
            {children}
          </StoreSettingsGate>
        </AppProviders>
      </body>
    </html>
  );
}
