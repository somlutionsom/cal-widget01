import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Calendar Widget',
  description: 'Interactive Notion Calendar Widget',
  openGraph: {
    title: 'Calendar Widget',
    description: 'Interactive Notion Calendar Widget',
    type: 'website',
    siteName: 'Calendar Widget',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendar Widget',
    description: 'Interactive Notion Calendar Widget',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
