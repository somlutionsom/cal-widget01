import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendar Widget',
  description: 'Notion Calendar Widget',
  robots: 'noindex, nofollow',
  other: {
    'X-Frame-Options': 'ALLOWALL',
  },
  openGraph: {
    type: 'website',
    siteName: 'Calendar Widget',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
