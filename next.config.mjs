/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/TiemhoaPhuclinh',
  assetPrefix: '/TiemhoaPhuclinh',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};
export default nextConfig;
