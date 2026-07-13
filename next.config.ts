import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public assets are shipped with the app; serve them directly so static
  // Vercel deployments do not depend on the image optimization endpoint.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
