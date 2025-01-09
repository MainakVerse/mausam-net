import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

// Font configurations
export const geistSans = localFont({
  src: '../app/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const geistMono = localFont({
  src: '../app/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

// Site configuration
export const siteConfig = {
  url: 'https://mausamnet.netlify.app/',
  name: 'MausumNet',
  title: 'MausumNet: Real-Time Weather Updates & Forecasts',
  description:
    'Get accurate weather forecasts, real-time updates, air quality data, and detailed weather information for any location worldwide. Features interactive maps, hourly forecasts, and comprehensive weather metrics using OpenWeather API.',
  keywords:
    'weather app, weather forecast, real-time weather, air quality index, temperature tracking, weather radar, climate data, weather maps, hourly forecast, weather alerts, precipitation forecast, wind speed, humidity levels, atmospheric pressure, UV index, weather dashboard, global weather, local weather, weather visualization, meteorological data, weather conditions',
  author: 'Mainak Chaudhuri',
  category: 'Weather, Forecast, Climate',
  ogImage: 'opengraph-image.png',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  languages: {
    'en-US': '/en-US',
    'es-ES': '/es-ES',
  },
  twitterHandle: '', // Add your Twitter handle if needed
  shortDescription: 'Global weather forecasts and real-time updates at your fingertips',
} as const;

// Construct metadata object from siteConfig
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Your Global Weather Companion`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  icons: siteConfig.icons,
  alternates: {
    languages: siteConfig.languages,
    canonical: siteConfig.url,
  },
  authors: [{ name: siteConfig.author }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  applicationName: siteConfig.name,
  category: siteConfig.category,
};
