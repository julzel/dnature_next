import type { NextConfig } from "next";
import { indexingHeaders } from "./lib/seo/config";

const nextConfig: NextConfig = {
  allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean),
  cacheComponents: true,
  partialPrefetching: true,
  headers: () => indexingHeaders(),
};

export default nextConfig;
