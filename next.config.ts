import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    // Allow product image CDNs used by the API payloads
    domains: [
      "laravelpoint.com",
      "i.imgur.com",
      "img.freepik.com",
      "mir-s3-cdn-cf.behance.net",
      "encrypted-tbn0.gstatic.com",
      "cdn.dribbble.com",
      "t3.ftcdn.net",
      "cdn.pixabay.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "picsum.photos",
      "placehold.co",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "laravelpoint.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "mir-s3-cdn-cf.behance.net" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "t3.ftcdn.net" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
