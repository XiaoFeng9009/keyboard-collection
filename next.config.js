/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { largePageDataBytes: 1024 * 1024 },
  output: "export",
  images: { unoptimized: true }
}
module.exports = nextConfig
