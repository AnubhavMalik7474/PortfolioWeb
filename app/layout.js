import { existsSync } from 'node:fs';
import path from 'node:path';
import { Archivo, Roboto_Flex } from 'next/font/google';
import { siteConfig } from '@/lib/site';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import Preloader from '@/components/Preloader/Preloader';
import Cursor from '@/components/Cursor/Cursor';
import './globals.css';

const bodyFont = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Display font: Archivo Expanded (width 125%, weight 600) — the closest free match to the reference's
// "Glancyr Neue" (wide geometric shapes, double-storey a, looptail g, angled t). Variable font, so the
// width axis is loaded too. If you own Glancyr Neue, drop it into /public/fonts (see GLANCYR_FILES):
// it is detected at build time and used instead.
const displayFont = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
});

const GLANCYR_FILES = [
  ['GlancyrNeue-Regular.woff2', 'woff2'],
  ['GlancyrNeue-Regular.woff', 'woff'],
  ['GlancyrNeue-Regular.otf', 'opentype'],
  ['Glancyr-Neue-Regular.otf', 'opentype'],
];

function glancyrFontFace() {
  const found = GLANCYR_FILES.filter(([file]) => existsSync(path.join(process.cwd(), 'public', 'fonts', file)));
  if (!found.length) return null;
  const src = found.map(([file, fmt]) => `url('/fonts/${file}') format('${fmt}')`).join(', ');
  return {
    preload: `/fonts/${found[0][0]}`,
    // Glancyr ships one regular weight at normal width — reset the Archivo tuning so it isn't faux-bolded.
    css:
      `@font-face{font-family:'Glancyr Neue';src:${src};font-weight:400;font-style:normal;font-display:swap;}` +
      `:root{--font-display:'Glancyr Neue',var(--font-archivo),sans-serif;--display-weight:400;--display-stretch:100%;}`,
  };
}

const glancyr = glancyrFontFace();

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'design',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: siteConfig.themeColor,
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        {glancyr && <link rel="preload" href={glancyr.preload} as="font" crossOrigin="anonymous" />}
        {glancyr && <style>{glancyr.css}</style>}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll />
        {children}
        <Cursor />
      </body>
    </html>
  );
}
