import { Analytics } from '@/components/googleAnalytics';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { metadata, viewport, geistSans, geistMono } from '@/config/siteconfig';
import Script from 'next/script';
import React from "react";

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen scroll-smooth`}
        suppressHydrationWarning={true}
      >
        {/* Google Analytics Scripts */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main id="main-content" className="min-h-screen text-nowrap">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
