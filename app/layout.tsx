import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { cn } from '../lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Mis XV Años - Juli',
  description: 'Te invito a celebrar conmigo este momento tan especial',
  keywords: 'quinceañera, 15 años, celebración, invitación',
  openGraph: {
    title: 'Mis XV Años - Juli',
    description: 'Te invito a celebrar conmigo este momento tan especial',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className={cn(inter.className, "bg-[#F7D0E2]")}>{children}</body>
    </html>
  );
}