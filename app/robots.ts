import type { MetadataRoute } from "next";

// Block every crawler from every path.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
