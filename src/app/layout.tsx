import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import {
  LocalBusinessSchema,
  WebSiteSchema,
  OrganizationSchema,
} from "@/components/schema/local-business";
import { WebVitalsReporter } from "@/components/seo/web-vitals-reporter";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.team[0]?.name ?? siteConfig.name }],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(siteConfig.seo.googleSiteVerification || siteConfig.seo.bingSiteVerification
    ? {
        verification: {
          ...(siteConfig.seo.googleSiteVerification && {
            google: siteConfig.seo.googleSiteVerification,
          }),
          ...(siteConfig.seo.bingSiteVerification && {
            other: { "msvalidate.01": siteConfig.seo.bingSiteVerification },
          }),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <LocalBusinessSchema />
          <WebSiteSchema />
          <OrganizationSchema />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
          <WebVitalsReporter />
        </body>
      </html>
    </Providers>
  );
}
