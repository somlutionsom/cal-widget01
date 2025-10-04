/**
 * Next.js 설정
 * 보안: 보안 헤더 설정
 * DX/배포: 빌드 최적화 설정
 */

import type { NextConfig } from "next";

const securityHeaders = [
  // X-Frame-Options는 제거 (CSP를 우선 사용)
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self' https://www.notion.so https://notion.so https://*.notion.site;",
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/embed/:cfg',
        destination: '/u/:cfg',
      },
    ];
  },
  
  images: {
    domains: ['notion.so', 'www.notion.so'],
  },
  
  poweredByHeader: false,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
