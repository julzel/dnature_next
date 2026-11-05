import type { NextConfig } from "next";
import { indexingHeaders } from "./lib/seo/config";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  headers: () => indexingHeaders(),
};

export default nextConfig;
