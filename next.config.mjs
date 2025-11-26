/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the default server output so API routes (contact, scope generation, etc.) remain available.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
