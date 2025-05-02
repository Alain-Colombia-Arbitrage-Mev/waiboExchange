/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  eslint: {
    // Advertencia: Esto permitirá errores de ESLint durante la build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 