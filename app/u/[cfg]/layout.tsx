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
  other: {
    'oembed:type': 'rich',
    'oembed:title': 'Calendar Widget',
    'oembed:author_name': 'Calendar Widget',
    'oembed:provider_name': 'Calendar Widget',
    'oembed:provider_url': 'https://cal-widget01.vercel.app',
    'oembed:html': '<iframe src="https://cal-widget01.vercel.app/u/{{config}}" width="100%" height="450" frameborder="0" style="border-radius: 8px;"></iframe>',
    'oembed:width': '800',
    'oembed:height': '450',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
