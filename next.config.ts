import type { NextConfig } from "next";
import path from "path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      { source: "/trocar-obra", destination: "/responsaveis", permanent: true },
      { source: "/equipe", destination: "/responsaveis", permanent: true },
      { source: "/clima", destination: "/dashboard", permanent: false },
      { source: "/recibos", destination: "/dashboard", permanent: false },
      { source: "/assistente", destination: "/dashboard", permanent: false },
      { source: "/login", destination: "/", permanent: true }
    ];
  }
};

export default nextConfig;

initOpenNextCloudflareForDev();
