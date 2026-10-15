/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Allow local browser origins when testing on-device in Termux.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
