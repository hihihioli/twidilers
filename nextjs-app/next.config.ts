import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy API requests to Flask backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.FLASK_API_URL || 'http://localhost:5000/api/:path*',
      },
      {
        source: '/login',
        destination: process.env.FLASK_API_URL || 'http://localhost:5000/login',
      },
      {
        source: '/logout',
        destination: process.env.FLASK_API_URL || 'http://localhost:5000/logout',
      },
    ];
  },
};

export default nextConfig;
