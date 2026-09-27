import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add your local Wi-Fi IP and any adapter IP here
  allowedDevOrigins: [
    '172.24.160.1',           // Virtual adapter shown in your terminal
    '192.168.1.15',           // Replace with your actual PC Wi-Fi IP from `ipconfig`
    '*.local',                // Useful if connecting via mDNS / hostname
  ],
};

export default nextConfig;