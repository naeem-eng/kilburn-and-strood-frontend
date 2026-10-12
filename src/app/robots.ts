import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/' },
    sitemap: `https://kilburn-and-strode-gray.vercel.app/sitemap.xml`,
  };
}
