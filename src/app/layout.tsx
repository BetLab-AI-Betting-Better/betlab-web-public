import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/app/providers";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

const WebVitalsReporter = dynamic(
  () => import("@/infrastructure/observability/web-vitals-reporter").then((m) => m.WebVitalsReporter)
);

const InstallPrompt = dynamic(
  () => import("@/shared/pwa/install-prompt").then((m) => m.InstallPrompt)
);

const ServiceWorkerRegister = dynamic(
  () => import("@/shared/pwa/service-worker-register").then((m) => m.ServiceWorkerRegister)
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Évite Flash of Unstyled Text
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Courier New", "monospace"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C8DC3F' },
    { media: '(prefers-color-scheme: dark)', color: '#003366' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://betlab.app'),
  title: {
    default: 'BetLab - Pronostics Sportifs IA',
    template: '%s | BetLab',
  },
  description: 'Pronostics sportifs précis générés par IA. Football, Basketball et plus.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BetLab',
    startupImage: [
      {
        url: '/splash/iphone6.png',
        media: '(device-width: 375px) and (device-height: 667px)',
      },
      {
        url: '/splash/iphone12.png',
        media: '(device-width: 390px) and (device-height: 844px)',
      },
      {
        url: '/splash/iphone14pro.png',
        media: '(device-width: 393px) and (device-height: 852px)',
      },
      {
        url: '/splash/ipad.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  applicationName: 'BetLab',
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-apple-touch.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://betlab.app',
    siteName: 'BetLab',
    title: 'BetLab - Pronostics Sportifs IA',
    description: 'Pronostics sportifs précis générés par IA',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'BetLab Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'BetLab - Pronostics Sportifs IA',
    description: 'Pronostics sportifs précis générés par IA',
    images: ['/icon-512.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
        <WebVitalsReporter />
        {process.env.NODE_ENV === "production" && (
          <>
            <ServiceWorkerRegister />
            <InstallPrompt />
          </>
        )}
      </body>
    </html>
  );
}
