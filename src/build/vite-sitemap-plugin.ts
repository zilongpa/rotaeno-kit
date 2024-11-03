import fs from 'fs'

// viteSitemapPlugin generates a sitemap.xml file for the given origin with lastmod set to the current date.
export default function viteSitemapPlugin({ routes }: { routes: string[] }) {
  return {
    name: 'vite-sitemap-plugin',

    buildEnd() {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `<url>
    <loc>${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
`
    )
    .join('')}
</urlset>`

      fs.writeFileSync('public/sitemap.xml', sitemap)
    },
  }
}
