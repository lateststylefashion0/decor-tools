import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('http://homespacecalc.com/'),
  title: {
    default: 'HomeSpaceCal | Free Home Decor & Home Improvement Calculators',
    template: '%s | HomeSpaceCal',
  },
  description:
    'Plan your next home project with 20 free, practical calculators for rug sizing, curtains, paint, flooring, tiles, recessed lighting, chandeliers, drywall, and more. Instant Imperial & Metric estimates.',
  keywords: [
    'home decor calculators',
    'home improvement calculators',
    'rug size calculator',
    'curtain size calculator',
    'paint calculator',
    'flooring calculator',
    'tile calculator',
    'recessed lighting calculator',
    'chandelier calculator',
    'drywall calculator',
  ],
  authors: [{ name: 'DecorTools Team' }],
  creator: 'DecorTools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://decortools.com',
    siteName: 'DecorTools',
    title: 'DecorTools | Free Home Decor & Renovation Calculators',
    description:
      '20 free, accurate calculators for interior design and renovation projects. Plan room dimensions, paint, flooring, lighting, and drapery with confidence.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DecorTools | Free Home Decor & Home Improvement Calculators',
    description:
      'Plan your renovation projects with 20 free, accurate calculators for room sizing, paint, tiles, flooring, and lighting.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#fcfbf9] text-stone-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
