/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['drive.google.com', 'multerimagelocationurl1.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'marc-data.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
