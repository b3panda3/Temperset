import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Do NOT use output: "standalone" on Vercel — it breaks the build.
  // Vercel has its own serverless deployment model.
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
