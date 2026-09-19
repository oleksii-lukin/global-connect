import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://global-connect-woad.vercel.app"),
  title: {
    default: "Global Connect — Your next global opportunity",
    template: "%s · Global Connect",
  },
  description:
    "Discover international opportunities, online sessions, guides and a global youth community. Exchanges, scholarships, conferences and volunteering for young people.",
  openGraph: {
    title: "Global Connect — Your next global opportunity",
    description:
      "Discover international opportunities, online sessions, guides and a global youth community. Exchanges, scholarships, conferences and volunteering for young people.",
    siteName: "Global Connect",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}