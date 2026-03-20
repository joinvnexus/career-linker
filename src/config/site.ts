export const siteConfig = {
  name: "HireHub",
  title: "HireHub | Job Search and Hiring Platform",
  description:
    "HireHub connects job seekers, employers, and administrators in a single job marketplace.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export type SiteConfig = typeof siteConfig;
