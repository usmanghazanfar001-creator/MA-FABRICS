/**
 * Single source of truth for the site's canonical URL.
 *
 * Set NEXT_PUBLIC_SITE_URL in your environment (Vercel → Settings →
 * Environment Variables) to your real domain once you have one — e.g.
 * https://mafabrics.com. Until then it falls back to your Vercel preview
 * URL if Vercel provides one, or localhost for local dev.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
