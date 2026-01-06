import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // 使用 remotePatterns 更加安全和灵活
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 如果你后续用了对象存储（如 R2 或 S3），把你的存储域名也加在这里
      // {
      //   protocol: 'https',
      //   hostname: 'your-r2-bucket.r2.dev',
      // },
    ],
  },
};

export default nextConfig;
