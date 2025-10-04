/**
 * Next.js 설정
 * 보안: 보안 헤더 설정
 * DX/배포: 빌드 최적화 설정
 */

import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

// 위젯 임베드용 헤더 (Notion 호환) - 최소한의 헤더만
const widgetHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        // 위젯 임베드 허용 설정 (Notion 전용) - X-Frame-Options 제거
        source: '/u/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // embed 경로도 동일하게 처리
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
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
