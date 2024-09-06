/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/meet/animation-next-js',
  distDir: '../dist/animation-next-js',
  output: 'export',
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/terms',
        destination: 'https://policies.google.com/terms',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: 'https://policies.google.com/privacy',
        permanent: true,
      },
      {
        source: '/support',
        destination: 'https://support.google.com/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
