// app/robots.js

export default function robots() {
  const URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/admin/',
      },
    ],
    sitemap: `${URL}/sitemap.xml`,
  };
}
