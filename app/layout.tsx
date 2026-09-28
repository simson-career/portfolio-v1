import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Simson M. — Software Development Engineer II",
    template: "%s — Simson M.",
  },
  description:
    "Software Development Engineer II building AI-powered products, secure distributed systems, and thoughtful enterprise experiences.",
  keywords: [
    "Simson M",
    "Software Development Engineer",
    "Java",
    "Spring Boot",
    "React",
    "AI Systems",
    "Bengaluru",
  ],
  authors: [{ name: "Simson M." }],
  openGraph: {
    title: "Simson M. — Software Development Engineer II",
    description:
      "AI-powered products, secure distributed systems, and thoughtful enterprise experiences.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simson M. — Software Development Engineer II",
    description:
      "AI-powered products, secure distributed systems, and thoughtful enterprise experiences.",
  },
};

const themeScript = `
  try {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={geist.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
