/** @type {import('next').NextConfig} */
const requiredEnv = ['OPENAI_API_KEY', 'RESEND_API_KEY'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
