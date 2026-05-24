import type { MetadataRoute } from 'next';

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fresh-catch-restaurant.vercel.app';
const SITE_URL = RAW_SITE_URL.replace(/^﻿/, '').trim();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
