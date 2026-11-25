import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {


    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },




  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
  ],

  async redirects() {


    return [
      {
        source: "/projects/:path+",
        destination: "/ai-projects/:path+",
        permanent: true
      }
    ]


  }
};

    export default nextConfig;