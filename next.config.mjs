/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "firebase",
      "recharts",
      "react-markdown",
    ],
  },
  images: {
    // BẬT lại tối ưu ảnh
    unoptimized: false,
    // Khai báo các domain bạn đang dùng
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "pub-526ed49342584675965c43f20162b75a.r2.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // optional: tinh chỉnh responsive
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
  },
}

export default nextConfig
