import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    domains: ['localhost:3000'], // 허용할 도메인 추가
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*', // 백엔드 주소
      },
    ];
  },
};

export default nextConfig;
