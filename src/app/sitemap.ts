import type { MetadataRoute } from "next";
import { EXAMPLES } from "@/lib/examples";
import { ARTICLES } from "@/content/articles";
import { abs } from "@/lib/site";

// Served at /sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: abs("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [abs("/opengraph-image.jpg")],
      videos: [
        {
          title: "The Doubtster film",
          thumbnail_loc: abs("/media/film.jpg"),
          description: "Stuck at 3 am? Ask Doubtster and watch it explained.",
          content_loc: abs("/media/film.mp4"),
          duration: 22,
        },
      ],
    },
    { url: abs("/examples"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...EXAMPLES.map((e) => ({
      url: abs(`/examples/${e.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      videos: [
        {
          title: e.title,
          thumbnail_loc: abs(`/media/${e.video}.jpg`),
          description: e.description,
          content_loc: abs(`/media/${e.video}.mp4`),
          duration: e.secs,
        },
      ],
    })),
    { url: abs("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...ARTICLES.map((a) => ({
      url: abs(`/blog/${a.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: abs("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
