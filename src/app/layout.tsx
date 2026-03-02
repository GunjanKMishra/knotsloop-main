import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Knotloop',
  description: 'From Videos to Learning. Knot Your Content into Loops That Teach Better.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
