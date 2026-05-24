import type { MetadataRoute } from 'next';

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fresh-catch-restaurant.vercel.app';
const SITE_URL = RAW_SITE_URL.replace(/^﻿/, '').trim();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
