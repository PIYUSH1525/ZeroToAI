import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add your local Wi-Fi IP and any adapter IP here
  allowedDevOrigins: [
    '172.24.160.1',           // Virtual adapter shown in your terminal
    '192.168.1.15',           // Replace with your actual PC Wi-Fi IP from `ipconfig`
    '*.local',                // Useful if connecting via mDNS / hostname
  ],

  // Basic security headers for every response
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
